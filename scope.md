# Project Scope - Chanakya GST Compliance Platform

> **Strategy:** Validation-Driven Development with Phase Gates
> **Approach:** Solo Founder MVP → Validate → Scale
> **Timeline:** 16 weeks to first paying customer
> **Last Updated:** January 2025

---

## Core Problem Statement (Research-Validated)

Small CA firms (2-5 employees, 20-30 clients) are drowning in operational chaos:

- **40%** of staff time wasted on manual data entry
- **70%** of reconciliation time spent just organizing data
- **45-90 day** payment delays creating cash flow crisis
- **73%** of firms missing 2-3 compliance deadlines annually
- Clients submit documents **7-10 days before deadlines** despite needing weeks for processing

---

## Primary Success Metrics

- ✅ Reduce monthly GST compliance time from **11-18 hours → 2 hours** per client
- ✅ Achieve **95%+ document collection** before deadline-5 days
- ✅ Automate **80% of data entry** through OCR
- ✅ Enable CA firms to handle **2x clients** with same team size

---

## Solo Founder Validation-Driven Roadmap

### **Philosophy: Build → Validate → Scale (or Pivot)**

Each phase has a **VALIDATION CHECKPOINT**. You only proceed to the next phase if validation succeeds.

```
Phase 0 (Week 0)    → VALIDATE: Problem + CA commitment
Phase 1 (Week 1-4)  → VALIDATE: Technical feasibility
Phase 2 (Week 5-8)  → VALIDATE: Core value (OCR works)
Phase 3 (Week 9-12) → VALIDATE: Daily usage by 2-3 CAs
Phase 4 (Week 13-16)→ VALIDATE: Willingness to pay
Phase 5+ (Week 17+) → SCALE: Only if all validations pass
```

---

## Phase 0: Pre-Development Validation (Week 0)

### Objective

**Validate that the problem is real and CAs will actually use your solution.**

### Tasks (40 hours)

| Task                               | Time | Deliverable                             | Success Criteria                         |
|------------------------------------|------|-----------------------------------------|------------------------------------------|
| Find 3-5 CA firms willing to pilot | 10h  | List of committed CAs with contact info | At least 2 CAs say "yes, we'll test it"  |
| Shadow CA workflow for GST filing  | 8h   | Process documentation with screenshots  | Understand current pain points           |
| Document GST reconciliation logic  | 8h   | GST_DOMAIN_LOGIC.md with matching rules | CA validates: "Yes, this is how we work" |
| Create clickable mockups (Figma)   | 8h   | 5-10 screen mockups                     | CA says: "This would solve our problem"  |
| Define MVP scope with CAs          | 4h   | Prioritized feature list (top 5)        | Agreement on what to build first         |
| Set up development environment     | 2h   | AWS account, GitHub repo, local setup   | Can run "Hello World"                    |

### Validation Checkpoint ✅

**GO Decision (Proceed to Phase 1):**

- [ ] 2+ CAs committed to pilot (written/verbal agreement)
- [ ] CA confirmed: "If you build X, we'll use it daily"
- [ ] You have test dataset: 20 real anonymized invoices
- [ ] CA agrees to weekly feedback calls

**NO-GO Decision (Pivot or Stop):**

- ❌ Less than 2 CA commitments → Find more CAs or reconsider
- ❌ CAs say "nice to have, not must-have" → Wrong problem
- ❌ CA's actual workflow doesn't match your assumptions → Redesign

### Budget

- **Cost:** ₹0 (time investment only)
- **Risk:** Low (1 week, no financial commitment)

---

## Phase 1: Technical Foundation (Weeks 1-4)

### Objective

**Validate that you can build the technical infrastructure and CAs can login + upload documents.**

### MVP Tech Stack (Simplified)

#### Backend (Essential Only)

| Component | Technology              | Why This?                   | When to Add Complexity      |
|-----------|-------------------------|-----------------------------|-----------------------------|
| Runtime   | Java 21                 | Spring Boot ecosystem       | -                           |
| Framework | Spring Boot 3.5         | Rapid API development       | -                           |
| Auth      | AWS Cognito             | Managed auth, JWT tokens    | -                           |
| Database  | MongoDB Atlas M0 (Free) | Document storage, free tier | Upgrade to M10 at 50+ users |
| Storage   | AWS S3                  | Document storage            | -                           |
| OCR       | AWS Textract            | Invoice data extraction     | -                           |

**Deliberately EXCLUDED for MVP:**

- ❌ API Gateway (Spring Boot handles requests directly)
- ❌ Redis/ElastiCache (no caching needs yet)
- ❌ SQS/Lambda (call Textract synchronously)
- ❌ Load Balancer (single instance handles <100 users)

#### Frontend (Unified)

| Component  | Technology            | Why This?                         |
|------------|-----------------------|-----------------------------------|
| Framework  | Expo SDK 54+          | Web + Mobile from single codebase |
| UI         | React Native Paper    | Pre-built components              |
| State      | React Query           | Server state caching              |
| Forms      | React Hook Form + Zod | Validation                        |
| Navigation | Expo Router           | File-based routing                |
| Camera     | expo-camera           | Document capture                  |

**Deliberately EXCLUDED for MVP:**

- ❌ WatermelonDB (no offline needs for CA staff)
- ❌ Zustand (React Query is enough)
- ❌ Advanced animations (ship ugly but functional)

### Week-by-Week Plan

#### **Week 1: Authentication & Setup**

```
Backend:
├── Spring Boot project scaffold
├── AWS Cognito user pool setup
├── JWT validation filter
├── MongoDB connection
└── Health check endpoint

Frontend:
├── Expo project with TypeScript
├── Login screen (email + password)
├── AWS Amplify Cognito integration
└── Protected navigation

Test: User can signup, login, see empty dashboard
Time: 50-60 hours (10-12 hours/day, 5 days)
```

#### **Week 2: Document Upload (Mobile)**

```
Backend:
├── POST /api/documents/upload endpoint
├── S3 bucket with tenantId prefix
├── Document metadata storage (MongoDB)
└── Multipart file handling

Frontend:
├── Camera screen with expo-camera
├── Image compression (80% quality)
├── Upload progress indicator
└── Success/error handling

Test: Client can capture invoice photo and upload to S3
Time: 50-60 hours
```

#### **Week 3: Document Management (Web)**

```
Backend:
├── GET /api/documents (list with pagination)
├── GET /api/documents/:id (detail)
├── PUT /api/documents/:id (update status)
└── Multi-tenancy filtering (tenantId in all queries)

Frontend (Expo Web):
├── Dashboard with document list
├── Document detail view (show image from S3)
├── Approve/Reject workflow
└── Basic filters (status, date)

Test: CA staff can view uploaded documents on web
Time: 50-60 hours
```

#### **Week 4: User Management & Polish**

```
Backend:
├── User roles (CA_ADMIN, CA_STAFF, CLIENT)
├── Client entity CRUD
├── User profile endpoints
└── Basic authorization (@PreAuthorize)

Frontend:
├── Client list screen
├── Add/Edit client form
├── User profile screen
└── Bug fixes & UI polish

Test: CA can add clients, assign documents to clients
Time: 40-50 hours
```

### Validation Checkpoint ✅

**GO Decision (Proceed to Phase 2):**

- [ ] 2 CA firms have successfully logged in
- [ ] At least 10 documents uploaded via mobile camera
- [ ] CA staff can view documents in web dashboard
- [ ] No critical bugs in auth or upload flow
- [ ] CA feedback: "This is working, keep going"

**NO-GO Decision (Pivot or Fix):**

- ❌ Upload fails >30% of the time → Fix reliability first
- ❌ CA says "too complicated to use" → Simplify UX
- ❌ Camera quality too poor on invoices → Add image quality checks
- ❌ CA lost interest, not responding → Find new pilot partners

### Budget (Month 1)

| Service              | Usage                         | Cost             |
|----------------------|-------------------------------|------------------|
| AWS EC2 t2.micro     | 750h (free tier)              | ₹0               |
| MongoDB Atlas M0     | 512MB shared                  | ₹0               |
| AWS S3               | 5GB storage, 100 PUT requests | ₹0-100           |
| AWS Cognito          | <50 MAU                       | ₹0               |
| Domain (chanakya.in) | Annual                        | ₹1,000           |
| **Total Month 1**    |                               | **₹1,000-1,100** |

---

## Phase 2: OCR & Core Value (Weeks 5-8)

### Objective

**Validate that OCR works well enough to save CA staff time on data entry.**

### Week-by-Week Plan

#### **Week 5: AWS Textract Integration**

```
Backend:
├── POST /api/documents/:id/process (trigger OCR)
├── AWS Textract API integration (synchronous)
├── Basic text extraction (raw blocks)
├── Store extracted text in MongoDB
└── Confidence scores per field

Frontend:
├── "Process with OCR" button
├── Processing status indicator
├── Display raw extracted text
└── Show confidence scores

Test: Textract successfully extracts text from 80%+ invoices
Time: 50-60 hours
```

#### **Week 6: Invoice Field Extraction**

```
Backend:
├── Parse Textract response for key fields:
│   ├── GSTIN (regex: \d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1})
│   ├── Invoice number
│   ├── Invoice date (multiple formats)
│   ├── Total amount (₹ symbol, commas)
│   └── Vendor/buyer name
├── Field validation logic
└── Manual override capability

Frontend:
├── Structured field display
├── Edit extracted fields
├── Validation errors (e.g., invalid GSTIN)
└── Save corrected data

Test: 70%+ of invoices have correct GSTIN extracted
Time: 50-60 hours
```

#### **Week 7: OCR Accuracy Improvement**

```
Backend:
├── Add pre-processing hints to Textract
├── Handle rotated/skewed images
├── Fallback logic for low confidence
└── Track extraction accuracy metrics

Frontend:
├── Image quality checker (blur detection)
├── Retake photo option
├── Manual entry fallback
└── Accuracy dashboard for CA

Test: GSTIN extraction accuracy >85%
Time: 40-50 hours
```

#### **Week 8: Invoice Data Management**

```
Backend:
├── Invoice entity (separate from Document)
├── POST /api/invoices (create from extracted data)
├── GET /api/invoices (list with filters)
├── PUT /api/invoices/:id (edit)
└── Link invoice ↔ document

Frontend:
├── Invoice list screen
├── Invoice detail/edit form
├── HSN code dropdown (top 50 codes)
└── Amount calculation (taxable + GST)

Test: CA can create 1 month's invoices for 1 client (20-30 invoices)
Time: 50-60 hours
```

### Validation Checkpoint ✅

**GO Decision (Proceed to Phase 3):**

- [ ] Processed 100+ real invoices through OCR
- [ ] GSTIN accuracy >80% (allows 20% manual correction)
- [ ] Invoice amount accuracy >70%
- [ ] CA reports: "This saves us 30-50% data entry time"
- [ ] Average processing time <30 seconds per invoice

**NO-GO Decision (Pivot or Fix):**

- ❌ GSTIN accuracy <60% → Improve extraction or add manual flow
- ❌ Textract costs >₹5,000/month → Reduce usage or find alternatives
- ❌ CA says "manual entry is still faster" → Rethink OCR approach
- ❌ Image quality issues in 50%+ uploads → Add quality guidance

### Budget (Month 2)

| Service           | Usage                                  | Cost         |
|-------------------|----------------------------------------|--------------|
| AWS EC2 t2.micro  | 750h (free tier)                       | ₹0           |
| MongoDB Atlas M0  | 512MB                                  | ₹0           |
| AWS S3            | 10GB storage, 500 GET/PUT              | ₹100-200     |
| AWS Textract      | 200-300 pages (1000 free in month 1-3) | ₹0-500       |
| AWS Cognito       | <50 MAU                                | ₹0           |
| **Total Month 2** |                                        | **₹100-700** |

---

## Phase 3: GST Forms & Daily Usage (Weeks 9-12)

### Objective

**Validate that CAs will use the system daily for actual GST filing work.**

### Week-by-Week Plan

#### **Week 9: GSTR-1 Form (B2B Section)**

```
Backend:
├── GSTR-1 B2B invoice aggregation logic
├── Group by GSTIN + month/year
├── Calculate totals (taxable, CGST, SGST, IGST)
├── GET /api/gstr1/:clientId/:month/:year
└── Export to JSON (GSTN portal format)

Frontend:
├── GSTR-1 form screen
├── Month/year selector
├── Invoice list for selected period
├── Editable table view
└── Summary totals

Test: Generate GSTR-1 for 1 client with 20 invoices
Time: 50-60 hours
```

#### **Week 10: GSTR-1 Export & Validation**

```
Backend:
├── Excel export (match GSTN offline tool format)
├── Validation rules:
│   ├── GSTIN format validation
│   ├── Amount cross-checks
│   ├── Duplicate invoice detection
│   └── Missing required fields
└── Validation report API

Frontend:
├── "Export to Excel" button
├── Validation error display
├── Fix errors inline
└── Mark as "Ready to File"

Test: Export valid Excel file that CA can upload to GST portal
Time: 40-50 hours
```

#### **Week 11: Client Dashboard & Reminders**

```
Backend:
├── Dashboard API (client-wise compliance status)
├── Deadline calculation logic (10th, 20th of month)
├── SMS notification service (AWS SNS)
├── Email notifications (AWS SES)
└── Notification preferences per user

Frontend:
├── Dashboard with client cards
├── Deadline countdown timers
├── Document submission status
├── Send reminder button (WhatsApp later, email for now)
└── Compliance scorecard

Test: CA sees all clients, upcoming deadlines, missing documents
Time: 40-50 hours
```

#### **Week 12: Polish, Deploy & Onboard**

```
Backend:
├── Production deployment (AWS EC2)
├── Environment-based configuration
├── Database backup setup (MongoDB Atlas)
├── CloudWatch logs & basic monitoring
└── Error tracking setup

Frontend:
├── Bug fixes from CA feedback
├── UI polish (loading states, empty states)
├── Onboarding tutorial/tooltips
├── User documentation (PDF/video)
└── Build and deploy to production

Test: 2-3 CAs complete 1 full month GST cycle
Time: 40-50 hours
```

### Validation Checkpoint ✅

**GO Decision (Proceed to Phase 4 - Monetization):**

- [ ] 2-3 CAs used system for full GST filing cycle (1 month)
- [ ] At least 5 clients' GSTR-1 filed using your system
- [ ] CAs report: "We filed faster than usual"
- [ ] Zero critical bugs that blocked filing
- [ ] CAs want to continue using it next month
- [ ] System uptime >95% for the month

**NO-GO Decision (Pivot or Fix):**

- ❌ CAs filed manually instead of using system → UX too complex
- ❌ Validation errors blocked filing → Fix validation logic
- ❌ System downtime during critical filing period → Improve reliability
- ❌ CA feedback: "Not saving us much time" → Identify bottlenecks
- ❌ CAs stopped responding → Re-engage or find new pilots

### Budget (Month 3)

| Service                         | Usage                                        | Cost           |
|---------------------------------|----------------------------------------------|----------------|
| AWS EC2 t2.micro                | 750h (free tier year 1)                      | ₹0             |
| MongoDB Atlas M0                | 512MB (consider M10 upgrade if >100 clients) | ₹0-2,000       |
| AWS S3                          | 20GB storage, 2000 requests                  | ₹200-400       |
| AWS Textract                    | 500 pages (~200 remaining in free tier)      | ₹500-1,000     |
| AWS SNS (SMS)                   | 100 SMS reminders                            | ₹50-100        |
| AWS SES (Email)                 | 1000 emails (free tier)                      | ₹0             |
| SSL Certificate (Let's Encrypt) | Free                                         | ₹0             |
| **Total Month 3**               |                                              | **₹750-3,500** |

---

## Phase 4: Monetization & First Revenue (Weeks 13-16)

### Objective

**Validate that CAs are willing to pay for the solution.**

### Week-by-Week Plan

#### **Week 13: Pricing & Payment Setup**

```
Backend:
├── Subscription plans (Starter, Professional)
├── Razorpay payment gateway integration
├── Subscription management (start date, renewal)
├── Usage tracking (documents, clients per tenant)
└── Invoice generation for CA firms

Frontend:
├── Pricing page
├── Subscription upgrade flow
├── Payment form (Razorpay checkout)
├── Billing history
└── Usage dashboard

Task: Present pricing to pilot CAs, negotiate if needed
Time: 40-50 hours
```

#### **Week 14: Sales Conversations & Conversions**

```
Activities:
├── Schedule 1-on-1 calls with each pilot CA
├── Present value proposition (time saved, error reduction)
├── Offer early adopter discount (50% off for 6 months)
├── Get written agreement (email confirmation)
└── Set up payment (first month paid)

Goal: Convert at least 1 pilot CA to paid customer
Time: 20-30 hours (sales, not coding)
```

#### **Week 15: Feature Requests & Iterations**

```
Based on CA feedback, implement top 2-3 quick wins:

Likely requests:
├── GSTR-3B form support
├── Better bulk editing of invoices
├── Duplicate invoice detection
├── Client-wise document folders
└── Mobile app improvements

Prioritize by:
1. Impact on daily workflow
2. Implementation time (<1 week)
3. Multiple CAs requesting it

Time: 50-60 hours
```

#### **Week 16: Referral Program & Case Study**

```
Activities:
├── Create case study from pilot CA (before/after metrics)
├── Record video testimonial
├── Design referral program (1 month free per referral)
├── Create marketing materials (website, pitch deck)
└── Identify next 5-10 CA prospects

Goal: Get 1-2 referrals from existing customers
Time: 30-40 hours
```

### Validation Checkpoint ✅

**GO Decision (Proceed to Phase 5 - Scale):**

- [ ] At least 1 CA paying customer (₹3K-5K/month)
- [ ] Monthly Recurring Revenue (MRR) >₹3,000
- [ ] Customer says: "I'd recommend this to other CAs"
- [ ] Pipeline of 3-5 interested CAs (from referrals/outreach)
- [ ] Churn: 0% (no customers cancelled)
- [ ] Product-market fit signals: CAs using daily, asking for more features

**NO-GO Decision (Pivot or Stop):**

- ❌ Zero CAs willing to pay → Wrong pricing or insufficient value
- ❌ CAs say "we'll pay later" → Build more value or change model
- ❌ Pilot CAs stopped using after free period → UX or value problem
- ❌ Cost per customer acquisition >₹20,000 → Unsustainable economics
- ❌ You're burning out → Scope too large, simplify further

### Budget (Month 4)

| Service                 | Usage                                  | Cost             |
|-------------------------|----------------------------------------|------------------|
| AWS EC2 t2.micro        | 750h (free tier)                       | ₹0               |
| MongoDB Atlas M0 or M10 | Upgrade if >50 clients                 | ₹0-2,500         |
| AWS S3                  | 30GB storage                           | ₹300-500         |
| AWS Textract            | 800 pages (₹1.50/page after free tier) | ₹1,200-2,000     |
| AWS SNS (SMS)           | 200 SMS                                | ₹100-200         |
| AWS SES (Email)         | 2000 emails                            | ₹0-50            |
| Razorpay (2% + ₹3/txn)  | 2 subscriptions × ₹3000                | ₹120             |
| **Total Month 4**       |                                        | **₹1,720-5,370** |

**Revenue:** ₹3,000-6,000 (1-2 paying customers)
**Net:** ₹0 to +₹2,500 (approaching break-even!)

---

## Phase 5: Scale (Week 17+) - Only if Phase 4 Validates

### Objective

**Grow from 2-3 customers to 10-20 customers while maintaining quality.**

### Gradual Scaling Strategy

#### **Months 5-6: Reach 10 Customers**

```
Focus:
├── Sales & marketing (LinkedIn, CA associations)
├── Customer onboarding automation
├── 2-3 most-requested features
├── Stability improvements (error handling)
└── Documentation & support

Target: 10 paying CAs × ₹4K average = ₹40K MRR
Time: 300-400 hours (part-time consulting possible)
```

#### **Months 7-9: Reach 20-30 Customers**

```
Now you can justify:
├── Upgrade to AWS t3.small (₹2,000/month)
├── MongoDB M10 cluster (₹2,500/month)
├── Part-time support person (₹15K/month)
├── Better monitoring (Sentry, ₹2K/month)
└── Advanced features:
    ├── GSTR-2A/2B reconciliation
    ├── WhatsApp integration
    └── Basic analytics

Target: 25 CAs × ₹5K average = ₹1.25L MRR
Costs: ₹25-30K/month
Net profit: ₹95K-1L/month (covers your salary!)
```

#### **Months 10-12: Reach 50+ Customers**

```
Now you can justify:
├── Hiring full-time developer (₹40-50K/month)
├── Customer success manager (₹30-35K/month)
├── Better infrastructure:
│   ├── Load balancer + 2 API instances
│   ├── Redis for caching
│   └── Separate staging environment
└── Advanced features:
    ├── Tally integration
    ├── Payment tracking
    └── Mobile app for clients

Target: 50 CAs × ₹6K average = ₹3L MRR
Costs: ₹1.2-1.5L/month
Net profit: ₹1.5-1.8L/month (sustainable business!)
```

### When to Add Complexity

| Technology    | Current State   | When to Add                              | Why                      |
|---------------|-----------------|------------------------------------------|--------------------------|
| API Gateway   | Not using       | At 1000 req/sec or need rate limiting    | Adds cost & complexity   |
| Redis Cache   | Not using       | When DB queries slow (>500ms p95)        | Premature optimization   |
| SQS + Lambda  | Not using       | When OCR takes >10s or need async        | Sync is simpler to debug |
| Load Balancer | Single instance | At 80% CPU utilization consistently      | Single point of failure  |
| Kubernetes    | Not using       | Never for this scale                     | Massive overkill         |
| Microservices | Monolith        | At 5+ developers or 10K+ users           | Distributed complexity   |
| AI/ML         | Rule-based OCR  | When you have 10K+ invoices for training | Need training data       |

---

## Financial Projections (Realistic)

### Bootstrap Mode (Months 1-4)

| Month       | Customers | MRR    | Costs  | Net     | Cumulative |
|-------------|-----------|--------|--------|---------|------------|
| **Month 1** | 0 (pilot) | ₹0     | ₹1,000 | -₹1,000 | -₹1,000    |
| **Month 2** | 0 (pilot) | ₹0     | ₹700   | -₹700   | -₹1,700    |
| **Month 3** | 0 (pilot) | ₹0     | ₹3,500 | -₹3,500 | -₹5,200    |
| **Month 4** | 1-2       | ₹3,000 | ₹5,000 | -₹2,000 | -₹7,200    |

**Total Investment:** ₹7,200 over 4 months (₹1,800/month average)
**Risk:** Very low financial risk

### Growth Mode (Months 5-12)

| Month        | Customers | MRR       | Costs   | Net      | Cumulative |
|--------------|-----------|-----------|---------|----------|------------|
| **Month 5**  | 3         | ₹12,000   | ₹6,000  | +₹6,000  | -₹1,200    |
| **Month 6**  | 5         | ₹20,000   | ₹8,000  | +₹12,000 | +₹10,800   |
| **Month 9**  | 15        | ₹75,000   | ₹25,000 | +₹50,000 | +₹210,800  |
| **Month 12** | 30        | ₹1,50,000 | ₹60,000 | +₹90,000 | +₹750,000  |

**Break-even:** Month 5 (cumulative)
**Profitable:** Month 6 onwards

### Year 2 Projections

| Quarter | Customers | MRR   | Costs (with team) | Net Profit  | ARR  |
|---------|-----------|-------|-------------------|-------------|------|
| Q1      | 50        | ₹2.5L | ₹1.2L             | ₹1.3L/month | ₹30L |
| Q2      | 75        | ₹4L   | ₹1.8L             | ₹2.2L/month | ₹48L |
| Q3      | 100       | ₹5.5L | ₹2.5L             | ₹3L/month   | ₹66L |
| Q4      | 150       | ₹8L   | ₹3.5L             | ₹4.5L/month | ₹96L |

---

## Pricing Strategy (Phase 4+)

### Tiered Pricing

| Tier                   | Target                | Price         | Includes                                                          | Limits                  |
|------------------------|-----------------------|---------------|-------------------------------------------------------------------|-------------------------|
| **Pilot** (Months 1-4) | First 2-3 CAs         | Free          | Everything                                                        | Full access to validate |
| **Starter**            | Solo CAs, 1-5 staff   | ₹2,999/month  | Basic OCR, GSTR-1/3B, 15 clients                                  | 1000 docs/month         |
| **Professional**       | Growing firms         | ₹5,999/month  | + Reconciliation, 50 clients, Priority support                    | 3000 docs/month         |
| **Enterprise**         | Large firms 10+ staff | ₹12,999/month | + Tally integration, Unlimited clients, Dedicated account manager | Unlimited               |

### Early Adopter Discount (Months 4-6)

- **50% off** for first 6 months (then full price)
- Converts to: Starter ₹1,500/mo, Professional ₹3,000/mo
- Lock-in: Annual commitment (cancel anytime but pay 3 months)

### Revenue Scenarios

**Conservative (80% Starter, 20% Professional):**

- 10 customers: 8 Starter (₹24K) + 2 Pro (₹12K) = **₹36K MRR**

**Realistic (60% Starter, 40% Professional):**

- 20 customers: 12 Starter (₹36K) + 8 Pro (₹48K) = **₹84K MRR**

**Optimistic (40% Starter, 50% Pro, 10% Enterprise):**

- 50 customers: 20 Starter (₹60K) + 25 Pro (₹1.5L) + 5 Enterprise (₹65K) = **₹2.75L MRR**

---

## Technology Evolution Path

### MVP Stack (Months 1-4)

```
Client:     Expo (Web + Mobile)
API:        Spring Boot (single EC2 t2.micro)
Auth:       AWS Cognito
Storage:    AWS S3
OCR:        AWS Textract (sync calls)
Database:   MongoDB Atlas M0 (free)
Monitoring: AWS CloudWatch (basic)
```

### Growth Stack (Months 5-9)

```
Add:
├── MongoDB Atlas M10 (dedicated, ₹2.5K/mo)
├── AWS t3.small instance (₹2K/mo)
├── Sentry error tracking (₹2K/mo)
├── Better logging (structured JSON logs)
└── Automated daily backups
```

### Scale Stack (Months 10-12)

```
Add:
├── Redis ElastiCache (₹3K/mo)
├── Application Load Balancer + 2 instances
├── SQS + Lambda for async OCR
├── Separate staging environment
├── AWS RDS for transactional data (if needed)
└── CloudFront CDN for web app
```

### Enterprise Stack (Year 2+)

```
Add only if needed:
├── API Gateway (rate limiting, API keys)
├── Kubernetes (if 10+ microservices)
├── Separate region (DR/backup)
├── Advanced monitoring (DataDog, ₹10K/mo)
└── Compliance (SOC 2, ISO 27001)
```

---

## Phase Gates Summary

### Visual Decision Tree

```
Week 0: Problem Validation
├─ ✅ 2+ CAs committed → Phase 1
└─ ❌ No CA commitment → STOP or find new CAs

Week 4: Technical Validation
├─ ✅ Auth + Upload working → Phase 2
└─ ❌ Technical blockers → Fix or pivot

Week 8: Value Validation
├─ ✅ OCR saves time (80%+ accuracy) → Phase 3
└─ ❌ OCR not good enough → Improve or manual flow

Week 12: Usage Validation
├─ ✅ CAs used for full GST cycle → Phase 4
└─ ❌ Not using daily → UX overhaul or pivot

Week 16: Monetization Validation
├─ ✅ 1+ paying customer → Phase 5 (Scale)
└─ ❌ No willingness to pay → Reconsider business model

Week 24+: Scale Validation
├─ ✅ 10+ customers, <10% churn → Keep scaling
└─ ❌ High churn, no growth → Product-market fit issue
```

---

## Critical Success Factors

### Must-Have by Phase

#### Phase 1 (Week 4)

- [ ] 2 CAs logged in and uploaded documents
- [ ] Zero security vulnerabilities (Cognito JWT working)
- [ ] Uptime >90% (local testing)

#### Phase 2 (Week 8)

- [ ] GSTIN extraction >80% accurate
- [ ] Processed 100+ real invoices
- [ ] CA confirms: "This saves time"

#### Phase 3 (Week 12)

- [ ] 2-3 CAs filed GSTR-1 using system
- [ ] Zero filing deadline misses due to system
- [ ] CAs want to use it again next month

#### Phase 4 (Week 16)

- [ ] 1+ paying customer
- [ ] ₹3K+ MRR
- [ ] Customer retention 100% (no cancellations)

#### Phase 5 (Month 12)

- [ ] 30+ customers
- [ ] ₹1.5L+ MRR
- [ ] <15% monthly churn
- [ ] Break-even or profitable

---

## Risk Mitigation

### High-Risk Items (Actively Monitor)

| Risk                      | Likelihood | Impact   | Mitigation                              | Early Warning Signs                  |
|---------------------------|------------|----------|-----------------------------------------|--------------------------------------|
| **CA abandons pilot**     | Medium     | High     | Weekly check-ins, show progress         | Not responding to messages           |
| **OCR accuracy too low**  | Medium     | High     | Manual fallback, improve over time      | <60% GSTIN accuracy                  |
| **AWS costs spike**       | Low        | Medium   | Free tier usage, billing alerts         | Bill >₹5K in month 1-3               |
| **Textract latency**      | Low        | Medium   | Async processing, progress indicator    | >30s processing time                 |
| **Security breach**       | Low        | Critical | JWT validation, tenant isolation, HTTPS | Unauthorized data access             |
| **Can't convert to paid** | Medium     | Critical | Prove value early, pricing research     | "We'll pay later" responses          |
| **Solo burnout**          | High       | Critical | 40-50h/week max, take weekends off      | Working 7 days/week, 12+ hours       |
| **Scope creep**           | High       | High     | Ruthless prioritization, say "no" often | Building features CAs didn't ask for |

---

## Deferred Features (Build Later)

Do NOT build these until you have 10+ paying customers:

### Month 6+ Features

- ❌ GSTR-2A/2B reconciliation (scope.md original line 644-654)
- ❌ Three-way matching algorithm (complex, needs real data)
- ❌ Advanced analytics & dashboards
- ❌ ITC eligibility calculator (Section 17(5) rules)

### Month 9+ Features

- ❌ Tally integration (no official API, complex)
- ❌ WhatsApp Business API (₹30-50K/month cost)
- ❌ Payment tracking & reminders
- ❌ Construction sector module

### Year 2+ Features

- ❌ AI/ML-powered categorization (need 10K+ invoices)
- ❌ Predictive analytics
- ❌ Natural language queries
- ❌ Multi-branch operations
- ❌ API for third-party integrations

---

## Solo Founder Weekly Checklist

### Every Week (Weeks 1-16)

**Monday:**

- [ ] Review last week's progress
- [ ] Plan this week's 3 most important tasks
- [ ] Check AWS billing dashboard

**Wednesday:**

- [ ] Mid-week check-in with pilot CA (15-min call)
- [ ] Share screenshot/demo of progress
- [ ] Get feedback on UX

**Friday:**

- [ ] Ship something visible (even if buggy)
- [ ] Update GitHub (commit progress)
- [ ] Write down: What worked? What didn't? What to change?

**Sunday:**

- [ ] Take a full day off (burnout prevention)

### Monthly (After Phase 1)

- [ ] Review success metrics (usage, adoption, feedback)
- [ ] Decide: GO to next phase or FIX current phase issues
- [ ] Financial check: Am I staying within budget?
- [ ] Motivation check: Still excited about this? (If no, reconsider)

---

## When to STOP (Red Flags)

**Consider stopping or pivoting if:**

1. **Week 8:** OCR accuracy stuck at <60% after 2 weeks of effort
2. **Week 12:** CAs filed GST manually instead of using your system
3. **Week 16:** Zero CAs willing to pay even at 50% discount
4. **Month 6:** Only 1-2 customers, no growth for 2 months
5. **Month 9:** Customer churn >30% per month
6. **Any time:** You're consistently working 70+ hours/week and burning out
7. **Any time:** Running out of savings and no revenue in sight

**It's okay to stop.** Failed startups are learning experiences. Key: Stop early if it's not working, don't waste years.

---

## Additional Resources

### Files to Create

```
/docs
  ├── MVP_ARCHITECTURE.md   ← Simplified architecture (Phase 1-4 only)
  ├── GST_DOMAIN_LOGIC.md   ← Reconciliation rules from CA partner
  ├── API_SPEC.yaml         ← OpenAPI spec for all endpoints
  ├── DEPLOYMENT.md         ← How to deploy to production
  └── RUNBOOK.md            ← Emergency procedures, monitoring

/tests
  ├── fixtures/
  │   └── sample_invoices/  ← 20 real anonymized invoices (test dataset)
  └── integration/
      └── tenant_isolation_test.ts  ← CRITICAL security test
```

### Weekly Demo Template

**Week X Progress:**

- ✅ What we built: [Screenshot/video]
- ✅ What works: [List]
- ⚠️ What's buggy: [List]
- ❓ Questions for you: [List]
- 🎯 Next week: [Plan]

---

## Summary: Validation-Driven Solo Roadmap

| Phase | Weeks  | Objective                      | Budget    | Validation                  |
|-------|--------|--------------------------------|-----------|-----------------------------|
| **0** | Week 0 | Find 2+ committed CA partners  | ₹0        | CA says "yes"               |
| **1** | 1-4    | Auth + Upload working          | ₹1K       | CAs uploaded 10+ docs       |
| **2** | 5-8    | OCR saves data entry time      | ₹700-3.5K | 80%+ GSTIN accuracy         |
| **3** | 9-12   | CAs file GST using system      | ₹750-3.5K | 2-3 CAs used for full cycle |
| **4** | 13-16  | First paying customer          | ₹1.7-5.4K | ₹3K+ MRR                    |
| **5** | 17+    | Scale to 10, 30, 50+ customers | ₹6-60K/mo | Break-even, profitability   |

**Total Investment (4 months):** ₹3,150-13,000
**Time to First Revenue:** Week 13-16
**Time to Break-Even:** Month 5-6
**Time to Sustainability:** Month 9-12

---

**Last Updated:** January 2025
**Document Owner:** Solo Founder
**Review Frequency:** After each phase gate
**Next Review:** After Week 4 validation checkpoint
