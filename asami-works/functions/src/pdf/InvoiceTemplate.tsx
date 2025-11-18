import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { pdfConfig } from './pdfConfig';
import path from 'path';
import * as admin from 'firebase-admin';

// 日本語フォントの登録（IPAex明朝）
Font.register({
  family: 'IPAex Mincho',
  src: path.join(__dirname, 'fonts', 'ipaexm.ttf'),
});

// スタイル定義
const styles = StyleSheet.create({
  page: {
    padding: pdfConfig.layout.pageMargin,
    fontSize: pdfConfig.fonts.sizes.body,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    backgroundColor: pdfConfig.colors.white,
  },
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
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pdfConfig.layout.sectionSpacing,
  },
  metaItem: { flex: 1 },
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
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pdfConfig.layout.sectionSpacing,
    paddingBottom: pdfConfig.layout.sectionSpacing,
    borderBottomWidth: pdfConfig.layout.thinBorder,
    borderBottomColor: pdfConfig.colors.lightGray,
  },
  addressBox: { width: '48%' },
  addressLabel: {
    fontSize: pdfConfig.fonts.sizes.tiny,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  addressName: {
    fontSize: 13,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    marginBottom: 5,
  },
  addressLine: {
    fontSize: pdfConfig.fonts.sizes.small,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 3,
    lineHeight: 1.5,
  },
  table: { marginBottom: pdfConfig.layout.sectionSpacing },
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
    fontSize: 10,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    lineHeight: 1.4,
  },
  tableCol1: { width: '50%' },
  tableCol2: { width: '15%', textAlign: 'center' },
  tableCol3: { width: '20%', textAlign: 'right' },
  tableCol4: { width: '15%', textAlign: 'right' },
  totalSection: { marginTop: 10, marginLeft: 'auto', width: '45%' },
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
  bankSection: {
    marginTop: pdfConfig.layout.sectionSpacing,
    paddingTop: pdfConfig.layout.sectionSpacing,
    borderTopWidth: pdfConfig.layout.thinBorder,
    borderTopColor: pdfConfig.colors.lightGray,
  },
  bankTitle: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  bankGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  bankItem: { width: '50%', marginBottom: 6 },
  bankItemLabel: {
    fontSize: pdfConfig.fonts.sizes.tiny,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 3,
  },
  bankItemValue: {
    fontSize: 9,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
  },
  notesSection: { marginTop: 12, paddingTop: 10 },
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
  },
});

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface BankInfo {
  bankName: string;
  branchName: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
}

interface CompanyInfo {
  name: string;
  postalCode: string;
  address: string;
  phone: string;
  email: string;
}

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
  issueDate: admin.firestore.Timestamp;
  dueDate: admin.firestore.Timestamp;
  status: string;
  notes?: string;
}

interface InvoicePDFProps {
  invoice: Invoice;
  bankInfo?: BankInfo;
  companyInfo: CompanyInfo;
}

export const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice, bankInfo, companyInfo }) => {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '¥0';
    return '¥' + amount.toLocaleString('ja-JP');
  };

  const formatDate = (timestamp: admin.firestore.Timestamp | undefined) => {
    if (!timestamp) return '';
    try {
      return format(timestamp.toDate(), 'yyyy年MM月dd日');
    } catch {
      return '';
    }
  };

  const taxPercent = invoice.taxRate ? (invoice.taxRate * 100).toFixed(0) : '0';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>請求書</Text>
          <Text style={styles.subtitle}>INVOICE</Text>
        </View>

        <View style={styles.metaSection}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>請求書番号</Text>
            <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>発行日</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.issueDate)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>支払期限</Text>
            <Text style={styles.metaValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
        </View>

        <View style={styles.addressSection}>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>請求先</Text>
            <Text style={styles.addressName}>{invoice.clientName} 御中</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>請求元</Text>
            <Text style={styles.addressName}>{companyInfo.name}</Text>
            <Text style={styles.addressLine}>〒{companyInfo.postalCode}</Text>
            <Text style={styles.addressLine}>{companyInfo.address}</Text>
            <Text style={styles.addressLine}>TEL: {companyInfo.phone}</Text>
            <Text style={styles.addressLine}>Email: {companyInfo.email}</Text>
          </View>
        </View>

        <View style={styles.table}>
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
              <Text style={[styles.tableCell, styles.tableCol3]}>{formatCurrency(item.unitPrice)}</Text>
              <Text style={[styles.tableCell, styles.tableCol4]}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>小計</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>消費税（{taxPercent}%）</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmount)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>合計金額</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(invoice.totalAmount)}</Text>
          </View>
        </View>

        {bankInfo && (
          <View style={styles.bankSection}>
            <Text style={styles.bankTitle}>振込先情報</Text>
            <View style={styles.bankGrid}>
              <View style={styles.bankItem}>
                <Text style={styles.bankItemLabel}>銀行名</Text>
                <Text style={styles.bankItemValue}>{bankInfo.bankName}</Text>
              </View>
              <View style={styles.bankItem}>
                <Text style={styles.bankItemLabel}>支店名</Text>
                <Text style={styles.bankItemValue}>{bankInfo.branchName}</Text>
              </View>
              <View style={styles.bankItem}>
                <Text style={styles.bankItemLabel}>口座種別</Text>
                <Text style={styles.bankItemValue}>{bankInfo.accountType}</Text>
              </View>
              <View style={styles.bankItem}>
                <Text style={styles.bankItemLabel}>口座番号</Text>
                <Text style={styles.bankItemValue}>{bankInfo.accountNumber}</Text>
              </View>
              <View style={[styles.bankItem, { width: '100%' }]}>
                <Text style={styles.bankItemLabel}>口座名義</Text>
                <Text style={styles.bankItemValue}>{bankInfo.accountHolder}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>備考</Text>
          <Text style={styles.notesText}>振込手数料はご負担いただきますようお願いいたします。</Text>
          {invoice.notes && <Text style={[styles.notesText, { marginTop: 6 }]}>{invoice.notes}</Text>}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>お支払い期限: {formatDate(invoice.dueDate)}</Text>
          <Text style={[styles.footerText, { textAlign: 'center', marginTop: 10 }]}>
            {companyInfo.name} | {companyInfo.email}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
