# ローカル請求書システム 設計仕様書

## システム概要

### アーキテクチャ概要
```
┌─────────────────────────────────────────────────────────────┐
│                    ローカル請求書システム                      │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React/Next.js)                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Dashboard   │ │ Client Mgmt │ │ Invoice Gen │          │
│  │ UI          │ │ UI          │ │ UI          │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  API Layer (Next.js API Routes)                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ /api/       │ │ /api/       │ │ /api/       │          │
│  │ clients     │ │ invoices    │ │ company     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Client      │ │ Invoice     │ │ PDF         │          │
│  │ Service     │ │ Generator   │ │ Generator   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Data Access Layer                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ JSON File   │ │ File System │ │ Logger      │          │
│  │ Manager     │ │ Manager     │ │ Service     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Storage Layer                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ data/       │ │ output/     │ │ logs/       │          │
│  │ *.json      │ │ YYYY-MM/    │ │ *.log       │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│  Automation Layer                                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Cron Job    │ │ Scheduler   │ │ Backup      │          │
│  │ Runner      │ │ Service     │ │ Service     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## 技術スタック

### フロントエンド
- **Framework**: Next.js 15.x（App Router）
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Hooks (useState, useEffect)
- **Form Handling**: React Hook Form + Zod バリデーション

### バックエンド
- **Runtime**: Node.js 20.x
- **API**: Next.js API Routes
- **PDF Generation**: React-PDF (@react-pdf/renderer)
- **File System**: Node.js fs/promises
- **Schedule**: node-cron
- **Logger**: Winston または Pino

### データストレージ
- **Primary Storage**: JSON Files
- **File Structure**: ローカルファイルシステム
- **Backup**: rsync + external storage

## ディレクトリ構造

```
local-invoice-system/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── dashboard/
│   │   │   └── page.tsx             # メインダッシュボード
│   │   ├── clients/
│   │   │   ├── page.tsx             # クライアント一覧
│   │   │   ├── new/
│   │   │   │   └── page.tsx         # 新規クライアント作成
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # クライアント詳細
│   │   │       └── edit/
│   │   │           └── page.tsx     # クライアント編集
│   │   ├── invoices/
│   │   │   ├── page.tsx             # 請求書一覧
│   │   │   ├── generate/
│   │   │   │   └── page.tsx         # 請求書生成
│   │   │   └── [id]/
│   │   │       └── page.tsx         # 請求書詳細
│   │   ├── settings/
│   │   │   └── page.tsx             # システム設定
│   │   └── api/                     # API Routes
│   │       ├── clients/
│   │       │   ├── route.ts         # GET /api/clients, POST /api/clients
│   │       │   └── [id]/
│   │       │       └── route.ts     # GET/PUT/DELETE /api/clients/:id
│   │       ├── invoices/
│   │       │   ├── route.ts         # GET /api/invoices, POST /api/invoices
│   │       │   ├── generate/
│   │       │   │   └── route.ts     # POST /api/invoices/generate
│   │       │   └── [id]/
│   │       │       └── route.ts     # GET/PUT/DELETE /api/invoices/:id
│   │       ├── company/
│   │       │   └── route.ts         # GET/PUT /api/company
│   │       └── system/
│   │           ├── logs/
│   │           │   └── route.ts     # GET /api/system/logs
│   │           └── stats/
│   │               └── route.ts     # GET /api/system/stats
│   ├── components/                   # React Components
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── form.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── dashboard/
│   │   │   ├── DashboardStats.tsx
│   │   │   ├── RecentInvoices.tsx
│   │   │   └── SystemStatus.tsx
│   │   ├── clients/
│   │   │   ├── ClientForm.tsx
│   │   │   ├── ClientList.tsx
│   │   │   └── ClientCard.tsx
│   │   ├── invoices/
│   │   │   ├── InvoiceList.tsx
│   │   │   ├── InvoiceGenerator.tsx
│   │   │   ├── InvoicePreview.tsx
│   │   │   └── InvoicePDF.tsx
│   │   └── common/
│   │       ├── Layout.tsx
│   │       ├── Navigation.tsx
│   │       └── Loading.tsx
│   ├── lib/                         # Business Logic
│   │   ├── services/                # Service Layer
│   │   │   ├── clientService.ts     # クライアント管理
│   │   │   ├── invoiceService.ts    # 請求書管理
│   │   │   ├── pdfService.ts        # PDF生成
│   │   │   ├── companyService.ts    # 会社情報管理
│   │   │   ├── loggerService.ts     # ログ管理
│   │   │   └── schedulerService.ts  # スケジューラ管理
│   │   ├── data/                    # Data Access Layer
│   │   │   ├── fileManager.ts       # ファイル操作
│   │   │   ├── jsonStorage.ts       # JSON CRUD
│   │   │   └── backup.ts           # バックアップ
│   │   ├── utils/                   # Utilities
│   │   │   ├── validators.ts        # バリデーション
│   │   │   ├── formatters.ts        # データフォーマット
│   │   │   ├── dateUtils.ts         # 日付処理
│   │   │   └── calculations.ts      # 料金計算
│   │   ├── hooks/                   # React Hooks
│   │   │   ├── useClients.ts
│   │   │   ├── useInvoices.ts
│   │   │   ├── useCompany.ts
│   │   │   └── useSystemStats.ts
│   │   └── types/                   # TypeScript Types
│   │       ├── client.ts
│   │       ├── invoice.ts
│   │       ├── company.ts
│   │       └── system.ts
├── scripts/                         # Automation Scripts
│   ├── monthly-generator.js         # 月次請求書生成
│   ├── setup-cron.sh               # Cron設定
│   ├── backup.sh                   # バックアップスクリプト
│   └── health-check.js             # ヘルスチェック
├── data/                           # JSON Data Storage
│   ├── clients.json               # クライアントデータ
│   ├── invoices.json              # 請求書データ
│   ├── company.json               # 会社情報
│   └── system.json                # システム設定
├── output/                         # Generated Invoices
│   ├── 2024-01/                   # 月別ディレクトリ
│   │   ├── INV-202401-ABC-0001.pdf
│   │   └── INV-202401-XYZ-0002.pdf
│   └── 2024-02/
├── logs/                          # Log Files
│   ├── app.log                    # アプリケーションログ
│   ├── generator.log              # 生成処理ログ
│   ├── error.log                  # エラーログ
│   └── access.log                 # アクセスログ
├── backups/                       # Backup Storage
│   ├── daily/
│   └── weekly/
└── config/                        # Configuration
    ├── database.json              # データベース設定
    ├── scheduler.json             # スケジューラ設定
    └── logger.json                # ログ設定
```

## データモデル設計

### Client（クライアント）
```typescript
interface Client {
  id: string;                        // UUID
  clientName: string;                // クライアント名
  siteName: string;                  // サイト名
  postalCode: string;                // 郵便番号（XXX-XXXX）
  address1: string;                  // 住所1
  address2?: string;                 // 住所2（オプション）
  billingFrequency: BillingFrequency; // 請求サイクル
  managementFee: number;             // 管理費（円）
  managementStartDate: Date;         // 管理開始日
  contractStartDate: Date;           // 契約開始日
  contractEndDate?: Date;            // 契約終了日（オプション）
  feeChangeDate?: Date;              // 料金変更日（オプション）
  newManagementFee?: number;         // 新管理費（オプション）
  isActive: boolean;                 // アクティブ状態
  notes?: string;                    // 備考
  createdAt: Date;                   // 作成日時
  updatedAt: Date;                   // 更新日時
}

type BillingFrequency = 'monthly' | 'yearly';
```

### Invoice（請求書）
```typescript
interface Invoice {
  id: string;                        // UUID
  invoiceNumber: string;             // 請求書番号（INV-YYYYMM-CLIENT-XXXX）
  clientId: string;                  // クライアントID
  clientName: string;                // クライアント名（非正規化）
  billingYear: number;               // 請求年
  billingMonth: number;              // 請求月（1-12）
  issueDate: Date;                   // 発行日
  dueDate: Date;                     // 支払期限
  managementFee: number;             // 管理費
  feeStartDate: Date;                // 料金適用開始日
  feeEndDate: Date;                  // 料金適用終了日
  adjustmentAmount: number;          // 調整金額
  subtotal: number;                  // 小計
  taxAmount: number;                 // 消費税額（免税事業者は0）
  totalAmount: number;               // 合計金額
  pdfPath: string;                   // PDFファイルパス
  status: InvoiceStatus;             // ステータス
  notes?: string;                    // 備考
  createdAt: Date;                   // 作成日時
  updatedAt: Date;                   // 更新日時
}

type InvoiceStatus = 'issued' | 'paid' | 'overdue' | 'cancelled';
```

### Company（会社情報）
```typescript
interface Company {
  name: string;                      // 会社名
  postalCode: string;                // 郵便番号
  address: string;                   // 住所
  phone: string;                     // 電話番号
  email: string;                     // メールアドレス
  website?: string;                  // ウェブサイト
  taxNumber?: string;                // 税務署番号
  businessNumber?: string;           // 事業者番号
  representative: string;            // 代表者名
  bankInfo: BankInfo;               // 銀行口座情報
  logoPath?: string;                // ロゴファイルパス
  sealPath?: string;                // 印鑑ファイルパス
  paymentTerms: number;             // 支払期限（日数）
  updatedAt: Date;                  // 更新日時
}

interface BankInfo {
  bankName: string;                  // 銀行名
  branchName: string;                // 支店名
  accountType: string;               // 口座種別
  accountNumber: string;             // 口座番号
  accountHolder: string;             // 口座名義
}
```

### SystemLog（システムログ）
```typescript
interface SystemLog {
  id: string;                        // UUID
  timestamp: Date;                   // タイムスタンプ
  level: LogLevel;                   // ログレベル
  category: LogCategory;             // カテゴリ
  message: string;                   // メッセージ
  data?: object;                     // 関連データ
  error?: string;                    // エラー詳細
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogCategory = 'system' | 'generator' | 'api' | 'auth' | 'backup';
```

## API設計

### RESTful API エンドポイント

#### Clients API
```
GET    /api/clients              # クライアント一覧取得
POST   /api/clients              # クライアント作成
GET    /api/clients/:id          # クライアント詳細取得
PUT    /api/clients/:id          # クライアント更新
DELETE /api/clients/:id          # クライアント削除
GET    /api/clients/search       # クライアント検索
```

#### Invoices API
```
GET    /api/invoices             # 請求書一覧取得
POST   /api/invoices             # 請求書作成（手動）
GET    /api/invoices/:id         # 請求書詳細取得
PUT    /api/invoices/:id         # 請求書更新
DELETE /api/invoices/:id         # 請求書削除
POST   /api/invoices/generate    # 請求書一括生成
GET    /api/invoices/preview     # 生成プレビュー
GET    /api/invoices/:id/pdf     # PDF取得
```

#### Company API
```
GET    /api/company              # 会社情報取得
PUT    /api/company              # 会社情報更新
```

#### System API
```
GET    /api/system/stats         # システム統計情報
GET    /api/system/logs          # ログ取得
POST   /api/system/backup        # バックアップ実行
GET    /api/system/health        # ヘルスチェック
```

### API レスポンス形式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: object;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
```

## コンポーネント設計

### ページコンポーネント
```typescript
// src/app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <Layout>
      <DashboardStats />
      <RecentInvoices />
      <SystemStatus />
    </Layout>
  );
}

// src/app/clients/page.tsx
export default function ClientsPage() {
  const { clients, loading, error } = useClients();

  return (
    <Layout>
      <ClientList
        clients={clients}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Layout>
  );
}
```

### 共通コンポーネント
```typescript
// src/components/ui/data-table.tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  pagination?: boolean;
}

// src/components/common/layout.tsx
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}
```

## PDF生成設計

### PDFテンプレート構造
```typescript
// src/lib/pdf/InvoiceTemplate.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface InvoicePDFProps {
  invoice: Invoice;
  client: Client;
  company: Company;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({
  invoice,
  client,
  company
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <CompanyInfo company={company} />
        <InvoiceInfo invoice={invoice} />
      </View>
      <View style={styles.client}>
        <ClientInfo client={client} />
      </View>
      <View style={styles.items}>
        <InvoiceItems invoice={invoice} />
      </View>
      <View style={styles.footer}>
        <PaymentInfo company={company} />
      </View>
    </Page>
  </Document>
);
```

### フォント設定
```typescript
// src/lib/pdf/fonts.ts
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'NotoSansJP',
  fonts: [
    {
      src: '/fonts/NotoSansJP-Regular.otf',
    },
    {
      src: '/fonts/NotoSansJP-Bold.otf',
      fontWeight: 'bold',
    },
  ],
});
```

## 自動化設計

### Cronジョブ設定
```bash
# 毎月1日 午前9時に実行
0 9 1 * * /usr/bin/node /path/to/scripts/monthly-generator.js

# 毎日 午前3時にバックアップ
0 3 * * * /bin/bash /path/to/scripts/backup.sh

# 毎時 ヘルスチェック
0 * * * * /usr/bin/node /path/to/scripts/health-check.js
```

### 月次生成スクリプト
```typescript
// scripts/monthly-generator.ts
import { InvoiceGeneratorService } from '../src/lib/services/invoiceService';
import { LoggerService } from '../src/lib/services/loggerService';

async function generateMonthlyInvoices() {
  const logger = new LoggerService();
  const generator = new InvoiceGeneratorService();

  try {
    logger.info('Starting monthly invoice generation');

    const targetMonth = getPreviousMonth();
    const result = await generator.generateForMonth(targetMonth);

    logger.info('Monthly generation completed', { result });

    // 通知メール送信（オプション）
    await sendNotificationEmail(result);

  } catch (error) {
    logger.error('Monthly generation failed', { error });
    throw error;
  }
}
```

## セキュリティ設計

### ファイルアクセス制御
```typescript
// src/lib/security/fileAccess.ts
export class FileAccessControl {
  private readonly allowedPaths = [
    '/data/',
    '/output/',
    '/logs/',
    '/backups/'
  ];

  validatePath(filePath: string): boolean {
    const normalizedPath = path.normalize(filePath);
    return this.allowedPaths.some(allowed =>
      normalizedPath.startsWith(allowed)
    );
  }

  async secureRead(filePath: string): Promise<string> {
    if (!this.validatePath(filePath)) {
      throw new Error('Access denied: Invalid file path');
    }
    return fs.readFile(filePath, 'utf-8');
  }
}
```

### データバリデーション
```typescript
// src/lib/validators/clientValidator.ts
import { z } from 'zod';

export const clientSchema = z.object({
  clientName: z.string().min(1).max(100),
  siteName: z.string().min(1).max(100),
  postalCode: z.string().regex(/^\d{3}-\d{4}$/),
  address1: z.string().min(1).max(200),
  address2: z.string().max(200).optional(),
  billingFrequency: z.enum(['monthly', 'yearly']),
  managementFee: z.number().positive(),
  managementStartDate: z.date(),
  contractStartDate: z.date(),
  contractEndDate: z.date().optional(),
});
```

## パフォーマンス設計

### データベース最適化
```typescript
// src/lib/data/optimizedStorage.ts
export class OptimizedJSONStorage {
  private cache = new Map<string, any>();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5分

  async read<T>(filePath: string): Promise<T> {
    const cacheKey = filePath;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await this.loadFromFile<T>(filePath);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }
}
```

### PDF生成最適化
```typescript
// src/lib/pdf/optimizedGenerator.ts
export class OptimizedPDFGenerator {
  private readonly concurrency = 3; // 同時生成数制限

  async generateBatch(invoices: Invoice[]): Promise<GenerationResult[]> {
    const chunks = this.chunkArray(invoices, this.concurrency);
    const results: GenerationResult[] = [];

    for (const chunk of chunks) {
      const chunkResults = await Promise.all(
        chunk.map(invoice => this.generateSingle(invoice))
      );
      results.push(...chunkResults);
    }

    return results;
  }
}
```

## エラーハンドリング設計

### エラー分類
```typescript
// src/lib/errors/AppError.ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super('VALIDATION_ERROR', message, 400);
    this.field = field;
  }
}

export class FileNotFoundError extends AppError {
  constructor(filePath: string) {
    super('FILE_NOT_FOUND', `File not found: ${filePath}`, 404);
  }
}
```

### グローバルエラーハンドラ
```typescript
// src/lib/middleware/errorHandler.ts
export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  const logger = new LoggerService();

  if (error instanceof AppError) {
    logger.warn('Operational error', { error: error.message, code: error.code });
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  logger.error('Unexpected error', { error: error.message, stack: error.stack });
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
}
```

## テスト戦略

### ユニットテスト
```typescript
// src/lib/services/__tests__/clientService.test.ts
import { ClientService } from '../clientService';
import { mockFileSystem } from '../../__mocks__/fileSystem';

describe('ClientService', () => {
  let clientService: ClientService;

  beforeEach(() => {
    clientService = new ClientService(mockFileSystem);
  });

  test('should create client with valid data', async () => {
    const clientData = {
      clientName: 'Test Company',
      siteName: 'Test Site',
      // ... other fields
    };

    const result = await clientService.create(clientData);

    expect(result.success).toBe(true);
    expect(result.data.id).toBeDefined();
  });
});
```

### 統合テスト
```typescript
// src/__tests__/integration/invoiceGeneration.test.ts
describe('Invoice Generation Flow', () => {
  test('should generate monthly invoices end-to-end', async () => {
    // セットアップ
    await setupTestClients();
    await setupTestCompany();

    // 実行
    const result = await generateMonthlyInvoices('2024-01');

    // 検証
    expect(result.successCount).toBeGreaterThan(0);
    expect(result.errorCount).toBe(0);

    // ファイル生成確認
    const pdfExists = await fs.access('output/2024-01/INV-202401-TEST-0001.pdf');
    expect(pdfExists).toBe(true);
  });
});
```

## デプロイメント設計

### 本番環境セットアップ
```bash
#!/bin/bash
# setup-production.sh

# Node.js環境確認
node --version

# プロジェクトクローンとセットアップ
git clone <repository-url> local-invoice-system
cd local-invoice-system
npm install

# データディレクトリ作成
mkdir -p data output logs backups

# 権限設定
chmod +x scripts/*.sh
chmod +x scripts/*.js

# Cron設定
./scripts/setup-cron.sh

# 初期データ作成
npm run setup:initial-data

# ヘルスチェック
npm run health-check
```

### Docker化（オプション）
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# データディレクトリ作成
RUN mkdir -p data output logs backups

# 非rootユーザー作成
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

---

**レビュー情報**
- 設計者：AsamiWorks システム開発チーム
- レビュアー：テクニカルアーキテクト
- 承認者：プロジェクト責任者
- 作成日：2024年10月28日
- バージョン：1.0