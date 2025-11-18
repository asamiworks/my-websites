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

// ミニマルデザインのスタイル定義
const styles = StyleSheet.create({
  page: {
    padding: pdfConfig.layout.pageMargin,
    fontSize: pdfConfig.fonts.sizes.body,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    backgroundColor: pdfConfig.colors.white,
  },

  // ヘッダー
  header: {
    marginBottom: pdfConfig.layout.sectionSpacing,
    paddingBottom: 12,
    borderBottomWidth: pdfConfig.layout.thinBorder,
    borderBottomColor: pdfConfig.colors.lightGray,
  },
  title: {
    fontSize: 24,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: pdfConfig.fonts.sizes.tiny,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    letterSpacing: 2,
  },

  // メタ情報
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pdfConfig.layout.sectionSpacing,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: pdfConfig.fonts.sizes.tiny,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  metaValue: {
    fontSize: 10,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
  },

  // 宛名セクション
  recipientSection: {
    marginBottom: pdfConfig.layout.sectionSpacing,
    paddingBottom: pdfConfig.layout.sectionSpacing,
    borderBottomWidth: pdfConfig.layout.thinBorder,
    borderBottomColor: pdfConfig.colors.lightGray,
  },
  recipientLabel: {
    fontSize: pdfConfig.fonts.sizes.tiny,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  recipientName: {
    fontSize: 16,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    marginBottom: 12,
  },

  // 金額セクション
  amountSection: {
    marginBottom: pdfConfig.layout.sectionSpacing,
    paddingBottom: pdfConfig.layout.sectionSpacing,
    borderBottomWidth: pdfConfig.layout.thinBorder,
    borderBottomColor: pdfConfig.colors.lightGray,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 32,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.accent,
    marginBottom: 8,
  },
  amountNote: {
    fontSize: pdfConfig.fonts.sizes.tiny,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
  },

  // テーブル
  table: {
    marginBottom: pdfConfig.layout.sectionSpacing,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomWidth: pdfConfig.layout.mediumBorder,
    borderBottomColor: pdfConfig.colors.black,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: pdfConfig.layout.thinBorder,
    borderBottomColor: pdfConfig.colors.lightGray,
  },
  tableCell: {
    fontSize: 9,
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
    marginTop: 10,
    marginLeft: 'auto',
    width: '45%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  totalLabel: {
    fontSize: 9,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
  },
  totalValue: {
    fontSize: 10,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 5,
    borderTopWidth: pdfConfig.layout.mediumBorder,
    borderTopColor: pdfConfig.colors.black,
    marginTop: 8,
  },
  grandTotalLabel: {
    fontSize: 13,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
  },
  grandTotalValue: {
    fontSize: 18,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.accent,
    textAlign: 'right',
  },

  // 但し書き
  notesSection: {
    marginTop: 12,
    paddingTop: 10,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  notesText: {
    fontSize: 9,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    lineHeight: 1.5,
  },

  // 発行者情報
  issuerSection: {
    marginTop: pdfConfig.layout.sectionSpacing,
    paddingTop: pdfConfig.layout.sectionSpacing,
    borderTopWidth: pdfConfig.layout.thinBorder,
    borderTopColor: pdfConfig.colors.lightGray,
  },
  issuerLabel: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  issuerName: {
    fontSize: 11,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    marginBottom: 4,
  },
  issuerLine: {
    fontSize: pdfConfig.fonts.sizes.small,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 3,
    lineHeight: 1.5,
  },

  // フッター
  footer: {
    marginTop: pdfConfig.layout.sectionSpacing,
    paddingTop: 10,
    borderTopWidth: pdfConfig.layout.thinBorder,
    borderTopColor: pdfConfig.colors.lightGray,
  },
  footerText: {
    fontSize: pdfConfig.fonts.sizes.tiny,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 3,
    lineHeight: 1.4,
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
  status: string;
  notes?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface ReceiptPDFProps {
  invoice: Invoice;
}

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ invoice }) => {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return '¥0';
    }
    return `¥${amount.toLocaleString('ja-JP')}`;
  };

  const formatDate = (date: any) => {
    try {
      // Firestore Timestamp の場合
      if (date && typeof date.toDate === 'function') {
        return format(date.toDate(), 'yyyy年MM月dd日');
      }
      // 文字列の場合
      if (typeof date === 'string') {
        return format(new Date(date), 'yyyy年MM月dd日');
      }
      // Date オブジェクトの場合
      if (date instanceof Date) {
        return format(date, 'yyyy年MM月dd日');
      }
      return '';
    } catch {
      return '';
    }
  };

  const paidDate = invoice.paidDate || new Date();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>領収書</Text>
          <Text style={styles.subtitle}>RECEIPT</Text>
        </View>

        {/* メタ情報（領収書番号・発行日） */}
        <View style={styles.metaSection}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>領収書番号</Text>
            <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>発行日</Text>
            <Text style={styles.metaValue}>{formatDate(paidDate)}</Text>
          </View>
        </View>

        {/* 宛名 */}
        <View style={styles.recipientSection}>
          <Text style={styles.recipientLabel}>宛名</Text>
          <Text style={styles.recipientName}>{invoice.clientName} 様</Text>
        </View>

        {/* 金額（大きく表示） */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>下記正に領収いたしました</Text>
          <Text style={styles.amountValue}>{formatCurrency(invoice.totalAmount)}</Text>
          <Text style={styles.amountNote}>（消費税込）</Text>
        </View>

        {/* 明細テーブル */}
        <View style={styles.table}>
          <Text style={[styles.tableHeaderCell, { marginBottom: 8 }]}>お支払い内訳</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.tableCol1]}>項目</Text>
            <Text style={[styles.tableHeaderCell, styles.tableCol2]}>数量</Text>
            <Text style={[styles.tableHeaderCell, styles.tableCol3]}>単価</Text>
            <Text style={[styles.tableHeaderCell, styles.tableCol4]}>金額</Text>
          </View>

          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCol1]}>{item.description}</Text>
              <Text style={[styles.tableCell, styles.tableCol2]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, styles.tableCol3, { fontFamily: pdfConfig.fonts.latin }]}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={[styles.tableCell, styles.tableCol4, { fontFamily: pdfConfig.fonts.latin }]}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>

        {/* 合計セクション */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>小計</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>消費税（{(invoice.taxRate * 100).toFixed(0)}%）</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmount)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>合計金額</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(invoice.totalAmount)}</Text>
          </View>
        </View>

        {/* 但し書き */}
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>但し</Text>
          <Text style={styles.notesText}>
            {invoice.notes || '上記の通り領収いたしました'}
          </Text>
        </View>

        {/* 発行者情報 */}
        <View style={styles.issuerSection}>
          <Text style={styles.issuerLabel}>発行者</Text>
          <Text style={styles.issuerName}>AsamiWorks</Text>
          <Text style={styles.issuerLine}>〒532-0011</Text>
          <Text style={styles.issuerLine}>大阪府大阪市淀川区西中島 5-6-13 新大阪御幸ビル 6F</Text>
          <Text style={styles.issuerLine}>TEL: 06-4866-6758</Text>
          <Text style={styles.issuerLine}>Email: info@asami-works.com</Text>
        </View>

        {/* フッター */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            本領収書は、お支払いを確認した証明書です
          </Text>
          {invoice.totalAmount >= 50000 && (
            <Text style={[styles.footerText, { marginTop: 6 }]}>
              ※ 5万円以上のため収入印紙の貼付が必要です
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};
