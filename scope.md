# Project Scope

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
- ✅ Reduce payment collection cycle from **45-90 days → 15-30 days**
- ✅ Achieve **95%+ document collection** before deadline-5 days
- ✅ Automate **80% of data entry** through OCR and integrations
- ✅ Enable CA firms to handle **2x clients** with same team size

---

## Target Customer Validation

| Customer Type            | Details                                                         |
|--------------------------|-----------------------------------------------------------------|
| **Initial CA Partner**   | 2 CAs, 5 support staff, 20-30 clients                           |
| **Gujarat Builder**      | Monthly invoices 500+, multi-tier subcontractors                |
| **Pain Point Alignment** | Both face document chaos, payment delays, reconciliation burden |


---

## Technology Stack

### 🔧 Backend Stack

| Component         | Technology                    | Version | Purpose                          |
|-------------------|-------------------------------|---------|----------------------------------|
| **Runtime**       | Java                          | 21 LTS  | Primary backend language         |
| **Framework**     | Spring Boot                   | 3.5.x   | REST API & business logic        |
| **Security**      | Spring Security + AWS Cognito | Latest  | Authentication & authorization   |
| **Database**      | MongoDB Atlas                 | Latest  | Primary database (NoSQL)         |
| **API Gateway**   | AWS API Gateway               | -       | API management & OIDC            |
| **File Storage**  | AWS S3                        | -       | Document storage                 |
| **OCR Engine**    | AWS Textract                  | -       | Invoice & document processing    |
| **Cache**         | Redis (ElastiCache)           | Latest  | Session & data caching           |
| **Message Queue** | AWS SQS                       | -       | Async processing & GST API retry |

### 🎨 Frontend Stack

| Component            | Technology                      | Version    | Purpose                         |
|----------------------|---------------------------------|------------|---------------------------------|
| **Framework**        | Expo                            | Latest SDK | Web + Mobile (unified codebase) |
| **UI Library**       | React Native                    | Latest     | Cross-platform UI components    |
| **Web Support**      | Expo Web                        | Latest     | PWA & responsive web app        |
| **State Management** | Redux Toolkit / Zustand         | Latest     | Global state management         |
| **API Client**       | Axios / React Query             | Latest     | HTTP client & data fetching     |
| **Forms**            | React Hook Form                 | Latest     | Form validation & handling      |
| **UI Components**    | React Native Paper / NativeBase | Latest     | Pre-built UI components         |
| **Navigation**       | Expo Router                     | Latest     | File-based routing              |

### ☁️ AWS Infrastructure & Security

| Service             | Purpose                                      |
|---------------------|----------------------------------------------|
| **AWS Cognito**     | User authentication, multi-tenant user pools |
| **AWS S3**          | Document storage with encryption at rest     |
| **AWS Textract**    | OCR processing for invoices & documents      |
| **AWS Lambda**      | Serverless functions for OCR processing      |
| **AWS API Gateway** | API management, throttling, OIDC integration |
| **AWS CloudWatch**  | Logging, monitoring, and alerting            |
| **AWS SQS**         | Message queuing for GST API retry logic      |
| **AWS ElastiCache** | Redis cache for session management           |
| **AWS VPC**         | Network isolation & security                 |
| **AWS KMS**         | Encryption key management                    |
| **AWS CloudFront**  | CDN for static assets                        |
| **AWS Route 53**    | DNS management                               |
| **AWS RDS Proxy**   | Connection pooling (if needed)               |

### 🔄 DevOps & CI/CD

| Component                   | Technology               | Purpose                       |
|-----------------------------|--------------------------|-------------------------------|
| **SCM**                     | GitHub                   | Source code management        |
| **CI/CD**                   | GitHub Actions           | Automated build, test, deploy |
| **Container Registry**      | AWS ECR                  | Docker image storage          |
| **Container Orchestration** | AWS ECS / Fargate        | Container deployment          |
| **Infrastructure as Code**  | Terraform / AWS CDK      | Infrastructure automation     |
| **Secrets Management**      | AWS Secrets Manager      | API keys & credentials        |
| **Monitoring**              | AWS CloudWatch + DataDog | Application monitoring        |
| **Error Tracking**          | Sentry                   | Error tracking & debugging    |

### 🔌 External Integrations

| Integration               | Purpose                            | Provider        |
|---------------------------|------------------------------------|-----------------|
| **WhatsApp Business API** | Document collection, notifications | Meta / Twilio   |
| **GST Portal API**        | GSTR-2A/2B fetch, filing           | GSTN            |
| **Tally Integration**     | Accounting data sync               | Tally Solutions |
| **Payment Gateway**       | Payment collection                 | Razorpay / PayU |
| **SMS Gateway**           | Payment reminders                  | AWS SNS / MSG91 |
| **Email Service**         | Notifications                      | AWS SES         |

### 🧪 Testing & Quality

| Tool                             | Purpose                          |
|----------------------------------|----------------------------------|
| **JUnit 5**                      | Backend unit testing             |
| **Mockito**                      | Mocking framework                |
| **TestContainers**               | Integration testing with MongoDB |
| **Jest**                         | Frontend unit testing            |
| **React Native Testing Library** | Component testing                |
| **Detox**                        | E2E testing for mobile           |
| **Postman / Newman**             | API testing                      |
| **SonarQube**                    | Code quality analysis            |

### 📊 Analytics & Reporting

| Tool                     | Purpose                            |
|--------------------------|------------------------------------|
| **AWS QuickSight**       | Business intelligence & dashboards |
| **Mixpanel / Amplitude** | User analytics                     |
| **Google Analytics**     | Web analytics                      |

### 🛠️ Development Tools

| Tool                | Purpose                     |
|---------------------|-----------------------------|
| **IntelliJ IDEA**   | Backend development IDE     |
| **VS Code**         | Frontend development IDE    |
| **Postman**         | API testing & documentation |
| **MongoDB Compass** | Database management         |
| **Docker Desktop**  | Local containerization      |
| **Expo Go**         | Mobile app testing          |

---

## Revised Project Plan with Timeline

### Phase 0: Foundation & Infrastructure (Weeks 1-2)
**✅ Milestone:** Technical Foundation Ready

#### Week 1: Core Infrastructure
- AWS account setup (Mumbai region for data residency)
- AWS Cognito configuration for multi-tenant architecture
- MongoDB Atlas setup with encryption
- AWS S3 configuration for document storage
- AWS Textract setup for OCR capabilities
- GitHub repository setup with branch protection
- CI/CD pipeline with GitHub Actions

#### Week 2: Development Environment
- Spring Boot 3.5 project scaffold with Java 21
- Expo project setup (web + mobile)
- API Gateway configuration with OIDC
- Development, staging, production environments
- Logging and monitoring setup (CloudWatch)
- Docker containerization setup


---

### Phase 1: MVP Core - Pain Point Killers (Weeks 3-8)
**✅ Milestone:** Alpha Release - Core Problem Solvers

#### Week 3-4: Smart Document Management
**Addresses:** Document collection chaos, 7-10 day deadline crunch

- Document upload via web, mobile, WhatsApp integration
- **OCR Engine using AWS Textract:**
  - Invoice capture from mobile photos
  - Auto-extraction: GSTIN, invoice number, date, amount, HSN codes
  - Confidence scoring and manual verification UI
- Document categorization (sales/purchase/expense)
- Deadline-based document request system
- Missing document alerts

#### Week 5-6: CA Billing & Payment Tracking
**Addresses:** 45-90 day payment delays, cash flow crisis

- **CA Firm Invoice Generation:**
  - Service-based billing with GST toggle per client
  - Retainer + variable fee models
  - Bulk invoice generation

- **Payment Tracking System:**
  - Payment status: Pending → Client Marked Paid → CA Verified → Received
  - Outstanding receivables dashboard
  - Aging analysis (30/60/90+ days)

- **Smart Payment Reminders:**
  - Automated WhatsApp/SMS reminders at intervals
  - Escalation workflows
  - Manual reminder triggers

- Payment receipt upload by clients
- Bank reconciliation for payment verification

#### Week 7-8: Rapid Data Entry & Basic GST
**Addresses:** 40% time on manual data entry

- Excel/CSV bulk upload with validation
- GSTR-1 and GSTR-3B preparation forms
- Basic reconciliation dashboard
- Data validation rules
- Error highlighting and correction workflow


---

### Phase 2: Reconciliation & Automation (Weeks 9-14)
**✅ Milestone:** Beta Launch - Efficiency Multipliers

#### Week 9-10: Intelligent Reconciliation Engine
**Addresses:** 70% time spent organizing reconciliation data

- GSTR-2A/2B auto-fetch via GST API (sandbox)
- **Three-way matching algorithm:**
  - Books vs GSTR-2A/2B vs GSTR-3B
  - Intelligent fuzzy matching for common errors
- Mismatch identification and categorization
- Bulk mismatch resolution tools
- ITC eligibility calculator with Section 17(5) rules

#### Week 11-12: Workflow Automation
**Addresses:** Task management chaos, deadline stress

- Task auto-assignment based on deadlines
- Client-wise task tracking
- Document request → Collection → Processing → Filing workflow
- Escalation matrices for delays
- Team workload balancing
- Deadline countdown dashboards

#### Week 13-14: Client Portal & Communication
**Addresses:** WhatsApp scatter, client education gap

- Self-service document upload portal
- Real-time filing status visibility
- Compliance scorecard for clients
- Automated filing notifications
- Educational content delivery
- Mobile-responsive design


---

### Phase 3: Construction Sector & Scale (Weeks 15-20)
**✅ Milestone:** Production Launch - Sector Specialization

#### Week 15-16: Construction/Real Estate Module
**Addresses:** Sector-specific complexity

- Multi-tier subcontractor management
- Works contract classification wizard
- ITC eligibility calculator for construction
- Project-wise GSTIN tracking
- Material rate classification (cement 28%, steel 18%, etc.)
- Volume invoice processing (1000+ monthly)

#### Week 17-18: Integration Layer
**Addresses:** Data silos, manual re-entry

- Tally Prime integration (critical for 70%+ market)
- Bank statement auto-import
- WhatsApp Business API for document collection
- GSTN portal integration (production APIs)
- Payment gateway integration (Razorpay/PayU)

#### Week 19-20: Performance & Polish

- Load testing for 50 concurrent users
- OCR accuracy improvements
- Bulk operations optimization
- Mobile app deployment (React Native)
- User training materials
- Production hardening


---

### Phase 4: Intelligence & Growth (Weeks 21-26)
**✅ Milestone:** Version 1.0 - Market Ready

#### Week 21-22: AI-Powered Features

- Smart invoice categorization using ML
- Anomaly detection in transactions
- Predictive deadline alerts
- Auto-suggestions for HSN codes
- Natural language query for reports

#### Week 23-24: Advanced Analytics

- Client profitability analysis for CAs
- ITC optimization recommendations
- GST liability forecasting
- Compliance health scores
- Custom report builder

#### Week 25-26: Scale Features

- Multi-branch operations
- Bulk client onboarding
- Advanced approval workflows
- Audit trail and compliance reports
- WhatsApp bot for status queries


---

## Updated Release & Deployment Plan

### Release Strategy - Iterative Value Delivery

#### 🚀 Release 0.1 (MVP Alpha) - Week 8
**Theme:** "Pain Killer Features"

| Aspect               | Details                                                                                                             |
|----------------------|---------------------------------------------------------------------------------------------------------------------|
| **Features**         | OCR document capture, CA billing, payment tracking, basic GST forms                                                 |
| **Target Users**     | Internal testing + 1 CA partner (5 clients)                                                                         |
| **Success Criteria** | • 90% OCR accuracy on printed invoices<br>• Payment reminder delivery success<br>• 50% reduction in data entry time |

#### 🚀 Release 0.5 (Beta) - Week 14
**Theme:** "Efficiency at Scale"

| Aspect               | Details                                                                                                                            |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------|
| **Features**         | Reconciliation engine, workflow automation, client portal                                                                          |
| **Target Users**     | 2 CA partners + Gujarat builder                                                                                                    |
| **Load**             | 30 clients, 500 invoices/month                                                                                                     |
| **Success Criteria** | • Reconciliation in <30 minutes per client<br>• 80% documents collected before deadline-5<br>• Zero missed deadlines in test month |

#### 🚀 Release 0.8 (Pilot) - Week 20
**Theme:** "Production Readiness"

| Aspect               | Details                                                                                                  |
|----------------------|----------------------------------------------------------------------------------------------------------|
| **Features**         | Construction module, Tally integration, WhatsApp automation                                              |
| **Target Users**     | 5 CA firms, 50 clients total                                                                             |
| **Success Criteria** | • Handle 1000+ invoices/client for construction<br>• 99.9% uptime for month<br>• <3 second response time |

#### 🚀 Release 1.0 (GA) - Week 26
**Theme:** "Market Launch"

| Aspect               | Details                                                   |
|----------------------|-----------------------------------------------------------|
| **Features**         | Complete feature set with AI capabilities                 |
| **Target Market**    | Open registration                                         |
| **Capacity**         | 100+ concurrent users                                     |
| **Success Criteria** | • 20 paying customers<br>• ₹2 lakh MRR<br>• NPS score >50 |

---


### Deployment Architecture - Progressive Rollout

#### Deployment Pipeline
```
Development → UAT → Staging → Production
```

**Frequency:**
- **Dev:** On every commit
- **UAT:** Daily
- **Staging:** Twice weekly
- **Production:** Weekly (Thursday evening)

**Rollout Strategy:**
- 10% canary for 2 hours
- 25% for 6 hours
- 50% for 12 hours
- 100% after 24 hours

#### Feature Flags for Progressive Enablement

- **OCR processing:** Start with structured documents → handwritten
- **Reconciliation:** Simple matching → fuzzy logic → AI-powered
- **Integrations:** Read-only → bi-directional sync
- **WhatsApp:** Notifications → document collection → full bot


---

## Critical Success Factors

### Week 1-8: Foundation Phase
- ✅ AWS Textract OCR achieving 85%+ accuracy
- ✅ Payment tracking system fully functional
- ✅ Document upload from mobile camera working
- ✅ Basic GSTR forms operational

### Week 9-14: Automation Phase
- ✅ Reconciliation reducing time by 70%
- ✅ Workflow automation eliminating manual tracking
- ✅ Client portal adoption >50%
- ✅ Zero critical bugs in beta

### Week 15-20: Scale Phase
- ✅ Construction module handling 1000+ invoices
- ✅ Tally integration functional
- ✅ System handling 50 concurrent users
- ✅ 99.9% uptime achieved

### Week 21-26: Intelligence Phase
- ✅ AI features showing measurable time savings
- ✅ Analytics driving user insights
- ✅ Customer acquisition cost <₹5,000
- ✅ Monthly retention >90%


---

## Risk Mitigation Updates

### New Risks Identified from Research

#### 🔴 Client Adoption Resistance (High)
**Mitigation:** WhatsApp-first approach, no login required initially

#### 🔴 OCR Accuracy on Poor Quality Images (High)
**Mitigation:** Confidence scoring, manual override, progressive improvement

#### 🔴 Tally Integration Complexity (High)
**Mitigation:** Start with read-only, phased bi-directional sync

#### 🟡 Payment Recovery Features Creating Friction (Medium)
**Mitigation:** Soft reminders, customizable schedules, relationship focus

#### 🔴 GST Portal API Instability (High)
**Mitigation:** Queue-based retry, manual fallback, status monitoring

---

## Investment Requirements

### 💰 Technology Costs (Monthly)

| Service               | Cost Range                    |
|-----------------------|-------------------------------|
| AWS Infrastructure    | ₹15,000-25,000                |
| MongoDB Atlas         | ₹8,000-12,000                 |
| AWS Textract          | ₹10,000-20,000 (volume-based) |
| WhatsApp Business API | ₹5,000-10,000                 |
| Third-party APIs      | ₹5,000-10,000                 |
| **Total**             | **₹43,000-77,000/month**      |

### 👥 Team Requirements

| Phase                     | Team Composition               |
|---------------------------|--------------------------------|
| **Immediate (Weeks 1-8)** | 2 full-stack developers        |
| **Beta (Weeks 9-14)**     | +1 QA engineer, +1 DevOps      |
| **Scale (Weeks 15-20)**   | +1 Frontend, +1 AI/ML engineer |
| **Growth (Weeks 21-26)**  | +2 Customer success            |


---

## Success Metrics Dashboard

### 📊 Operational Metrics

| Metric                                | Target   |
|---------------------------------------|----------|
| Data entry time reduction             | 80% ↓    |
| Reconciliation time                   | 70% ↓    |
| Document collection before deadline-5 | 95% ↑    |
| Payment collection cycle              | <30 days |

### 💼 Business Metrics

| Metric               | Target                |
|----------------------|-----------------------|
| Customer Acquisition | 20 firms by Week 26   |
| Revenue              | ₹2 lakh MRR by launch |
| Retention            | >90% monthly          |
| NPS Score            | >50                   |

### ⚙️ Technical Metrics

| Metric                | Target                    |
|-----------------------|---------------------------|
| OCR Accuracy          | >90% on standard invoices |
| API Response Time     | <2 seconds                |
| Uptime                | 99.9%                     |
| Mobile App Crash Rate | <1%                       |
