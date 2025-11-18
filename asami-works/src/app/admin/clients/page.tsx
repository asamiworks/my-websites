'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Client, ManagementFeeSchedule } from '@/types/invoice';
import AdminNav from '@/components/admin/AdminNav';
import StripeSetupButton from '@/components/admin/StripeSetupButton';
import styles from './page.module.css';
import ContractModal, { ContractData } from './ContractModal';

const ADMIN_EMAIL = 'admin@asami-works.com';

export default function AdminClientsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractClient, setContractClient] = useState<Client | null>(null);

  // パスワード表示用のモーダル
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [credentialsData, setCredentialsData] = useState({
    clientName: '',
    email: '',
    password: '',
    mypageUrl: ''
  });

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    address: '',
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
      loadClients();
    }
  }, [user, authLoading, router]);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const clientsQuery = query(
        collection(db, 'clients'),
        orderBy('createdAt', 'desc')
      );

      const clientsSnapshot = await getDocs(clientsQuery);
      const clientsData = clientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Client[];

      setClients(clientsData);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('クライアントの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        clientName: client.clientName ?? '',
        email: client.email ?? '',
        phone: client.phone ?? '',
        address: client.address ?? '',
      });
    } else {
      setEditingClient(null);
      setFormData({
        clientName: '',
        email: '',
        phone: '',
        address: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // メールアドレスの必須チェック
      if (!formData.email) {
        setError('メールアドレスは必須です（認証とカード決済に必要）');
        return;
      }

      if (editingClient) {
        // 更新
        await updateDoc(doc(db, 'clients', editingClient.id), {
          clientName: formData.clientName,
          email: formData.email,
          phone: formData.phone || null,
          address: formData.address || null,
          updatedAt: Timestamp.now(),
        });
        alert('クライアント情報を更新しました');
      } else {
        // 新規作成
        // 1. Firestoreにクライアントドキュメントを作成
        const docRef = await addDoc(collection(db, 'clients'), {
          clientName: formData.clientName,
          email: formData.email,
          phone: formData.phone || null,
          address: formData.address || null,
          userId: user?.uid || null,
          paymentMethod: 'bank_transfer', // デフォルトは銀行振込
          isActive: true,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });

        const clientId = docRef.id;

        // 2. Firebase Authenticationユーザーを作成
        const authResponse = await fetch('/api/clients/create-auth-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            clientName: formData.clientName,
            clientId,
          }),
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
          // Authユーザー作成失敗時は、作成したクライアントドキュメントを削除
          await deleteDoc(doc(db, 'clients', clientId));
          throw new Error(authData.error || 'ユーザー作成に失敗しました');
        }

        // 3. マイページURLを生成
        const mypageUrl = `${window.location.origin}/client/login`;

        // 4. クライアントにログイン情報をメールで送信
        const emailResponse = await fetch('/api/clients/send-credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            clientName: formData.clientName,
            mypageUrl,
            password: authData.initialPassword,
          }),
        });

        if (!emailResponse.ok) {
          console.error('メール送信に失敗しましたが、ユーザーは作成されました');
          alert(
            `クライアントを作成しました。\n\nメール送信に失敗したため、以下の情報を手動でお伝えください：\n\nメールアドレス: ${formData.email}\n初期パスワード: ${authData.initialPassword}\nマイページURL: ${mypageUrl}`
          );
        } else {
          alert('クライアントを作成し、ログイン情報をメールで送信しました');
        }
      }

      handleCloseModal();
      loadClients();
    } catch (err: any) {
      console.error('Error saving client:', err);
      setError(err.message || 'クライアントの保存に失敗しました');
    }
  };

  const handleToggleActive = async (client: Client) => {
    try {
      await updateDoc(doc(db, 'clients', client.id), {
        isActive: !client.isActive,
        updatedAt: Timestamp.now(),
      });
      loadClients();
    } catch (err) {
      console.error('Error toggling client status:', err);
      setError('クライアントのステータス変更に失敗しました');
    }
  };

  const handleSetupAuth = async (client: Client) => {
    if (!client.email) {
      setError('メールアドレスが登録されていません');
      return;
    }

    const confirmed = confirm(
      `${client.clientName} 様の認証を設定しますか？\n\nメールアドレス: ${client.email}\n\n初期パスワードを自動生成し、表示します。このパスワードをクライアントにお伝えください。`
    );

    if (!confirmed) return;

    try {
      setError(null);

      // 1. Firebase Authenticationユーザーを作成
      const authResponse = await fetch('/api/clients/create-auth-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: client.email,
          clientName: client.clientName,
          clientId: client.id,
        }),
      });

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        throw new Error(authData.error || 'ユーザー作成に失敗しました');
      }

      // 2. マイページURLを生成
      const mypageUrl = `${window.location.origin}/client/login`;

      // 3. パスワード情報をモーダルで表示
      setCredentialsData({
        clientName: client.clientName,
        email: client.email,
        password: authData.initialPassword,
        mypageUrl
      });
      setShowPasswordModal(true);

      loadClients();
    } catch (err: any) {
      console.error('Error setting up auth:', err);
      setError(err.message || '認証の設定に失敗しました');
    }
  };

  const handleRemoveAuth = async (client: Client) => {
    if (!client.authUid) {
      setError('認証が設定されていません');
      return;
    }

    const confirmed = confirm(
      `${client.clientName} 様の認証を解除しますか？\n\n以下の処理が実行されます：\n- Firebase Authenticationからユーザーを削除\n- ログインできなくなります\n\nこの操作は元に戻せません。`
    );

    if (!confirmed) return;

    try {
      setError(null);

      // 1. Firebase Authenticationからユーザーを削除
      const authResponse = await fetch('/api/clients/delete-auth-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authUid: client.authUid,
        }),
      });

      const authData = await authResponse.json();

      // ユーザーが見つからない場合（既に削除されている場合）も成功とみなす
      if (!authResponse.ok && authResponse.status !== 404 && authData.error !== 'ユーザーが見つかりません') {
        throw new Error(authData.error || 'ユーザー削除に失敗しました');
      }

      // 2. Firestoreから認証関連フィールドをクリア
      await updateDoc(doc(db, 'clients', client.id), {
        authUid: null,
        emailVerified: null,
        passwordHash: null,
        hasInitialPassword: null,
        updatedAt: Timestamp.now(),
      });

      if (authResponse.status === 404 || authData.error === 'ユーザーが見つかりません') {
        alert(`${client.clientName} 様の認証情報をクリアしました（Firebase Authユーザーは既に削除されていました）`);
      } else {
        alert(`${client.clientName} 様の認証を解除しました`);
      }

      loadClients();
    } catch (err: any) {
      console.error('Error removing auth:', err);
      setError(err.message || '認証の解除に失敗しました');
    }
  };

  const handleOpenContractModal = (client: Client) => {
    setContractClient(client);
    setShowContractModal(true);
  };

  const handleCloseContractModal = () => {
    setShowContractModal(false);
    setContractClient(null);
  };

  // Firestoreにundefinedを保存できないため、undefinedを除外するヘルパー関数
  const removeUndefinedValues = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== 'object') return obj;
    // Timestamp オブジェクトはそのまま保持
    if (obj instanceof Timestamp || (obj.toDate && typeof obj.toDate === 'function')) return obj;
    if (Array.isArray(obj)) return obj.map(removeUndefinedValues);

    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== undefined) {
        cleaned[key] = removeUndefinedValues(obj[key]);
      }
    });
    return cleaned;
  };

  const handleSaveContract = async (contractData: ContractData) => {
    if (!contractClient) return;

    try {
      // undefinedを除外してからFirestoreに保存
      const cleanedData = {
        contractStartDate: contractData.contractStartDate ? Timestamp.fromDate(contractData.contractStartDate) : null,
        productionFee: contractData.productionFee,
        productionFeePaid: contractData.productionFeePaid,
        productionFeeBreakdown: removeUndefinedValues(contractData.productionFeeBreakdown),
        paymentMethod: contractData.paymentMethod,
        billingFrequency: contractData.billingFrequency,
        managementFeeSchedule: removeUndefinedValues(contractData.managementFeeSchedule),
        updatedAt: Timestamp.now(),
      };

      await updateDoc(doc(db, 'clients', contractClient.id), cleanedData);
      loadClients();
    } catch (err) {
      console.error('Error saving contract:', err);
      throw err; // ContractModal will handle the error
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

  if (authLoading || loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>読み込み中...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <AdminNav />
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>クライアント管理</h1>
          <p className={styles.subtitle}>
            {clients.length}件のクライアント
          </p>
        </div>
        <button className={styles.addButton} onClick={() => handleOpenModal()}>
          + 新規クライアント
        </button>
      </div>

      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}

      {clients.length === 0 ? (
        <div className={styles.empty}>
          <p>クライアントがありません</p>
          <button className={styles.addButtonLarge} onClick={() => handleOpenModal()}>
            最初のクライアントを追加
          </button>
        </div>
      ) : (
        <div className={styles.clientsTable}>
          <table>
            <thead>
              <tr>
                <th>クライアント名</th>
                <th>支払い方法</th>
                <th>マイページ</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className={!client.isActive ? styles.inactiveRow : ''}>
                  <td className={styles.clientName}>{client.clientName}</td>
                  <td>
                    {client.paymentMethod === 'credit_card' ? 'クレジットカード' :
                     client.paymentMethod === 'bank_debit' ? '口座引き落とし' :
                     client.paymentMethod === 'bank_transfer' ? '銀行振込' : '-'}
                  </td>
                  <td>
                    {client.authUid ? (
                      <div className={styles.authConfiguredContainer}>
                        <span className={styles.authConfigured}>✓ 認証設定済み</span>
                        <button
                          className={styles.removeAuthButton}
                          onClick={() => handleRemoveAuth(client)}
                        >
                          認証解除
                        </button>
                      </div>
                    ) : client.email ? (
                      <button
                        className={styles.setupAuthButton}
                        onClick={() => handleSetupAuth(client)}
                      >
                        認証設定
                      </button>
                    ) : (
                      <span className={styles.noEmail}>メール未登録</span>
                    )}
                  </td>
                  <td>
                    <span className={client.isActive ? styles.statusActive : styles.statusInactive}>
                      {client.isActive ? '有効' : '無効'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleOpenModal(client)}
                      >
                        編集
                      </button>
                      <button
                        className={styles.contractButton}
                        onClick={() => handleOpenContractModal(client)}
                      >
                        契約情報
                      </button>
                      {client.contractStartDate && client.managementFeeSchedule && client.managementFeeSchedule.length > 0 && (
                        <StripeSetupButton
                          clientId={client.id}
                          clientName={client.clientName}
                          disabled={!client.isActive}
                        />
                      )}
                      <button
                        className={styles.toggleButton}
                        onClick={() => handleToggleActive(client)}
                      >
                        {client.isActive ? '無効化' : '有効化'}
                      </button>
                      <button
                        className={styles.invoiceButton}
                        onClick={() => router.push(`/admin/invoices?clientId=${client.id}`)}
                      >
                        請求書
                      </button>
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
                {editingClient ? 'クライアント編集' : '新規クライアント'}
              </h2>
              <button className={styles.closeButton} onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  クライアント名 <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  メールアドレス
                </label>
                <input
                  type="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>電話番号</label>
                <input
                  type="tel"
                  className={styles.input}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>住所</label>
                <textarea
                  className={styles.textarea}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.cancelButton} onClick={handleCloseModal}>
                  キャンセル
                </button>
                <button type="submit" className={styles.submitButton}>
                  {editingClient ? '更新' : '作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showContractModal && contractClient && (
        <ContractModal
          client={contractClient}
          onClose={handleCloseContractModal}
          onSave={handleSaveContract}
        />
      )}

      {/* パスワード表示モーダル */}
      {showPasswordModal && (
        <div className={styles.modal} onClick={() => setShowPasswordModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                認証設定完了
              </h2>
              <button className={styles.closeButton} onClick={() => setShowPasswordModal(false)}>
                ×
              </button>
            </div>

            <div className={styles.credentialsContainer}>
              <p className={styles.credentialsNote}>
                {credentialsData.clientName} 様の認証を設定しました。<br/>
                以下の情報を使用してログインできます。
              </p>

              <div className={styles.credentialItem}>
                <label className={styles.credentialLabel}>クライアント名</label>
                <div className={styles.credentialValueContainer}>
                  <input
                    type="text"
                    className={styles.credentialValue}
                    value={credentialsData.clientName}
                    readOnly
                  />
                  <button
                    className={styles.copyButton}
                    onClick={() => {
                      navigator.clipboard.writeText(credentialsData.clientName);
                      alert('コピーしました');
                    }}
                  >
                    📋 コピー
                  </button>
                </div>
              </div>

              <div className={styles.credentialItem}>
                <label className={styles.credentialLabel}>メールアドレス</label>
                <div className={styles.credentialValueContainer}>
                  <input
                    type="text"
                    className={styles.credentialValue}
                    value={credentialsData.email}
                    readOnly
                  />
                  <button
                    className={styles.copyButton}
                    onClick={() => {
                      navigator.clipboard.writeText(credentialsData.email);
                      alert('コピーしました');
                    }}
                  >
                    📋 コピー
                  </button>
                </div>
              </div>

              <div className={styles.credentialItem}>
                <label className={styles.credentialLabel}>初期パスワード</label>
                <div className={styles.credentialValueContainer}>
                  <input
                    type="text"
                    className={styles.credentialValue}
                    value={credentialsData.password}
                    readOnly
                  />
                  <button
                    className={styles.copyButton}
                    onClick={() => {
                      navigator.clipboard.writeText(credentialsData.password);
                      alert('コピーしました');
                    }}
                  >
                    📋 コピー
                  </button>
                </div>
              </div>

              <div className={styles.credentialItem}>
                <label className={styles.credentialLabel}>マイページURL</label>
                <div className={styles.credentialValueContainer}>
                  <input
                    type="text"
                    className={styles.credentialValue}
                    value={credentialsData.mypageUrl}
                    readOnly
                  />
                  <button
                    className={styles.copyButton}
                    onClick={() => {
                      navigator.clipboard.writeText(credentialsData.mypageUrl);
                      alert('コピーしました');
                    }}
                  >
                    📋 コピー
                  </button>
                </div>
              </div>

              <div className={styles.warningNote}>
                ⚠️ この情報は安全に保管してください。パスワードは初回ログイン後に変更することを推奨します。
              </div>

              <button
                className={styles.closeModalButton}
                onClick={() => setShowPasswordModal(false)}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
