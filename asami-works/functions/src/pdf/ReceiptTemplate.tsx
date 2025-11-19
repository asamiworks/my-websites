import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { pdfConfig } from './pdfConfig';
import path from 'path';

// 日本語フォントの登録（IPAex明朝）
Font.register({
  family: 'IPAex Mincho',
  src: path.join(__dirname, 'fonts', 'ipaexm.ttf'),
});

// A5横長（ランドスケープ）用センター配置デザイン
const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 25,
    paddingBottom: 20,
    fontSize: 9,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    backgroundColor: pdfConfig.colors.white,
  },

  // メインコンテナ
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  // ヘッダー（タイトル中央）
  header: {
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: pdfConfig.colors.black,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    letterSpacing: 3,
  },
  reissueTag: {
    fontSize: 10,
    fontFamily: pdfConfig.fonts.japanese,
    color: '#c00',
    marginTop: 4,
  },

  // メタ情報（右寄せ）
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    gap: 6,
  },
  metaLabel: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
  },
  metaValue: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
  },

  // 宛名セクション（中央）
  recipientSection: {
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: pdfConfig.colors.lightGray,
  },
  recipientName: {
    fontSize: 16,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    marginBottom: 4,
  },
  recipientSuffix: {
    fontSize: 12,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
  },

  // 金額セクション（中央・強調）
  amountSection: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  amountLabel: {
    fontSize: 9,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 6,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amountValue: {
    fontSize: 28,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
  },
  amountNote: {
    fontSize: 10,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginLeft: 6,
  },
  receivedText: {
    fontSize: 9,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    marginTop: 8,
  },

  // 2カラムレイアウト（明細と発行者）
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 25,
    flex: 1,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    width: 160,
  },

  // 明細テーブル
  table: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: pdfConfig.colors.black,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: pdfConfig.colors.lightGray,
  },
  tableCell: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    lineHeight: 1.4,
  },
  tableCol1: { width: '50%' },
  tableCol2: { width: '15%', textAlign: 'center' },
  tableCol3: { width: '20%', textAlign: 'right' },
  tableCol4: { width: '15%', textAlign: 'right' },

  // 合計セクション
  totalSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: pdfConfig.colors.lightGray,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 2,
    gap: 20,
  },
  totalLabel: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    width: 80,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    width: 60,
    textAlign: 'right',
  },

  // 但し書き・支払い方法
  notesSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: pdfConfig.colors.lightGray,
  },
  notesRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    width: 60,
  },
  notesValue: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    flex: 1,
  },

  // 発行者情報
  issuerSection: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  issuerLabel: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 8,
    letterSpacing: 1,
  },
  issuerName: {
    fontSize: 11,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    marginBottom: 6,
  },
  issuerLine: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 2,
    lineHeight: 1.5,
  },

  // フッター
  footer: {
    marginTop: 'auto',
    paddingTop: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 6,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    textAlign: 'center',
  },
});

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  issueDate: any;
  dueDate: any;
  paidDate?: any;
  paidAt?: any;
  status: string;
  notes?: string;
  paymentMethod?: 'card' | 'bank_transfer' | 'other';
  cardLastFour?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface CompanyInfo {
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
}

interface ReceiptPDFProps {
  invoice: Invoice;
  companyInfo?: CompanyInfo;
  isReissue?: boolean;
  reissueCount?: number;
}

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ invoice, companyInfo, isReissue }) => {
  // デフォルトの会社情報
  const company = companyInfo || {
    name: 'AsamiWorks',
    postalCode: '532-0011',
    address: '大阪府大阪市淀川区西中島 5-6-13 新大阪御幸ビル 6F',
    phone: '06-4866-6758',
    email: 'info@asami-works.com',
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return '¥0';
    }
    return `¥${amount.toLocaleString('ja-JP')}`;
  };

  const formatDate = (date: any) => {
    try {
      if (date && typeof date.toDate === 'function') {
        return format(date.toDate(), 'yyyy年MM月dd日');
      }
      if (typeof date === 'string') {
        return format(new Date(date), 'yyyy年MM月dd日');
      }
      if (date instanceof Date) {
        return format(date, 'yyyy年MM月dd日');
      }
      return '';
    } catch {
      return '';
    }
  };

  const getPaymentMethodDisplay = () => {
    switch (invoice.paymentMethod) {
      case 'card':
        if (invoice.cardLastFour) {
          return `クレジットカード（****-****-****-${invoice.cardLastFour}）`;
        }
        return 'クレジットカード';
      case 'bank_transfer':
        return '銀行振込';
      default:
        return 'その他';
    }
  };

  const paidDate = invoice.paidAt || invoice.paidDate || new Date();

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        <View style={styles.container}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>領 収 書</Text>
              <Text style={styles.subtitle}>RECEIPT</Text>
            </View>
            {isReissue && (
              <Text style={styles.reissueTag}>（再発行）</Text>
            )}
          </View>

          {/* メタ情報 */}
          <View style={styles.metaSection}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>No.</Text>
              <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>発行日</Text>
              <Text style={styles.metaValue}>{formatDate(paidDate)}</Text>
            </View>
          </View>

          {/* 宛名 */}
          <View style={styles.recipientSection}>
            <Text style={styles.recipientName}>
              {invoice.clientName}
              <Text style={styles.recipientSuffix}> 様</Text>
            </Text>
          </View>

          {/* 金額 */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>領収金額</Text>
            <View style={styles.amountRow}>
              <Text style={styles.amountValue}>{formatCurrency(invoice.totalAmount)}</Text>
              <Text style={styles.amountNote}>（税込）</Text>
            </View>
            <Text style={styles.receivedText}>上記正に領収いたしました</Text>
          </View>

          {/* 2カラム: 明細と発行者 */}
          <View style={styles.twoColumnLayout}>
            {/* 左カラム: 明細 */}
            <View style={styles.leftColumn}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.tableCol1]}>内訳</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableCol2]}>数量</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableCol3]}>単価</Text>
                  <Text style={[styles.tableHeaderCell, styles.tableCol4]}>金額</Text>
                </View>

                {invoice.items.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.tableCol1]}>{item.description}</Text>
                    <Text style={[styles.tableCell, styles.tableCol2]}>{item.quantity}</Text>
                    <Text style={[styles.tableCell, styles.tableCol3]}>{formatCurrency(item.unitPrice)}</Text>
                    <Text style={[styles.tableCell, styles.tableCol4]}>{formatCurrency(item.amount)}</Text>
                  </View>
                ))}
              </View>

              {/* 合計 */}
              <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>小計</Text>
                  <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>消費税（{(invoice.taxRate * 100).toFixed(0)}%）</Text>
                  <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmount)}</Text>
                </View>
              </View>

              {/* 但し書き・支払い方法 */}
              <View style={styles.notesSection}>
                <View style={styles.notesRow}>
                  <Text style={styles.notesLabel}>但し</Text>
                  <Text style={styles.notesValue}>{invoice.notes || '上記サービス料として'}</Text>
                </View>
                <View style={styles.notesRow}>
                  <Text style={styles.notesLabel}>支払方法</Text>
                  <Text style={styles.notesValue}>{getPaymentMethodDisplay()}</Text>
                </View>
              </View>
            </View>

            {/* 右カラム: 発行者 */}
            <View style={styles.rightColumn}>
              <View style={styles.issuerSection}>
                <Text style={styles.issuerLabel}>発行者</Text>
                <Text style={styles.issuerName}>{company.name}</Text>
                <Text style={styles.issuerLine}>〒{company.postalCode}</Text>
                <Text style={styles.issuerLine}>{company.address}</Text>
                <Text style={styles.issuerLine}>TEL: {company.phone}</Text>
                <Text style={styles.issuerLine}>Email: {company.email}</Text>
              </View>
            </View>
          </View>

          {/* フッター */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              この領収書は電子帳簿保存法の要件に基づき電子的に発行されています
              {invoice.totalAmount >= 50000 && ' / 電子発行のため収入印紙は不要です'}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
