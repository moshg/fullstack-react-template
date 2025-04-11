// keycloak-init.js

// ===== Configuration Parameters =====
const KC_URL = "http://keycloak:8080";
const KC_ADMIN = "admin";
const KC_ADMIN_PASSWORD = "admin";

// Realm configuration
const REALM_NAME = "identity-provider";
const REALM_DISPLAY_NAME = "Identity Provider for Single Sign-On";

// Client configuration
// https://www.keycloak.org/docs-api/26.1.4/rest-api/#ClientRepresentation
const CLIENT_CONFIG = {
	protocol: "openid-connect",
	clientId: "fullstack-react-template",
	name: "Fullstack React Template",
	publicClient: false,
	secret: "s3cr3t",
	consentRequired: true,
	standardFlowEnabled: true,
	directAccessGrantsEnabled: false,
	frontchannelLogout: true,
	attributes: {
		"post.logout.redirect.uris": "/*",
	},
	alwaysDisplayInConsole: false,
	rootUrl: "http://localhost:5173",
	baseUrl: "http://localhost:5173",
	// The 'keycloak' part corresponds to the providerId in better-auth
	redirectUris: ["/api/auth/oauth2/callback/keycloak"],
};

// User configuration
const USER = {
	username: "test-user",
	email: "test-user@example.com",
	firstName: "Test",
	lastName: "User",
	password: "password",
	enabled: true,
	emailVerified: true,
};

// Script execution
main();

/**
 * Main function
 */
async function main() {
	try {
		// Perform health check here since it's difficult to do it in Docker Compose
		console.log("Attempting to connect to Keycloak server...");
		await waitForKeycloak(12, 5000);

		console.log("Obtaining admin token...");
		const token = await getToken();
		console.log("Admin token obtained");

		// Create realm (if it doesn't exist)
		if (await realmExists(token, REALM_NAME)) {
			console.log(`Realm '${REALM_NAME}' already exists`);
		} else {
			await createRealm(token);
		}

		// Create client (skip if already exists)
		await createClient(token, REALM_NAME, CLIENT_CONFIG);

		// Create user (skip if already exists)
		await createUser(token, USER);

		console.log("Keycloak initialization completed");
		console.log(`Realm: ${REALM_NAME}`);
		console.log(`Client ID: ${CLIENT_CONFIG.clientId}`);
		// Use localhost for browser access
		console.log(
			`Access URL: ${KC_URL.replace("keycloak", "localhost")}/realms/${REALM_NAME}/account`,
		);
	} catch (error) {
		console.error("Error during initialization:", error);
		process.exit(1);
	}
}

/**
 * Wait for Keycloak connection
 *
 * @param {number} retries Maximum number of retries
 * @param {number} intervalMs Interval between retries (milliseconds)
 */
async function waitForKeycloak(retries, intervalMs) {
	for (let i = 0; i < retries; i++) {
		try {
			const response = await fetch(KC_URL);
			if (response.ok) {
				console.log("Keycloak server is up");
				return;
			}
		} catch (error) {
			// Continue waiting if an error occurs
		}

		console.log(`Keycloak server not ready. Waiting... (${i + 1}/${retries})`);
		await new Promise((resolve) => setTimeout(resolve, intervalMs));
	}

	throw new Error("Timeout: Could not connect to Keycloak server");
}

/**
 * Get access token from Keycloak
 * @returns {Promise<string>} Access token
 */
async function getToken() {
	const params = new URLSearchParams();
	params.append("username", KC_ADMIN);
	params.append("password", KC_ADMIN_PASSWORD);
	params.append("grant_type", "password");
	params.append("client_id", "admin-cli");

	const response = await fetch(
		`${KC_URL}/realms/master/protocol/openid-connect/token`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params,
		},
	);

	if (!response.ok) {
		throw new Error(
			`Token retrieval error: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data.access_token;
}

/**
 * Check if realm exists
 * @param {string} token Access token
 * @param {string} realmName Realm name
 * @returns {Promise<boolean>} Whether realm exists
 */
async function realmExists(token, realmName) {
	// https://www.keycloak.org/docs-api/26.1.4/rest-api/#_get_adminrealmsrealm
	const response = await fetch(`${KC_URL}/admin/realms/${realmName}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return response.ok;
}

/**
 * Create realm
 * @param {string} token Access token
 */
async function createRealm(token) {
	// https://www.keycloak.org/docs-api/26.1.4/rest-api/#_post_adminrealms
	const response = await fetch(`${KC_URL}/admin/realms`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			realm: REALM_NAME,
			enabled: true,
			displayName: REALM_DISPLAY_NAME,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(
			`Realm creation error: ${response.status} ${response.statusText} - ${error}`,
		);
	}

	console.log(`Created realm '${REALM_NAME}'`);
}

/**
 * Create client (skip if exists)
 * @param {string} token Access token
 * @param {string} realmName Realm name
 * @param {Object} clientConfig Client configuration
 */
async function createClient(token, realmName, clientConfig) {
	// Try to create client
	// https://www.keycloak.org/docs-api/26.1.4/rest-api/#_post_adminrealmsrealmclients
	const response = await fetch(`${KC_URL}/admin/realms/${realmName}/clients`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(clientConfig),
	});

	if (response.ok) {
		console.log(`Created client '${clientConfig.clientId}'`);
		return;
	}

	// Skip if 409 Conflict (already exists)
	if (response.status === 409) {
		console.log(`Client '${clientConfig.clientId}' already exists`);
		return;
	}

	// Throw error for other cases
	const error = await response.text();
	throw new Error(
		`Client creation error: ${response.status} ${response.statusText} - ${error}`,
	);
}

/**
 * Create user (skip if exists)
 * @param {string} token Access token
 * @param {Object} user User information
 */
async function createUser(token, user) {
	// Try to create user
	// https://www.keycloak.org/docs-api/26.1.4/rest-api/#_post_adminrealmsrealmusers
	const createResponse = await fetch(
		`${KC_URL}/admin/realms/${REALM_NAME}/users`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: user.username,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				enabled: user.enabled,
				emailVerified: user.emailVerified,
				credentials: [
					{
						type: "password",
						value: user.password,
						temporary: false,
					},
				],
			}),
		},
	);

	if (createResponse.ok) {
		console.log(`Created user '${user.username}'`);
		return;
	}

	// Skip if 409 Conflict (already exists)
	if (createResponse.status === 409) {
		console.log(`User '${user.username}' already exists`);
		return;
	}

	// Throw error for other cases
	const error = await createResponse.text();
	throw new Error(
		`User creation error: ${createResponse.status} ${createResponse.statusText} - ${error}`,
	);
}
