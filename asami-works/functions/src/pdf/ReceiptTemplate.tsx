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

// A5横長（ランドスケープ）用ミニマルデザインのスタイル定義
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    backgroundColor: pdfConfig.colors.white,
  },

  // 2カラムレイアウト
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 20,
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    width: 180,
  },

  // ヘッダー
  header: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: pdfConfig.layout.thinBorder,
    borderBottomColor: pdfConfig.colors.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    letterSpacing: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },

  // メタ情報
  metaItem: {
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 6,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 1,
  },
  metaValue: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
  },

  // 宛名セクション
  recipientSection: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: pdfConfig.layout.thinBorder,
    borderBottomColor: pdfConfig.colors.lightGray,
  },
  recipientName: {
    fontSize: 14,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    marginBottom: 6,
  },

  // 金額セクション
  amountSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  amountLabel: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
  },
  amountValue: {
    fontSize: 24,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.accent,
  },
  amountNote: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginLeft: 4,
  },

  // テーブル
  table: {
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 4,
    borderBottomWidth: pdfConfig.layout.mediumBorder,
    borderBottomColor: pdfConfig.colors.black,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 6,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: pdfConfig.layout.thinBorder,
    borderBottomColor: pdfConfig.colors.lightGray,
  },
  tableCell: {
    fontSize: 7,
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
    marginTop: 6,
    marginLeft: 'auto',
    width: '45%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  totalLabel: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
  },
  totalValue: {
    fontSize: 8,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 3,
    borderTopWidth: pdfConfig.layout.mediumBorder,
    borderTopColor: pdfConfig.colors.black,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
  },
  grandTotalValue: {
    fontSize: 14,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.accent,
    textAlign: 'right',
  },

  // 但し書き
  notesSection: {
    marginTop: 6,
  },
  notesText: {
    fontSize: 7,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.darkGray,
    lineHeight: 1.6,
  },

  // 発行者情報
  issuerSection: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  issuerLabel: {
    fontSize: 6,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  issuerName: {
    fontSize: 10,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.black,
    marginBottom: 4,
  },
  issuerLine: {
    fontSize: 6,
    fontFamily: pdfConfig.fonts.japanese,
    color: pdfConfig.colors.gray,
    marginBottom: 2,
    lineHeight: 1.4,
  },

  // フッター
  footer: {
    marginTop: 'auto',
    paddingTop: 6,
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
  status: string;
  notes?: string;
  paymentMethod?: 'card' | 'bank_transfer' | 'other';
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
  isReissue?: boolean; // 再発行かどうか
  reissueCount?: number; // 再発行回数
}

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ invoice, companyInfo, isReissue, reissueCount }) => {
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

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case 'card':
        return 'クレジットカード';
      case 'bank_transfer':
        return '銀行振込';
      default:
        return 'その他';
    }
  };

  const paidDate = invoice.paidDate || new Date();

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        {/* ヘッダー（タイトル + メタ情報） */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>
              領収書{isReissue && '（再発行）'}
            </Text>
            <Text style={styles.subtitle}>
              RECEIPT{isReissue && ' - REISSUED'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>No.</Text>
              <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>発行日</Text>
              <Text style={styles.metaValue}>{formatDate(paidDate)}</Text>
            </View>
          </View>
        </View>

        {/* 2カラムレイアウト */}
        <View style={styles.twoColumnLayout}>
          {/* 左カラム: 宛名・金額・明細 */}
          <View style={styles.leftColumn}>
            {/* 宛名と金額 */}
            <View style={styles.recipientSection}>
              <Text style={styles.recipientName}>{invoice.clientName} 様</Text>
              <View style={styles.amountSection}>
                <Text style={styles.amountValue}>{formatCurrency(invoice.totalAmount)}</Text>
                <Text style={styles.amountNote}>（税込）</Text>
              </View>
              <Text style={styles.amountLabel}>上記正に領収いたしました</Text>
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
                  <Text style={[styles.tableCell, styles.tableCol3, { fontFamily: pdfConfig.fonts.latin }]}>{formatCurrency(item.unitPrice)}</Text>
                  <Text style={[styles.tableCell, styles.tableCol4, { fontFamily: pdfConfig.fonts.latin }]}>{formatCurrency(item.amount)}</Text>
                </View>
              ))}

              {/* 合計行 */}
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { flex: 1 }]}>小計</Text>
                <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { flex: 1 }]}>消費税（{(invoice.taxRate * 100).toFixed(0)}%）</Text>
                <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmount)}</Text>
              </View>
            </View>

            {/* 但し書き・支払い方法 */}
            <View style={styles.notesSection}>
              <Text style={styles.notesText}>
                但し {invoice.notes || '上記サービス料として'}
              </Text>
              <Text style={styles.notesText}>
                支払方法: {getPaymentMethodLabel(invoice.paymentMethod)}
              </Text>
            </View>
          </View>

          {/* 右カラム: 発行者情報 */}
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
      </Page>
    </Document>
  );
};
