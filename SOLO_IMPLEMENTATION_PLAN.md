# Solo Founder 12-Week Implementation Plan

> **Goal:** Build a working MVP that solves document collection chaos for CA firms
> **Timeline:** 12 weeks (8-10 hours/day, 5 days/week)
> **Team:** You + Claude Code + 1-2 CA advisors

---

## 📋 Pre-Week 0: Setup (Before You Code)

### Tasks (2-3 days)

#### Day 1: Infrastructure Setup

**AWS Account:**
```bash
# 1. Create AWS account (ap-south-1 Mumbai region)
#    - Enable MFA
#    - Set billing alert: $50/month
#    - Create IAM user (don't use root!)

# 2. Services to enable:
#    - Cognito (User Pools)
#    - S3 (create bucket: chanakya-docs-dev)
#    - Textract (verify service quota: 1000 pages/month free)
#    - EC2 or App Runner (for Spring Boot)
```

**Development Tools:**
```bash
# Install required tools:
brew install openjdk@21        # Java 21
brew install node              # Node.js (for Expo)
brew install --cask docker     # Docker Desktop
brew install --cask intellij-idea-ce  # IntelliJ IDEA
brew install --cask visual-studio-code

# Expo CLI
npm install -g expo-cli
npm install -g eas-cli

# Verify installations:
java --version   # Should show 21.x
node --version   # Should show 18.x or higher
expo --version
```

**GitHub Setup:**
```bash
# 1. Create GitHub account if you don't have one
# 2. Create repository: chanakya-saas
# 3. Clone locally
git clone https://github.com/YOUR_USERNAME/chanakya-saas.git
cd chanakya-saas

# 4. Create initial structure:
mkdir backend frontend
```

#### Day 2: Find CA Partners

**Critical:** You need 1-2 CA friends to pilot with!

**Outreach Template (WhatsApp/Email):**
```
Hey [CA Name],

I'm building a tool to solve a problem I've seen CAs face:
document collection chaos and GST compliance deadlines.

The idea: Clients scan invoices with their phone camera →
OCR extracts data → You get organized documents before deadline.

Would you be open to:
1. 30-min call to understand your workflow?
2. Testing an early prototype (free, 12 weeks)?
3. Giving honest feedback weekly?

No obligation to pay or commit long-term. Just want to build
something that actually solves a real problem.

Interested?
```

**Target:**
- 3 CA firms (to get 1-2 yes)
- Different specializations (retail, construction, general)
- 20-50 clients each

#### Day 3: Technical Planning

**With Claude Code, Review:**
1. Read through scope.md (already done!)
2. Understand tech stack choices
3. Plan your development environment

**Create Project Plan:**
```bash
# Create a simple TODO list
cat > TODO.md <<EOF
# Week 1 Goals
- [ ] Spring Boot project with Cognito auth
- [ ] Expo project with login screen
- [ ] Can create user and login

# Week 2 Goals
- [ ] Document upload API
- [ ] S3 integration working
- [ ] Mobile camera capture
EOF
```

---

## Week 1-2: Foundation & Authentication

### Week 1: Backend Setup + Basic Auth

#### Day 1-2: Spring Boot Project (8-10 hours/day)

**Ask Claude Code:**
```
Create a Spring Boot 3.5 project with:
- Java 21
- Dependencies: Spring Web, Spring Security, OAuth2 Resource Server, Spring Data MongoDB, AWS SDK
- Package structure: com.chanakya (controller, service, repository, model, config)
- application.yml with AWS Cognito configuration placeholders
- Dockerfile for containerization
```

**Expected Output:**
```
backend/
├── src/main/java/com/chanakya/
│   ├── ChanakayaApplication.java
│   ├── controller/
│   │   └── AuthController.java
│   ├── service/
│   ├── repository/
│   ├── model/
│   │   └── User.java
│   └── config/
│       ├── SecurityConfig.java
│       └── CorsConfig.java
├── src/main/resources/
│   └── application.yml
├── pom.xml
└── Dockerfile
```

**Manual Tasks:**
1. Open IntelliJ IDEA, import Maven project
2. Configure application.yml with your AWS Cognito details
3. Test: `mvn spring-boot:run` → Should start on port 8080

#### Day 3: AWS Cognito Setup (4-6 hours)

**AWS Console (Manual):**
```
1. Go to AWS Cognito → User Pools
2. Create User Pool:
   - Name: chanakya-users-dev
   - Sign-in: Email
   - Password: Default policy
   - MFA: Optional (disable for dev)
   - Email: Use Cognito (free tier)

3. Create App Client:
   - Name: chanakya-mobile-app
   - Auth flows: ALLOW_USER_PASSWORD_AUTH, ALLOW_REFRESH_TOKEN_AUTH
   - OAuth: Authorization code grant
   - Scopes: openid, email, profile
   - Callback URLs: exp://localhost:19000

4. Note down:
   - User Pool ID: ap-south-1_XXXXXX
   - App Client ID: 1234567890abcdef
   - Region: ap-south-1
```

**Update application.yml:**
```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_XXXXXX

aws:
  cognito:
    userPoolId: ap-south-1_XXXXXX
    clientId: 1234567890abcdef
    region: ap-south-1
```

#### Day 4-5: Basic API Endpoints (8-10 hours)

**Ask Claude Code:**
```
Create these REST endpoints in Spring Boot:

1. POST /api/auth/signup - Create user in Cognito
2. POST /api/auth/login - Login with Cognito
3. GET /api/auth/me - Get current user (requires JWT)
4. POST /api/documents - Upload document (placeholder)
5. GET /api/documents - List documents (placeholder)

Use Spring Security to protect endpoints (except signup/login).
Add proper error handling and response DTOs.
```

**Test Manually:**
```bash
# 1. Sign up
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234"}'

# 2. Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@1234"}'
# → Should return access_token

# 3. Get current user
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
# → Should return user info
```

**Success Criteria:**
- ✅ Can create user
- ✅ Can login and get JWT token
- ✅ Can access protected endpoint with token
- ✅ Get 401 without token

---

### Week 2: Frontend Setup + Login UI

#### Day 1-2: Expo Project Setup (8-10 hours)

**Ask Claude Code:**
```
Create an Expo project with:
- Latest SDK (52+)
- TypeScript
- Expo Router for navigation
- React Native Paper for UI components
- AWS Amplify for Cognito auth
- Axios for API calls
- React Query for data fetching

Setup folder structure:
- app/ (routes)
- components/ (reusable components)
- services/ (API calls)
- types/ (TypeScript types)
- utils/ (helpers)
```

**Run Commands:**
```bash
cd frontend
npx create-expo-app@latest chanakya-app --template tabs
cd chanakya-app

# Install dependencies
npx expo install expo-router expo-camera expo-image-picker
npx expo install @aws-amplify/react-native aws-amplify
npm install react-native-paper axios @tanstack/react-query zustand
npm install zod react-hook-form @hookform/resolvers

# Configure Amplify
npx amplify configure
```

**Manual Configuration:**
```typescript
// src/config/amplify.ts
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_XXXXXX',
      userPoolClientId: '1234567890abcdef',
      region: 'ap-south-1',
    },
  },
});
```

#### Day 3-4: Login & Signup Screens (8-10 hours)

**Ask Claude Code:**
```
Build these screens in Expo with React Native Paper:

1. app/login.tsx - Login screen
   - Email input
   - Password input
   - Login button
   - "Sign up" link
   - Use AWS Amplify signIn()

2. app/signup.tsx - Signup screen
   - Email input
   - Password input
   - Confirm password
   - Sign up button
   - Use AWS Amplify signUp()

3. app/(tabs)/_layout.tsx - Tab navigator
   - Home, Documents, Profile tabs
   - Only accessible when authenticated

4. components/AuthProvider.tsx - Auth context
   - Check if user is logged in
   - Redirect to login if not
   - Store user state in Zustand

Add loading states, error handling, and validation with Zod.
```

**Expected Screens:**
```
/login
  ├── Email field
  ├── Password field
  ├── "Login" button
  └── "Don't have account? Sign up"

/signup
  ├── Email field
  ├── Password field
  ├── Confirm password
  ├── "Sign Up" button
  └── "Already have account? Login"

/(tabs)/
  ├── Home (placeholder)
  ├── Documents (placeholder)
  └── Profile (placeholder)
```

#### Day 5: Integration Testing (4-6 hours)

**Test Flow:**
```bash
# 1. Start Expo
npx expo start

# 2. Test on your phone (install Expo Go app)
# Scan QR code

# 3. Manual testing:
- Open app → Should show login screen
- Tap "Sign up" → Create account
- Should redirect to tabs
- Close app, reopen → Should stay logged in
- Tap "Profile" → Logout → Should go to login
```

**Common Issues & Fixes:**
```bash
# Issue: "Unable to resolve module"
npm install
npx expo start -c

# Issue: Cognito error "Invalid client"
# → Check userPoolClientId in amplify config

# Issue: "Network request failed"
# → Check backend is running on correct IP
# → Use your local IP (not localhost) in mobile: http://192.168.1.X:8080
```

**Week 1-2 Success Criteria:**
- ✅ Spring Boot API running, can create user & login
- ✅ Expo app on your phone
- ✅ Can sign up, login, logout in mobile app
- ✅ JWT token stored and sent with requests
- ✅ GitHub repo with both frontend & backend committed

---

## Week 3-4: Document Capture (Mobile Camera)

### Week 3: Camera Integration

#### Day 1-2: Camera Screen (8-10 hours)

**Ask Claude Code:**
```
Create a document scanning screen in Expo:

1. app/(tabs)/scan.tsx
   - Camera view (full screen)
   - "Capture" button
   - Live document edge detection (bonus: use react-native-document-scanner-plugin)
   - Image preview after capture
   - "Retake" or "Use Photo" buttons

2. services/camera.ts
   - Request camera permissions
   - Handle photo capture
   - Compress image (reduce file size for upload)

3. components/DocumentScanner.tsx
   - Reusable scanner component
   - Shows camera with overlay
   - Handles edge detection visuals

Use expo-camera for camera access.
Handle permissions properly (ask user, show settings if denied).
```

**Expected UI:**
```
Camera Screen
├── [Camera View] (full screen)
├── [ ] Grid overlay (optional, helps alignment)
├── [○ Capture Button] (center bottom)
└── [< Back] (top left)

After Capture:
├── [Image Preview]
├── [Retake] [Use Photo] (bottom buttons)
```

#### Day 3-4: Image Upload (8-10 hours)

**Backend: S3 Integration**

**Ask Claude Code:**
```
Add S3 upload to Spring Boot:

1. Create DocumentController.java
   - POST /api/documents/upload
   - Accepts multipart file
   - Uploads to S3 bucket: chanakya-docs-dev
   - Returns S3 URL and document ID

2. Add AWS S3 dependency to pom.xml

3. Create S3Service.java
   - uploadFile(MultipartFile file, String userId) → String s3Url
   - Use AWS SDK v2
   - Generate unique filename: userId/timestamp_filename.jpg
   - Set proper content type

4. Create Document entity (MongoDB)
   - id, userId, s3Url, originalFilename, uploadedAt, status (PENDING, PROCESSING, COMPLETED)
```

**Frontend: Upload API**

**Ask Claude Code:**
```
Create upload functionality in Expo:

1. services/api.ts
   - uploadDocument(imageUri: string) → Promise<Document>
   - Use FormData to send image
   - Show upload progress
   - Handle errors

2. app/(tabs)/scan.tsx (update)
   - After "Use Photo", upload to API
   - Show upload progress bar
   - Navigate to document list on success
   - Show error toast on failure

3. Add loading states and error handling
```

**Test Upload:**
```bash
# Backend test
curl -X POST http://localhost:8080/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/test-invoice.jpg"
# → Should return document ID and S3 URL

# Check S3 bucket
aws s3 ls s3://chanakya-docs-dev/
# → Should see uploaded file
```

#### Day 5: Document List Screen (4-6 hours)

**Ask Claude Code:**
```
Create document list screen in Expo:

1. app/(tabs)/documents.tsx
   - Fetch documents from API: GET /api/documents
   - Display as list (FlatList)
   - Show: thumbnail, filename, date, status
   - Tap to view details
   - Pull to refresh

2. Backend: GET /api/documents endpoint
   - Return paginated list of user's documents
   - Include presigned S3 URLs (valid for 1 hour)
   - Filter by userId from JWT token

3. components/DocumentCard.tsx
   - Shows document thumbnail
   - Status badge (Pending, Processing, Completed)
   - Date uploaded
```

**Week 3-4 Success Criteria:**
- ✅ Mobile app has working camera
- ✅ Can capture photo of invoice
- ✅ Photo uploads to S3 via API
- ✅ See uploaded documents in list
- ✅ Works end-to-end on your phone

---

## Week 5-6: OCR Processing (AWS Textract)

### Week 5: Textract Integration

#### Day 1-2: Textract Service (8-10 hours)

**Ask Claude Code:**
```
Add AWS Textract integration to Spring Boot:

1. Create TextractService.java
   - analyzeDocument(String s3BucketName, String s3Key) → InvoiceData
   - Use AWS Textract detectDocumentText() API
   - Extract text from invoice image
   - Parse extracted text for:
     * GSTIN (regex: \d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1})
     * Invoice number
     * Invoice date
     * Total amount
     * Vendor name

2. Create InvoiceData DTO
   - gstin, invoiceNumber, invoiceDate, amount, vendorName
   - confidence scores for each field

3. Update Document entity
   - Add extractedData field (embedded InvoiceData)
   - Add ocrStatus (PENDING, PROCESSING, COMPLETED, FAILED)

4. Add endpoint: POST /api/documents/{id}/process
   - Trigger Textract analysis
   - Update document with extracted data
   - Return InvoiceData
```

**AWS IAM Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "textract:DetectDocumentText",
        "textract:AnalyzeDocument"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::chanakya-docs-dev/*"
    }
  ]
}
```

#### Day 3-4: Automatic OCR Processing (8-10 hours)

**Ask Claude Code:**
```
Make OCR processing automatic after upload:

1. Update DocumentController.upload()
   - After S3 upload, trigger OCR async
   - Return immediately (don't wait for OCR)
   - Use CompletableFuture or @Async

2. Create AsyncOcrProcessor.java
   - @Async method processDocumentOcr(String documentId)
   - Call TextractService
   - Update document status
   - Handle errors (retry 3 times with exponential backoff)

3. Frontend: Auto-refresh document status
   - Poll API every 5 seconds after upload
   - Update UI when OCR completes
   - Show extracted data

4. Error handling:
   - If OCR fails, show error to user
   - Allow manual retry button
```

#### Day 5: OCR Results UI (4-6 hours)

**Ask Claude Code:**
```
Create OCR results screen in Expo:

1. app/documents/[id].tsx - Document detail screen
   - Show document image
   - Display extracted data:
     * GSTIN: 27XXXXX1234X1ZX (confidence: 95%)
     * Invoice Number: INV-001 (confidence: 89%)
     * Date: 15/01/2025 (confidence: 92%)
     * Amount: ₹10,000 (confidence: 97%)
   - "Edit" button to manually correct
   - "Approve" button to confirm

2. components/InvoiceDataForm.tsx
   - Editable form with extracted data
   - Validation (GSTIN format, date, amount)
   - Save changes button

3. Backend: PUT /api/documents/{id}
   - Update extracted data
   - Mark as manually verified
```

---

### Week 6: Data Validation & Categorization

#### Day 1-2: Field Validation (8-10 hours)

**Ask Claude Code:**
```
Add validation and parsing logic:

1. Create ValidationService.java
   - validateGSTIN(String gstin) → boolean
   - validateInvoiceDate(String date) → LocalDate
   - validateAmount(String amount) → BigDecimal
   - Regex patterns for Indian formats

2. Enhance TextractService
   - Apply validation to extracted fields
   - Flag low-confidence fields (< 80%)
   - Suggest corrections based on patterns

3. Frontend validation in InvoiceDataForm
   - Real-time validation as user types
   - Show error messages
   - Disable submit if invalid
   - Use Zod schemas
```

#### Day 3-4: Document Categorization (8-10 hours)

**Ask Claude Code:**
```
Add document categorization feature:

1. Create enum DocumentType
   - SALES_INVOICE
   - PURCHASE_INVOICE
   - EXPENSE_RECEIPT
   - CREDIT_NOTE
   - DEBIT_NOTE

2. Update Document entity
   - Add documentType field
   - Add category (INCOME, EXPENSE)

3. Add endpoint: PUT /api/documents/{id}/categorize
   - Body: { "documentType": "SALES_INVOICE" }
   - Update document type
   - Return updated document

4. Frontend: Categorization UI
   - Radio buttons or dropdown
   - Show in document detail screen
   - Auto-categorize based on keywords (optional)
```

#### Day 5: Multi-tenant Support (4-6 hours)

**Ask Claude Code:**
```
Add tenant isolation (critical for multi-CA setup):

1. Add tenantId to User entity
   - When user signs up, assign tenantId
   - For now, tenantId = userId (solo CA)
   - Later: multiple users can have same tenantId

2. Create TenantContext.java
   - ThreadLocal to store current tenant ID
   - Extract from JWT token

3. Add TenantFilter.java
   - Intercepts all requests
   - Sets TenantContext from JWT
   - Clears after request

4. Update all MongoDB queries
   - Add findByTenantIdAndId()
   - Add findAllByTenantId()
   - Prevent cross-tenant data access

5. Test: Create 2 users, verify they can't see each other's documents
```

**Week 5-6 Success Criteria:**
- ✅ Upload invoice → OCR runs automatically
- ✅ See extracted data: GSTIN, amount, date
- ✅ Can manually edit wrong data
- ✅ Can categorize as sales/purchase
- ✅ Multi-tenant isolation working (different users can't see each other's data)

---

## Week 7-8: Web Dashboard (Expo Web)

### Week 7: Web Layout & Navigation

#### Day 1-2: Expo Web Setup (8-10 hours)

**Configure Expo for Web:**
```bash
cd frontend/chanakya-app

# Test web build
npx expo start --web
# → Should open browser at http://localhost:19006
```

**Ask Claude Code:**
```
Optimize Expo app for web (responsive design):

1. app/_layout.tsx
   - Detect platform (web vs mobile)
   - Different layouts for web (sidebar) vs mobile (tabs)
   - Use useBreakpointValue for responsive design

2. Create components/web/Sidebar.tsx
   - Navigation menu for web
   - Logo, menu items, user profile
   - Collapse on mobile

3. app/(web)/dashboard/layout.tsx
   - Sidebar + content area layout
   - Header with search, notifications
   - Responsive grid

4. Update existing screens for web:
   - Make DocumentCard wider on web
   - Use data tables instead of FlatList
   - Better use of large screens
```

#### Day 3-4: Document Management Dashboard (8-10 hours)

**Ask Claude Code:**
```
Build CA staff dashboard for web:

1. app/(web)/dashboard/documents.tsx
   - Data table with columns:
     * Thumbnail
     * Client Name
     * Document Type
     * Date Uploaded
     * OCR Status
     * Amount
     * Actions (View, Edit, Delete)
   - Filters: Date range, status, type
   - Search by client/invoice number
   - Sort by columns

2. Use a data table library:
   - react-native-table-component (for React Native)
   - Or create custom table with FlatList

3. Bulk operations:
   - Select multiple documents
   - Bulk approve
   - Bulk categorize
   - Export to Excel

4. Pagination:
   - 20 documents per page
   - Previous/Next buttons
   - Page numbers
```

#### Day 5: Document Approval Workflow (4-6 hours)

**Ask Claude Code:**
```
Add approval workflow for CA staff:

1. Add status field to Document
   - PENDING_REVIEW (after OCR)
   - APPROVED
   - REJECTED
   - NEEDS_CORRECTION

2. Backend: PUT /api/documents/{id}/approve
   - Mark document as approved
   - Log who approved and when

3. Backend: PUT /api/documents/{id}/reject
   - Mark as rejected
   - Require rejection reason
   - Notify client (future: WhatsApp)

4. Frontend: Approval UI
   - Show pending documents prominently
   - Quick approve/reject buttons
   - Bulk approval
   - Rejection reason modal
```

---

### Week 8: Basic GST Forms

#### Day 1-3: GSTR-1 Form (12-15 hours)

**Ask Claude Code:**
```
Create basic GSTR-1 form (B2B invoices):

1. Backend: Create GSTRController.java
   - GET /api/gstr/1/{month}/{year} - Get GSTR-1 data
   - POST /api/gstr/1/generate - Generate GSTR-1 from documents

2. Backend: Create GSTRService.java
   - Fetch approved SALES_INVOICE documents for month
   - Group by GSTIN (recipient)
   - Calculate totals: taxable value, CGST, SGST, IGST
   - Return GSTR-1 format data

3. Frontend: app/(web)/gstr/gstr1.tsx
   - Month/Year selector
   - Generate button
   - Show table: GSTIN, Invoice Number, Date, Taxable Value, Tax
   - Calculate totals
   - Export to Excel button

4. Excel export:
   - Use a library like xlsx or exceljs
   - Format as GSTR-1 template
   - Download file
```

**GSTR-1 Simplified Format:**
```
Month: January 2025

B2B Invoices:
| GSTIN | Invoice No | Date | Taxable Value | CGST | SGST | Total |
|-------|-----------|------|---------------|------|------|-------|
| 27... | INV-001   | 15/01| 10,000       | 900  | 900  | 11,800|
| 27... | INV-002   | 20/01| 5,000        | 450  | 450  | 5,900 |

Totals: ₹15,000 taxable, ₹1,350 CGST, ₹1,350 SGST
```

#### Day 4-5: Notifications (4-6 hours)

**Ask Claude Code:**
```
Add WhatsApp/SMS notifications:

1. Create NotificationService.java
   - Use AWS SNS for SMS
   - sendSMS(String phoneNumber, String message)
   - For WhatsApp: Use Twilio API (get free trial account)

2. Add notification preferences to User entity
   - phoneNumber
   - enableSMS
   - enableWhatsApp

3. Send notification scenarios:
   - Document uploaded by client → Notify CA
   - Document processed (OCR done) → Notify CA
   - Deadline approaching (5 days) → Notify CA + Client

4. Frontend: Notification settings
   - app/(tabs)/profile/notifications.tsx
   - Toggle SMS/WhatsApp
   - Set phone number
   - Test notification button
```

**Week 7-8 Success Criteria:**
- ✅ Web dashboard accessible at localhost:19006
- ✅ CA can view all client documents in table
- ✅ Can approve/reject documents
- ✅ Can generate basic GSTR-1 report
- ✅ Can export to Excel
- ✅ SMS/WhatsApp notifications working

---

## Week 9-10: Refinement & Testing

### Week 9: Bug Fixes & Polish

#### Day 1-2: End-to-End Testing (8-10 hours)

**Test Complete Flow:**
```
1. Client Journey (Mobile):
   - Sign up as client
   - Upload 5 invoices (scan with camera)
   - Wait for OCR processing
   - Edit any wrong data
   - Verify approved status

2. CA Journey (Web):
   - Login as CA
   - See 5 documents in dashboard
   - Review extracted data
   - Approve all
   - Generate GSTR-1 report
   - Export to Excel
   - Verify calculations

3. Edge Cases:
   - Poor quality image (blurry)
   - Non-invoice document (receipt)
   - Duplicate upload
   - Network failure during upload
   - JWT token expiry during session
```

**Create Bug List:**
```markdown
# Bugs Found
- [ ] OCR confidence < 50% → show warning
- [ ] Amount extraction fails on comma formatting
- [ ] Mobile UI breaks on iPad
- [ ] Excel export: date format wrong
- [ ] Notification: phone number validation missing
```

#### Day 3-5: Fix Critical Bugs (12-15 hours)

**Priority:**
1. **Critical** (blocks usage): OCR failures, auth issues, data loss
2. **High** (bad UX): UI crashes, wrong calculations, export errors
3. **Medium** (annoying): Loading states, error messages, validation
4. **Low** (nice-to-have): Animations, icons, colors

**Ask Claude Code to help fix bugs systematically.**

---

### Week 10: User Experience Polish

#### Day 1-2: Loading States & Error Handling (8-10 hours)

**Ask Claude Code:**
```
Improve UX with proper loading and error states:

1. Add loading skeletons:
   - Document list: Show skeleton cards while loading
   - OCR processing: Show progress indicator
   - Form submission: Disable button, show spinner

2. Better error messages:
   - Network errors: "Can't connect. Check internet."
   - Auth errors: "Session expired. Please login again."
   - Upload errors: "Upload failed. Try again?"
   - OCR errors: "Can't read document. Try better lighting."

3. Empty states:
   - No documents: "Upload your first invoice"
   - No results: "No documents found. Try different filter."

4. Success feedback:
   - Toast notifications: "Document uploaded ✓"
   - Inline success: "Saved!" (with checkmark)
   - Confetti on first approval (fun touch!)
```

#### Day 3-4: Performance Optimization (8-10 hours)

**Backend Optimization:**
```
1. Add caching:
   - Cache user info (avoid Cognito calls)
   - Cache document list (5 min TTL)
   - Use Spring @Cacheable

2. Database indexing:
   - Index: { tenantId: 1, uploadedAt: -1 }
   - Index: { tenantId: 1, status: 1 }
   - Index: { tenantId: 1, documentType: 1 }

3. Reduce API payload:
   - Don't send full image URLs in list
   - Paginate results (20 per page)
   - Use DTOs to exclude unused fields

4. Background jobs:
   - Move OCR to async queue (if not already)
   - Don't block upload response
```

**Frontend Optimization:**
```
1. Image optimization:
   - Compress images before upload (80% quality)
   - Use thumbnails in list view
   - Lazy load images

2. Reduce re-renders:
   - Memoize components (React.memo)
   - Use useCallback for handlers
   - Optimize FlatList (getItemLayout)

3. Bundle size:
   - Check bundle: npx expo export --dump-assetmap
   - Remove unused dependencies
   - Tree-shake imports
```

#### Day 5: Deployment Preparation (4-6 hours)

**Backend Deployment:**
```bash
# 1. Build Docker image
cd backend
docker build -t chanakya-api:v1 .

# 2. Test locally
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=dev \
  -e AWS_REGION=ap-south-1 \
  chanakya-api:v1

# 3. Deploy to AWS App Runner (easiest) or EC2
# Follow AWS App Runner guide: https://docs.aws.amazon.com/apprunner/
```

**Frontend Build:**
```bash
cd frontend/chanakya-app

# 1. Test production build (web)
npx expo export:web
# → Creates web-build/ folder
# → Deploy to S3 + CloudFront or Vercel

# 2. Build mobile app (later in Week 11)
eas build --platform android --profile preview
```

**Week 9-10 Success Criteria:**
- ✅ All critical bugs fixed
- ✅ Smooth end-to-end flow (no crashes)
- ✅ Good loading states and error messages
- ✅ Fast performance (<2s API response)
- ✅ Backend deployed to cloud (accessible via URL)
- ✅ Web app deployed (can share link)

---

## Week 11-12: Pilot Onboarding

### Week 11: Prepare for Pilots

#### Day 1-2: Documentation (8-10 hours)

**Create User Guides:**

**1. Client Quick Start (Mobile):**
```markdown
# How to Upload Invoices

1. Download "Chanakya" app from [link]
2. Sign up with email
3. Tap "Scan Invoice"
4. Point camera at invoice
5. Tap capture
6. Review extracted data
7. Submit

Done! Your CA will be notified.
```

**2. CA Quick Start (Web):**
```markdown
# How to Review Documents

1. Go to https://chanakya-app.com
2. Login with email
3. See all client documents
4. Click "Review" on pending
5. Verify GSTIN, amount, date
6. Click "Approve" or "Edit"

Generate GSTR-1:
1. Click "GST Returns" → "GSTR-1"
2. Select month
3. Click "Generate"
4. Download Excel
```

**3. Video Tutorials:**
- Record 2-min video: Mobile app upload
- Record 5-min video: Web dashboard tour
- Use Loom or OBS Studio

#### Day 3-4: Onboarding 2-3 CAs (8-10 hours)

**Onboarding Checklist (Per CA):**
```
□ Schedule 30-min call
□ Understand their workflow
□ Create their account (tenantId = firm name)
□ Walk through web dashboard
□ Add 2-3 test documents
□ Show GSTR-1 generation

□ Send client invite links
□ Help 5 clients install mobile app
□ Upload 10-20 real invoices
□ Review extracted data together
□ Fix any obvious bugs immediately

□ Set up notifications (WhatsApp/SMS)
□ Schedule weekly check-in calls
□ Create feedback form
```

**Feedback Form (Google Forms):**
```
1. How easy was it to upload documents? (1-5)
2. Was OCR accuracy good? (% correct)
3. What's most frustrating?
4. What's missing?
5. Would you pay ₹3000/month for this?
6. What price would be fair?
```

#### Day 5: Monitor Usage (4-6 hours)

**Add Analytics:**
```
1. Backend logging:
   - Track: uploads, OCR success rate, approvals
   - Log to CloudWatch
   - Set up dashboards

2. Frontend analytics:
   - Use Firebase Analytics or Mixpanel
   - Track: screen views, button clicks, errors
   - Monitor crash rate

3. Business metrics:
   - Daily active users
   - Documents uploaded per CA
   - Time from upload to approval
   - GSTR-1 exports generated
```

---

### Week 12: Iterate Based on Feedback

#### Day 1-3: High-Priority Fixes (12-15 hours)

**Common Pilot Feedback:**

1. **"OCR gets GSTIN wrong often"**
   - Improve regex patterns
   - Add manual correction hints
   - Train on more samples

2. **"Need to edit date format"**
   - Support DD/MM/YYYY and DD-MM-YYYY
   - Add date picker

3. **"Want to add notes to invoices"**
   - Add notes field to Document
   - Show in detail view

4. **"Export should have more details"**
   - Add vendor name to Excel
   - Add HSN codes (future)
   - Include totals by tax rate

**Ask Claude Code to implement top 3 requests.**

#### Day 4-5: Prepare for Next Phase (4-6 hours)

**Collect Learnings:**
```markdown
# What Worked
- Mobile document capture is loved
- OCR saves time (even with errors)
- Web dashboard is intuitive

# What Didn't Work
- Reconciliation feature not needed yet (defer!)
- Payment tracking: CAs don't care about this
- Construction module: too niche

# Next Features (Based on Feedback)
1. Bulk upload (web): CA uploads 50 PDFs
2. Email forwarding: client@chanakya.app → auto-upload
3. Tally export: Direct CSV for Tally import
4. Better search: by amount, date range

# Pricing Insights
- CAs willing to pay ₹2500-4000/month
- Want per-client pricing (₹100/client/month)
- Prefer annual billing (discount)
```

**Decide:**
- Continue with current 3 CAs?
- Expand to 5-10 CAs (Week 13-16)?
- Build feature X next? Or Y?

**Week 11-12 Success Criteria:**
- ✅ 2-3 CAs onboarded and using daily
- ✅ 50+ real invoices processed
- ✅ Feedback collected (survey + calls)
- ✅ Top 3 issues fixed
- ✅ Clear roadmap for next 12 weeks
- ✅ Decision: Continue or pivot?

---

## Post-Week 12: What's Next?

### Option A: Scale (Week 13-24)

**If CAs are happy and willing to pay:**

**Week 13-16: Onboard 10 CAs**
- Build referral program
- Improve onboarding flow
- Add billing (Razorpay integration)

**Week 17-20: Tally Integration**
- Research Tally TDL
- Build CSV export for Tally
- Test with CAs

**Week 21-24: Reconciliation (if needed!)**
- Only build if CAs request it
- Start simple: Books vs GSTR-2A matching
- Defer AI/ML

### Option B: Pivot (Week 13-16)

**If feedback reveals different problem:**

**Example:** "CAs don't care about documents. They want payment tracking."
- Pivot to payment tracking SaaS
- Reuse auth, user management, dashboard
- Build invoice generation + payment links

**Example:** "Builders love this more than CAs."
- Pivot to construction-focused product
- Add project management features
- Target builders directly

### Option C: Stop (Week 13)

**If no one is willing to pay or use:**
- Don't force it!
- Learnings are valuable
- Share your experience (blog post)
- Try different idea

---

## 📊 Weekly Time Tracking

**Track your hours to avoid burnout:**

```markdown
# Week 1 Log
| Day | Hours | Tasks | Notes |
|-----|-------|-------|-------|
| Mon | 8h    | Spring Boot setup | Smooth |
| Tue | 10h   | Cognito config | Tricky, many errors |
| Wed | 6h    | API endpoints | Fast with Claude |
| Thu | 9h    | Testing, fixes | Found JWT bug |
| Fri | 7h    | Expo setup | Easier than expected |
| Sat | 4h    | Login UI | Polish |
| Sun | 0h    | Rest | Important! |

Total: 44h (within 40-50h target) ✓
```

**Burnout Indicators:**
- Working >10h/day regularly
- Not taking breaks
- Dreading opening code
- Fighting with tech instead of building

**If burned out:**
- Take 2-3 days off completely
- Reduce scope (cut features)
- Ask for help (forums, Discord, Claude)

---

## 🎯 Key Success Metrics (Track Weekly)

```markdown
# Week 12 Metrics

Technical:
- [ ] Uptime: 99%+ (no crashes)
- [ ] API response: <2 seconds
- [ ] OCR accuracy: >80%
- [ ] Mobile app: <5MB size

Usage:
- [ ] 3 CAs onboarded
- [ ] 50+ documents uploaded
- [ ] 10+ GSTR-1 exports
- [ ] Daily active users: 5-10

Business:
- [ ] 1-2 CAs willing to pay
- [ ] Pricing validated (₹3K/month)
- [ ] Feedback NPS: >7/10
- [ ] Feature requests: 5-10

Personal:
- [ ] Learned: Spring Boot, Expo, AWS
- [ ] GitHub: 100+ commits
- [ ] Network: 3 CA friends
- [ ] Confidence: Can build SaaS solo!
```

---

## 🛠️ Tools & Resources

**Development:**
- IntelliJ IDEA Community Edition (Java)
- VS Code (Expo/TypeScript)
- Postman (API testing)
- MongoDB Compass (database GUI)

**Design:**
- Figma (UI mockups) - free tier
- Excalidraw (diagrams)
- Coolors (color palettes)

**Learning:**
- Spring Boot docs: spring.io
- Expo docs: docs.expo.dev
- AWS Textract: aws.amazon.com/textract
- GST resources: gst.gov.in

**Community:**
- Stack Overflow (coding questions)
- Reddit: r/SaaS, r/startups
- Discord: Expo, Spring Boot servers
- Twitter: #buildinpublic (share journey!)

---

## 📝 Final Checklist

**Before Week 1:**
- [ ] AWS account created, billing alert set
- [ ] 1-2 CA partners confirmed
- [ ] Development tools installed
- [ ] GitHub repo created
- [ ] Calendar blocked (8h/day, 12 weeks)

**By Week 6:**
- [ ] Mobile app: Camera + Upload works
- [ ] Backend: OCR processing works
- [ ] Can show demo to CA partners

**By Week 12:**
- [ ] 2-3 CAs using daily
- [ ] 50+ real documents processed
- [ ] Feedback collected
- [ ] Decision: Continue or pivot?

---

**You've got this! Building solo is hard but incredibly rewarding. Ship fast, get feedback, iterate. Good luck! 🚀**

---

*Questions? Issues? Use Claude Code to help debug, implement, and iterate. This plan is a guide, not gospel. Adapt as you learn. The best feature is the one your customers actually use.*
