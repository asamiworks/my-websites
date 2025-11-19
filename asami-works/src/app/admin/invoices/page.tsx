'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Invoice, InvoiceItem, InvoiceStatus, Client } from '@/types/invoice';
import AdminNav from '@/components/admin/AdminNav';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'admin@asami-works.com';

function AdminInvoicesContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientIdParam = searchParams.get('clientId');

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>(clientIdParam || '');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateBillingMonth, setGenerateBillingMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [generatingPdfFor, setGeneratingPdfFor] = useState<string | null>(null);
  const [generatingReceiptFor, setGeneratingReceiptFor] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [sendingInvoice, setSendingInvoice] = useState<string | null>(null);
  const [submittingInvoice, setSubmittingInvoice] = useState(false);

  const [invoiceSettings, setInvoiceSettings] = useState({
    taxRate: 0, // デフォルトは免税
  });

  const [formData, setFormData] = useState({
    clientId: '',
    issueDate: '',
    dueDate: '',
    taxRate: 0, // 免税事業者のため0%
    notes: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }] as InvoiceItem[],
    billingPeriodStart: null as Date | null,
    billingPeriodEnd: null as Date | null,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
      return;
    }

    // 管理者メールアドレスチェック
    if (!authLoading && user && user.email !== ADMIN_EMAIL) {
      router.push('/');
      return;
    }

    if (user && user.email === ADMIN_EMAIL) {
      loadSettings();
      loadClients();
      loadInvoices();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedClientId) {
      loadInvoices();
    }
  }, [selectedClientId]);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (response.ok && data.invoiceSettings) {
        setInvoiceSettings({
          taxRate: data.invoiceSettings.taxRate || 0,
        });
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const loadClients = async () => {
    try {
      const clientsQuery = query(
        collection(db, 'clients'),
        where('isActive', '==', true),
        orderBy('clientName', 'asc')
      );
      const clientsSnapshot = await getDocs(clientsQuery);
      const clientsData = clientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];
      setClients(clientsData);
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      let invoicesQuery;
      if (selectedClientId) {
        invoicesQuery = query(
          collection(db, 'invoices'),
          where('clientId', '==', selectedClientId),
          orderBy('createdAt', 'desc')
        );
      } else {
        invoicesQuery = query(
          collection(db, 'invoices'),
          orderBy('createdAt', 'desc')
        );
      }

      const invoicesSnapshot = await getDocs(invoicesQuery);
      const invoicesData = invoicesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[];

      setInvoices(invoicesData);
    } catch (err) {
      console.error('Error loading invoices:', err);
      setError('請求書の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const calculateItemAmount = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateTotals = (items: InvoiceItem[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = Math.round(subtotal * taxRate);
    const totalAmount = subtotal + taxAmount;
    return { subtotal, taxAmount, totalAmount };
  };

  const handleOpenModal = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      const issueDate = invoice.issueDate.toDate ? invoice.issueDate.toDate() : new Date(invoice.issueDate as any);
      const dueDate = invoice.dueDate.toDate ? invoice.dueDate.toDate() : new Date(invoice.dueDate as any);

      // 請求期間を取得
      let billingPeriodStart = null;
      let billingPeriodEnd = null;
      if (invoice.billingPeriodStart) {
        const start = invoice.billingPeriodStart as any;
        billingPeriodStart = start.toDate ? start.toDate() : new Date(start);
      }
      if (invoice.billingPeriodEnd) {
        const end = invoice.billingPeriodEnd as any;
        billingPeriodEnd = end.toDate ? end.toDate() : new Date(end);
      }

      setFormData({
        clientId: invoice.clientId,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        taxRate: invoice.taxRate,
        notes: invoice.notes ?? '',
        items: [...invoice.items],
        billingPeriodStart,
        billingPeriodEnd,
      });
    } else {
      setEditingInvoice(null);
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      setFormData({
        clientId: clientIdParam || '',
        issueDate: today.toISOString().split('T')[0],
        dueDate: nextMonth.toISOString().split('T')[0],
        taxRate: invoiceSettings.taxRate,
        notes: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
        billingPeriodStart: null,
        billingPeriodEnd: null,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInvoice(null);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].amount = calculateItemAmount(
        newItems[index].quantity,
        newItems[index].unitPrice
      );
    }

    setFormData({ ...formData, items: newItems });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const triggerAutoCharge = async (invoiceId: string) => {
    try {
      const response = await fetch('/api/stripe/auto-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: 'カード決済が完了しました' };
      } else if (data.skipped || data.alreadyPaid) {
        return { success: true, skipped: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error triggering auto-charge:', error);
      return { success: false, error: 'Auto-charge request failed' };
    }
  };

  // 請求書メール送信
  const sendInvoiceEmail = async (invoiceId: string) => {
    try {
      const response = await fetch('/api/admin/invoices/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error sending invoice email:', error);
      return { success: false, error: 'メール送信に失敗しました' };
    }
  };

  const handleSubmit = async (status: InvoiceStatus = 'draft') => {
    // 既に送信中の場合は処理をスキップ（二重クリック防止）
    if (submittingInvoice) return;

    setSubmittingInvoice(true);
    setError(null);

    try {
      const selectedClient = clients.find(c => c.id === formData.clientId);
      if (!selectedClient) {
        setError('クライアントを選択してください');
        setSubmittingInvoice(false);
        return;
      }

      const { subtotal, taxAmount, totalAmount } = calculateTotals(formData.items, formData.taxRate);

      const invoiceData: any = {
        clientId: formData.clientId,
        clientName: selectedClient.clientName,
        invoiceNumber: editingInvoice?.invoiceNumber || generateInvoiceNumber(),
        items: formData.items,
        subtotal,
        taxRate: formData.taxRate,
        taxAmount,
        totalAmount,
        issueDate: Timestamp.fromDate(new Date(formData.issueDate)),
        dueDate: Timestamp.fromDate(new Date(formData.dueDate)),
        status: editingInvoice ? (editingInvoice.status || status) : status,
        notes: formData.notes || null,
        updatedAt: Timestamp.now(),
      };

      // 請求期間を保存（入金確認時のlastPaidPeriod更新に使用）
      if (formData.billingPeriodStart) {
        invoiceData.billingPeriodStart = Timestamp.fromDate(formData.billingPeriodStart);
      }
      if (formData.billingPeriodEnd) {
        invoiceData.billingPeriodEnd = Timestamp.fromDate(formData.billingPeriodEnd);
      }

      let invoiceId = editingInvoice?.id;

      if (editingInvoice) {
        await updateDoc(doc(db, 'invoices', editingInvoice.id), invoiceData);
        alert('請求書を更新しました');
      } else {
        const docRef = await addDoc(collection(db, 'invoices'), {
          ...invoiceData,
          createdAt: Timestamp.now(),
        });
        invoiceId = docRef.id;
        const statusLabel = status === 'draft' ? '下書きとして保存' : '送付';
        alert(`請求書を${statusLabel}しました`);
      }

      // 送付時の処理
      if (status === 'sent' && invoiceId) {
        let emailSent = false;
        let chargeDone = false;
        let emailError = '';
        let chargeError = '';

        // 認証設定済みのクライアントにメール送信
        if (selectedClient.authUid) {
          const emailResult = await sendInvoiceEmail(invoiceId);
          if (emailResult.success) {
            emailSent = true;
          } else {
            emailError = emailResult.error || '';
          }
        }

        // クレジットカード決済のクライアントで自動決済を試行
        if (selectedClient.paymentMethod === 'credit_card') {
          const chargeResult = await triggerAutoCharge(invoiceId);
          if (chargeResult.success && !chargeResult.skipped) {
            chargeDone = true;
          } else if (!chargeResult.success) {
            chargeError = chargeResult.error || '';
          }
        }

        // 結果メッセージを作成
        let message = '請求書を送付しました';
        if (emailSent) {
          message += '\nメールを送信しました';
        } else if (selectedClient.authUid && emailError) {
          message += '\nメール送信に失敗しました: ' + emailError;
        }
        if (chargeDone) {
          message += '\nカード決済が完了しました';
        } else if (selectedClient.paymentMethod === 'credit_card' && chargeError) {
          message += '\nカード決済に失敗しました: ' + chargeError;
        }

        alert(message);
      }

      handleCloseModal();
      loadInvoices();
    } catch (err) {
      console.error('Error saving invoice:', err);
      setError('請求書の保存に失敗しました');
    } finally {
      setSubmittingInvoice(false);
    }
  };

  const handleStatusChange = async (invoice: Invoice, newStatus: InvoiceStatus) => {
    // 支払い済みにする場合は入金確認モーダルを開く
    if (newStatus === 'paid') {
      setSelectedInvoiceForPayment(invoice);
      setPaymentAmount(invoice.totalAmount.toString());
      setShowPaymentModal(true);
      return;
    }

    // 既に送信中の場合は処理をスキップ（二重クリック防止）
    if (sendingInvoice) return;

    // 送付処理の場合はローディング状態をセット
    if (newStatus === 'sent') {
      setSendingInvoice(invoice.id);
    }

    try {
      await updateDoc(doc(db, 'invoices', invoice.id), {
        status: newStatus,
        updatedAt: Timestamp.now(),
      });

      // ステータスを'sent'に変更した場合の処理
      if (newStatus === 'sent') {
        const client = clients.find(c => c.id === invoice.clientId);
        if (client) {
          let emailSent = false;
          let chargeDone = false;
          let emailError = '';
          let chargeError = '';

          // 認証設定済みのクライアントにメール送信
          if (client.authUid) {
            const emailResult = await sendInvoiceEmail(invoice.id);
            if (emailResult.success) {
              emailSent = true;
            } else {
              emailError = emailResult.error || '';
            }
          }

          // クレジットカード決済のクライアントで自動決済を試行
          if (client.paymentMethod === 'credit_card') {
            const chargeResult = await triggerAutoCharge(invoice.id);
            if (chargeResult.success && !chargeResult.skipped) {
              chargeDone = true;
            } else if (!chargeResult.success) {
              chargeError = chargeResult.error || '';
            }
          }

          // 結果メッセージを作成
          let message = '請求書を送付しました';
          if (emailSent) {
            message += '\nメールを送信しました';
          } else if (client.authUid && emailError) {
            message += '\nメール送信に失敗しました: ' + emailError;
          }
          if (chargeDone) {
            message += '\nカード決済が完了しました';
          } else if (client.paymentMethod === 'credit_card' && chargeError) {
            message += '\nカード決済に失敗しました: ' + chargeError;
          }

          alert(message);
        }
      }

      loadInvoices();
    } catch (err) {
      console.error('Error updating invoice status:', err);
      setError('ステータスの更新に失敗しました');
    } finally {
      setSendingInvoice(null);
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedInvoiceForPayment) return;

    const paidAmount = parseFloat(paymentAmount);
    if (isNaN(paidAmount) || paidAmount < 0) {
      alert('正しい入金額を入力してください');
      return;
    }

    const paymentDifference = paidAmount - selectedInvoiceForPayment.totalAmount;

    try {
      // 請求書を更新
      await updateDoc(doc(db, 'invoices', selectedInvoiceForPayment.id), {
        status: 'paid' as InvoiceStatus,
        paidAmount,
        paymentDifference,
        paidAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      // クライアントの累積過不足金と支払いフラグを更新
      const clientRef = doc(db, 'clients', selectedInvoiceForPayment.clientId);
      const clientDoc = await getDoc(clientRef);

      if (clientDoc.exists()) {
        const clientData = clientDoc.data();
        const currentDifference = clientData.accumulatedDifference || 0;
        const newDifference = currentDifference + paymentDifference;

        // 現在のproductionFeeBreakdownを取得（なければ空オブジェクト）
        const currentBreakdown = clientData.productionFeeBreakdown || {};

        // 請求書内の一回払い項目をチェック
        const items = selectedInvoiceForPayment.items || [];

        // フラグを更新（既存の値を保持しつつ更新）
        const updatedBreakdown = { ...currentBreakdown };

        if (items.some(item => item.description?.includes('初期費用'))) {
          updatedBreakdown.initialPaymentPaid = true;
        }

        if (items.some(item => item.description?.includes('中間費用'))) {
          updatedBreakdown.intermediatePaymentPaid = true;
        }

        if (items.some(item => item.description?.includes('最終金'))) {
          updatedBreakdown.finalPaymentPaid = true;
        }

        // 支払い完了期間を更新（月額管理費の重複請求を防ぐ）
        const updateData: Record<string, unknown> = {
          accumulatedDifference: newDifference,
          productionFeeBreakdown: updatedBreakdown,
          updatedAt: Timestamp.now(),
        };

        // billingPeriodStart/End から支払い完了期間を保存（年月日形式）
        if (selectedInvoiceForPayment.billingPeriodStart) {
          updateData.lastPaidPeriodStart = selectedInvoiceForPayment.billingPeriodStart;
        }
        if (selectedInvoiceForPayment.billingPeriodEnd) {
          updateData.lastPaidPeriodEnd = selectedInvoiceForPayment.billingPeriodEnd;
          // 後方互換性のため lastPaidPeriod も更新
          const periodEnd = selectedInvoiceForPayment.billingPeriodEnd;
          const endDate = periodEnd.toDate ? periodEnd.toDate() : new Date(periodEnd as unknown as string);
          const year = endDate.getFullYear();
          const month = String(endDate.getMonth() + 1).padStart(2, '0');
          updateData.lastPaidPeriod = `${year}-${month}`;
        } else if (selectedInvoiceForPayment.billingMonth) {
          // フォールバック: billingMonth がある場合はそれを使用
          updateData.lastPaidPeriod = selectedInvoiceForPayment.billingMonth;
        }

        // クライアントドキュメントを更新
        await updateDoc(clientRef, updateData);
      }

      setShowPaymentModal(false);
      setSelectedInvoiceForPayment(null);
      setPaymentAmount('');

      if (paymentDifference !== 0) {
        const diffLabel = paymentDifference > 0 ? '過払い' : '不足';
        alert(`入金を確認しました\n\n${diffLabel}金額: ¥${Math.abs(paymentDifference).toLocaleString()}\n次回請求書で調整されます`);
      } else {
        alert('入金を確認しました');
      }

      loadInvoices();
    } catch (err) {
      console.error('Error confirming payment:', err);
      alert('入金確認に失敗しました');
    }
  };

  const handleDeleteInvoice = async (invoice: Invoice) => {
    // 支払い済みの請求書は削除不可
    if (invoice.status === 'paid') {
      alert('支払い済みの請求書は削除できません');
      return;
    }

    // 確認ダイアログ
    const confirmMessage = `請求書 #${invoice.invoiceNumber} を削除しますか？\n\nクライアント: ${invoice.clientName}\n金額: ${formatCurrency(invoice.totalAmount)}\n\nこの操作は取り消せません。`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('請求書を削除しました');
        loadInvoices();
      } else {
        throw new Error(data.error || '請求書の削除に失敗しました');
      }
    } catch (err: any) {
      console.error('Error deleting invoice:', err);
      setError(err.message || '請求書の削除に失敗しました');
    }
  };

  const handleGeneratePDF = async (invoice: Invoice) => {
    try {
      setGeneratingPdfFor(invoice.id);

      const response = await fetch(`/api/admin/invoices/${invoice.id}/pdf`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        if (data.pdfUrl) {
          // URLをクリップボードにコピー
          await navigator.clipboard.writeText(data.pdfUrl);
          alert(`PDFを生成してGoogle Driveに保存しました\n\nURLをクリップボードにコピーしました:\n${data.pdfUrl}`);
        } else {
          alert('PDFを生成しました');
        }
        loadInvoices();
      } else {
        throw new Error(data.error || 'PDF生成に失敗しました');
      }
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      alert(err.message || 'PDF生成に失敗しました');
    } finally {
      setGeneratingPdfFor(null);
    }
  };

  const handleBulkGeneratePDF = async () => {
    if (selectedInvoices.size === 0) {
      alert('請求書を選択してください');
      return;
    }

    const confirmed = confirm(`${selectedInvoices.size}件の請求書のPDFを生成しますか？`);
    if (!confirmed) return;

    try {
      setGenerating(true);

      const response = await fetch('/api/admin/invoices/bulk-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceIds: Array.from(selectedInvoices),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        setSelectedInvoices(new Set());
        loadInvoices();
      } else {
        throw new Error(data.error || 'PDF生成に失敗しました');
      }
    } catch (err: any) {
      console.error('Error bulk generating PDFs:', err);
      alert(err.message || 'PDF一括生成に失敗しました');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateReceipt = async (invoice: Invoice) => {
    if (invoice.status !== 'paid') {
      alert('領収書は支払い済みの請求書のみ生成できます');
      return;
    }

    try {
      setGeneratingReceiptFor(invoice.id);

      const response = await fetch(`/api/admin/invoices/${invoice.id}/receipt`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        if (data.receiptUrl) {
          await navigator.clipboard.writeText(data.receiptUrl);
          alert(`領収書PDFを生成してGoogle Driveに保存しました\n\nURLをクリップボードにコピーしました:\n${data.receiptUrl}`);
        } else {
          alert('領収書PDFを生成しました');
        }
        loadInvoices();
      } else {
        throw new Error(data.error || '領収書PDF生成に失敗しました');
      }
    } catch (err: any) {
      console.error('Error generating receipt:', err);
      alert(err.message || '領収書PDF生成に失敗しました');
    } finally {
      setGeneratingReceiptFor(null);
    }
  };

  const handleToggleReceiptDisabled = async (invoice: Invoice) => {
    const newValue = !invoice.receiptDisabled;
    const confirmMessage = newValue
      ? '領収書生成を無効にしますか？\n（既に別途発行済みの場合など）'
      : '領収書生成を有効にしますか？';

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await updateDoc(doc(db, 'invoices', invoice.id), {
        receiptDisabled: newValue,
        updatedAt: Timestamp.now(),
      });
      loadInvoices();
    } catch (err) {
      console.error('Error toggling receipt disabled:', err);
      alert('更新に失敗しました');
    }
  };

  const toggleInvoiceSelection = (invoiceId: string) => {
    const newSelected = new Set(selectedInvoices);
    if (newSelected.has(invoiceId)) {
      newSelected.delete(invoiceId);
    } else {
      newSelected.add(invoiceId);
    }
    setSelectedInvoices(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedInvoices.size === invoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(invoices.map(inv => inv.id)));
    }
  };

  // Timestamp/Dateを安全に変換するヘルパー関数
  const safeToDate = (timestamp: any): Date | null => {
    if (!timestamp) return null;
    if (timestamp instanceof Date) return timestamp;
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return null;
  };

  const handleAutoGenerateItems = async () => {
    if (!formData.clientId || !formData.issueDate || !formData.dueDate) {
      alert('クライアント、発行日、支払期限を入力してください');
      return;
    }

    try {
      const selectedClient = clients.find(c => c.id === formData.clientId);
      if (!selectedClient) {
        alert('クライアントが見つかりません');
        return;
      }

      const items: InvoiceItem[] = [];
      let billingPeriodStartDate: Date | null = null;
      let billingPeriodEndDate: Date | null = null;

      // 管理費を取得
      if (selectedClient.managementFeeSchedule && selectedClient.managementFeeSchedule.length > 0) {
        const issueDate = new Date(formData.issueDate);

        // 最新の管理費スケジュールを取得
        const currentSchedule = selectedClient.managementFeeSchedule.find((schedule: any) => {
          const scheduleStart = safeToDate(schedule.fromDate);
          const scheduleEnd = safeToDate(schedule.toDate);

          if (scheduleStart && scheduleStart > issueDate) return false;
          if (scheduleEnd && scheduleEnd < issueDate) return false;

          return true;
        });

        if (currentSchedule) {
          const billingFrequency = selectedClient.billingFrequency || 'monthly';

          if (billingFrequency === 'yearly') {
            // 年額請求（11ヶ月分）
            items.push({
              description: '年間管理費（11ヶ月分）',
              quantity: 11,
              unitPrice: currentSchedule.monthlyFee,
              amount: currentSchedule.monthlyFee * 11,
            });
          } else {
            // 月額請求 - 請求対象月を計算（発行日の前月）
            const billingMonth = new Date(issueDate.getFullYear(), issueDate.getMonth() - 1, 1);
            const billingMonthEnd = new Date(issueDate.getFullYear(), issueDate.getMonth(), 0); // 前月末日

            const scheduleStart = safeToDate(currentSchedule.fromDate);
            const baseDescription = currentSchedule.description || '月額管理費';

            // 未払い期間の開始を決定
            let unpaidStartDate: Date;

            // 優先順位: lastPaidPeriodEnd > lastPaidPeriod > scheduleStart
            if (selectedClient.lastPaidPeriodEnd) {
              // lastPaidPeriodEndの翌日から開始（年月日ベース）
              const lastPaidEnd = safeToDate(selectedClient.lastPaidPeriodEnd);
              if (lastPaidEnd) {
                unpaidStartDate = new Date(lastPaidEnd);
                unpaidStartDate.setDate(unpaidStartDate.getDate() + 1); // 翌日から
              } else {
                unpaidStartDate = billingMonth;
              }
            } else if (selectedClient.lastPaidPeriod) {
              // 後方互換性: lastPaidPeriodの翌月から開始
              const [year, month] = selectedClient.lastPaidPeriod.split('-').map(Number);
              unpaidStartDate = new Date(year, month, 1); // 翌月の1日
            } else if (scheduleStart) {
              // 初回請求の場合はスケジュール開始日から
              unpaidStartDate = scheduleStart;
            } else {
              // デフォルトは請求対象月の1日
              unpaidStartDate = billingMonth;
            }

            // 未払い開始が請求対象月の終わりより後の場合は請求対象がない
            if (unpaidStartDate <= billingMonthEnd) {
              // 期間と金額を計算
              let periodStartMonth = unpaidStartDate.getMonth() + 1;
              let periodStartDay = unpaidStartDate.getDate();
              let periodEndMonth = billingMonth.getMonth() + 1;
              let periodEndDay = billingMonthEnd.getDate();
              let totalAmount = 0;

              // 未払い期間の月を計算
              const currentMonth = new Date(unpaidStartDate.getFullYear(), unpaidStartDate.getMonth(), 1);

              while (currentMonth <= billingMonth) {
                const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                const daysInMonth = monthEnd.getDate();

                let startDay = 1;
                let endDay = daysInMonth;

                // 開始月の場合
                if (currentMonth.getFullYear() === unpaidStartDate.getFullYear() &&
                    currentMonth.getMonth() === unpaidStartDate.getMonth()) {
                  startDay = unpaidStartDate.getDate();
                }

                // 終了月の場合
                if (currentMonth.getFullYear() === billingMonth.getFullYear() &&
                    currentMonth.getMonth() === billingMonth.getMonth()) {
                  endDay = billingMonthEnd.getDate();
                }

                const actualDays = endDay - startDay + 1;

                if (actualDays === daysInMonth) {
                  // 全日数の場合は月額
                  totalAmount += currentSchedule.monthlyFee;
                } else {
                  // 日割り計算
                  totalAmount += Math.round(currentSchedule.monthlyFee * actualDays / daysInMonth);
                }

                // 次の月へ
                currentMonth.setMonth(currentMonth.getMonth() + 1);
              }

              const periodStr = periodStartMonth === periodEndMonth
                ? `${periodStartMonth}/${periodStartDay}〜${periodEndMonth}/${periodEndDay}`
                : `${periodStartMonth}/${periodStartDay}〜${periodEndMonth}/${periodEndDay}`;

              items.push({
                description: `${baseDescription}（${periodStr}）`,
                quantity: 1,
                unitPrice: totalAmount,
                amount: totalAmount,
              });

              // 請求期間を保存用に記録
              billingPeriodStartDate = unpaidStartDate;
              billingPeriodEndDate = billingMonthEnd;
            }
          }
        }
      }

      // 制作費を追加（未払いの場合）
      if (selectedClient.productionFeeBreakdown) {
        const breakdown = selectedClient.productionFeeBreakdown;
        const issueDate = new Date(formData.issueDate);

        // 初期費用
        if (breakdown.initialPayment &&
            breakdown.initialPaymentDueDate &&
            !breakdown.initialPaymentPaid) {
          const dueDate = safeToDate(breakdown.initialPaymentDueDate);
          if (dueDate && dueDate <= issueDate) {
            items.push({
              description: 'サイト制作費（初期費用）',
              quantity: 1,
              unitPrice: breakdown.initialPayment,
              amount: breakdown.initialPayment,
            });
          }
        }

        // 中間費用
        if (breakdown.intermediatePayment &&
            breakdown.intermediatePaymentDueDate &&
            !breakdown.intermediatePaymentPaid) {
          const dueDate = safeToDate(breakdown.intermediatePaymentDueDate);
          if (dueDate && dueDate <= issueDate) {
            items.push({
              description: 'サイト制作費（中間費用）',
              quantity: 1,
              unitPrice: breakdown.intermediatePayment,
              amount: breakdown.intermediatePayment,
            });
          }
        }

        // 最終金
        if (breakdown.finalPayment &&
            breakdown.finalPaymentDueDate &&
            !breakdown.finalPaymentPaid) {
          const dueDate = safeToDate(breakdown.finalPaymentDueDate);
          if (dueDate && dueDate <= issueDate) {
            items.push({
              description: 'サイト制作費（最終金）',
              quantity: 1,
              unitPrice: breakdown.finalPayment,
              amount: breakdown.finalPayment,
            });
          }
        }
      }

      if (items.length === 0) {
        alert('このクライアントには請求可能な項目がありません');
        return;
      }

      setFormData({
        ...formData,
        items,
        billingPeriodStart: billingPeriodStartDate,
        billingPeriodEnd: billingPeriodEndDate,
      });
      alert(`${items.length}件の請求項目を自動生成しました\n\n内容を確認して、「下書き保存」または「送付」してください`);
    } catch (err) {
      console.error('Error auto-generating items:', err);
      alert('請求内容の自動生成に失敗しました');
    }
  };

  const handleGenerateInvoices = async () => {
    try {
      setGenerating(true);
      setError(null);

      const response = await fetch('/api/admin/invoices/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billingMonth: generateBillingMonth,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${data.count}件の請求書を生成しました`);
        setShowGenerateModal(false);
        loadInvoices();
      } else {
        throw new Error(data.error || '請求書の生成に失敗しました');
      }
    } catch (err: any) {
      console.error('Error generating invoices:', err);
      setError(err.message || '請求書の生成に失敗しました');
    } finally {
      setGenerating(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: '下書き',
      sent: '送付済み',
      paid: '支払い済み',
      overdue: '期限超過',
      cancelled: 'キャンセル',
      refunded: '返金済み',
      partially_refunded: '一部返金',
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      draft: styles.statusDraft,
      sent: styles.statusSent,
      paid: styles.statusPaid,
      overdue: styles.statusOverdue,
      cancelled: styles.statusCancelled,
      refunded: styles.statusCancelled,
      partially_refunded: styles.statusOverdue,
    };
    return classes[status] || styles.statusDraft;
  };

  // 返金処理
  const handleRefund = async (invoice: Invoice) => {
    if (!invoice.stripePaymentIntentId) {
      alert('この請求書にはStripe決済情報がありません');
      return;
    }

    const confirmMessage = `請求書 #${invoice.invoiceNumber} を返金しますか？\n\nクライアント: ${invoice.clientName}\n金額: ${formatCurrency(invoice.totalAmount)}\n\nこの操作は取り消せません。`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch('/api/stripe/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message);
        loadInvoices();
      } else {
        throw new Error(data.error || '返金処理に失敗しました');
      }
    } catch (error: any) {
      console.error('Error processing refund:', error);
      alert(error.message || '返金処理に失敗しました');
    }
  };

  if (authLoading || loading) {
    return (
      <div className={styles.pageWrapper}>
        <AdminNav />
        <div className={styles.container}>
          <div className={styles.loading}>読み込み中...</div>
        </div>
      </div>
    );
  }

  const { subtotal, taxAmount, totalAmount } = formData.items.length > 0
    ? calculateTotals(formData.items, formData.taxRate)
    : { subtotal: 0, taxAmount: 0, totalAmount: 0 };

  return (
    <div className={styles.pageWrapper}>
      <AdminNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>請求書管理</h1>
            <p className={styles.subtitle}>
              {invoices.length}件の請求書
            </p>
          </div>
          <div className={styles.headerButtons}>
            {selectedInvoices.size > 0 && (
              <button className={styles.generateButton} onClick={handleBulkGeneratePDF} disabled={generating}>
                {generating ? 'PDF生成中...' : `📄 選択中(${selectedInvoices.size}件)のPDF生成`}
              </button>
            )}
            <button className={styles.generateButton} onClick={() => setShowGenerateModal(true)}>
              📋 請求書を一括生成
            </button>
            <button className={styles.addButton} onClick={() => handleOpenModal()}>
              + 新規請求書
            </button>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>{error}</div>
        )}

        <div className={styles.filters}>
        <select
          className={styles.filterSelect}
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
        >
          <option value="">全てのクライアント</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.clientName}
            </option>
          ))}
        </select>
      </div>

      {invoices.length === 0 ? (
        <div className={styles.empty}>
          <p>請求書がありません</p>
          <button className={styles.addButtonLarge} onClick={() => handleOpenModal()}>
            最初の請求書を作成
          </button>
        </div>
      ) : (
        <div className={styles.invoicesTable}>
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedInvoices.size === invoices.length && invoices.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>請求書番号</th>
                <th>クライアント</th>
                <th>請求期間</th>
                <th>月数</th>
                <th>発行日</th>
                <th>支払期限</th>
                <th>金額</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedInvoices.has(invoice.id)}
                      onChange={() => toggleInvoiceSelection(invoice.id)}
                    />
                  </td>
                  <td className={styles.invoiceNumber}>#{invoice.invoiceNumber}</td>
                  <td>
                    {invoice.clientName}
                    {invoice.notes && (
                      <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.25rem' }}>
                        {invoice.notes}
                      </div>
                    )}
                  </td>
                  <td>
                    {invoice.billingPeriodStart && invoice.billingPeriodEnd ? (
                      <div style={{ fontSize: '0.9rem' }}>
                        {formatDate(invoice.billingPeriodStart)}
                        <br />
                        〜 {formatDate(invoice.billingPeriodEnd)}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {invoice.quantity ? `${invoice.quantity}ヶ月` : '-'}
                  </td>
                  <td>{formatDate(invoice.issueDate)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td className={styles.amount}>
                    {formatCurrency(invoice.totalAmount)}
                    {invoice.taxRate === 0 && (
                      <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                        (免税)
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={getStatusClass(invoice.status)}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      {invoice.status === 'draft' && (
                        <button
                          className={styles.editButton}
                          onClick={() => handleOpenModal(invoice)}
                        >
                          編集
                        </button>
                      )}
                      {invoice.status === 'draft' && (
                        <button
                          className={styles.sendButton}
                          onClick={() => handleStatusChange(invoice, 'sent')}
                          disabled={sendingInvoice === invoice.id}
                        >
                          {sendingInvoice === invoice.id ? '送付中...' : '送付'}
                        </button>
                      )}
                      {invoice.status === 'sent' && (
                        <button
                          className={styles.paidButton}
                          onClick={() => handleStatusChange(invoice, 'paid')}
                        >
                          支払済
                        </button>
                      )}
                      <button
                        className={styles.viewButton}
                        onClick={() => router.push(`/admin/invoices/${invoice.id}`)}
                      >
                        詳細
                      </button>
                      <button
                        className={styles.viewButton}
                        onClick={() => handleGeneratePDF(invoice)}
                        disabled={generatingPdfFor === invoice.id}
                      >
                        {generatingPdfFor === invoice.id ? 'PDF生成中...' : '📄 PDF生成'}
                      </button>
                      {invoice.pdfUrl && (
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.viewButton}
                          style={{ textDecoration: 'none', display: 'inline-block' }}
                        >
                          📎 PDF表示
                        </a>
                      )}
                      {invoice.status === 'paid' && !invoice.receiptDisabled && (
                        <button
                          className={styles.receiptButton}
                          onClick={() => handleGenerateReceipt(invoice)}
                          disabled={generatingReceiptFor === invoice.id}
                        >
                          {generatingReceiptFor === invoice.id ? '領収書生成中...' : '📋 領収書生成'}
                        </button>
                      )}
                      {invoice.status === 'paid' && !invoice.receiptDisabled && invoice.receiptUrl && (
                        <a
                          href={invoice.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.receiptButton}
                          style={{ textDecoration: 'none', display: 'inline-block' }}
                        >
                          📎 領収書表示
                        </a>
                      )}
                      {invoice.status === 'paid' && (
                        <button
                          className={invoice.receiptDisabled ? styles.enableButton : styles.disableButton}
                          onClick={() => handleToggleReceiptDisabled(invoice)}
                          title={invoice.receiptDisabled ? '領収書生成を有効にする' : '領収書生成を無効にする'}
                        >
                          {invoice.receiptDisabled ? '🔓 領収書有効化' : '🔒 領収書無効'}
                        </button>
                      )}
                      {invoice.status === 'paid' && invoice.stripePaymentIntentId && (
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleRefund(invoice)}
                        >
                          返金
                        </button>
                      )}
                      {invoice.status !== 'paid' && invoice.status !== 'refunded' && invoice.status !== 'partially_refunded' && (
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteInvoice(invoice)}
                        >
                          削除
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className={styles.modal} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingInvoice ? '請求書編集' : '新規請求書'}
              </h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    クライアント <span className={styles.required}>*</span>
                  </label>
                  <select
                    className={styles.select}
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    required
                  >
                    <option value="">選択してください</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.clientName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    発行日 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    className={styles.input}
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    支払期限 <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    className={styles.input}
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* 請求内容を自動生成ボタン */}
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#ebf8ff', borderRadius: '0.5rem', borderLeft: '4px solid #3182ce' }}>
                <p style={{ marginBottom: '0.5rem', color: '#2c5282', fontSize: '0.95rem' }}>
                  クライアント、発行日、支払期限を入力後、ボタンを押すと請求内容が自動入力されます
                </p>
                <button
                  type="button"
                  className={styles.generateButton}
                  onClick={handleAutoGenerateItems}
                  style={{ width: '100%' }}
                >
                  🔄 請求内容を自動生成
                </button>
              </div>

              <div className={styles.itemsSection}>
                <div className={styles.itemsHeader}>
                  <h3 className={styles.itemsTitle}>明細</h3>
                  <button
                    type="button"
                    className={styles.addItemButton}
                    onClick={handleAddItem}
                  >
                    + 項目追加
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <div className={styles.itemFields}>
                      <input
                        type="text"
                        className={styles.itemInput}
                        placeholder="項目"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        className={styles.itemInputSmall}
                        placeholder="数量"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                      <input
                        type="number"
                        className={styles.itemInputMedium}
                        placeholder="単価"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseInt(e.target.value) || 0)}
                        required
                      />
                      <div className={styles.itemAmount}>
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeItemButton}
                        onClick={() => handleRemoveItem(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.totalsSection}>
                <div className={styles.totalRow}>
                  <span>小計:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>消費税 ({formData.taxRate * 100}%):</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className={styles.totalRowFinal}>
                  <span>合計:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>備考</label>
                <textarea
                  className={styles.textarea}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="備考を入力してください"
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal} disabled={submittingInvoice}>
                  キャンセル
                </button>
                {editingInvoice ? (
                  <button type="button" className={styles.submitButton} onClick={() => handleSubmit()} disabled={submittingInvoice}>
                    {submittingInvoice ? '更新中...' : '更新'}
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className={styles.draftButton}
                      onClick={() => handleSubmit('draft')}
                      disabled={submittingInvoice}
                    >
                      {submittingInvoice ? '保存中...' : '📝 下書き保存'}
                    </button>
                    <button
                      type="button"
                      className={styles.sendButton}
                      onClick={() => handleSubmit('sent')}
                      disabled={submittingInvoice}
                    >
                      {submittingInvoice ? '送付中...' : '📤 送付'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {showGenerateModal && (
        <div className={styles.modal} onClick={() => setShowGenerateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>請求書一括生成</h2>
              <button className={styles.closeButton} onClick={() => setShowGenerateModal(false)}>
                ×
              </button>
            </div>

            <div className={styles.generateForm}>
              <p className={styles.generateDescription}>
                指定した月の請求書を全クライアント分自動生成します。<br />
                管理費は日割り計算され、制作費は請求期間内に支払期限がある場合に含まれます。
              </p>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  請求対象月 <span className={styles.required}>*</span>
                </label>
                <input
                  type="month"
                  className={styles.input}
                  value={generateBillingMonth}
                  onChange={(e) => setGenerateBillingMonth(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowGenerateModal(false)}
                  disabled={generating}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={handleGenerateInvoices}
                  disabled={generating}
                >
                  {generating ? '生成中...' : '生成'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 入金確認モーダル */}
      {showPaymentModal && selectedInvoiceForPayment && (
        <div className={styles.modal} onClick={() => setShowPaymentModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>入金確認</h2>
              <button className={styles.closeButton} onClick={() => setShowPaymentModal(false)}>
                ×
              </button>
            </div>

            <div className={styles.form} style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500', color: '#4a5568' }}>請求書番号:</span>
                  <span style={{ fontWeight: '600' }}>{selectedInvoiceForPayment.invoiceNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500', color: '#4a5568' }}>クライアント:</span>
                  <span style={{ fontWeight: '600' }}>{selectedInvoiceForPayment.clientName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500', color: '#4a5568' }}>請求額:</span>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#2d3748' }}>
                    {formatCurrency(selectedInvoiceForPayment.totalAmount)}
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  入金額 <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  className={styles.input}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="入金額を入力してください"
                  min="0"
                  step="1"
                  required
                />
              </div>

              {paymentAmount && !isNaN(parseFloat(paymentAmount)) && (
                <div style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  backgroundColor: parseFloat(paymentAmount) === selectedInvoiceForPayment.totalAmount
                    ? '#f0fff4'
                    : parseFloat(paymentAmount) > selectedInvoiceForPayment.totalAmount
                      ? '#fffaf0'
                      : '#fff5f5',
                  borderRadius: '0.5rem',
                  borderLeft: '4px solid ' + (
                    parseFloat(paymentAmount) === selectedInvoiceForPayment.totalAmount
                      ? '#38a169'
                      : parseFloat(paymentAmount) > selectedInvoiceForPayment.totalAmount
                        ? '#dd6b20'
                        : '#e53e3e'
                  )
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                      {parseFloat(paymentAmount) === selectedInvoiceForPayment.totalAmount
                        ? '✓ 過不足なし'
                        : parseFloat(paymentAmount) > selectedInvoiceForPayment.totalAmount
                          ? '⚠ 過払い'
                          : '⚠ 不足'}
                    </span>
                    {parseFloat(paymentAmount) !== selectedInvoiceForPayment.totalAmount && (
                      <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                        {parseFloat(paymentAmount) > selectedInvoiceForPayment.totalAmount ? '+' : ''}
                        {formatCurrency(parseFloat(paymentAmount) - selectedInvoiceForPayment.totalAmount)}
                      </span>
                    )}
                  </div>
                  {parseFloat(paymentAmount) !== selectedInvoiceForPayment.totalAmount && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#4a5568' }}>
                      次回請求書で自動調整されます
                    </p>
                  )}
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowPaymentModal(false)}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className={styles.submitButton}
                  onClick={handleConfirmPayment}
                  disabled={!paymentAmount || isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) < 0}
                >
                  入金確認
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default function AdminInvoicesPage() {
  return (
    <Suspense fallback={
      <div className={styles.pageWrapper}>
        <AdminNav />
        <div className={styles.container}>
          <div className={styles.loading}>読み込み中...</div>
        </div>
      </div>
    }>
      <AdminInvoicesContent />
    </Suspense>
  );
}
