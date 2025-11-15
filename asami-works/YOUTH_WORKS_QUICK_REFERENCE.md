# Youth-Works Invoice System - Quick Reference

## Key Files to Reference

### Core Pages
- **Dashboard**: `/src/app/page.tsx` (statistics, quick actions)
- **Invoice List**: `/src/app/invoices/page.tsx` (table, bulk ops, modals)
- **Invoice Generation**: `/src/app/invoices/generate/page.tsx` (workflow, preview)
- **Client Management**: `/src/app/clients/page.tsx` (CRUD operations)

### API Routes
- **Invoice Operations**: `/src/app/api/invoices/`
  - `route.ts` - GET invoices
  - `generate/route.ts` - POST generate
  - `preview/route.ts` - POST preview
  - `dates/route.ts` - GET dates
  - `bulk-pdf/route.ts` - POST bulk PDF
  - `bulk-delete/route.ts` - POST bulk delete

### Services & Utilities
- **InvoiceService**: `/src/lib/services/invoiceService.ts` (calculation logic)
- **Date Utilities**: `/src/lib/utils/dateUtils.ts` (holiday handling)
- **JSON Storage**: `/src/lib/data/jsonStorage.ts` (persistence)
- **Type Definitions**: `/src/lib/types/` (invoice, client, company types)

---

## Most Valuable Patterns to Reuse

### 1. Service Architecture Pattern
```typescript
// Pattern: Static service with dependency injection
class InvoiceService {
  private storage: JSONStorage<Invoice>;
  
  async generateForMonth(params): Promise<InvoiceGenerationResult> {
    // Business logic here
  }
}

// Benefits: Testable, reusable, clean separation
```

### 2. Type-Safe API Response
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { total?: number };
}

// Benefits: Consistent error handling across all endpoints
```

### 3. Modal Component Pattern
```tsx
{showPaymentModal && selectedInvoice && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 max-w-md">
      {/* Content */}
    </div>
  </div>
)}

// Benefits: Reusable modal structure, no external library needed
```

### 4. Table with Bulk Selection
```tsx
// Features:
- Individual checkbox per row
- Select-all checkbox in header
- Dynamic button visibility based on selection
- Confirmation modal for destructive actions
```

### 5. Currency & Date Formatting
```tsx
// Currency
new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' })

// Date
format(new Date(dateString), 'yyyy年MM月dd日')
```

---

## Quick Implementation Checklist

### For Asami-Works Dashboard
- [ ] Copy dashboard layout pattern (statistics cards + quick actions)
- [ ] Implement ApiResponse pattern for all endpoints
- [ ] Adapt navigation bar component
- [ ] Use date-fns with Japanese formatting
- [ ] Implement table with checkbox selection

### For Payment Tracking
- [ ] Study payment difference calculation logic
- [ ] Understand accumulated difference tracking
- [ ] Review status transition flow
- [ ] Adapt modal patterns for custom workflows

### For Data Management
- [ ] Review JSONStorage implementation
- [ ] Consider scaling strategy (JSON → Database)
- [ ] Study type definition patterns
- [ ] Implement similar service architecture

---

## File Locations (Absolute Paths)

```
/home/asamiworks/my-websites/youth-works/

Key Directories:
  src/app/                     - Pages & API routes
  src/lib/                     - Services, types, utils
  src/components/              - React components
  data/                        - JSON data files
  public/fonts/                - Japanese font (ipaexm.ttf)

Most Important Files:
  src/app/page.tsx                           ← Dashboard template
  src/app/invoices/page.tsx                  ← Invoice list template
  src/app/invoices/generate/page.tsx         ← Generation workflow
  src/lib/services/invoiceService.ts         ← Complex logic
  src/lib/types/invoice.ts                   ← Data models
  src/lib/data/jsonStorage.ts                ← Persistence layer
  src/lib/utils/dateUtils.ts                 ← Date utilities
```

---

## Dependencies to Consider

**Already in youth-works package.json:**
- `next` - Framework
- `react` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `date-fns` - Date manipulation
- `@react-pdf/renderer` - PDF generation
- `archiver` - ZIP creation
- `react-hook-form` - Form handling
- `zod` - Validation
- `uuid` - ID generation

---

## Performance Notes

1. **Data Loading**: Currently fetches all invoices on load (OK for small datasets)
2. **Table Rendering**: Uses React state, no virtualization (OK < 1000 rows)
3. **Date Calculations**: Calculated on-demand, no caching
4. **PDF Generation**: Executed in Node.js runtime (batch processing recommended)

---

## Security Considerations

1. **Input Validation**: Use Zod schemas for all API inputs
2. **Error Messages**: Don't expose internal errors to client
3. **Data Access**: Add authorization checks if multi-user
4. **File Operations**: Validate file paths before access

---

## Testing Recommendations

1. **Unit Tests**: Service calculation logic (Jest + ts-jest)
2. **Integration Tests**: API routes with mock storage
3. **E2E Tests**: Workflow scenarios (Playwright/Cypress)
4. **Date Edge Cases**: Holidays, month boundaries, leap years

---

## Documentation References

**Within Project:**
- `/README-KIRO.md` - Project setup
- Various `.md` files in root

**External:**
- Next.js App Router: https://nextjs.org/docs/app
- React Hook Form: https://react-hook-form.com/
- date-fns: https://date-fns.org/
- Tailwind CSS: https://tailwindcss.com/
- @react-pdf/renderer: https://react-pdf.org/

---

## Quick Copy-Paste Snippets

### Status Badge (Tailwind)
```tsx
{
  issued: { label: '発行済み', class: 'bg-blue-100 text-blue-800' },
  paid: { label: '支払済み', class: 'bg-green-100 text-green-800' },
  overdue: { label: '期限切れ', class: 'bg-red-100 text-red-800' },
  cancelled: { label: 'キャンセル', class: 'bg-gray-100 text-gray-800' },
}
```

### Page Container Layout
```tsx
<div className="min-h-screen bg-gray-50">
  <nav className="bg-white shadow-sm border-b">...</nav>
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">...</main>
</div>
```

### Statistics Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div className="bg-white rounded-lg shadow p-6">
    <div className="text-sm font-medium text-gray-500 mb-2">Label</div>
    <div className="text-3xl font-bold text-gray-900">Value</div>
  </div>
</div>
```

### Table with Checkboxes
```tsx
<table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3">
        <input type="checkbox" onChange={toggleSelectAll} />
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
        Header
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {items.map(item => (
      <tr key={item.id}>
        <td className="px-6 py-4">
          <input type="checkbox" onChange={() => toggleSelection(item.id)} />
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## Next Steps

1. **Review the Full Report**: Read YOUTH_WORKS_INVOICE_ANALYSIS.md for complete details
2. **Study Key Files**: Focus on InvoiceService and data models first
3. **Copy Patterns**: Start with simple UI patterns (buttons, cards, tables)
4. **Test the System**: Run youth-works locally to understand the workflow
5. **Adapt for Asami-Works**: Modify business logic to match your requirements

---

**Generated**: November 2024
**Analysis Depth**: Very Thorough
**Scope**: Complete invoice system examination
