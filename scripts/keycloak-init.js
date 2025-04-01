// keycloak-init.js

// ===== 設定パラメータ =====
const KC_URL = "http://keycloak:8080";
const KC_ADMIN = "admin";
const KC_ADMIN_PASSWORD = "admin";

// 作成するレルムの情報
const REALM_NAME = "identity-provider";
const REALM_DISPLAY_NAME = "Identity Provider for Single Sign-On";

// 作成するクライアントの情報
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
	// `keycloak`の部分はbetter-authのproviderIdに対応する
	redirectUris: ["/api/auth/oauth2/callback/keycloak"],
};

// 作成するユーザーの情報
const USER = {
	username: "test-user",
	email: "test-user@example.com",
	firstName: "Test",
	lastName: "User",
	password: "password",
	enabled: true,
	emailVerified: true,
};

// スクリプトの実行
main();

/**
 * メイン関数
 */
async function main() {
	try {
		// Docker ComposeでKeycloakのヘルスチェックを行うことは困難なため、ここでヘルスチェックを行う
		console.log("Keycloakサーバーにアクセスを試みています...");
		await waitForKeycloak(12, 5000);

		console.log("管理者トークンを取得しています...");
		const token = await getToken();
		console.log("管理者トークンを取得しました");

		// レルムの作成（存在しない場合）
		if (await realmExists(token, REALM_NAME)) {
			console.log(`レルム '${REALM_NAME}' は既に存在します`);
		} else {
			await createRealm(token);
		}

		// クライアントの作成（すでに存在する場合はスキップ）
		await createClient(token, REALM_NAME, CLIENT_CONFIG);

		// ユーザーの作成（すでに存在する場合はスキップ）
		await createUser(token, USER);

		console.log("Keycloakの初期化が完了しました");
		console.log(`レルム: ${REALM_NAME}`);
		console.log(`クライアントID: ${CLIENT_CONFIG.clientId}`);
		// ブラウザからアクセスする場合はlocalhostでアクセスする
		console.log(
			`アクセスURL: ${KC_URL.replace("keycloak", "localhost")}/realms/${REALM_NAME}/account`,
		);
	} catch (error) {
		console.error("初期化処理中にエラーが発生しました:", error);
		process.exit(1);
	}
}

/**
 * Keycloakへの接続を待機する
 *
 * @param {number} retries 最大リトライ回数
 * @param {number} intervalMs 待機間隔（ミリ秒）
 */
async function waitForKeycloak(retries, intervalMs) {
	for (let i = 0; i < retries; i++) {
		try {
			const response = await fetch(KC_URL);
			if (response.ok) {
				console.log("Keycloakサーバーが起動しました");
				return;
			}
		} catch (error) {
			// エラーが発生した場合は待機を続ける
		}

		console.log(
			`Keycloakサーバーが準備できていません。待機中... (${i + 1}/${retries})`,
		);
		await new Promise((resolve) => setTimeout(resolve, intervalMs));
	}

	throw new Error("タイムアウト: Keycloakサーバーに接続できませんでした");
}

/**
 * Keycloakからアクセストークンを取得する
 * @returns {Promise<string>} アクセストークン
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
			`トークン取得エラー: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data.access_token;
}

/**
 * レルムが存在するか確認する
 * @param {string} token アクセストークン
 * @param {string} realmName レルム名
 * @returns {Promise<boolean>} レルムの存在有無
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
 * レルムを作成する
 * @param {string} token アクセストークン
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
			`レルム作成エラー: ${response.status} ${response.statusText} - ${error}`,
		);
	}

	console.log(`レルム '${REALM_NAME}' を作成しました`);
}

/**
 * クライアントを作成する（存在する場合はスキップ）
 * @param {string} token アクセストークン
 * @param {string} realmName レルム名
 * @param {Object} clientConfig クライアント設定
 */
async function createClient(token, realmName, clientConfig) {
	// クライアントを作成してみる
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
		console.log(`クライアント '${clientConfig.clientId}' を作成しました`);
		return;
	}

	// 409 Conflict エラーの場合は既に存在するのでスキップ
	if (response.status === 409) {
		console.log(`クライアント '${clientConfig.clientId}' は既に存在します`);
		return;
	}

	// その他のエラーの場合は例外をスロー
	const error = await response.text();
	throw new Error(
		`クライアント作成エラー: ${response.status} ${response.statusText} - ${error}`,
	);
}

/**
 * ユーザーを作成する（存在する場合はスキップ）
 * @param {string} token アクセストークン
 * @param {Object} user ユーザー情報
 */
async function createUser(token, user) {
	// ユーザーを作成してみる
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
		console.log(`ユーザー '${user.username}' を作成しました`);
		return;
	}

	// 409 Conflict エラーの場合は既に存在するのでスキップ
	if (createResponse.status === 409) {
		console.log(`ユーザー '${user.username}' は既に存在します`);
		return;
	}

	// その他のエラーの場合は例外をスロー
	const error = await createResponse.text();
	throw new Error(
		`ユーザー作成エラー: ${createResponse.status} ${createResponse.statusText} - ${error}`,
	);
}
