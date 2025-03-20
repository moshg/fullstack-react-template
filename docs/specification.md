# Specification

## 1. System Overview
Book Manager is a web application for organizing and managing book collections with categorization capabilities.

## 2. Core Features

### 2.1. Book Management
#### 2.1.1. Book List View (`/books`)
- **Display Components**
  - Book title
  - Author name
  - Publication year
  - Associated categories

#### 2.1.2. Book Creation (`/books/new`)
- **Required Fields**
  - Title (string)
  - Author (string)
- **Optional Fields**
  - Publication Year (number)
- **Category Assignment**
  - Multiple category selection
  - Dynamic category list refresh
- **Post-submission**
  - Redirect to book list view

### 2.2. Category Management
#### 2.2.1. Category List View (`/categories`)
- **Display Components**
  - Category name
  - Category description

#### 2.2.2. Category Creation (`/categories/new`)
- **Required Fields**
  - Name (string, unique constraint)
- **Optional Fields**
  - Description (string)
- **Validation Rules**
  - Unique name verification
- **Post-submission**
  - Redirect to category list view

## 3. User Interface Specifications

### 3.1. Navigation System
- **Global Navigation**
  - Home link
  - Books section
  - Categories section
