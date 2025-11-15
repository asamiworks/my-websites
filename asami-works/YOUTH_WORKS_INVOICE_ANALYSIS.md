# Youth-Works Invoice System - Comprehensive Analysis Report

## Executive Summary

The youth-works project implements a sophisticated **Local Invoice System** built with Next.js 15, featuring:
- Automated invoice generation for multiple clients
- Advanced payment tracking with difference management
- PDF generation with customizable templates
- Dashboard with statistics and analytics
- Client management system
- Configurable invoice date settings

**Tech Stack**: Next.js 15, React 18, TypeScript, Tailwind CSS, date-fns, @react-pdf/renderer, archiver

---

## 1. Dashboard Structure & Layout

### Main Dashboard (`/src/app/page.tsx`)

The dashboard serves as the central hub with four key sections:

#### 1.1 Statistics Cards (4 metrics)
```
- Activated Clients Count
- Current Month Invoices
- Current Month Total Billing
- System Status (Health indicator)
```

**Implementation Pattern**:
```tsx
- Grid layout (1 col mobile, 2 col tablet, 4 col desktop)
- White cards with shadow effects
- Large, bold typography for numbers
- Responsive padding/spacing
```

#### 1.2 Quick Actions Section
Three primary action buttons:
1. **New Client Registration** → `/clients/new`
2. **Bulk Invoice Generation** → `/invoices/generate`
3. **Company Settings** → `/settings/company`

**Design**: Grid layout, bordered buttons with hover effects

#### 1.3 Recent Activity Section
Displays latest 5 invoices with:
- Client name
- Invoice number & issue date
- Total amount (formatted as JPY)
- Status indicator (paid/overdue/issued/cancelled)

**Features**:
- Automatic sorting by creation date (newest first)
- "View All" link for full invoice list
- Hover effect on rows

### Navigation Bar (Shared Across Pages)
```
- Logo/Title: "ローカル請求書システム" (Local Invoice System)
- Navigation Links: Dashboard, Client Management, Invoice Management, Settings
- Active page highlighted with background color
- Consistent styling across all pages
```

---

## 2. Invoice Management System

### 2.1 Invoice List Page (`/src/app/invoices/page.tsx`)

**Primary Features**:

#### Data Table
- Sortable columns:
  - Checkbox (select multiple)
  - Invoice Number + Issue Date
  - Client Name
  - Billing Month (YYYY年MM月 format)
  - Total Amount (JPY currency)
  - Status Badge
  - Actions (Save PDF, Mark as Paid)

#### Status Badges
```
- issued (blue): 発行済み
- paid (green): 支払済み
- overdue (red): 期限切れ
- cancelled (gray): キャンセル
```

#### Bulk Operations
1. **Bulk PDF Download**: Select multiple invoices → Download as ZIP
2. **Bulk Delete**: Select multiple invoices → Delete with confirmation
3. **Select All**: Toggle to select all invoices at once

#### Modals
1. **Payment Confirmation Modal**:
   - Invoice number & client name
   - Invoice amount display
   - Input field for actual paid amount
   - Real-time calculation of overpayment/underpayment
   - Color-coded indicators (green=exact, blue=overpaid, red=underpaid)

2. **Delete Confirmation Modal**:
   - Warning banner about irreversible deletion
   - Includes PDF files
   - Confirms count of items to delete

#### Statistics Cards (Bottom Section)
```
- Total Invoice Count
- Current Month Invoices
- Total Billing Amount (all invoices)
```

**Error Handling**:
- Error banner at top if data fetch fails
- Empty state message with instructions
- Loading state with skeleton/text

---

### 2.2 Invoice Generation Page (`/src/app/invoices/generate/page.tsx`)

**Workflow**:
1. **Month Selection** → Input field (HTML5 month type)
2. **Preview Loading** → Loads estimated invoices without saving
3. **Date Preview** → Shows closing, issue, and due dates
4. **Manual Review** → Table of all invoices to be generated
5. **Confirmation** → One-click generation with warning dialog
6. **Bulk Download** → Download all generated PDFs as ZIP

#### Date Preview Section
Three informational cards (color-coded):
- **Closing Date** (blue): 締め日
- **Issue Date** (green): 発行日
- **Due Date** (orange): 支払い期限

**Features**:
- Edit button to manually adjust dates (inline date pickers)
- Format: "yyyy年MM月dd日 (曜日)"
- Link to settings page for default configuration

#### Preview Table
Shows estimated invoices with:
- Client Name
- Billing Period (from date ~ to date)
- Management Fee (right-aligned, JPY)
- Adjustment Amount (with +/- color coding)
- Invoice Total (bold, right-aligned)
- Notes (multi-month billing, yearly discount, production costs, etc.)

**Table Footer**:
- Total billing amount across all invoices
- Recalculates dynamically

#### Generation Result
Success banner shows:
- Count of successful generations
- Count of failures
- Detailed error list if any
- Action buttons: Download ZIP, View Invoice List

---

## 3. Key Components & UI Patterns

### 3.1 Common Components

#### Status Badge Component
```tsx
{
  issued: { label: '発行済み', class: 'bg-blue-100 text-blue-800' },
  paid: { label: '支払済み', class: 'bg-green-100 text-green-800' },
  overdue: { label: '期限切れ', class: 'bg-red-100 text-red-800' },
  cancelled: { label: 'キャンセル', class: 'bg-gray-100 text-gray-800' },
}
```

#### Currency Formatter
```tsx
new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
}).format(amount)
// Output: "¥123,456"
```

#### Date Formatter
```tsx
format(new Date(dateString), 'yyyy年MM月dd日')
// Output: "2025年11月10日"
```

### 3.2 Layout Patterns

#### Page Container
```tsx
<div className="min-h-screen bg-gray-50">
  <nav>...</nav>
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    ...
  </main>
</div>
```

#### Card Containers
```tsx
<div className="bg-white rounded-lg shadow p-6">
  ...
</div>
```

#### Grid Layouts
- Statistics: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Quick Actions: `grid grid-cols-1 md:grid-cols-3 gap-4`
- Date Preview: `grid grid-cols-1 md:grid-cols-3 gap-4`

---

## 4. Data Models & Types

### 4.1 Invoice Type
```typescript
interface Invoice {
  id: string;
  invoiceNumber: string;        // INV-YYYYMM-XXX
  clientId: string;
  clientName: string;
  billingYear: number;
  billingMonth: number;
  issueDate: string;            // ISO8601
  dueDate: string;              // ISO8601
  managementFee: number;
  quantity?: number;            // 月数（複数月請求の場合）
  feeStartDate: string;         // ISO8601
  feeEndDate: string;           // ISO8601
  adjustmentAmount: number;     // 制作費、過不足金の調整
  subtotal: number;
  taxAmount: number;            // 現在は常に0（免税事業者）
  totalAmount: number;
  pdfPath: string;
  status: 'issued' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;

  // Payment tracking
  paidAmount?: number;
  paymentDifference?: number;   // totalAmount - paidAmount
  paidDate?: string;

  createdAt: string;
  updatedAt: string;
}
```

### 4.2 Client Type
```typescript
interface Client {
  id: string;
  clientName: string;
  clientType?: 'corporate' | 'individual';
  siteName: string;
  websiteType?: 'homepage' | 'landingpage';
  siteUrl?: string;
  postalCode: string;
  address1: string;
  address2?: string;

  // Production info
  sitePublishDate: string;      // Billing start date
  initialProductionCost?: number;
  hasInvoicedProduction: boolean;

  // Billing info
  billingFrequency: 'monthly' | 'yearly';
  currentManagementFee: number;
  feeChangeHistory: FeeChangeHistory[];

  // Payment tracking
  lastPaidPeriod?: string;      // YYYY-MM
  accumulatedDifference: number; // Payment difference adjustment

  // Contract info
  contractStartDate: string;
  contractEndDate?: string;

  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.3 Company Settings
```typescript
interface InvoiceSettings {
  closingDayType: 'end_of_month' | 'specific_day';
  closingDay?: number;

  issueDayType: 'next_day' | 'first_of_next_month' | 'specific_day';
  issueDay?: number;

  dueDateType: 'end_of_issue_month' | 'days_after_issue' | 'specific_day';
  dueDateDays?: number;
  dueDateDay?: number;

  adjustDueDateForHolidays: boolean;
  showTaxRow?: boolean;
}
```

### 4.4 API Response Pattern
```typescript
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
```

---

## 5. API Routes & Operations

### 5.1 Invoice API Endpoints

#### GET `/api/invoices`
- Returns all invoices
- Response: `ApiResponse<Invoice[]>`
- Includes meta with total count

#### POST `/api/invoices/generate`
- Body: `{ targetMonth: "YYYY-MM", clientIds?: string[], customDates?: {...} }`
- Returns: `InvoiceGenerationResult`
- Creates invoices and marks as issued
- Updates client's lastPaidPeriod and accumulatedDifference

#### POST `/api/invoices/preview`
- Body: `{ targetMonth: "YYYY-MM", clientIds?: string[] }`
- Returns: Preview of invoices WITHOUT saving
- Used for review before generation

#### GET `/api/invoices/dates?targetMonth=YYYY-MM`
- Calculates invoice dates based on company settings
- Returns: `{ closingDate, issueDate, dueDate, settings }`

#### PATCH `/api/invoices/:id/status`
- Body: `{ status: string, paidAmount?: number }`
- Updates invoice status (issued → paid, overdue, cancelled)
- Calculates paymentDifference
- Updates client's accumulatedDifference

#### POST `/api/invoices/bulk-pdf`
- Body: `{ invoiceIds: string[] }`
- Generates PDFs via external script
- Returns ZIP file
- Filename: `invoices-YYYY-MM-DD.zip`

#### POST `/api/invoices/bulk-delete`
- Body: `{ invoiceIds: string[] }`
- Deletes invoices and associated PDF files
- Returns success/error counts

---

## 6. Business Logic & Calculations

### 6.1 Invoice Generation Logic (InvoiceService)

**Calculation Flow**:

```
1. Unpaid Months Calculation
   - For monthly billing: months since lastPaidPeriod
   - For yearly billing: always 1 (annual service month)

2. Management Fee
   - monthlyFee = client.currentManagementFee
   - totalFee = monthlyFee × unpaidMonths

3. Adjustment Amount
   - Production cost (if first invoice)
   - Prior payment difference (overpayment/underpayment)
   - Can be positive (add) or negative (subtract)

4. Subtotal = Management Fee + Adjustment Amount
5. Tax = 0 (tax-exempt business)
6. Total = Subtotal + Tax

7. Fee Period
   - Normally: previous month (1st ~ end)
   - If unpaid months > 1: extends back accordingly
   - Example: 2-month backlog → 2 months prior + current
```

**Invoice Number Generation**:
```
Format: INV-YYYYMM-XXX
Example: INV-202511-001
- YYYYMM: Billing year/month
- XXX: Sequential number for that month
```

### 6.2 Payment Tracking

**Payment Difference Calculation**:
```
paymentDifference = totalAmount - paidAmount

If paymentDifference > 0:
  → Overpaid (client credit)
  → Reduces next invoice amount

If paymentDifference < 0:
  → Underpaid (company shortfall)
  → Increases next invoice amount

If paymentDifference === 0:
  → Exact payment
```

**Client's accumulatedDifference** tracks cumulative differences:
- Updated when payment status changes to "paid"
- Reset after being applied to next invoice
- Carried forward if not fully adjusted

### 6.3 Date Calculations

**Holiday Support**:
- Adjusts due date backward if it falls on weekend/holiday
- 2025 holidays are hardcoded (could be externalized)

**Date Calculation Methods**:
```
Closing Date
├─ end_of_month: Last day of target month
└─ specific_day: Nth day of target month

Issue Date
├─ next_day: Day after closing date
├─ first_of_next_month: 1st of next month
└─ specific_day: Nth day of target month

Due Date
├─ end_of_issue_month: Last day of issue month
├─ days_after_issue: Nth day after issue date
└─ specific_day: Nth day of target month
```

---

## 7. Data Persistence

### 7.1 JSON Storage System

**Files Location**: `/data/` directory

**JSONStorage Class**:
- Read: Loads all data from file
- Write: Overwrites entire file
- Append: Adds single item
- FindById: Queries by ID
- Find: Filters by predicate
- UpdateById: Partial update
- DeleteById: Physical deletion
- Clear: Empties file

**Files Used**:
- `data/invoices.json` - All invoice records
- `data/clients.json` - Client information
- `data/company.json` - Company settings

---

## 8. PDF Generation

### 8.1 Technologies
- **Library**: @react-pdf/renderer (React JSX to PDF)
- **Font**: IPAex Mincho (Japanese support)
- **Design**: Minimal, professional template

### 8.2 PDF Generation Flow

```
1. Request: POST /api/invoices/bulk-pdf with invoiceIds
2. For each invoice ID:
   a. Fetch invoice data from storage
   b. Execute external script: scripts/generate-invoice-pdf.ts
   c. Returns: file path
   d. Read generated PDF file into buffer
   e. Add to ZIP archive with filename: {invoiceNumber}_{clientName}.pdf
3. Return ZIP as attachment
4. Client downloads ZIP file
```

### 8.3 PDF Template Features

**Layout**:
- A4 page size
- Minimal, clean design
- Professional typography

**Sections**:
1. Header: "請求書" title
2. Invoice metadata: Number, dates
3. Billing parties: From/To addresses
4. Itemized table: Fee description, period, amount
5. Summary: Subtotal, tax, total
6. Bank details for payment
7. Notes section

---

## 9. Features Implemented

### 9.1 Core Features

| Feature | Status | Details |
|---------|--------|---------|
| Invoice Generation | ✓ | Batch generation for multiple clients |
| Invoice Preview | ✓ | Review before saving |
| PDF Generation | ✓ | Customizable template, bulk download |
| Payment Tracking | ✓ | Amount, date, difference calculation |
| Payment Adjustment | ✓ | Auto-apply overpayment/underpayment |
| Client Management | ✓ | CRUD operations, fee tracking |
| Dashboard Analytics | ✓ | Statistics, recent activity |
| Configurable Dates | ✓ | Closing, issue, due date settings |
| Holiday Support | ✓ | Adjusts due date for weekends/holidays |
| Multi-month Billing | ✓ | Handles backlogs automatically |
| Production Cost | ✓ | One-time charge on first invoice |
| Yearly Billing | ✓ | Different calculation from monthly |

### 9.2 Advanced Features

| Feature | Details |
|---------|---------|
| Fee History | Track fee changes over time per client |
| Bulk Operations | Select multiple invoices for actions |
| Payment Difference Tracking | Automatic overpayment/underpayment management |
| Status Management | issued, paid, overdue, cancelled states |
| Error Reporting | Generation failures logged with details |
| Flexible Date Settings | Multiple configuration options per date type |

---

## 10. Reusable Code for Asami-Works

### 10.1 Architecture Components to Adapt

#### 1. Dashboard Layout Pattern
```tsx
// Location: /src/app/page.tsx
// Reusable: Main dashboard grid, statistics cards, quick actions
// Adaptable: Change metrics, adjust colors/branding, add custom sections
```

#### 2. API Response Pattern
```typescript
// Location: /src/lib/types/system.ts (ApiResponse<T>)
// Reusable: Standard response format across all endpoints
// Benefit: Consistent error handling, type safety
```

#### 3. JSON Storage Service
```typescript
// Location: /src/lib/data/jsonStorage.ts
// Reusable: CRUD operations, file-based persistence
// Benefit: No database setup, simple file management
// Note: Suitable for small-scale data; consider database for scale
```

#### 4. Form Handling Pattern
```tsx
// Uses: React Hook Form + Zod validation
// Pattern: Client form validation, error messages
// Locations: Client pages, settings pages
```

#### 5. Data Formatting Utilities
```tsx
// Currency: Intl.NumberFormat for JPY
// Dates: date-fns library with custom formats
// Location: /src/lib/utils/dateUtils.ts
// Files: Various formatters for consistent display
```

#### 6. Modal Component Pattern
```tsx
// Pattern: Fixed overlay, centered content, action buttons
// Locations: Payment confirmation, delete confirmation
// Features: Backdrop click handling, keyboard support
```

#### 7. Table Component Pattern
```tsx
// Features: Checkbox selection, sorting hints, status badges
// Responsive: Handles mobile/tablet/desktop
// Interactions: Bulk selection, individual selection
```

#### 8. Service Classes
```typescript
// Pattern: Static methods, dependency injection
// Classes: InvoiceService, ClientService, CompanyService
// Benefits: Testable, reusable, separation of concerns
```

### 10.2 Specific Modules to Reuse

#### Invoice Service Patterns
- **Billing Calculation Logic**: Multi-month billing, production costs, payment differences
- **Status Management**: Status transitions and related data updates
- **Preview Functionality**: Non-destructive generation preview

#### Date Utilities
- **Holiday Handling**: Weekend/holiday detection and adjustment
- **Date Calculations**: Multiple date type configurations
- **Format Conversions**: ISO8601 ↔ Display formats

#### Type Definitions
- **InvoiceSettings**: Complex configuration structure (portable)
- **Generic ApiResponse**: Can be used across projects
- **Common Enums**: Status types, frequency types

### 10.3 UI/UX Patterns

#### Navigation Bar
- Consistent top navigation
- Active state highlighting
- Responsive hamburger (if added)

#### Status Badges
- Color-coded status indicators
- Standardized styling
- Extensible for custom statuses

#### Statistics Cards
- Metric display pattern
- Number formatting
- Responsive grid layout

#### Data Tables
- Header with sorting hints
- Checkbox for bulk selection
- Hover states
- Mobile-responsive overflow

### 10.4 Implementation Tips for Adaptation

1. **Color Scheme**:
   - Current: Blue/Green/Red for actions/success/danger
   - Adapt: Match asami-works branding

2. **Japanese Localization**:
   - Already in place with good date-fns locale support
   - Date formatting examples can be reused
   - Currency formatting (JPY) example applicable

3. **Responsive Design**:
   - Tailwind grid/flex patterns are portable
   - Max-width container pattern: `max-w-7xl`
   - Padding/spacing scales: `px-4 sm:px-6 lg:px-8`

4. **Error Handling**:
   - Global error banner pattern
   - Form-level validation with React Hook Form
   - API error response handling

5. **Loading States**:
   - Conditional rendering patterns
   - Loading state messages
   - Skeleton screens (not yet implemented but pattern is simple)

---

## 11. File Structure Reference

```
youth-works/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Dashboard
│   │   ├── invoices/
│   │   │   ├── page.tsx               ← Invoice list
│   │   │   └── generate/
│   │   │       └── page.tsx           ← Invoice generation
│   │   ├── clients/
│   │   │   ├── page.tsx               ← Client list
│   │   │   ├── new/
│   │   │   │   └── page.tsx           ← Client form
│   │   │   └── [id]/
│   │   │       └── page.tsx           ← Client detail
│   │   ├── settings/
│   │   │   ├── page.tsx               ← Settings home
│   │   │   └── company/
│   │   │       └── page.tsx           ← Company settings
│   │   └── api/
│   │       ├── invoices/
│   │       │   ├── route.ts           ← GET invoices
│   │       │   ├── generate/
│   │       │   │   └── route.ts       ← POST generate
│   │       │   ├── preview/
│   │       │   │   └── route.ts       ← POST preview
│   │       │   ├── dates/
│   │       │   │   └── route.ts       ← GET dates
│   │       │   ├── [id]/
│   │       │   │   ├── route.ts       ← GET/DELETE single
│   │       │   │   ├── status/
│   │       │   │   │   └── route.ts   ← PATCH status
│   │       │   │   └── pdf/
│   │       │   │       └── route.ts   ← POST single PDF
│   │       │   ├── bulk-pdf/
│   │       │   │   └── route.ts       ← POST bulk PDF
│   │       │   └── bulk-delete/
│   │       │       └── route.ts       ← POST bulk delete
│   │       ├── clients/
│   │       │   ├── route.ts           ← GET/POST clients
│   │       │   └── [id]/
│   │       │       └── route.ts       ← GET/PATCH/DELETE
│   │       └── company/
│   │           └── route.ts           ← GET/POST company
│   ├── lib/
│   │   ├── types/
│   │   │   ├── index.ts               ← Type exports
│   │   │   ├── invoice.ts             ← Invoice types
│   │   │   ├── client.ts              ← Client types
│   │   │   ├── company.ts             ← Company types
│   │   │   └── system.ts              ← System types
│   │   ├── services/
│   │   │   ├── invoiceService.ts      ← Invoice logic
│   │   │   ├── clientService.ts       ← Client logic
│   │   │   └── companyService.ts      ← Company logic
│   │   ├── data/
│   │   │   └── jsonStorage.ts         ← Persistence layer
│   │   ├── utils/
│   │   │   └── dateUtils.ts           ← Date calculations
│   │   └── pdf/
│   │       ├── InvoiceTemplate.tsx    ← PDF template
│   │       └── pdfConfig.ts           ← PDF styling
│   └── components/
│       ├── clients/                   ← Client components
│       ├── invoices/                  ← Invoice components
│       └── ...
├── data/
│   ├── invoices.json
│   ├── clients.json
│   └── company.json
└── public/
    └── fonts/
        └── ipaexm.ttf                 ← Japanese font
```

---

## 12. Key Insights & Observations

### 12.1 Strengths

1. **Clean Architecture**: Separation of services, types, and data layers
2. **Type Safety**: Comprehensive TypeScript interfaces
3. **Flexible Configuration**: Multiple date configuration options
4. **Smart Calculations**: Handles complex billing scenarios
5. **Error Handling**: Comprehensive validation and error reporting
6. **User Experience**: Modal confirmations, previews, bulk operations
7. **Responsive Design**: Mobile-first Tailwind CSS approach
8. **Localization**: Japanese formatting throughout

### 12.2 Potential Improvements

1. **Data Validation**: Could use Zod schema validation more extensively
2. **Caching**: No caching strategy for frequently accessed data
3. **Testing**: No unit/integration tests visible
4. **Logging**: Could benefit from structured logging system
5. **Scalability**: JSON file storage has limitations at scale
6. **Backup**: No automatic backup mechanism
7. **Audit Trail**: No audit log for changes

### 12.3 Design Patterns Used

- **Service Pattern**: Business logic in dedicated services
- **Repository Pattern**: JSONStorage abstraction
- **Factory Pattern**: Invoice generation from templates
- **Builder Pattern**: Complex invoice calculation
- **Observer Pattern**: React state management
- **MVC**: Next.js app router structure

---

## 13. Recommendations for Asami-Works

### 13.1 High Priority
1. **Adopt the Service Architecture**: InvoiceService pattern is clean and testable
2. **Use ApiResponse Pattern**: Consistent error handling across APIs
3. **Implement Date Utilities**: Reuse dateUtils.ts patterns
4. **Copy UI Components**: Tables, modals, cards are well-designed

### 13.2 Medium Priority
1. **Consider Dashboard Analytics**: Statistics cards pattern is effective
2. **Adapt Bulk Operations**: Select/delete patterns useful for data management
3. **Use JSONStorage for Prototyping**: Fast development without DB setup
4. **Implement Type Definitions**: Comprehensive types prevent runtime errors

### 13.3 Low Priority (Scale Later)
1. **Add Database**: Migrate from JSON files when scale demands
2. **Implement Caching**: Add Redis/memcached as data grows
3. **Add Audit Logging**: Track all changes for compliance
4. **Implement Testing**: Add Jest/Vitest when team grows

---

## Summary

The youth-works invoice system is a well-architected, feature-rich solution that demonstrates excellent React/Next.js patterns. Its modular design, comprehensive type safety, and business logic implementation make it an excellent reference for building similar systems in asami-works. The reusable components, services, and utilities can significantly accelerate development while maintaining code quality and consistency.

