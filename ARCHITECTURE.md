# Chanakya SaaS - System Architecture

> **Version:** 1.0
> **Last Updated:** January 2025
> **Status:** Solo Founder MVP

---

## Table of Contents

1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Security Architecture](#security-architecture)
4. [Authentication Flow](#authentication-flow)
5. [Document Upload Flow](#document-upload-flow)
6. [Multi-Tenancy Architecture](#multi-tenancy-architecture)
7. [Database Schema](#database-schema)
8. [API Architecture](#api-architecture)
9. [Deployment Architecture](#deployment-architecture)
10. [Mobile Security (Certificate Pinning)](#mobile-security-certificate-pinning)

---

## System Overview

### Purpose
A SaaS platform for CA (Chartered Accountant) firms to manage client documents, automate GST compliance, and reduce manual data entry.

### Core Components
- **Mobile App (Expo):** Client document capture via camera
- **Web App (Expo Web):** CA staff dashboard for document review
- **Backend API (Spring Boot):** Business logic, auth, OCR processing
- **Cloud Services (AWS):** Storage (S3), OCR (Textract), Auth (Cognito)
- **Database (MongoDB Atlas):** Document metadata, user data

---

## High-Level Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Mobile["📱 Mobile App (Expo)<br/>React Native<br/>iOS + Android"]
        Web["🖥️ Web App (Expo Web)<br/>React<br/>Desktop Browser"]
    end

    subgraph "CDN Layer"
        CF["☁️ CloudFront<br/>Static Assets<br/>Web App Hosting"]
    end

    subgraph "API Gateway"
        APIGW["🚪 AWS API Gateway<br/>Rate Limiting<br/>Request Validation<br/>CORS"]
    end

    subgraph "Application Layer"
        API["⚙️ Spring Boot API<br/>Java 21<br/>Business Logic<br/>JWT Validation"]
    end

    subgraph "AWS Services"
        Cognito["🔐 AWS Cognito<br/>User Authentication<br/>JWT Tokens"]
        S3["📦 AWS S3<br/>Document Storage<br/>Encrypted"]
        Textract["📄 AWS Textract<br/>OCR Processing<br/>Invoice Extraction"]
        SQS["📨 AWS SQS<br/>Async Job Queue<br/>OCR Jobs"]
        Lambda["λ Lambda<br/>OCR Processor<br/>Serverless"]
    end

    subgraph "Data Layer"
        MongoDB["🗄️ MongoDB Atlas<br/>User Data<br/>Documents<br/>Invoices"]
        ElastiCache["⚡ ElastiCache<br/>Redis Cache<br/>Session Store"]
    end

    subgraph "External Services"
        FCM["🔔 Firebase<br/>Push Notifications"]
        SMS["📱 AWS SNS<br/>SMS Notifications"]
        WhatsApp["💬 Twilio<br/>WhatsApp Messages"]
    end

    Mobile -->|HTTPS + JWT| APIGW
    Web --> CF
    CF -->|HTTPS| APIGW
    APIGW -->|Forward| API

    API -->|Auth| Cognito
    API -->|Store/Retrieve| S3
    API -->|Queue Job| SQS
    API -->|Read/Write| MongoDB
    API -->|Cache| ElastiCache
    API -->|Send| FCM
    API -->|Send| SMS
    API -->|Send| WhatsApp

    SQS -->|Trigger| Lambda
    Lambda -->|Process| Textract
    Lambda -->|Update| MongoDB
    Textract -->|Read| S3

    style Mobile fill:#e1f5ff
    style Web fill:#e1f5ff
    style API fill:#fff4e1
    style Cognito fill:#ffe1e1
    style S3 fill:#e1ffe1
    style MongoDB fill:#f0e1ff
```

---

## Security Architecture

### Security Layers (Defense in Depth)

```mermaid
graph LR
    subgraph "Layer 1: Transport"
        TLS["🔒 HTTPS/TLS 1.2+<br/>All Communication Encrypted"]
    end

    subgraph "Layer 2: Authentication"
        Auth["🔐 AWS Cognito<br/>JWT Tokens<br/>MFA (Optional)"]
    end

    subgraph "Layer 3: Authorization"
        RBAC["👥 Role-Based Access<br/>CA_ADMIN, CA_STAFF, CLIENT"]
    end

    subgraph "Layer 4: Tenant Isolation"
        Tenant["🏢 Multi-Tenancy<br/>tenantId Filtering<br/>ThreadLocal Context"]
    end

    subgraph "Layer 5: Input Validation"
        Validation["✅ Input Sanitization<br/>Zod Schemas<br/>Spring Validators"]
    end

    subgraph "Layer 6: Rate Limiting"
        Rate["⏱️ API Gateway<br/>1000 req/sec/tenant<br/>DDoS Protection"]
    end

    subgraph "Layer 7: Audit"
        Audit["📝 Audit Logs<br/>CloudWatch<br/>7-Year Retention"]
    end

    TLS --> Auth --> RBAC --> Tenant --> Validation --> Rate --> Audit

    style TLS fill:#ffe1e1
    style Auth fill:#ffe1e1
    style RBAC fill:#fff4e1
    style Tenant fill:#fff4e1
    style Validation fill:#e1ffe1
    style Rate fill:#e1ffe1
    style Audit fill:#e1f5ff
```

### Web & Mobile → API Security Matrix

| Security Control             | Web (Expo Web)                | Mobile (Expo Native)                 | Status     | Notes                              |
|------------------------------|-------------------------------|--------------------------------------|------------|------------------------------------|
| **Transport Security**       | ✅ HTTPS (TLS 1.2+)            | ✅ HTTPS (TLS 1.2+)                   | ✅ Phase 0  | Enforced by CloudFront/API Gateway |
| **Certificate Pinning**      | ❌ Not applicable (browser)    | ⚠️ Recommended                       | 🔄 Phase 2 | Prevents MITM attacks              |
| **Authentication**           | ✅ JWT (Access Token)          | ✅ JWT (Access Token)                 | ✅ Phase 0  | AWS Cognito issued                 |
| **Token Storage**            | ✅ Memory (React Context)      | ✅ Memory (React Context)             | ✅ Phase 1  | Not in localStorage                |
| **Token Refresh**            | ✅ httpOnly Cookie             | ✅ Secure Storage (expo-secure-store) | ✅ Phase 1  | 30-day refresh tokens              |
| **CORS**                     | ✅ Restricted origins          | ✅ Not applicable                     | ✅ Phase 1  | Only prod domain + localhost       |
| **Request Signing**          | ❌ Not needed (JWT sufficient) | ❌ Not needed (JWT sufficient)        | N/A        | JWT provides integrity             |
| **Rate Limiting**            | ✅ 1000 req/sec/tenant         | ✅ 1000 req/sec/tenant                | ✅ Phase 1  | API Gateway enforced               |
| **Input Validation**         | ✅ Client-side (Zod)           | ✅ Client-side (Zod)                  | ✅ Phase 1  | + Server-side validation           |
| **XSS Protection**           | ✅ React escapes by default    | ✅ React Native safe                  | ✅ Built-in | CSP headers on web                 |
| **SQL/NoSQL Injection**      | N/A (client)                  | N/A (client)                         | ✅ Phase 1  | Parameterized queries (backend)    |
| **Man-in-the-Middle**        | ✅ HTTPS + HSTS                | ⚠️ HTTPS only (Phase 1)              | 🔄 Phase 2 | Add cert pinning mobile            |
| **Jailbreak/Root Detection** | N/A (web)                     | ⚠️ Optional                          | 🔄 Phase 3 | Detect compromised devices         |
| **Code Obfuscation**         | ⚠️ Web minification           | ⚠️ JS bundle obfuscation             | 🔄 Phase 3 | Makes reverse engineering harder   |
| **Audit Logging**            | ✅ All API calls logged        | ✅ All API calls logged               | ✅ Phase 2  | CloudWatch Logs                    |

**Legend:**
- ✅ Implemented
- ⚠️ Partially implemented / Recommended
- ❌ Not applicable / Not needed
- 🔄 Planned for future phase

---

## Authentication Flow

### User Login (Web & Mobile)

```mermaid
sequenceDiagram
    participant User
    participant App as Expo App<br/>(Web/Mobile)
    participant Cognito as AWS Cognito
    participant API as Spring Boot API
    participant DB as MongoDB

    User->>App: Enter email + password
    App->>Cognito: POST /oauth2/token<br/>(username, password)

    alt Valid Credentials
        Cognito-->>App: 200 OK<br/>access_token (JWT, 1h)<br/>refresh_token (30d)<br/>id_token

        App->>App: Store access_token in memory<br/>Store refresh_token securely

        App->>API: GET /api/auth/me<br/>Authorization: Bearer {access_token}

        API->>API: Validate JWT signature<br/>Check expiration<br/>Extract claims

        API->>Cognito: Verify token (JWKS)
        Cognito-->>API: Valid ✓

        API->>DB: Find user by sub (user ID)
        DB-->>API: User data

        API-->>App: 200 OK<br/>{ user: {...}, tenantId: "..." }

        App->>App: Store user in state
        App-->>User: Redirect to Dashboard
    else Invalid Credentials
        Cognito-->>App: 401 Unauthorized
        App-->>User: "Invalid email or password"
    end

    Note over App,API: All subsequent API calls include:<br/>Authorization: Bearer {access_token}
```

### Token Refresh Flow

```mermaid
sequenceDiagram
    participant App as Expo App
    participant API as Spring Boot API
    participant Cognito as AWS Cognito

    App->>API: GET /api/documents<br/>Authorization: Bearer {expired_token}

    API->>API: Validate JWT
    API-->>App: 401 Unauthorized<br/>{ error: "Token expired" }

    App->>App: Axios interceptor catches 401

    App->>Cognito: POST /oauth2/token<br/>grant_type=refresh_token<br/>refresh_token={refresh_token}

    alt Valid Refresh Token
        Cognito-->>App: 200 OK<br/>new access_token<br/>new refresh_token

        App->>App: Update tokens in memory

        App->>API: Retry: GET /api/documents<br/>Authorization: Bearer {new_access_token}

        API-->>App: 200 OK<br/>{ documents: [...] }
    else Invalid Refresh Token
        Cognito-->>App: 401 Unauthorized
        App->>App: Clear all tokens
        App-->>App: Redirect to Login
    end
```

---

## Document Upload Flow

### Mobile Camera Capture → OCR Processing

```mermaid
sequenceDiagram
    participant Client as Mobile App<br/>(Client User)
    participant API as Spring Boot API
    participant S3 as AWS S3
    participant SQS as AWS SQS
    participant Lambda as Lambda Function
    participant Textract as AWS Textract
    participant DB as MongoDB
    participant CA as Web App<br/>(CA Staff)

    Client->>Client: Open camera, capture invoice
    Client->>Client: Compress image (80% quality)

    Client->>API: POST /api/documents/upload<br/>Authorization: Bearer {token}<br/>FormData: { file, documentType }

    API->>API: Validate JWT<br/>Extract tenantId, userId

    API->>S3: Upload file<br/>Key: {tenantId}/{userId}/{timestamp}.jpg<br/>Encryption: AES-256

    S3-->>API: S3 URL

    API->>DB: Create Document<br/>{ id, tenantId, userId, s3Url,<br/>status: PENDING, ocrStatus: PENDING }

    DB-->>API: Document saved

    API->>SQS: Send message<br/>{ documentId, s3Bucket, s3Key }

    API-->>Client: 201 Created<br/>{ documentId, status: "PENDING" }

    Client->>Client: Show "Processing..." with spinner

    Note over SQS,Lambda: Async Processing (5-10 seconds)

    SQS->>Lambda: Trigger with message

    Lambda->>Textract: DetectDocumentText<br/>S3Bucket: {s3Bucket}<br/>S3Key: {s3Key}

    Textract->>S3: Read image
    Textract-->>Lambda: Extracted text<br/>{ blocks: [...] }

    Lambda->>Lambda: Parse text:<br/>- GSTIN (regex)<br/>- Invoice number<br/>- Date<br/>- Amount<br/>- Vendor name

    Lambda->>DB: Update Document<br/>{ extractedData: {...},<br/>ocrStatus: COMPLETED,<br/>confidence: 85% }

    DB-->>Lambda: Updated

    Lambda->>Client: Push notification (FCM)<br/>"Invoice processed ✓"

    Client->>Client: Show notification

    Client->>API: GET /api/documents/{documentId}

    API->>DB: Find document by ID + tenantId
    DB-->>API: Document with extractedData

    API-->>Client: 200 OK<br/>{ document: { extractedData: {...} } }

    Client->>Client: Display extracted data:<br/>GSTIN, Amount, Date

    Note over CA: CA staff sees in dashboard

    CA->>API: GET /api/documents?status=PENDING_REVIEW
    API-->>CA: List of documents

    CA->>API: PUT /api/documents/{documentId}/approve
    API->>DB: Update status: APPROVED
    API-->>CA: 200 OK
```

---

## Multi-Tenancy Architecture

### Tenant Isolation Strategy

```mermaid
graph TB
    subgraph "Request Flow"
        Request["📨 API Request<br/>Authorization: Bearer {JWT}"]
        Extract["🔍 Extract JWT Claims<br/>sub (userId)<br/>custom:tenantId"]
        ThreadLocal["🧵 Set ThreadLocal<br/>TenantContext.setTenantId(tenantId)"]
        Business["⚙️ Business Logic<br/>Process Request"]
        Query["🗄️ MongoDB Query<br/>ALWAYS filter by tenantId"]
        Response["📤 Return Response"]
        Clear["🧹 Clear ThreadLocal<br/>TenantContext.clear()"]
    end

    Request --> Extract
    Extract --> ThreadLocal
    ThreadLocal --> Business
    Business --> Query
    Query --> Response
    Response --> Clear

    subgraph "Security Checks"
        Validate["✅ Validate tenantId present<br/>Throw error if null"]
        Prevent["🚫 Prevent cross-tenant access<br/>All queries scoped"]
    end

    ThreadLocal --> Validate
    Query --> Prevent

    style Request fill:#e1f5ff
    style Extract fill:#fff4e1
    style ThreadLocal fill:#ffe1e1
    style Query fill:#ffe1e1
    style Validate fill:#ffe1e1
    style Prevent fill:#ffe1e1
```

### MongoDB Document Structure (Multi-Tenant)

// Every document MUST have tenantId field

// User Collection
```json
{
  "_id": "user_123",
  "tenantId": "ca-firm-abc",        // ← REQUIRED
  "email": "john@example.com",
  "role": "CA_STAFF",
  "createdAt": ISODate("2025-01-15")
}
```

// Document Collection
```json
{
  "_id": "doc_456",
  "tenantId": "ca-firm-abc",        // ← REQUIRED
  "userId": "user_123",
  "clientId": "client_789",
  "s3Url": "s3://bucket/ca-firm-abc/user_123/invoice.jpg",
  "documentType": "SALES_INVOICE",
  "ocrStatus": "COMPLETED",
  "extractedData": {
    "gstin": "27XXXXX1234X1ZX",
    "amount": 10000,
    "invoiceNumber": "INV-001",
    "invoiceDate": "2025-01-15"
  },
  "status": "APPROVED",
  "createdAt": ISODate("2025-01-15")
}
```

// Invoice Collection (GSTR Data)
```json
{
  "_id": "invoice_789",
  "tenantId": "ca-firm-abc",        // ← REQUIRED
  "documentId": "doc_456",
  "clientId": "client_789",
  "gstin": "27XXXXX1234X1ZX",
  "invoiceNumber": "INV-001",
  "invoiceDate": "2025-01-15",
  "taxableValue": 10000,
  "cgst": 900,
  "sgst": 900,
  "igst": 0,
  "total": 11800,
  "month": 1,
  "year": 2025,
  "filingStatus": "PENDING"
}
```

### Compound Indexes (Security + Performance)

```javascript
// MongoDB Indexes

// User collection
db.users.createIndex({ "tenantId": 1, "email": 1 }, { unique: true });
db.users.createIndex({ "tenantId": 1, "role": 1 });

// Document collection
db.documents.createIndex({ "tenantId": 1, "_id": 1 });
db.documents.createIndex({ "tenantId": 1, "status": 1, "createdAt": -1 });
db.documents.createIndex({ "tenantId": 1, "userId": 1 });
db.documents.createIndex({ "tenantId": 1, "clientId": 1 });
db.documents.createIndex({ "tenantId": 1, "ocrStatus": 1 });

// Invoice collection
db.invoices.createIndex({ "tenantId": 1, "month": 1, "year": 1 });
db.invoices.createIndex({ "tenantId": 1, "gstin": 1 });

// Why tenantId is first in every index:
// 1. Security: Forces MongoDB to use tenantId in query plan
// 2. Performance: Avoids scanning other tenants' data
// 3. Isolation: Each tenant's data is effectively partitioned
```

---

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    TENANT ||--o{ USER : has
    TENANT ||--o{ CLIENT : has
    TENANT ||--o{ DOCUMENT : has
    TENANT ||--o{ INVOICE : has

    USER ||--o{ DOCUMENT : uploads
    CLIENT ||--o{ DOCUMENT : owns
    DOCUMENT ||--o| INVOICE : generates

    TENANT {
        string id PK
        string name
        string subscriptionTier
        date createdAt
        boolean active
    }

    USER {
        string id PK
        string tenantId FK
        string email
        string cognitoSub
        enum role
        string phoneNumber
        boolean enableNotifications
        date createdAt
    }

    CLIENT {
        string id PK
        string tenantId FK
        string name
        string gstin
        string email
        string phoneNumber
        enum category
        date createdAt
    }

    DOCUMENT {
        string id PK
        string tenantId FK
        string userId FK
        string clientId FK
        string s3Url
        string originalFilename
        enum documentType
        enum status
        enum ocrStatus
        object extractedData
        float confidence
        date uploadedAt
        date processedAt
        string approvedBy
    }

    INVOICE {
        string id PK
        string tenantId FK
        string documentId FK
        string clientId FK
        string gstin
        string invoiceNumber
        date invoiceDate
        decimal taxableValue
        decimal cgst
        decimal sgst
        decimal igst
        decimal total
        int month
        int year
        enum filingStatus
    }
```

---

## API Architecture

### RESTful API Endpoints

```mermaid
graph LR
    subgraph "Authentication"
        A1[POST /api/auth/signup]
        A2[POST /api/auth/login]
        A3[GET /api/auth/me]
        A4[POST /api/auth/logout]
    end

    subgraph "Documents"
        D1[POST /api/documents/upload]
        D2[GET /api/documents]
        D3[GET /api/documents/:id]
        D4[PUT /api/documents/:id]
        D5[DELETE /api/documents/:id]
        D6[POST /api/documents/:id/process]
        D7[PUT /api/documents/:id/approve]
        D8[PUT /api/documents/:id/reject]
    end

    subgraph "GST Returns"
        G1[GET /api/gstr/1/:month/:year]
        G2[POST /api/gstr/1/generate]
        G3[GET /api/gstr/1/export]
        G4[GET /api/gstr/3b/:month/:year]
    end

    subgraph "Clients"
        C1[POST /api/clients]
        C2[GET /api/clients]
        C3[GET /api/clients/:id]
        C4[PUT /api/clients/:id]
        C5[GET /api/clients/:id/documents]
    end

    subgraph "Notifications"
        N1[POST /api/notifications/send]
        N2[GET /api/notifications]
        N3[PUT /api/notifications/preferences]
    end

    style A1 fill:#e1f5ff
    style A2 fill:#e1f5ff
    style D1 fill:#fff4e1
    style D2 fill:#fff4e1
    style G1 fill:#e1ffe1
    style G2 fill:#e1ffe1
```

### API Request/Response Format

**Standard Request:**
```http
POST /api/documents/upload HTTP/1.1
Host: api.chanakya.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="invoice.jpg"
Content-Type: image/jpeg

[binary data]
------WebKitFormBoundary
Content-Disposition: form-data; name="documentType"

SALES_INVOICE
------WebKitFormBoundary--
```

**Standard Success Response:**
```json
{
  "success": true,
  "data": {
    "id": "doc_456",
    "tenantId": "ca-firm-abc",
    "userId": "user_123",
    "s3Url": "https://s3.ap-south-1.amazonaws.com/...",
    "status": "PENDING",
    "ocrStatus": "PENDING",
    "uploadedAt": "2025-01-15T10:30:00Z"
  },
  "message": "Document uploaded successfully",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

**Standard Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "JWT token has expired",
    "details": {
      "expiredAt": "2025-01-15T09:30:00Z",
      "currentTime": "2025-01-15T10:30:00Z"
    }
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

---

## Deployment Architecture

### AWS Infrastructure (Production)

```mermaid
graph TB
    subgraph "Edge Layer"
        R53["Route 53<br/>DNS<br/>chanakya.com"]
        CF["CloudFront<br/>CDN<br/>SSL/TLS"]
    end

    subgraph "Public Subnet"
        ALB["Application Load Balancer<br/>Health Checks<br/>SSL Termination"]
        APIGW["API Gateway<br/>Rate Limiting"]
    end

    subgraph "Private Subnet"
        ECS["ECS Fargate<br/>Spring Boot API<br/>Auto-scaling 2-10 tasks"]
    end

    subgraph "Data Subnet"
        RDS["MongoDB Atlas<br/>M10 Cluster<br/>3 Replicas"]
        Redis["ElastiCache<br/>Redis 6.x<br/>Cache Cluster"]
    end

    subgraph "Storage"
        S3["S3 Bucket<br/>Documents<br/>Versioning Enabled"]
    end

    subgraph "Compute"
        Lambda["Lambda Functions<br/>OCR Processing<br/>Async Jobs"]
        SQS2["SQS Queue<br/>Job Processing"]
    end

    subgraph "Monitoring"
        CW["CloudWatch<br/>Logs + Metrics<br/>Alarms"]
    end

    Internet((Internet)) --> R53
    R53 --> CF
    CF --> APIGW
    CF --> S3
    APIGW --> ALB
    ALB --> ECS

    ECS --> RDS
    ECS --> Redis
    ECS --> S3
    ECS --> SQS2
    ECS --> CW

    SQS2 --> Lambda
    Lambda --> S3
    Lambda --> RDS

    style Internet fill:#e1f5ff
    style CF fill:#ffe1e1
    style ECS fill:#fff4e1
    style RDS fill:#e1ffe1
    style Lambda fill:#fff4e1
```

### Environment Configuration

| Environment | Purpose | Infrastructure | Cost/Month |
|-------------|---------|---------------|------------|
| **Development** | Local dev + testing | Docker Compose locally | ₹0 |
| **Staging** | Pre-production testing | AWS Free Tier (t2.micro, 512MB MongoDB) | ₹500-1,500 |
| **Production** | Live customer traffic | ECS Fargate (2 tasks), M10 MongoDB, CloudFront | ₹15,000-25,000 |

---

## Mobile Security (Certificate Pinning)

### What is Certificate Pinning?

**Problem:** Even with HTTPS, attacker can install rogue CA certificate on device and intercept traffic.

**Solution:** Mobile app "pins" (hardcodes) the expected server certificate. Rejects connection if certificate doesn't match.

```mermaid
graph TB
    subgraph "Without Pinning (Vulnerable)"
        M1[Mobile App] -->|HTTPS| Attacker[👿 Attacker MITM]
        Attacker -->|HTTPS| Server1[Server]
        M1 -.->|"Trusts any CA"| BadCA[🚫 Rogue CA Certificate]
    end

    subgraph "With Pinning (Secure)"
        M2[Mobile App] -->|HTTPS| Server2[Server]
        M2 -->|"Expected Certificate:<br/>SHA-256: abc123..."| Pin[📌 Pinned Certificate]
        M2 -.->|❌ Rejects| Attacker2[👿 Attacker MITM<br/>Different Certificate]
    end

    style M1 fill:#ffe1e1
    style Attacker fill:#ff0000
    style M2 fill:#e1ffe1
    style Server2 fill:#e1ffe1
```

### Implementation Plan

**Phase 1 (Week 1-12): HTTPS Only**
```typescript
// Expo app - Default HTTPS
const API_URL = 'https://api.chanakya.com';

// Axios client
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// ✅ This is secure for MVP
// ⚠️ But can be MITM'd on compromised device
```

**Phase 2 (Week 13+): Add Certificate Pinning**
```typescript
// Step 1: Get your server's SSL certificate hash
// openssl s_client -connect api.chanakya.com:443 | openssl x509 -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | openssl enc -base64

// Step 2: Install react-native-ssl-pinning (requires expo prebuild)
import { fetch } from 'react-native-ssl-pinning';

// Step 3: Configure pinning
const pinnedFetch = async (url: string, options: any) => {
  return fetch(url, {
    ...options,
    sslPinning: {
      certs: ['server-cert'], // Place cert in assets folder
      // Or use public key hash:
      // publicKeyHashes: ['sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=']
    },
  });
};

// Step 4: Use in API calls
const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await pinnedFetch('https://api.chanakya.com/api/documents/upload', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  // ✅ Connection rejected if certificate doesn't match
  // ✅ Prevents MITM even on compromised device
};
```

**Certificate Rotation Strategy:**
```mermaid
graph LR
    subgraph "Problem with Pinning"
        Cert["Server Certificate<br/>Expires: Jan 2026"]
        New["New Certificate<br/>Issued: Jan 2026"]
        App["Mobile App<br/>Pinned to old cert"]

        Cert -.->|"Certificate rotates"| New
        App -.->|"❌ Rejects connection"| New
    end

    subgraph "Solution: Backup Pins"
        Primary["Primary Pin<br/>Current Cert"]
        Backup["Backup Pin<br/>Next Cert"]
        App2["Mobile App<br/>Accepts either pin"]

        App2 -->|"✅ Works"| Primary
        App2 -->|"✅ Works"| Backup
    end

    style Cert fill:#fff4e1
    style New fill:#ffe1e1
    style App fill:#ffe1e1
    style App2 fill:#e1ffe1
```

**Best Practice:**
```typescript
// Pin both current AND next certificate
const sslPinningConfig = {
  publicKeyHashes: [
    'sha256/CURRENT_CERT_HASH_HERE',  // Current certificate
    'sha256/BACKUP_CERT_HASH_HERE',   // Next certificate (before rotation)
  ],
};

// This gives you time to:
// 1. Rotate server certificate
// 2. Update mobile app with new pin
// 3. Users update app
// 4. Remove old pin from app
```

### Implementation Checklist

**MVP (Phase 1 - Week 1-12):**
- [x] HTTPS enforced (TLS 1.2+)
- [x] JWT tokens in Authorization header
- [x] No sensitive data in URLs
- [ ] Document certificate pinning plan

**Production (Phase 2 - Week 13-20):**
- [ ] Implement certificate pinning (mobile only)
- [ ] Configure backup certificate pins
- [ ] Test with proxy tools (Charles, Burp Suite)
- [ ] Add certificate expiry monitoring
- [ ] Plan rotation 30 days before expiry

**Additional Security (Phase 3 - Week 21+):**
- [ ] Jailbreak/root detection
- [ ] Code obfuscation (JS bundle)
- [ ] Runtime application self-protection (RASP)
- [ ] Binary hardening

---

## Security Testing Checklist

### Penetration Testing Scenarios

**Authentication:**
- [ ] Try accessing API without token (expect 401)
- [ ] Try using expired token (expect 401)
- [ ] Try using another user's token (expect 403)
- [ ] Try SQL injection in login form
- [ ] Try brute force password (should be rate-limited)

**Authorization:**
- [ ] CA_STAFF tries to access CA_ADMIN endpoint (expect 403)
- [ ] CLIENT tries to view other client's documents (expect 403)
- [ ] Try accessing different tenant's data (expect 403)

**Data Validation:**
- [ ] Upload non-image file (expect 400)
- [ ] Upload 50MB file (should reject)
- [ ] Try XSS in document notes field
- [ ] Try NoSQL injection in search query

**Transport Security:**
- [ ] Verify TLS 1.2+ only (reject TLS 1.0, 1.1)
- [ ] Verify HSTS header present
- [ ] Test with self-signed cert (should fail)
- [ ] Test MITM with proxy (Phase 2: should fail with cert pinning)

---

## Monitoring & Observability

### Key Metrics to Track

```mermaid
graph TB
    subgraph "Application Metrics"
        A1["Request Rate<br/>(req/sec)"]
        A2["Error Rate<br/>(4xx, 5xx)"]
        A3["Response Time<br/>(p50, p95, p99)"]
    end

    subgraph "Business Metrics"
        B1["Documents Uploaded<br/>(per day)"]
        B2["OCR Success Rate<br/>(%)"]
        B3["Active Users<br/>(DAU, MAU)"]
    end

    subgraph "Infrastructure Metrics"
        I1["CPU Usage<br/>(%)"]
        I2["Memory Usage<br/>(%)"]
        I3["Database Connections<br/>(count)"]
    end

    subgraph "Security Metrics"
        S1["Failed Login Attempts<br/>(count)"]
        S2["Rate Limit Hits<br/>(count)"]
        S3["Unauthorized Access<br/>(403 errors)"]
    end

    CloudWatch["AWS CloudWatch<br/>Centralized Logging"]

    A1 --> CloudWatch
    A2 --> CloudWatch
    A3 --> CloudWatch
    B1 --> CloudWatch
    B2 --> CloudWatch
    B3 --> CloudWatch
    I1 --> CloudWatch
    I2 --> CloudWatch
    I3 --> CloudWatch
    S1 --> CloudWatch
    S2 --> CloudWatch
    S3 --> CloudWatch

    CloudWatch --> Alerts["📧 Email Alerts<br/>SMS Alerts"]

    style CloudWatch fill:#fff4e1
    style Alerts fill:#ffe1e1
```

### CloudWatch Alarms

```yaml
# Critical Alarms (immediate action)
- Error rate > 5% for 5 minutes → Page on-call
- API response time p99 > 5s for 10 minutes → Page on-call
- OCR processing failed > 20% for 15 minutes → Page on-call

# Warning Alarms (investigate)
- CPU usage > 80% for 10 minutes → Email alert
- Memory usage > 85% for 10 minutes → Email alert
- Failed login attempts > 50/hour → Email alert
- Unauthorized access (403) > 100/hour → Email alert

# Budget Alarms
- AWS bill > $100 in single day → SMS alert
- Textract cost > $50 in single day → Email alert
```

---

## Disaster Recovery Plan

### Backup Strategy

| Data | Backup Frequency | Retention | Recovery Time |
|------|------------------|-----------|---------------|
| **MongoDB** | Continuous (Atlas) | 7 days | < 1 hour |
| **S3 Documents** | Versioning enabled | 30 days | < 30 minutes |
| **Application Code** | Git push | Forever | < 15 minutes |
| **Infrastructure Config** | Terraform state | Forever | < 1 hour |

### Incident Response

```mermaid
graph LR
    Incident["🚨 Incident Detected<br/>(CloudWatch Alarm)"]
    Assess["📊 Assess Severity<br/>P0: System Down<br/>P1: Partial Outage<br/>P2: Degraded"]

    P0["P0: System Down<br/>All users affected"]
    P1["P1: Partial Outage<br/>Some users affected"]
    P2["P2: Degraded<br/>Performance issues"]

    Act["🔧 Take Action<br/>Rollback / Hotfix"]
    Communicate["📢 Communicate<br/>Status page / Email"]
    Resolve["✅ Resolve Issue"]
    Postmortem["📝 Write Postmortem<br/>What happened?<br/>Why?<br/>How to prevent?"]

    Incident --> Assess
    Assess --> P0
    Assess --> P1
    Assess --> P2

    P0 --> Act
    P1 --> Act
    P2 --> Act

    Act --> Communicate
    Communicate --> Resolve
    Resolve --> Postmortem

    style Incident fill:#ffe1e1
    style P0 fill:#ff0000
    style Resolve fill:#e1ffe1
```

---

## Appendix: Technology Versions

| Technology | Version | Justification |
|------------|---------|---------------|
| Java | 21 LTS | Long-term support, modern features |
| Spring Boot | 3.5.x | Latest stable, Spring Security 6.5 |
| Node.js | 20.x LTS | Expo compatibility |
| Expo SDK | 52+ | Latest stable, Expo Router support |
| MongoDB | 7.0+ | Latest features, better performance |
| Redis | 7.2+ | Latest stable |
| AWS SDK | Latest | Auto-updated by AWS |

---

## References

- [AWS Cognito Best Practices](https://docs.aws.amazon.com/cognito/latest/developerguide/security-best-practices.html)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [Expo Security](https://docs.expo.dev/guides/security/)
- [Certificate Pinning Guide](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning)

---

**Last Updated:** January 2025
**Maintained By:** Solo Founder + Claude Code
**Review Frequency:** Every sprint (2 weeks)
