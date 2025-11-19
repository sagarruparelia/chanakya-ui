# MVP Architecture - Chanakya GST Compliance Platform

> **Strategy:** Start Simple → Validate → Add Complexity Only When Needed
> **Approach:** Monolith → Measured Scale
> **Timeline:** Phases 0-4 (Weeks 0-16)
> **Last Updated:** January 2025

---

## Table of Contents

1. [Architecture Philosophy](#architecture-philosophy)
2. [MVP System Overview (Phases 1-4)](#mvp-system-overview-phases-1-4)
3. [Authentication & Security](#authentication--security)
4. [Document Upload & OCR Flow](#document-upload--ocr-flow)
5. [Multi-Tenancy](#multi-tenancy)
6. [Database Design](#database-design)
7. [API Endpoints](#api-endpoints)
8. [Deployment (Simple)](#deployment-simple)
9. [When to Add Complexity](#when-to-add-complexity)
10. [Phase-by-Phase Evolution](#phase-by-phase-evolution)

---

## Architecture Philosophy

### Build Principle: YAGNI (You Aren't Gonna Need It)

**Don't build it until you need it. Don't optimize until it's slow.**

| Complexity           | When MVP | When To Add                       | Why Wait                                       |
|----------------------|----------|-----------------------------------|------------------------------------------------|
| **API Gateway**      | ❌ Skip   | At 1000 req/sec or need API keys  | Adds cost (₹0.035/million), extra debug layer  |
| **Redis Cache**      | ❌ Skip   | When DB queries >500ms p95        | Premature optimization, adds state management  |
| **SQS + Lambda**     | ❌ Skip   | When OCR >10s or need retry logic | Synchronous is simpler to debug                |
| **Load Balancer**    | ❌ Skip   | When single instance CPU >80%     | Single instance handles 100+ concurrent users  |
| **Multiple Regions** | ❌ Skip   | Never for 50 CAs                  | Massive complexity, not needed for India-only  |
| **Microservices**    | ❌ Skip   | At 5+ developers or 10K users     | Distributed complexity kills solo productivity |
| **Kubernetes**       | ❌ Skip   | Never (for this scale)            | Docker Compose or ECS is enough                |

**Start with the simplest thing that works. Add complexity when you have a problem to solve.**

---

## MVP System Overview (Phases 1-4)

### High-Level Architecture (Weeks 1-16)

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
├──────────────────────────┬──────────────────────────────────┤
│  📱 Mobile App (Expo)    │  🖥️  Web App (Expo Web)         │
│  - Document capture      │  - CA dashboard                  │
│  - Client invoice upload │  - Document review               │
│  - React Native          │  - GSTR form preparation         │
└──────────────┬───────────┴──────────────┬───────────────────┘
               │                          │
               │    HTTPS (TLS 1.2+)     │
               │    JWT in Auth header    │
               │                          │
               └──────────┬───────────────┘
                          ▼
         ┌────────────────────────────────────┐
         │   🌐 CloudFront (Optional Phase 2) │
         │   - CDN for web static assets      │
         │   - SSL certificate (ACM)          │
         └────────────────┬───────────────────┘
                          │
                          ▼
         ┌────────────────────────────────────┐
         │   ⚙️  Spring Boot API               │
         │   - Single instance (EC2 t2.micro) │
         │   - JWT validation                 │
         │   - Business logic                 │
         │   - Multi-tenant filtering         │
         └─────┬────────┬────────┬────────────┘
               │        │        │
       ┌───────┘        │        └────────┐
       ▼                ▼                 ▼
┌──────────┐    ┌──────────────┐    ┌─────────┐
│ 🔐 Cognito│    │ 🗄️  MongoDB   │    │ 📦 S3   │
│ - Auth   │    │    Atlas M0   │    │ Docs    │
│ - JWT    │    │ - Free tier   │    │ Storage │
└──────────┘    │ - 512MB       │    └────┬────┘
                └───────┬───────┘         │
                        │                 │
                        │     ┌───────────┘
                        │     ▼
                        │  ┌──────────────┐
                        │  │ 📄 Textract  │
                        │  │ - OCR        │
                        │  │ - Sync calls │
                        │  └──────────────┘
                        ▼
                ┌────────────────┐
                │ 📧 AWS SNS/SES │
                │ - Notifications│
                └────────────────┘
```

**Total Components: 6** (Cognito, Spring Boot, MongoDB, S3, Textract, SNS)
**Complexity: Low** (No queues, no caching, no microservices)

---

## Authentication & Security

### JWT Token Flow (AWS Cognito)

```
┌─────────┐                                     ┌──────────┐
│  User   │                                     │ Cognito  │
└────┬────┘                                     └────┬─────┘
     │                                                │
     │  1. POST /oauth2/token                        │
     │     (email, password)                         │
     ├──────────────────────────────────────────────>│
     │                                                │
     │  2. Validate credentials                      │
     │     Check user pool                           │
     │                                                │
     │  3. 200 OK                                    │
     │     { access_token, refresh_token, id_token } │
     │<──────────────────────────────────────────────┤
     │                                                │
┌────┴────┐                                          │
│ Expo App│                                          │
│ Store:  │                                          │
│ - Access token in memory (React Context)          │
│ - Refresh token in SecureStore (mobile)           │
│   or httpOnly cookie (web)                        │
└────┬────┘                                          │
     │                                                │
     │  4. API Request                               │
     │     GET /api/documents                    ┌───┴────┐
     │     Authorization: Bearer {access_token}  │ Spring │
     ├──────────────────────────────────────────>│  Boot  │
     │                                            └───┬────┘
     │  5. Extract JWT from header                   │
     │     Validate signature with Cognito JWKS      │
     │     Check expiration (exp claim)              │
     │     Extract: sub, tenantId, role              │
     │                                                │
     │  6. If valid: Process request                 │
     │     If expired: 401 Unauthorized              │
     │<──────────────────────────────────────────────┤
     │                                                │
     │  7. On 401: Refresh token flow                │
     │     POST /oauth2/token                        │
     │     grant_type=refresh_token              ┌───┴────┐
     ├──────────────────────────────────────────>│ Cognito│
     │                                            └───┬────┘
     │  8. New access_token + refresh_token          │
     │<──────────────────────────────────────────────┤
     │                                                │
     │  9. Retry original request with new token     │
     └────────────────────────────────────────────────┘
```

### JWT Token Structure

**Access Token (Valid 1 hour):**

```json
{
  "sub": "user_123",
  // User ID
  "cognito:groups": [
    "CA_STAFF"
  ],
  // User role
  "custom:tenantId": "ca-firm-abc",
  // CA firm ID (CRITICAL for multi-tenancy)
  "email": "john@cafirm.com",
  "exp": 1704970800,
  // Expiration timestamp
  "iat": 1704967200
  // Issued at
}
```

**Spring Boot JWT Validation:**

```java

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                        )
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/**").authenticated()
                );
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        // Cognito public keys URL
        String jwksUrl = "https://cognito-idp.ap-south-1.amazonaws.com/"
                + cognitoUserPoolId + "/.well-known/jwks.json";
        return NimbusJwtDecoder.withJwkSetUri(jwksUrl).build();
    }
}
```

### Security Checklist (MVP)

**Phase 1-4 (Must Have):**

- [x] HTTPS everywhere (TLS 1.2+)
- [x] JWT tokens (not session cookies)
- [x] Token in Authorization header (not URL params)
- [x] Refresh token in secure storage (not localStorage)
- [x] Multi-tenant filtering (tenantId in all queries)
- [x] CORS restricted to production domain
- [x] Input validation (Zod on frontend, Spring validators on backend)

**Phase 5+ (Nice to Have):**

- [ ] Certificate pinning (mobile)
- [ ] Rate limiting (API Gateway or Spring)
- [ ] Audit logging (CloudWatch structured logs)
- [ ] WAF (Web Application Firewall)
- [ ] VAPT testing (after 50+ users)

---

## Document Upload & OCR Flow

### Synchronous OCR Flow (Simple, Weeks 5-8)

**Why synchronous?**

- Simpler to debug (no queue monitoring)
- Good enough for MVP (<30s processing)
- No SQS/Lambda costs
- Fewer moving parts

```
┌──────────┐                                              ┌────────────┐
│  Mobile  │                                              │  Spring    │
│   App    │                                              │   Boot     │
└────┬─────┘                                              └─────┬──────┘
     │                                                          │
     │ 1. User captures invoice photo                          │
     │    - expo-camera                                        │
     │    - Compress to 80% quality                            │
     │    - Max 5MB                                            │
     │                                                          │
     │ 2. POST /api/documents/upload                           │
     │    Content-Type: multipart/form-data                    │
     │    Authorization: Bearer {JWT}                          │
     │    Body: { file, documentType, clientId }               │
     ├─────────────────────────────────────────────────────────>│
     │                                                          │
     │                                      3. Validate JWT    │
     │                                         Extract tenantId│
     │                                         Extract userId  │
     │                                                          │
     │                                      4. Upload to S3    │
     │                                         Key: {tenantId}/│
     │                                              {clientId}/│
     │                                              {timestamp}.jpg
     │                                                      ┌───┴───┐
     │                                                      │  S3   │
     │                                                      └───┬───┘
     │                                      5. S3 URL returned │
     │                                                          │
     │                                      6. Save metadata    │
     │                                         to MongoDB       │
     │                                         {                │
     │                                           id: doc_123    │
     │                                           tenantId       │
     │                                           s3Url          │
     │                                           status: PENDING│
     │                                           ocrStatus: PENDING
     │                                         }            ┌───┴────┐
     │                                                      │ MongoDB│
     │                                                      └───┬────┘
     │  7. 201 Created                                         │
     │     { documentId: doc_123, status: PENDING }            │
     │<────────────────────────────────────────────────────────┤
     │                                                          │
     │ 8. Display: "Uploaded successfully"                     │
     │    Show document in list                                │
     │                                                          │
     │ 9. User clicks "Process with OCR"                       │
     │    POST /api/documents/doc_123/process                  │
     ├─────────────────────────────────────────────────────────>│
     │                                                          │
     │                                     10. Update status:   │
     │                                         ocrStatus:       │
     │                                         PROCESSING       │
     │                                                          │
     │                                     11. Call Textract   │
     │                                         (SYNCHRONOUS)    │
     │                                         - Read from S3   │
     │                                         - Extract text   │
     │                                                      ┌───┴────┐
     │                                                      │Textract│
     │                                                      └───┬────┘
     │                                     12. Parse response  │
     │                                         Extract:         │
     │                                         - GSTIN          │
     │                                         - Invoice #      │
     │                                         - Date           │
     │                                         - Amount         │
     │                                         - Confidence     │
     │                                                          │
     │                                     13. Save extracted   │
     │                                         data to MongoDB  │
     │                                         ocrStatus:       │
     │                                         COMPLETED        │
     │                                                          │
     │ 14. 200 OK                                              │
     │     { extractedData: {...}, confidence: 85% }           │
     │<────────────────────────────────────────────────────────┤
     │                                                          │
     │ 15. Display extracted fields                            │
     │     Allow manual edit if confidence <90%                │
     │                                                          │
     └─────────────────────────────────────────────────────────┘
```

**Timing:**

- Upload to S3: ~2 seconds
- Textract processing: ~10-20 seconds
- Total: ~15-25 seconds (acceptable for MVP)

**If Textract is slow (>30s), then add async in Phase 5:**

```
Replace: Direct Textract call
With:    SQS queue → Lambda → Textract
         Then push notification when done
```

### Textract Response Parsing

**Textract returns blocks of text:**

```json
{
  "Blocks": [
    {
      "BlockType": "LINE",
      "Text": "GSTIN: 27XXXXX1234X1ZX",
      "Confidence": 99.8
    },
    {
      "BlockType": "LINE",
      "Text": "Invoice No: INV-001",
      "Confidence": 98.5
    },
    {
      "BlockType": "LINE",
      "Text": "Total Amount: ₹11,800",
      "Confidence": 95.2
    }
  ]
}
```

**Backend parsing logic:**

```java
public class TextractParser {

    private static final Pattern GSTIN_PATTERN =
            Pattern.compile("\\d{2}[A-Z]{5}\\d{4}[A-Z]{1}[A-Z\\d]{1}[Z]{1}[A-Z\\d]{1}");

    public ExtractedData parseTextractResponse(TextractResponse response) {
        ExtractedData data = new ExtractedData();

        for (Block block : response.getBlocks()) {
            String text = block.getText();

            // Extract GSTIN
            Matcher gstinMatcher = GSTIN_PATTERN.matcher(text);
            if (gstinMatcher.find()) {
                data.setGstin(gstinMatcher.group());
                data.setGstinConfidence(block.getConfidence());
            }

            // Extract invoice number (multiple patterns)
            if (text.matches("(?i).*invoice\\s*no\\.?\\s*:?\\s*(.+)")) {
                // Parse invoice number
            }

            // Extract amount (₹ symbol, commas)
            if (text.matches(".*₹\\s*([\\d,]+).*")) {
                // Parse amount
            }
        }

        return data;
    }
}
```

---

## Multi-Tenancy

### Critical: Prevent Cross-Tenant Data Leakage

**Every query MUST filter by tenantId. No exceptions.**

### Request Flow with Tenant Isolation

```
1. Request arrives with JWT
   └─> Extract tenantId from JWT claims

2. Store tenantId in ThreadLocal
   └─> Available for entire request lifecycle

3. All MongoDB queries MUST include tenantId filter
   └─> db.documents.find({ tenantId: "ca-firm-abc", ... })

4. Clear ThreadLocal after response
   └─> Prevents leakage to next request
```

### Implementation

**Tenant Context (ThreadLocal):**

```java
public class TenantContext {
    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();

    public static void setTenantId(String tenantId) {
        if (tenantId == null || tenantId.isEmpty()) {
            throw new IllegalArgumentException("tenantId cannot be null");
        }
        currentTenant.set(tenantId);
    }

    public static String getTenantId() {
        String tenantId = currentTenant.get();
        if (tenantId == null) {
            throw new SecurityException("No tenant context set!");
        }
        return tenantId;
    }

    public static void clear() {
        currentTenant.remove();
    }
}
```

**Security Filter:**

```java

@Component
public class TenantFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) {
        try {
            // Extract tenantId from JWT
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof Jwt) {
                Jwt jwt = (Jwt) auth.getPrincipal();
                String tenantId = jwt.getClaimAsString("custom:tenantId");

                if (tenantId == null) {
                    throw new SecurityException("No tenantId in JWT");
                }

                TenantContext.setTenantId(tenantId);
            }

            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear(); // ALWAYS clear
        }
    }
}
```

**Repository Layer (Auto-filter):**

```java

@Repository
public class DocumentRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Document> findAll() {
        String tenantId = TenantContext.getTenantId(); // Throws if not set

        Query query = new Query();
        query.addCriteria(Criteria.where("tenantId").is(tenantId));

        return mongoTemplate.find(query, Document.class);
    }

    public Document findById(String id) {
        String tenantId = TenantContext.getTenantId();

        Query query = new Query();
        query.addCriteria(
                Criteria.where("_id").is(id)
                        .and("tenantId").is(tenantId)  // ← CRITICAL
        );

        return mongoTemplate.findOne(query, Document.class);
    }

    public Document save(Document doc) {
        String tenantId = TenantContext.getTenantId();
        doc.setTenantId(tenantId); // Auto-set on save

        return mongoTemplate.save(doc);
    }
}
```

### MongoDB Indexes for Multi-Tenancy

```javascript
// CRITICAL: tenantId must be FIRST in every compound index

// Documents collection
db.documents.createIndex({"tenantId": 1, "_id": 1});
db.documents.createIndex({"tenantId": 1, "status": 1, "createdAt": -1});
db.documents.createIndex({"tenantId": 1, "clientId": 1});
db.documents.createIndex({"tenantId": 1, "ocrStatus": 1});

// Users collection
db.users.createIndex({"tenantId": 1, "email": 1}, {unique: true});
db.users.createIndex({"tenantId": 1, "role": 1});

// Invoices collection
db.invoices.createIndex({"tenantId": 1, "clientId": 1, "month": 1, "year": 1});
db.invoices.createIndex({"tenantId": 1, "gstin": 1});
```

**Why tenantId first?**

- MongoDB will use tenantId in query plan
- Prevents scanning other tenants' data
- Improves performance AND security

---

## Database Design

### Core Collections

**1. Tenants Collection**

```javascript
const tenants = {
    "_id": "ca-firm-abc",
        "name": "ABC Chartered Accountants",
        "ownerEmail": "owner@abc-ca.com",
        "subscriptionTier": "PROFESSIONAL", // PILOT, STARTER, PROFESSIONAL, ENTERPRISE
        "subscriptionStartDate": "2025-01-01",
        "subscriptionStatus": "ACTIVE", // ACTIVE, CANCELLED, SUSPENDED
        "limits": {
        "maxClients": 50,
            "maxDocumentsPerMonth": 3000
    },
    "usage": {
        "currentClients": 12,
            "documentsThisMonth": 450
    },
    "createdAt": "2025-01-01",
        "updatedAt": "2025-01-15"
}
```

**2. Users Collection**

```javascript
var user = {
    "_id": "user_123",
        "tenantId": "ca-firm-abc", // ← REQUIRED
        "cognitoSub": "cognito-uuid-here",// Link to Cognito
        "email": "john@abc-ca.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "CA_STAFF",// CA_ADMIN, CA_STAFF, CLIENT
        "phoneNumber": "+919876543210",
        "notificationPreferences": {
        "email": true,
            "sms": true,
            "push": true
    },
    "active": true,
    "createdAt": "2025-01-01", // ISO Date
    "lastLoginAt": "2025-01-15" // ISO Date
}

```

**3. Clients Collection**

```javascript
const clients = {
    "_id": "client_456",
        "tenantId": "ca-firm-abc",// ← REQUIRED
        "name": "ABC Textiles Pvt Ltd",
        "gstin": "27XXXXX1234X1ZX", // Unique per tenant
        "email": "accounts@abctextiles.com",
        "phoneNumber": "+919876543211",
        "address": {
        "line1": "123 MG Road",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400001"
    },
    "category": "RETAIL",// RETAIL, MANUFACTURING, SERVICES, CONSTRUCTION
        "filingFrequency": "MONTHLY",// MONTHLY, QUARTERLY
        "assignedStaff": ["user_123"],// Array of user IDs
        "active": true,
        "createdAt": "2025-01-01"
}
```

**4. Documents Collection**

```javascript
var doc = {
    "_id"
:
    "doc_789",
        "tenantId"
:
    "ca-firm-abc",           // ← REQUIRED
        "clientId"
:
    "client_456",
        "uploadedBy"
:
    "user_123",            // User who uploaded
        "s3Bucket"
:
    "chanakya-documents",
        "s3Key"
:
    "ca-firm-abc/client_456/2025-01-15_invoice.jpg",
        "s3Url"
:
    "https://s3.ap-south-1.amazonaws.com/...",
        "originalFilename"
:
    "invoice.jpg",
        "fileSize"
:
    2048576,                 // Bytes
        "mimeType"
:
    "image/jpeg",
        "documentType"
:
    "SALES_INVOICE",     // SALES_INVOICE, PURCHASE_INVOICE, EXPENSE
        "status"
:
    "APPROVED",                // PENDING, APPROVED, REJECTED
        "ocrStatus"
:
    "COMPLETED",            // PENDING, PROCESSING, COMPLETED, FAILED
        "extractedData"
:
    {
        "gstin"
    :
        "29YYYYYY5678Y1ZY",
            "gstinConfidence"
    :
        98.5,
            "invoiceNumber"
    :
        "INV-001",
            "invoiceNumberConfidence"
    :
        95.0,
            "invoiceDate"
    :
        "2025-01-15",
            "invoiceDateConfidence"
    :
        92.3,
            "totalAmount"
    :
        11800,
            "totalAmountConfidence"
    :
        97.8,
            "vendorName"
    :
        "XYZ Suppliers",
            "rawText"
    :
        "Full extracted text..."
    }
,
    "reviewedBy"
:
    "user_123",            // CA who approved
        "reviewNotes"
:
    "GSTIN verified",
        "uploadedAt"
:
    ISODate("2025-01-15T10:00:00Z"),
        "processedAt"
:
    ISODate("2025-01-15T10:00:25Z"),
        "reviewedAt"
:
    ISODate("2025-01-15T11:00:00Z")
}
```

**5. Invoices Collection** (After OCR approval)

```javascript
var invoice= {
    "_id"
:
    "invoice_101",
        "tenantId"
:
    "ca-firm-abc",           // ← REQUIRED
        "clientId"
:
    "client_456",
        "documentId"
:
    "doc_789",             // Link to original document

        // Invoice details
        "gstin"
:
    "29YYYYYY5678Y1ZY",
        "invoiceNumber"
:
    "INV-001",
        "invoiceDate"
:
    ISODate("2025-01-15"),
        "invoiceType"
:
    "B2B",                // B2B, B2C, EXPORT, IMPORT

        // Amounts
        "taxableValue"
:
    10000,
        "cgst"
:
    900,
        "sgst"
:
    900,
        "igst"
:
    0,
        "cess"
:
    0,
        "totalAmount"
:
    11800,

        // Classification
        "hsnCode"
:
    "5208",                   // Harmonized System Nomenclature
        "gstRate"
:
    18,                       // 5, 12, 18, 28
        "placeOfSupply"
:
    "Maharashtra",

        // GSTR filing
        "month"
:
    1,                          // Jan = 1, Feb = 2, etc.
        "year"
:
    2025,
        "filingStatus"
:
    "PENDING",           // PENDING, FILED, RECONCILED
        "filedAt"
:
    null,

        // Manual overrides
        "manuallyEdited"
:
    false,
        "editedBy"
:
    null,
        "editNotes"
:
    null,

        "createdAt"
:
    ISODate("2025-01-15T11:00:00Z"),
        "updatedAt"
:
    ISODate("2025-01-15T11:00:00Z")
}
```

**6. GSTR1 Returns Collection** (Aggregated)

```javascript
var gst = {
    "_id"
:
    "gstr1_202501_client456",
        "tenantId"
:
    "ca-firm-abc",           // ← REQUIRED
        "clientId"
:
    "client_456",
        "gstin"
:
    "27XXXXX1234X1ZX",          // Client's GSTIN
        "month"
:
    1,
        "year"
:
    2025,

        // Aggregated data (calculated from invoices)
        "b2b"
:
    {
        "invoices"
    :
        [
            {
                "gstin": "29YYYYYY5678Y1ZY",
                "invoiceNumber": "INV-001",
                "invoiceDate": "2025-01-15",
                "taxableValue": 10000,
                "cgst": 900,
                "sgst": 900,
                "igst": 0,
                "total": 11800
            }
            // ... more invoices
        ],
            "totalInvoices"
    :
        25,
            "totalTaxableValue"
    :
        250000,
            "totalTax"
    :
        45000
    }
,

    // Validation results
    "validationErrors"
:
    [
        {
            "invoiceId": "invoice_105",
            "field": "gstin",
            "error": "Invalid GSTIN format"
        }
    ],

        "status"
:
    "DRAFT",                   // DRAFT, VALIDATED, READY_TO_FILE, FILED
        "filedAt"
:
    null,
        "filedBy"
:
    null,

        "createdAt"
:
    ISODate("2025-02-01"),
        "updatedAt"
:
    ISODate("2025-02-05")
}
```

---

## API Endpoints

### Authentication

```
POST   /api/auth/signup          # Create new user (Cognito)
POST   /api/auth/login           # Login (handled by Cognito, returns JWT)
POST   /api/auth/refresh         # Refresh access token
GET    /api/auth/me              # Get current user info
POST   /api/auth/logout          # Logout (client-side, invalidate tokens)
POST   /api/auth/forgot-password # Initiate password reset
POST   /api/auth/reset-password  # Complete password reset
```

### Users

```
GET    /api/users                # List users in tenant
POST   /api/users                # Create new user (invite)
GET    /api/users/:id            # Get user details
PUT    /api/users/:id            # Update user
DELETE /api/users/:id            # Deactivate user
```

### Clients

```
GET    /api/clients              # List clients (paginated)
POST   /api/clients              # Create new client
GET    /api/clients/:id          # Get client details
PUT    /api/clients/:id          # Update client
DELETE /api/clients/:id          # Deactivate client
GET    /api/clients/:id/documents # List documents for client
GET    /api/clients/:id/invoices  # List invoices for client
```

### Documents

```
POST   /api/documents/upload     # Upload document (multipart/form-data)
GET    /api/documents            # List documents (filters: clientId, status, ocrStatus)
GET    /api/documents/:id        # Get document details
PUT    /api/documents/:id        # Update document metadata
DELETE /api/documents/:id        # Delete document (also removes from S3)

POST   /api/documents/:id/process     # Trigger OCR processing
PUT    /api/documents/:id/approve     # Approve extracted data
PUT    /api/documents/:id/reject      # Reject document
```

### Invoices

```
GET    /api/invoices             # List invoices (filters: clientId, month, year, status)
POST   /api/invoices             # Create invoice (from document or manual)
GET    /api/invoices/:id         # Get invoice details
PUT    /api/invoices/:id         # Update invoice (manual edit)
DELETE /api/invoices/:id         # Delete invoice
```

### GSTR Forms

```
GET    /api/gstr1/:clientId/:month/:year      # Generate GSTR-1 return
POST   /api/gstr1/:clientId/:month/:year/validate  # Validate GSTR-1 data
GET    /api/gstr1/:clientId/:month/:year/export    # Export to Excel/JSON

GET    /api/gstr3b/:clientId/:month/:year     # Generate GSTR-3B (Phase 3+)
```

### Dashboard & Reports

```
GET    /api/dashboard            # Dashboard summary (clients, deadlines, pending docs)
GET    /api/reports/compliance   # Compliance status by client
GET    /api/reports/usage        # Tenant usage stats (for billing)
```

### Notifications

```
GET    /api/notifications        # List notifications for user
PUT    /api/notifications/:id/read  # Mark notification as read
POST   /api/notifications/send   # Send manual reminder (SMS/email)
```

### API Response Format (Standard)

**Success Response:**

```json
{
  "success": true,
  "data": {
    ...
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-01-15T10:00:00Z"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_GSTIN",
    "message": "GSTIN format is invalid",
    "field": "gstin",
    "details": {
      "providedValue": "12ABC",
      "expectedFormat": "\\d{2}[A-Z]{5}\\d{4}..."
    }
  },
  "timestamp": "2025-01-15T10:00:00Z"
}
```

---

## Deployment (Simple)

### Phase 1-4: Single EC2 Instance

```
┌─────────────────────────────────────────────────────────┐
│  AWS EC2 t2.micro (Free tier for 1 year)                │
│  - Amazon Linux 2023                                     │
│  - Java 21                                               │
│  - Docker (optional)                                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📦 Spring Boot Application                              │
│  - JAR file (java -jar app.jar)                         │
│  - Port 8080 (internal)                                 │
│  - Environment variables from .env                      │
│                                                          │
│  🔧 SystemD Service                                      │
│  - Auto-restart on failure                              │
│  - Logs to /var/log/chanakya/                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
           │
           │ Port 8080
           ▼
┌─────────────────────────────────────────────────────────┐
│  Nginx (Reverse Proxy)                                   │
│  - SSL termination (Let's Encrypt cert)                 │
│  - Port 443 → 8080                                       │
│  - Static file serving (Expo web build)                 │
│  - CORS headers                                          │
└─────────────────────────────────────────────────────────┘
```

### Deployment Steps

**1. Initial Setup (Week 1):**

```bash
# Launch EC2 t2.micro
# - AMI: Amazon Linux 2023
# - Security Group: Allow 22 (SSH), 80 (HTTP), 443 (HTTPS)
# - Elastic IP: Attach for stable IP

# SSH into instance
ssh -i key.pem ec2-user@<elastic-ip>

# Install Java 21
sudo yum install java-21-amazon-corretto

# Install Nginx
sudo yum install nginx

# Install Certbot (Let's Encrypt)
sudo yum install certbot python3-certbot-nginx

# Create application directory
sudo mkdir -p /opt/chanakya
sudo chown ec2-user:ec2-user /opt/chanakya
```

**2. Deploy Spring Boot App:**

```bash
# Build JAR locally
./mvnw clean package -DskipTests

# Copy to EC2
scp -i key.pem target/chanakya-api.jar ec2-user@<elastic-ip>:/opt/chanakya/

# Create .env file on EC2
cat > /opt/chanakya/.env <<EOF
SPRING_PROFILES_ACTIVE=production
AWS_REGION=ap-south-1
COGNITO_USER_POOL_ID=ap-south-1_XXXXX
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chanakya
S3_BUCKET_NAME=chanakya-documents
TEXTRACT_ENABLED=true
EOF

# Create systemd service
sudo nano /etc/systemd/system/chanakya.service
```

**SystemD Service File:**

```ini
[Unit]
Description=Chanakya GST API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/chanakya
EnvironmentFile=/opt/chanakya/.env
ExecStart=/usr/bin/java -jar /opt/chanakya/chanakya-api.jar
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/chanakya/app.log
StandardError=append:/var/log/chanakya/error.log

[Install]
WantedBy=multi-user.target
```

**Start service:**

```bash
# Create log directory
sudo mkdir -p /var/log/chanakya
sudo chown ec2-user:ec2-user /var/log/chanakya

# Enable and start service
sudo systemctl enable chanakya
sudo systemctl start chanakya

# Check status
sudo systemctl status chanakya

# View logs
tail -f /var/log/chanakya/app.log
```

**3. Configure Nginx:**

```nginx
# /etc/nginx/conf.d/chanakya.conf

server {
    listen 80;
    server_name api.chanakya.in;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.chanakya.in;

    # SSL certificate (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.chanakya.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.chanakya.in/privkey.pem;

    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";

    # CORS headers (adjust for your frontend domain)
    add_header Access-Control-Allow-Origin "https://app.chanakya.in";
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Authorization, Content-Type";

    # Proxy to Spring Boot
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeout for OCR requests (30s)
        proxy_read_timeout 30s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:8080/actuator/health;
    }
}
```

**Get SSL certificate:**

```bash
sudo certbot --nginx -d api.chanakya.in
# Auto-renewal is configured by certbot
```

**4. Deploy Expo Web App:**

```bash
# Build locally
npx expo export --platform web

# Copy to EC2
scp -r -i key.pem dist/* ec2-user@<elastic-ip>:/var/www/html/chanakya/

# Configure Nginx for web app
sudo nano /etc/nginx/conf.d/chanakya-web.conf
```

**Web app Nginx config:**

```nginx
server {
    listen 80;
    server_name app.chanakya.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name app.chanakya.in;

    ssl_certificate /etc/letsencrypt/live/app.chanakya.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.chanakya.in/privkey.pem;

    root /var/www/html/chanakya;
    index index.html;

    # SPA routing (all routes go to index.html)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Monitoring (Basic)

**CloudWatch Logs Agent:**

```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Configure to send logs
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -s \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json
```

**CloudWatch config:**

```json
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/chanakya/app.log",
            "log_group_name": "/chanakya/api",
            "log_stream_name": "{instance_id}"
          },
          {
            "file_path": "/var/log/chanakya/error.log",
            "log_group_name": "/chanakya/api-errors",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  }
}
```

**Set up billing alerts:**

```bash
# AWS Console → CloudWatch → Alarms → Create Alarm
# Metric: Billing → Total Estimated Charge
# Threshold: $100
# Action: Send email to your-email@domain.com
```

---

## When to Add Complexity

### Decision Matrix: When to Upgrade

| Component          | Current (Phase 1-4)     | Upgrade Trigger                              | New Setup                          | Cost Impact  |
|--------------------|-------------------------|----------------------------------------------|------------------------------------|--------------|
| **API Server**     | Single EC2 t2.micro     | CPU >80% for 1 week OR 100+ concurrent users | 2x t3.small + ALB                  | +₹4K/month   |
| **Database**       | MongoDB Atlas M0 (free) | >100 clients OR >10GB data                   | MongoDB M10                        | +₹2.5K/month |
| **OCR Processing** | Sync Textract calls     | Processing >10s OR need retry                | SQS + Lambda                       | +₹2K/month   |
| **Caching**        | No cache                | DB queries >500ms p95                        | Redis ElastiCache                  | +₹3K/month   |
| **CDN**            | Nginx static files      | Users outside India OR >1GB bandwidth        | CloudFront                         | +₹1K/month   |
| **Monitoring**     | CloudWatch basic        | Need error tracking                          | Sentry                             | +₹2K/month   |
| **Rate Limiting**  | None                    | Seeing abuse OR need API keys                | API Gateway or Spring Rate Limiter | ₹0-1K/month  |

### Phase 5 Architecture (Months 7-12, 50+ Customers)

**Only add when you have the problem to solve:**

```
┌─────────────────────────────────────────────────────────┐
│  CloudFront CDN                                          │
│  - Static assets caching                                │
│  - SSL termination                                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  Application Load Balancer                               │
│  - Health checks                                         │
│  - SSL termination                                       │
│  - Sticky sessions (if needed)                           │
└────────────────┬────────────────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      ▼                     ▼
┌──────────┐          ┌──────────┐
│  API #1  │          │  API #2  │
│ t3.small │          │ t3.small │
│ Spring   │          │ Spring   │
└─────┬────┘          └─────┬────┘
      │                     │
      └──────────┬──────────┘
                 │
      ┌──────────┼──────────┬──────────┐
      ▼          ▼          ▼          ▼
 ┌─────────┐ ┌─────┐   ┌─────┐    ┌─────┐
 │ MongoDB │ │ S3  │   │Redis│    │ SQS │
 │  M10    │ │     │   │Cache│    │     │
 └─────────┘ └─────┘   └─────┘    └──┬──┘
                                      │
                                      ▼
                                  ┌────────┐
                                  │ Lambda │
                                  │  OCR   │
                                  └────────┘
```

**Cost at 50 customers (₹3L MRR):**

- 2x t3.small: ₹4K
- ALB: ₹2K
- MongoDB M10: ₹2.5K
- Redis: ₹3K
- CloudFront: ₹1K
- Lambda + SQS: ₹2K
- Textract: ₹5-10K (volume discounts)
- **Total: ₹19.5-24.5K/month**
- **Net profit: ₹2.75-2.8L/month**

---

## Phase-by-Phase Evolution

### Phase 1 (Weeks 1-4): Foundation

**Architecture:**

```
Expo App → Spring Boot → Cognito
                       → MongoDB M0
                       → S3
```

**Capabilities:**

- User authentication (Cognito)
- Document upload (mobile camera)
- Document list view (web)
- User management

**NOT included:**

- OCR processing
- GST forms
- Notifications

**Monthly cost:** ₹1,000

---

### Phase 2 (Weeks 5-8): OCR Value

**Architecture:**

```
Expo App → Spring Boot → Cognito
                       → MongoDB M0
                       → S3 ←→ Textract (sync)
```

**New capabilities:**

- Textract OCR integration
- GSTIN/invoice field extraction
- Manual field editing
- Confidence scores

**Monthly cost:** ₹100-3,500

---

### Phase 3 (Weeks 9-12): GST Forms

**Architecture:**

```
Expo App → Spring Boot → Cognito
                       → MongoDB M0
                       → S3 ←→ Textract
                       → SNS (SMS)
                       → SES (Email)
```

**New capabilities:**

- GSTR-1 B2B form generation
- Excel export
- Email/SMS notifications
- Deadline tracking

**Monthly cost:** ₹750-3,500

---

### Phase 4 (Weeks 13-16): Monetization

**Architecture:** Same as Phase 3 + Razorpay

**New capabilities:**

- Subscription plans
- Payment gateway (Razorpay)
- Usage tracking
- Billing

**Monthly cost:** ₹1,700-5,400
**Revenue:** ₹3,000-6,000

---

### Phase 5 (Months 7-12): Scale

**Architecture:**

```
CloudFront → ALB → 2x Spring Boot → MongoDB M10
                                  → Redis
                                  → S3
                                  → SQS → Lambda → Textract
```

**New capabilities:**

- Load balancing
- Redis caching
- Async OCR processing
- Better monitoring
- GSTR-2A reconciliation
- WhatsApp integration (optional)

**Monthly cost:** ₹25-60K
**Revenue:** ₹1.25-3L MRR

---

## Security Checklist

### Phase 1-4 (MVP)

**Authentication:**

- [x] AWS Cognito for user management
- [x] JWT tokens (not session cookies)
- [x] Token in Authorization header
- [x] Refresh tokens in secure storage
- [x] Password complexity enforcement (Cognito policy)

**Authorization:**

- [x] Role-based access (CA_ADMIN, CA_STAFF, CLIENT)
- [x] @PreAuthorize annotations on endpoints
- [x] Multi-tenant filtering (tenantId in all queries)

**Transport:**

- [x] HTTPS everywhere (TLS 1.2+)
- [x] SSL certificate (Let's Encrypt)
- [x] HSTS headers

**Input Validation:**

- [x] Zod schemas (frontend)
- [x] Spring validators (backend)
- [x] Parameterized MongoDB queries
- [x] GSTIN format validation

**Data Protection:**

- [x] S3 server-side encryption (AES-256)
- [x] MongoDB Atlas encryption at rest
- [x] No sensitive data in logs
- [x] No credentials in code (env variables)

**CORS:**

- [x] Restricted to production domain
- [x] Allow localhost for dev

---

## Key Takeaways

### 1. Start Simple

- Single EC2 instance for API
- MongoDB free tier
- Synchronous OCR
- **Total cost: ₹1-3.5K/month**

### 2. Validate Before Scaling

- Don't add Redis until queries are slow
- Don't add load balancer until CPU is high
- Don't add async processing until OCR is slow

### 3. Multi-Tenancy is Critical

- **Every query must filter by tenantId**
- Use ThreadLocal for request-scoped context
- Index tenantId first in all compound indexes
- Test cross-tenant access (security test)

### 4. Simplicity = Speed

- Fewer components = easier debugging
- Monolith = faster development
- Synchronous = simpler code
- **Ship fast, optimize later**

---

## Next Steps

### Week 0 (Before coding):

1. Find 2+ CA partners
2. Shadow their workflow
3. Get 20 sample invoices
4. Create mockups

### Week 1 (Start Phase 1):

1. Set up AWS account
2. Create Cognito user pool
3. Initialize Spring Boot project
4. Initialize Expo project
5. Build login screen

### Week 2-4:

Follow the week-by-week plan in scope.md

---

**Last Updated:** January 2025
**Document Owner:** Solo Founder
**Review Frequency:** After each phase validation
**Next Review:** After Phase 1 completion (Week 4)
