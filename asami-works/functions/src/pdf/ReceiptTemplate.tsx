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

// A5横長（ランドスケープ）用コンパクトデザイン
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    backgroundColor: pdfConfig.colors.white,
  },

  // メインコンテナ
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  // ヘッダー行（タイトル左 + メタ情報右）
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: pdfConfig.colors.black,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
  },
  reissueTag: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: '#c00',
    marginLeft: 8,
  },
  metaInfo: {
    alignItems: 'flex-end',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
  },
  metaValue: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
  },

  // 上部セクション（宛名左 + 金額右）
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 20,
  },
  recipientSection: {
    flex: 1,
  },
  recipientName: {
    fontSize: 11,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    marginBottom: 2,
  },
  recipientSuffix: {
    fontSize: 9,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
  },
  amountBox: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'flex-end',
    minWidth: 180,
  },
  amountLabel: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 18,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
  },
  amountNote: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginTop: 2,
  },

  // 明細テーブル
  table: {
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: pdfConfig.colors.black,
    marginBottom: 3,
  },
  tableHeaderCell: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e9ecef',
  },
  tableCell: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
  },
  tableCol1: { width: '50%' },
  tableCol2: { width: '15%', textAlign: 'center' },
  tableCol3: { width: '20%', textAlign: 'right' },
  tableCol4: { width: '15%', textAlign: 'right' },

  // 合計セクション
  totalSection: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 1,
    gap: 16,
  },
  totalLabel: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    width: 70,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    width: 50,
    textAlign: 'right',
  },

  // 下部セクション（備考と発行者）
  bottomSection: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20,
  },
  notesSection: {
    flex: 1,
  },
  notesRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  notesLabel: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    width: 50,
  },
  notesValue: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    flex: 1,
  },

  // 発行者情報
  issuerSection: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
    width: 150,
  },
  issuerLabel: {
    fontSize: 6,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 4,
  },
  issuerName: {
    fontSize: 9,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    marginBottom: 4,
  },
  issuerLine: {
    fontSize: 6,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 1,
    lineHeight: 1.4,
  },

  // フッター
  footer: {
    marginTop: 'auto',
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#e9ecef',
  },
  footerText: {
    fontSize: 5,
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
  cardLast4?: string;
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
        if (invoice.cardLast4) {
          return `クレジットカード（****-${invoice.cardLast4}）`;
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
          {/* ヘッダー行 */}
          <View style={styles.headerRow}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>領収書</Text>
              <Text style={styles.subtitle}>RECEIPT</Text>
              {isReissue && (
                <Text style={styles.reissueTag}>（再発行）</Text>
              )}
            </View>
            <View style={styles.metaInfo}>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>No.</Text>
                <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>発行日</Text>
                <Text style={styles.metaValue}>{formatDate(paidDate)}</Text>
              </View>
            </View>
          </View>

          {/* 上部セクション: 宛名と金額 */}
          <View style={styles.topSection}>
            <View style={styles.recipientSection}>
              <Text style={styles.recipientName}>
                {invoice.clientName}
                <Text style={styles.recipientSuffix}> 様</Text>
              </Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>領収金額</Text>
              <Text style={styles.amountValue}>{formatCurrency(invoice.totalAmount)}</Text>
              <Text style={styles.amountNote}>（税込）</Text>
            </View>
          </View>

          {/* 明細テーブル */}
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

          {/* 下部セクション: 備考と発行者 */}
          <View style={styles.bottomSection}>
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

            <View style={styles.issuerSection}>
              <Text style={styles.issuerLabel}>発行者</Text>
              <Text style={styles.issuerName}>{company.name}</Text>
              <Text style={styles.issuerLine}>〒{company.postalCode}</Text>
              <Text style={styles.issuerLine}>{company.address}</Text>
              <Text style={styles.issuerLine}>TEL: {company.phone}</Text>
              <Text style={styles.issuerLine}>Email: {company.email}</Text>
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
