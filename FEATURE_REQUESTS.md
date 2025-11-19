# Feature Requests & Product Roadmap

> **Source:** CA Partner Feedback (January 2025)
> **Status:** Documented, Prioritized, Roadmapped
> **Last Updated:** January 2025

---

## Table of Contents

1. [Feature Request Summary](#feature-request-summary)
2. [Priority Matrix](#priority-matrix)
3. [Revised Tech Stack Decision](#revised-tech-stack-decision)
4. [Detailed Feature Specs](#detailed-feature-specs)
5. [Updated Phased Roadmap](#updated-phased-roadmap)
6. [Database Schema Changes](#database-schema-changes)
7. [Impact Analysis](#impact-analysis)

---

## Feature Request Summary

### From CA Partner Interview (January 2025)

| #     | Feature                       | Description                                              | Business Value                          | Complexity    | Priority     |
|-------|-------------------------------|----------------------------------------------------------|-----------------------------------------|---------------|--------------|
| **1** | Multiple Projects per CA      | CAs manage multiple client engagements/projects          | High - CAs serve various industries     | Medium        | **Phase 1**  |
| **2** | CA Group Collaboration        | Multiple CAs/staff collaborate on same clients           | High - Team workflows                   | High          | **Phase 2**  |
| **3** | Customer Portal (Shared Data) | Customers see their compliance status                    | Medium - Client satisfaction            | Medium        | **Phase 3**  |
| **4** | Customer Invoice Generation   | Customers create invoices in-app (jewelry store example) | **VERY HIGH** - Solves upstream problem | High          | **Phase 2**  |
| **5** | Conversational AI             | Natural language: "generate invoice for X item..."       | High - UX delight                       | **Very High** | **Phase 5+** |
| **6** | Mobile App (CA)               | CAs track compliance, get notifications on phone         | **CRITICAL** - CA explicitly requested  | Medium        | **Phase 1**  |
| **7** | Mobile App (Customer)         | Customers upload docs, create invoices on mobile         | **CRITICAL** - Mobile-first user base   | Medium        | **Phase 1**  |

---

## Priority Matrix

### CRITICAL PATH (Build First) ✅

**Phase 1 (Weeks 1-4): Foundation + Mobile**

- ✅ Mobile app (CA) - Explicitly requested
- ✅ Mobile app (Customer) - Document upload
- ✅ Multiple projects per CA customer - Data model
- ⚠️ **TECH STACK CHANGE REQUIRED:** Expo (not Next.js)

**Phase 2 (Weeks 5-8): Core Value**

- ✅ Customer invoice generation - High business value
- ✅ OCR for uploaded documents
- ✅ Basic project management

**Phase 3 (Weeks 9-12): Collaboration**

- ✅ CA group collaboration
- ✅ Customer portal (view-only)
- ✅ GSTR-1 forms

**Phase 4 (Weeks 13-16): Polish & Monetize**

- ✅ Notifications (push, SMS, email)
- ✅ Subscription & billing
- ✅ User onboarding flows

### FUTURE FEATURES (Phase 5+) 🔮

**Phase 5 (Months 5-9): Advanced Features**

- Customer portal (self-service)
- Advanced analytics
- WhatsApp integration
- GSTR-2A/2B reconciliation

**Phase 6+ (Months 10+): AI & Innovation**

- ⚠️ Conversational AI (needs training data, 10K+ invoices)
- Predictive compliance alerts
- Auto-categorization with ML

---

## Revised Tech Stack Decision

### Critical Finding: **Mobile App is REQUIRED, not optional**

**CA Partner Quote:**
> "We need mobile app to track and get notifications on phone"
> "Customers need mobile app to upload and create invoices"

### Decision: **Back to Expo** ✅

**Original Plan → Revised Plan:**

| Aspect               | Next.js Plan (Previous) | Expo Plan (Revised)  | Why Changed                   |
|----------------------|-------------------------|----------------------|-------------------------------|
| **Web**              | Next.js (primary)       | Expo Web             | Mobile now primary            |
| **Mobile**           | Responsive web only     | Native iOS + Android | CA explicitly requested       |
| **Code Sharing**     | None (web only)         | 80-90% shared        | Efficiency                    |
| **Development Time** | 10 weeks                | 12 weeks             | Worth 2 weeks for native apps |
| **User Experience**  | Good on web             | Excellent on mobile  | Mobile-first users            |

**Justification:**

1. ✅ CA explicitly asked for mobile app
2. ✅ Customers are mobile-first (jewelry store owners)
3. ✅ Push notifications critical (can't do well on web)
4. ✅ Camera for invoice photos (better native experience)
5. ✅ 80-90% code reuse (Expo) vs building separately

**New Stack:**

```
Frontend:  Expo SDK 54+ (React Native)
           ├── iOS App (App Store)
           ├── Android App (Google Play)
           └── Web App (Expo Web)

Backend:   Spring Boot 3.5 (Java 21)

Database:  MongoDB Atlas
Auth:      AWS Cognito
Storage:   AWS S3
OCR:       AWS Textract
```

---

## Detailed Feature Specs

### Feature 1: Multiple Projects per CA Customer

**Use Case:**

```
CA Firm "ABC Associates" has:
├── Client: Jewelry Store A
│   ├── Project: Monthly GST Compliance
│   └── Project: Annual ITR Filing
├── Client: Restaurant B
│   └── Project: GST Compliance
└── Client: Construction Co C
    ├── Project: GST Compliance
    └── Project: TDS Management
```

**Data Model Change:**

```javascript
// OLD: Flat structure
{
    tenantId: "ca-firm-abc",
        clientId
:
    "client-456",
        documents
:
    [...]
}

// NEW: Project-based structure
{
    tenantId: "ca-firm-abc",
        clientId
:
    "client-456",
        projectId
:
    "project-789",  // ← NEW
        projectType
:
    "GST_COMPLIANCE", // GST_COMPLIANCE, ITR_FILING, TDS_MANAGEMENT
        documents
:
    [...]
}
```

**UI Changes:**

- Navigation: Tenant → Clients → Projects → Documents
- Dashboard: Show stats per project
- Filters: By client AND project

**Complexity:** Medium (mostly data model + UI)
**Timeline:** Week 2-3 (during foundation phase)

---

### Feature 2: CA Group Collaboration

**Use Case:**

```
CA Firm "ABC Associates" has 5 users:
├── CA Admin (Owner)
├── CA Manager (Senior)
├── CA Staff 1 (Junior)
├── CA Staff 2 (Junior)
└── CA Intern

Permissions:
- Admin: Full access
- Manager: Assign work, review, approve
- Staff: Upload, data entry, can't approve
- Intern: View only
```

**New Roles:**

```javascript
enum UserRole {
    CA_OWNER,      // Full access
    CA_MANAGER,    // Assign + review
    CA_STAFF,      // Data entry
    CA_INTERN,     // View only
    CLIENT_ADMIN,  // Customer portal admin
    CLIENT_USER    // Customer portal user
}
```

**Features:**

- Task assignment per project
- Activity feed (who did what)
- @mentions in comments
- Approval workflows

**Complexity:** High (permissions, workflows)
**Timeline:** Week 9-12 (Phase 3)

---

### Feature 3: Customer Portal (Shared Data)

**Use Case:**

```
Jewelry Store owner logs in and sees:
├── My Compliance Status (90% complete)
├── Pending Documents (3 items)
├── Upcoming Deadlines (GST: Feb 10)
├── Filed Returns (Jan GSTR-1: ✓)
└── My Invoices (250 this month)
```

**Access Levels:**

- View compliance status
- Upload documents
- Create invoices (Feature 4)
- View filed returns (read-only)
- Download reports

**Complexity:** Medium (mostly UI + permissions)
**Timeline:** Week 9-11 (Phase 3)

---

### Feature 4: Customer Invoice Generation ⭐ **HIGH PRIORITY**

**Use Case (Jewelry Store):**

```
Customer: "ABC Jewellers"
Scenario: Customer walks in, buys gold necklace

Store owner opens app:
1. Tap "Create Invoice"
2. Select/Add customer (name, phone, GSTIN if B2B)
3. Select/Add item:
   - Product: Gold Necklace 22K
   - HSN: 7113
   - Weight: 15 grams
   - Making charges: ₹5,000
   - Gold rate today: ₹6,000/gram
   - Total: ₹95,000 (₹90,000 + ₹5,000)
4. GST auto-calculated: 3% = ₹2,850
5. Grand Total: ₹97,850
6. Generate PDF invoice
7. Share via WhatsApp/Email
8. Auto-saved to GST records
```

**Why This is Gold 🏆:**

- Solves upstream problem (invoice creation, not just collection)
- Data quality 10x better (structured from start)
- Customer gets value immediately (not just CA)
- Stickiness: Once they create invoices here, they're locked in
- Upsell: Can charge per invoice generated

**Features Needed:**

```
Invoice Creation:
├── Product catalog (per customer)
│   ├── Name, HSN, price
│   └── Tax rate (3%, 5%, 12%, 18%, 28%)
├── Customer directory (buyer details)
├── Invoice templates
│   ├── B2B (with GSTIN)
│   └── B2C (retail)
├── Auto-calculations
│   ├── Taxable value
│   ├── CGST, SGST, IGST
│   └── Round-off
├── PDF generation
│   ├── Company logo
│   ├── Terms & conditions
│   └── QR code (GST portal requirement)
├── Sharing
│   ├── WhatsApp (direct)
│   ├── Email
│   └── SMS with payment link
└── Auto-sync to GST records
    └── Ready for GSTR-1 filing
```

**Jewelry Store Specific:**

- Gold/silver rate integration (live API)
- Weight-based pricing (grams × rate + making)
- Purity variants (22K, 24K, etc.)
- Stone charges separate
- Old gold exchange accounting

**Complexity:** High (but worth it!)
**Timeline:** Week 5-8 (Phase 2) - **BUILD THIS EARLY**

**Business Model Impact:**

```
Pricing Options:
1. Free: 50 invoices/month (Starter tier)
2. Professional: 500 invoices/month (₹5,999)
3. Enterprise: Unlimited invoices (₹12,999)

OR Usage-based:
₹2-5 per invoice generated (like payment gateway)
```

---

### Feature 5: Conversational AI ⚠️ **DEFER TO PHASE 6+**

**Use Case:**

```
User: "Generate invoice for gold necklace 20 grams at today's rate
       to customer Ramesh with GSTIN 27ABC..."

AI: "Creating invoice:
     - Product: Gold Necklace 22K
     - Weight: 20g
     - Rate: ₹6,000/gram = ₹1,20,000
     - Making: ₹8,000
     - Customer: Ramesh (GSTIN: 27ABC...)
     - GST 3%: ₹3,840
     - Total: ₹1,31,840

     Looks good? Say 'yes' to generate PDF."

User: "Yes"

AI: "✓ Invoice INV-2025-001 created. Sent to Ramesh via WhatsApp."
```

**Why Defer:**

1. ❌ Need 10K+ invoices for training
2. ❌ Need 6 months of usage patterns
3. ❌ High development cost (₹5-10L if outsourced)
4. ❌ Maintenance overhead (AI responses need monitoring)
5. ❌ MVP can work perfectly without this (forms are fast enough)

**Build First, Then AI:**

- Week 5-8: Build structured invoice form (fast, reliable)
- Month 6-12: Collect 10K+ invoice creation patterns
- Month 12+: Train AI model on actual data
- Month 18+: Beta test conversational interface

**Alternative for MVP:**

- Smart autocomplete (not full AI)
- Template-based quick actions
- Keyboard shortcuts
- Voice input (device native, no AI needed)

**Complexity:** Very High (NLP, training, monitoring)
**Timeline:** Phase 6+ (Month 18+) - **DON'T BUILD NOW**

---

### Feature 6 & 7: Mobile Apps (CA + Customer)

**CA Mobile App Features:**

```
📱 CA Mobile App (iOS + Android)
├── Dashboard
│   ├── Today's tasks (5 pending)
│   ├── Upcoming deadlines
│   ├── Recent activity feed
│   └── Quick stats
├── Clients
│   ├── Client list (search)
│   ├── Client details
│   └── Projects per client
├── Documents
│   ├── Review queue (photos)
│   ├── Approve/Reject (swipe gestures)
│   └── Camera upload (if needed)
├── Notifications
│   ├── Push alerts
│   ├── Deadline reminders
│   └── Document upload notifications
└── Profile
    ├── Settings
    ├── Team members
    └── Subscription
```

**Customer Mobile App Features:**

```
📱 Customer Mobile App (iOS + Android)
├── Dashboard
│   ├── Compliance status
│   ├── Pending uploads (3)
│   └── Next deadline
├── Create Invoice ⭐
│   ├── Quick create (camera + voice)
│   ├── Product catalog
│   ├── Customer directory
│   └── Share invoice
├── Upload Documents
│   ├── Camera capture
│   ├── Edge detection
│   ├── Auto-rotate
│   └── Compress
├── My Invoices
│   ├── This month's invoices
│   ├── Search/filter
│   └── Download PDF
└── Notifications
    ├── Upload reminders
    ├── Filing status updates
    └── Payment reminders (future)
```

**Mobile-Specific Features:**

- 📸 Camera with edge detection (document scanning)
- 🔔 Push notifications (Firebase Cloud Messaging)
- 📴 Offline mode (WatermelonDB for local storage)
- 👆 Swipe gestures (approve/reject documents)
- 📍 Location tagging (optional, for multi-location businesses)
- 🎙️ Voice input (device native, for invoice creation)

**Complexity:** Medium (Expo handles most complexity)
**Timeline:** Week 1-12 (throughout MVP phases)

---

## Updated Phased Roadmap

### Phase 0: Pre-Development (Week 0) ✅ COMPLETED

- [x] Find CA partner
- [x] Document feature requests
- [x] Prioritize features
- [x] Choose tech stack (Expo)
- [x] Set up AWS account

---

### Phase 1: Foundation (Weeks 1-4)

**Goal:** Mobile apps + Multi-project support

#### Week 1: Authentication & Projects

**Backend:**

```java
✅Spring Boot
scaffold
✅
AWS Cognito
setup
✅
JWT validation
✅
MongoDB connection
✅Entities:Tenant,User,Project,Client
✅Multi-
project data
model
```

**Mobile (Expo):**

```typescript
✅ Expo
project
setup
✅ Navigation(tabs + stack)
✅ Login
screen(Cognito)
✅ Protected
routes
✅ Dashboard(empty)
✅ Project
selector
```

**Deliverable:** CA logs in mobile app, sees projects

#### Week 2: Document Upload (Mobile)

**Backend:**

```java
✅POST /api/documents/upload
✅

S3 upload(with projectId)
✅
Document entity +repository
```

**Mobile:**

```typescript
✅ Camera
screen(expo - camera)
✅ Document
edge
detection
✅ Image
compression
✅ Upload
progress
✅ Success / error
handling
```

**Deliverable:** Customer uploads invoice via mobile camera

#### Week 3: Document Management (Mobile Web)

**Backend:**

```java
✅GET /api/

documents(by project)
✅GET /api/documents/:id
✅PUT /api/documents/:id/approve
```

**Mobile:**

```typescript
✅ Document
list(by
project
)
✅ Document
detail
view
✅ Image
viewer(S3)
✅ Swipe
to
approve / reject
```

**Deliverable:** CA reviews documents on mobile

#### Week 4: Client & Project Management

**Backend:**

```java
✅Client CRUD
✅
Project CRUD
✅
User management
✅Role-
based permissions
```

**Mobile:**

```typescript
✅ Client
list
✅ Add / Edit
client
form
✅ Project
list
per
client
✅ Add / Edit
project
```

**Deliverable:** CA manages multiple projects

**Phase 1 Validation:**

- [ ] CA using mobile app daily
- [ ] 10+ documents uploaded
- [ ] Multi-project structure working
- [ ] CA feedback: "This is useful, keep going"

---

### Phase 2: Invoice Generation + OCR (Weeks 5-8) ⭐ **HIGH VALUE**

**Goal:** Customers can CREATE invoices (not just upload)

#### Week 5: Product Catalog & Invoice Structure

**Backend:**

```java
✅Product entity(name, HSN, price, tax rate)
✅POST /api/products
✅GET /api/

products(by project)
✅

Invoice entity(structured)
✅POST /api/invoices/

create(not from OCR)
```

**Mobile:**

```typescript
✅ Product
catalog
screen
✅ Add / Edit
product
form
✅ Product
search / autocomplete
```

**Deliverable:** Customer can manage product catalog

#### Week 6: Invoice Creation Flow

**Backend:**

```java
✅Invoice calculation

logic(taxable, GST, total)
✅

Customer entity(buyer details)
✅POST /api/

invoices(with line items)
✅

PDF generation(JasperReports or Apache PDFBox)
```

**Mobile:**

```typescript
✅ "Create Invoice"
button(prominent)
✅ Add
customer(quick
add
or
select
)
✅ Add
line
items(products)
✅ Auto - calculate
totals
✅ Preview
invoice
✅ Generate
PDF
✅ Share(WhatsApp / Email)
```

**Deliverable:** Customer creates invoice in <2 minutes

#### Week 7: OCR Integration (Document Upload Flow)

**Backend:**

```java
✅POST /api/documents/:id/process
✅
AWS Textract

integration(sync)
✅
GSTIN extraction
✅
Amount extraction
✅
Invoice field
parsing
```

**Mobile:**

```typescript
✅ "Process OCR"
button
✅ Loading
state(15 - 25
s
)
✅ Extracted
fields
display
✅ Edit
extracted
data
✅ Convert
to
invoice
```

**Deliverable:** OCR extracts data from uploaded invoices

#### Week 8: Invoice Management

**Backend:**

```java
✅GET /api/

invoices(by project, date range)
✅PUT /api/invoices/:

id(edit)
✅DELETE /api/invoices/:id
✅
Invoice validation
rules
```

**Mobile:**

```typescript
✅ Invoice
list(this
month
)
✅ Invoice
detail
view
✅ Edit
invoice
✅ Duplicate
invoice(quick
create
)
✅ Invoice
stats(count, total
value
)
```

**Deliverable:** Customer manages 50+ invoices

**Phase 2 Validation:**

- [ ] 100+ invoices created by customers
- [ ] OCR accuracy >70% for GSTIN
- [ ] Customers prefer creating invoices in-app vs external tools
- [ ] CA reports: "This saves us 50% data entry time"

---

### Phase 3: Collaboration + Portal (Weeks 9-12)

**Goal:** CA team collaboration + customer portal

#### Week 9: CA Group Features

**Backend:**

```java
✅User roles(OWNER, MANAGER, STAFF, INTERN)
✅
Permission matrix
per role
✅

Task assignment(assign document review)
✅

Activity feed(audit log)
```

**Mobile:**

```typescript
✅ Team
members
list
✅ Assign
task
UI
✅ Activity
feed
✅ @mentions in
comments
```

**Deliverable:** CA team collaborates on clients

#### Week 10: Customer Portal (View-Only)

**Backend:**

```java
✅GET /api/portal/

status(compliance status)
✅GET /api/portal/

documents(customer's docs)
        ✅ GET/api/portal/invoices(customer's invoices)
```

**Mobile (Customer View):**

```typescript
✅ Compliance
dashboard
✅ Pending
actions(3
documents
needed
)
✅ Filed
returns(Jan
GSTR - 1 ✓)
✅ My
invoices(this
month
)
```

**Deliverable:** Customer sees their compliance status

#### Week 11: GSTR-1 Forms

**Backend:**

```java
✅GET /api/gstr1/:projectId/:month/:year
✅
B2B invoice

aggregation(from created invoices)
✅
Validation rules
✅

Excel export(GSTN format)
```

**Mobile:**

```typescript
✅ GSTR - 1
screen(month
selector
)
✅ Invoice
list(editable)
✅ Validation
errors
✅ Export
to
Excel
```

**Deliverable:** CA files GSTR-1 using app

#### Week 12: Notifications + Polish

**Backend:**

```java
✅Firebase Cloud

Messaging(FCM) setup
✅
Push notification
service
✅

Email notifications(AWS SES)
✅

SMS notifications(AWS SNS)
```

**Mobile:**

```typescript
✅ Push
notification
handling
✅ Notification
preferences
✅ In - app
notifications
✅ Badge
counts
✅ Deep
linking(notification → screen
)
```

**Deliverable:** Users get timely notifications

**Phase 3 Validation:**

- [ ] 2-3 CA firms using for full GST cycle
- [ ] Team collaboration features used daily
- [ ] Customer portal accessed by 50%+ clients
- [ ] System uptime >95%

---

### Phase 4: Monetization (Weeks 13-16)

**Goal:** First paying customer

**Features:**

```
✅ Subscription plans (Starter, Professional, Enterprise)
✅ Razorpay integration
✅ Usage tracking (invoices, documents)
✅ Billing dashboard
✅ Invoice generation limits per tier
```

**Pricing (Updated for Invoice Generation):**

| Tier             | Price   | Clients   | Invoices/Month | Documents/Month | Features                         |
|------------------|---------|-----------|----------------|-----------------|----------------------------------|
| **Starter**      | ₹2,999  | 15        | 100            | 500             | Basic OCR, GSTR-1                |
| **Professional** | ₹5,999  | 50        | 500            | 2000            | + Reconciliation, Team (5 users) |
| **Enterprise**   | ₹12,999 | Unlimited | Unlimited      | Unlimited       | + Priority support, WhatsApp     |

**Phase 4 Validation:**

- [ ] 1+ paying customer
- [ ] ₹3K+ MRR
- [ ] Customer retention 100%
- [ ] Referral interest from users

---

### Phase 5: Scale (Months 5-9)

**Features:**

- GSTR-2A/2B reconciliation
- WhatsApp integration
- Advanced analytics
- Multi-location support (for chains)
- Payment gateway integration (in-invoice payments)

---

### Phase 6+: AI & Innovation (Month 10+)

**Features:**

- Conversational AI (needs 10K+ invoice training data)
- Predictive compliance alerts
- ML-based categorization
- Smart reconciliation suggestions

---

## Database Schema Changes

### New Entities

**1. Project Entity:**

```javascript
{
    "_id"
:
    "project_123",
        "tenantId"
:
    "ca-firm-abc",
        "clientId"
:
    "client_456",
        "name"
:
    "Monthly GST Compliance",
        "type"
:
    "GST_COMPLIANCE",  // GST_COMPLIANCE, ITR_FILING, TDS_MANAGEMENT
        "status"
:
    "ACTIVE",        // ACTIVE, COMPLETED, ON_HOLD
        "startDate"
:
    ISODate("2025-01-01"),
        "endDate"
:
    null,
        "assignedStaff"
:
    ["user_123", "user_124"],  // Array of user IDs
        "filingFrequency"
:
    "MONTHLY",  // MONTHLY, QUARTERLY
        "createdAt"
:
    ISODate("2025-01-01"),
        "updatedAt"
:
    ISODate("2025-01-15")
}
```

**2. Product Entity (for Invoice Generation):**

```javascript
{
    "_id"
:
    "product_789",
        "tenantId"
:
    "ca-firm-abc",
        "clientId"
:
    "client_456",    // Product catalog per client
        "projectId"
:
    "project_123",
        "name"
:
    "Gold Necklace 22K",
        "category"
:
    "JEWELRY",       // JEWELRY, ELECTRONICS, etc.
        "hsnCode"
:
    "7113",
        "unitOfMeasure"
:
    "GRAMS",    // PIECES, GRAMS, KG, LITERS, etc.
        "basePrice"
:
    6000,           // Per gram
        "taxRate"
:
    3,                // 3% GST for gold
        "description"
:
    "22 karat gold necklace",
        "active"
:
    true,
        "createdAt"
:
    ISODate("2025-01-10")
}
```

**3. Updated Invoice Entity:**

```javascript
{
    "_id"
:
    "invoice_456",
        "tenantId"
:
    "ca-firm-abc",
        "clientId"
:
    "client_456",        // Who owns this invoice (jewelry store)
        "projectId"
:
    "project_123",      // ← NEW: Which project
        "invoiceNumber"
:
    "INV-2025-001",
        "invoiceDate"
:
    ISODate("2025-01-15"),
        "invoiceType"
:
    "B2B",

        // Customer (Buyer)
        "customer"
:
    {
        "name"
    :
        "Ramesh Kumar",
            "gstin"
    :
        "27ABC...",           // If B2B
            "phoneNumber"
    :
        "+919876543210",
            "email"
    :
        "ramesh@example.com",
            "address"
    :
        "..."
    }
,

    // Line Items (Products)
    "lineItems"
:
    [
        {
            "productId": "product_789",
            "productName": "Gold Necklace 22K",
            "hsnCode": "7113",
            "quantity": 15,              // grams
            "unitPrice": 6000,           // per gram
            "amount": 90000,             // 15 * 6000
            "makingCharges": 5000,
            "taxableValue": 95000,
            "gstRate": 3,
            "cgst": 1425,                // 1.5%
            "sgst": 1425,                // 1.5%
            "total": 97850
        }
    ],

        // Totals
        "subtotal"
:
    95000,
        "totalTax"
:
    2850,
        "grandTotal"
:
    97850,
        "roundOff"
:
    0,

        // Source
        "source"
:
    "CREATED_IN_APP",      // CREATED_IN_APP, UPLOADED_DOCUMENT, OCR_EXTRACTED
        "documentId"
:
    null,              // If uploaded

        // Status
        "status"
:
    "DRAFT",               // DRAFT, SENT, PAID
        "filingStatus"
:
    "PENDING",       // For GSTR filing

        // Sharing
        "sharedVia"
:
    ["WHATSAPP", "EMAIL"],
        "pdfUrl"
:
    "s3://...",

        "createdAt"
:
    ISODate("2025-01-15"),
        "createdBy"
:
    "user_123"
}
```

**4. Activity/Audit Entity (for Collaboration):**

```javascript
{
    "_id"
:
    "activity_999",
        "tenantId"
:
    "ca-firm-abc",
        "userId"
:
    "user_123",
        "userName"
:
    "John Doe",
        "action"
:
    "DOCUMENT_APPROVED",   // DOCUMENT_APPROVED, INVOICE_CREATED, etc.
        "entityType"
:
    "DOCUMENT",        // DOCUMENT, INVOICE, CLIENT, etc.
        "entityId"
:
    "doc_456",
        "details"
:
    {
        "documentName"
    :
        "invoice_Jan2025.jpg",
            "previousStatus"
    :
        "PENDING",
            "newStatus"
    :
        "APPROVED"
    }
,
    "timestamp"
:
    ISODate("2025-01-15T10:30:00Z")
}
```

---

## Impact Analysis

### Timeline Impact

| Original Scope      | New Scope                   | Change       | Reason                       |
|---------------------|-----------------------------|--------------|------------------------------|
| 10 weeks (Next.js)  | 12 weeks (Expo)             | +2 weeks     | Mobile app required          |
| No invoice creation | Invoice creation in Phase 2 | +2 weeks     | High-value feature           |
| Simple structure    | Multi-project structure     | +1 week      | Data model complexity        |
| **Total**           | **15 weeks to MVP**         | **+5 weeks** | **More scope, higher value** |

### Cost Impact

| Phase                | Original Cost | New Cost    | Change      | Reason                    |
|----------------------|---------------|-------------|-------------|---------------------------|
| Month 1              | ₹1,000        | ₹1,000      | No change   | Same AWS setup            |
| Month 2              | ₹700          | ₹700        | No change   | Same services             |
| Month 3              | ₹3,500        | ₹3,500      | No change   | Same usage                |
| Month 4              | ₹5,000        | ₹6,000      | +₹1,000     | EAS Build for mobile apps |
| **Total (4 months)** | **₹10,200**   | **₹11,200** | **+₹1,000** | **Mobile app builds**     |

### Revenue Impact (Positive!) 💰

**Invoice Generation as Monetization Driver:**

```
New Pricing Model:

Tier 1 (Starter): ₹2,999/month
- 100 invoices/month included
- ₹5 per additional invoice

Tier 2 (Professional): ₹5,999/month
- 500 invoices/month included
- ₹3 per additional invoice

Tier 3 (Enterprise): ₹12,999/month
- Unlimited invoices

Expected adoption:
- Jewelry stores: 200-500 invoices/month → Professional tier
- Restaurants: 100-200 invoices/month → Starter tier
- Construction: 50-100 invoices/month → Starter tier

Revenue projection (10 customers at Month 6):
- 3 Starter (₹9K) + 5 Professional (₹30K) + 2 Enterprise (₹26K)
- = ₹65K MRR (vs original ₹40K projection)

**+62% revenue increase due to invoice generation feature!**
```

---

## Decision Matrix: Build or Defer?

### Build NOW (Phase 1-4):

| Feature                 | Why Build Now              | Business Value |
|-------------------------|----------------------------|----------------|
| **Mobile App**          | CA explicitly requested    | Critical       |
| **Multi-project**       | Affects data model         | Foundation     |
| **Invoice Generation**  | Huge value, differentiator | Very High      |
| **OCR**                 | Core value prop            | High           |
| **Basic Collaboration** | Team workflows             | Medium-High    |

### Defer (Phase 5+):

| Feature                  | Why Defer            | When to Build       |
|--------------------------|----------------------|---------------------|
| **Conversational AI**    | Need training data   | After 10K invoices  |
| **Advanced Analytics**   | Need usage data      | After 6 months      |
| **WhatsApp Integration** | Nice-to-have, costly | After 20+ customers |
| **Payment Gateway**      | Not core workflow    | After monetization  |

---

## Recommendations

### Immediate Actions (This Week):

1. ✅ **Confirm mobile app priority with CA:**
    - Ask: "Do you prefer mobile app over web, or both equally?"
    - Expected: "Mobile is primary, web is secondary"

2. ✅ **Validate invoice generation value:**
    - Ask: "How many invoices do your clients create per month?"
    - Ask: "Would they pay to create invoices in our app?"
    - Expected: "Yes, this solves a big problem"

3. ✅ **Get jewelry store access:**
    - Shadow them for 2-3 hours
    - Watch invoice creation process
    - Note all fields they capture

4. ✅ **Switch to Expo (if not started yet):**
    - If you haven't coded Next.js yet, switch now
    - If you have, finish Phase 0-1 in Next.js, then add mobile in Phase 2

### Tech Stack Final Decision:

**✅ Use Expo for everything (Web + iOS + Android)**

```
Justification:
1. Mobile is REQUIRED, not optional
2. 80-90% code reuse across platforms
3. Push notifications critical
4. Camera experience better native
5. Only 2 weeks slower than Next.js approach
6. Better long-term maintainability (one codebase)
```

### Feature Priority:

**Phase 1-2 (Must Have):**

1. Mobile app (both CA + Customer)
2. Multi-project structure
3. Invoice generation (customers create invoices)
4. OCR (document upload flow)

**Phase 3-4 (Should Have):**

5. CA team collaboration
6. Customer portal (view status)
7. GSTR-1 filing
8. Notifications

**Phase 5+ (Nice to Have):**

9. Conversational AI (defer 12+ months)
10. Advanced analytics
11. WhatsApp integration

---

## Summary

**Key Changes from Original Plan:**

| Aspect                | Original               | Updated                          | Impact                 |
|-----------------------|------------------------|----------------------------------|------------------------|
| **Tech Stack**        | Next.js (web only)     | **Expo (web + mobile)**          | +2 weeks, +₹1K         |
| **Core Feature**      | Document upload + OCR  | **+ Invoice generation**         | +2 weeks, +62% revenue |
| **Data Model**        | Flat (tenant → client) | **Hierarchical (project-based)** | +1 week                |
| **Mobile App**        | Phase 5+ (optional)    | **Phase 1 (critical)**           | +2 weeks               |
| **Timeline**          | 10 weeks               | **15 weeks**                     | +5 weeks               |
| **Revenue (Month 6)** | ₹40K MRR               | **₹65K MRR**                     | +62%                   |

**Validation Checkpoints:**

Week 4: ✅ Mobile app working, CA using daily
Week 8: ✅ Invoice generation working, customers creating 100+ invoices
Week 12: ✅ CA team collaborating, customers viewing portal
Week 16: ✅ First paying customer, ₹3K+ MRR

---

**Last Updated:** January 2025
**Next Review:** After Phase 1 completion (Week 4)
**Status:** Ready to implement
