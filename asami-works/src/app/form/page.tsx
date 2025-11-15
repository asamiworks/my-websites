"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { api } from "@/lib/api";
import styles from "./form.module.css";

const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

type SubmitMessage = {
  type: 'success' | 'error';
  text: string;
};

// FormContentコンポーネント（useSearchParams()を使用）
function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string>("");
  const [isFormAttempted, setIsFormAttempted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    company: "",
    budget: "",
    deadline: "",
    inquiryType: "",
    other: "",
    message: "",
    // サポート関連の追加フィールド
    supportType: "",
    siteUrl: "",
    urgency: "",
    // 広告ページ制作関連の追加フィールド
    prPagePurpose: "",
    prPagePeriod: "",
  });

  // チャットから来たかどうかのフラグ
  const [isFromChat, setIsFromChat] = useState(false);
  const [chatConversation, setChatConversation] = useState("");
  const [isChatExpanded, setIsChatExpanded] = useState(false);

  // URLパラメータから初期値を設定
  useEffect(() => {
    const type = searchParams.get('type');
    const service = searchParams.get('service');
    const from = searchParams.get('from');

    if (type === 'support') {
      setFormData(prev => ({
        ...prev,
        inquiryType: "サポート・設定支援"
      }));
    } else if (service === 'pr-page') {
      setFormData(prev => ({
        ...prev,
        inquiryType: "広告ページ制作について"
      }));
    }

    // チャットから来た場合、会話内容を読み込む
    if (from === 'chat') {
      const conversation = localStorage.getItem('chatConversation');
      const businessType = localStorage.getItem('chatBusinessType');
      const contactName = localStorage.getItem('chatContactName');
      const contactEmail = localStorage.getItem('chatContactEmail');
      const contactPhone = localStorage.getItem('chatContactPhone');
      const contactCompany = localStorage.getItem('chatContactCompany');

      if (conversation) {
        setIsFromChat(true);
        setChatConversation(conversation);
        setFormData(prev => ({
          ...prev,
          name: contactName || '',
          email: contactEmail || '',
          tel: contactPhone || '',
          company: contactCompany || businessType || '',
          inquiryType: 'AIチャットからの相談',
          message: `【チャットでの相談内容】\n\n${conversation}\n\n【追加のご要望・ご質問】\n`
        }));
        // 読み込んだら削除
        localStorage.removeItem('chatConversation');
        localStorage.removeItem('chatBusinessType');
        localStorage.removeItem('chatContactName');
        localStorage.removeItem('chatContactEmail');
        localStorage.removeItem('chatContactPhone');
        localStorage.removeItem('chatContactCompany');
      }
    }
  }, [searchParams]);

  // スクロール位置をトップに戻す
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showConfirm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    // フォーム送信を試みたことを記録
    setIsFormAttempted(true);

    // HTML5バリデーションを実行
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
      // バリデーションエラーがある場合は、ブラウザのデフォルトのバリデーションメッセージを表示
      form.reportValidity();
      return;
    }

    // ローカル環境ではreCAPTCHAをスキップ
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('開発環境: reCAPTCHAをスキップ');
      setRecaptchaToken('dummy-token-for-development');
      setShowConfirm(true);
      return;
    }

    // 本番環境でreCAPTCHA v3を実行
    if (!executeRecaptcha) {
      alert("reCAPTCHAの読み込みに失敗しました。ページを再読み込みしてください。");
      return;
    }

    try {
      const token = await executeRecaptcha('submit');
      setRecaptchaToken(token);
      setShowConfirm(true);
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      alert("reCAPTCHAの検証に失敗しました。もう一度お試しください。");
    }
  };

  const handleBack = () => {
    setShowConfirm(false);
    setSubmitMessage(null);
    setRecaptchaToken("");
  };

  const handleSend = async () => {
    try {
      setIsSubmitting(true);
      setSubmitMessage(null);

      console.log('フォーム送信開始:', formData);

      // メッセージを構築
      let fullMessage = `【ご相談内容】${formData.inquiryType}${formData.other ? ` - ${formData.other}` : ''}\n\n`;
      
      // サポート依頼の場合、追加情報を含める
      if (formData.inquiryType === "サポート・設定支援") {
        if (formData.supportType) {
          fullMessage += `【サポート種別】${formData.supportType}\n`;
        }
        if (formData.siteUrl) {
          fullMessage += `【対象サイト】${formData.siteUrl}\n`;
        }
        if (formData.urgency) {
          fullMessage += `【緊急度】${formData.urgency}\n`;
        }
        fullMessage += '\n';
      }
      
      // 広告ページ制作の場合、追加情報を含める
      if (formData.inquiryType === "広告ページ制作について") {
        if (formData.prPagePurpose) {
          fullMessage += `【用途】${formData.prPagePurpose}\n`;
        }
        if (formData.prPagePeriod) {
          fullMessage += `【掲載期間】${formData.prPagePeriod}\n`;
        }
        fullMessage += '\n';
      }
      
      fullMessage += formData.message || '';

      // Form APIが期待する形式にデータを送信
      const submitData = {
        name: formData.name,
        email: formData.email,
        tel: formData.tel || "未入力",
        company: formData.company || "未入力",
        budget: formData.budget || "未定",
        deadline: formData.deadline || "未定",
        inquiryType: formData.inquiryType,
        other: formData.other,
        message: fullMessage,
        token: recaptchaToken
      };

      console.log('送信データ:', submitData);

      const result = await api.form(submitData);

      if (result.success) {
        // 送信成功
        setSubmitMessage({
          type: 'success',
          text: result.message || 'お問い合わせを受け付けました。自動返信メールをご確認ください。'
        });

        // フォームをリセット
        setFormData({
          name: "",
          email: "",
          tel: "",
          company: "",
          budget: "",
          deadline: "",
          inquiryType: "",
          other: "",
          message: "",
          supportType: "",
          siteUrl: "",
          urgency: "",
          prPagePurpose: "",
          prPagePeriod: "",
        });
        
        // フォーム送信試行フラグもリセット
        setIsFormAttempted(false);
        
        // 3秒後にTOPページに移動
        setTimeout(() => {
          router.push("/");
        }, 3000);

      } else {
        throw new Error(result.message || 'システムエラーが発生しました');
      }

    } catch (error) {
      console.error('送信エラー:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'ネットワークエラーが発生しました。時間をおいて再度お試しください。'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 確認画面
  if (showConfirm) {
    return (
      <section className={styles.section}>
        <h1 className={styles.title}>入力内容のご確認</h1>
        
        {/* 送信メッセージ */}
        {submitMessage && (
          <div className={`${styles.message} ${styles[submitMessage.type]}`}>
            {submitMessage.text}
            {submitMessage.type === 'success' && (
              <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                3秒後にTOPページに移動します...
              </p>
            )}
          </div>
        )}

        {!submitMessage && (
          <>
            <div className={styles.confirmTable}>
              <p><strong>お名前：</strong>{formData.name}</p>
              <p><strong>メールアドレス：</strong>{formData.email}</p>
              
              {formData.tel && (
                <p><strong>電話番号：</strong>{formData.tel}</p>
              )}
              {formData.company && (
                <p><strong>会社名：</strong>{formData.company}</p>
              )}
              
              <p><strong>ご相談内容：</strong>{formData.inquiryType}</p>
              
              {/* サポート依頼の追加情報 */}
              {formData.inquiryType === "サポート・設定支援" && (
                <>
                  {formData.supportType && (
                    <p><strong>サポート種別：</strong>{formData.supportType}</p>
                  )}
                  {formData.siteUrl && (
                    <p><strong>対象サイト：</strong>{formData.siteUrl}</p>
                  )}
                  {formData.urgency && (
                    <p><strong>緊急度：</strong>{formData.urgency}</p>
                  )}
                </>
              )}
              
              {/* 広告ページ制作の追加情報 */}
              {formData.inquiryType === "広告ページ制作について" && (
                <>
                  {formData.prPagePurpose && (
                    <p><strong>用途：</strong>{formData.prPagePurpose}</p>
                  )}
                  {formData.prPagePeriod && (
                    <p><strong>掲載期間：</strong>{formData.prPagePeriod}</p>
                  )}
                </>
              )}
              
              {/* 新規制作の場合の予算・納期 */}
              {(formData.inquiryType === "ホームページ制作について" || 
                formData.inquiryType === "補助金を活用した相談" ||
                formData.inquiryType === "見積もりの依頼" ||
                formData.inquiryType === "広告ページ制作について") && (
                <>
                  {formData.budget && (
                    <p><strong>ご予算：</strong>{formData.budget}</p>
                  )}
                  {formData.deadline && (
                    <p><strong>ご希望納期：</strong>{formData.deadline}</p>
                  )}
                </>
              )}
              
              {formData.inquiryType === "その他" && formData.other && (
                <p><strong>その他の内容：</strong>{formData.other}</p>
              )}
              {formData.message && (
                <div>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>詳細内容：</strong>
                    {isFromChat && (
                      <button
                        onClick={() => setIsChatExpanded(!isChatExpanded)}
                        style={{
                          marginLeft: '10px',
                          padding: '4px 12px',
                          fontSize: '14px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        type="button"
                      >
                        {isChatExpanded ? '▲ 閉じる' : '▼ チャット内容を表示'}
                      </button>
                    )}
                  </p>
                  {(!isFromChat || isChatExpanded) && (
                    <div style={{ whiteSpace: 'pre-wrap', marginTop: '8px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                      {formData.message}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.confirmButtons}>
              <button 
                type="button" 
                onClick={handleBack} 
                className={styles.backButton}
                disabled={isSubmitting}
              >
                戻る
              </button>
              <button 
                type="button" 
                onClick={handleSend} 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? '送信中...' : '送信する'}
              </button>
            </div>
          </>
        )}
      </section>
    );
  }

  // 入力画面
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>お問い合わせフォーム</h1>
      <form 
        onSubmit={handleConfirm} 
        className={`${styles.form} ${isFormAttempted ? styles.formAttempted : ''}`}
      >
        {/* お名前 */}
        <div className={styles.formGroup}>
          <span className={styles.label}>お名前（必須）</span>
          <input
            type="text"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="例: 山田太郎"
            title="お名前を入力してください"
          />
        </div>

        {/* メールアドレス */}
        <div className={styles.formGroup}>
          <span className={styles.label}>メールアドレス（必須）</span>
          <input
            type="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="例: info@example.com"
            title="有効なメールアドレスを入力してください"
          />
        </div>

        {/* 電話番号 */}
        <div className={styles.formGroup}>
          <span className={styles.label}>電話番号</span>
          <input
            type="tel"
            name="tel"
            className={styles.input}
            value={formData.tel}
            onChange={handleChange}
            placeholder="例: 03-1234-5678"
            pattern="[0-9]{2,4}-?[0-9]{2,4}-?[0-9]{3,4}"
            title="電話番号の形式が正しくありません（例: 03-1234-5678）"
          />
        </div>

        {/* 会社名 */}
        <div className={styles.formGroup}>
          <span className={styles.label}>会社名</span>
          <input
            type="text"
            name="company"
            className={styles.input}
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        {/* ご相談内容 */}
        <div className={styles.formGroup}>
          <span className={styles.label}>ご相談内容（必須）</span>
          <select
            name="inquiryType"
            className={styles.select}
            value={formData.inquiryType}
            onChange={handleChange}
            required
            title="ご相談内容を選択してください"
            disabled={isFromChat}
          >
            <option value="" disabled>選択してください</option>
            <option value="ホームページ制作について">ホームページ制作について</option>
            <option value="広告ページ制作について">広告ページ制作について</option>
            <option value="補助金を活用した相談">補助金を活用した相談</option>
            <option value="料金プランについて">料金プランについて</option>
            <option value="見積もりの依頼">見積もりの依頼</option>
            <option value="サポート・設定支援">サポート・設定支援</option>
            <option value="AIチャットからの相談">AIチャットからの相談</option>
            <option value="その他">その他</option>
          </select>
        </div>

        {/* 広告ページ制作の場合の追加フィールド */}
        {formData.inquiryType === "広告ページ制作について" && (
          <>
            {/* 用途 */}
            <div className={styles.formGroup}>
              <span className={styles.label}>用途</span>
              <select
                name="prPagePurpose"
                className={styles.select}
                value={formData.prPagePurpose}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="キャンペーン告知">キャンペーン・イベント告知</option>
                <option value="店舗案内">店舗・サービス案内</option>
                <option value="名刺用URL">名刺用URL</option>
                <option value="商品・サービス紹介">商品・サービス紹介</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* 掲載期間 */}
            <div className={styles.formGroup}>
              <span className={styles.label}>掲載期間の予定</span>
              <select
                name="prPagePeriod"
                className={styles.select}
                value={formData.prPagePeriod}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="6ヶ月">6ヶ月</option>
                <option value="1年">1年</option>
                <option value="2年以上">2年以上</option>
                <option value="期間限定">期間限定（終了日あり）</option>
                <option value="未定">未定</option>
              </select>
            </div>
          </>
        )}

        {/* サポート依頼の場合の追加フィールド */}
        {formData.inquiryType === "サポート・設定支援" && (
          <>
            {/* サポート種別 */}
            <div className={styles.formGroup}>
              <span className={styles.label}>サポート種別</span>
              <select
                name="supportType"
                className={styles.select}
                value={formData.supportType}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="メール設定">メール設定</option>
                <option value="サイト更新・修正">サイト更新・修正</option>
                <option value="エラー・不具合対応">エラー・不具合対応</option>
                <option value="使い方・操作方法">使い方・操作方法</option>
                <option value="パスワード変更">パスワード変更</option>
                <option value="その他のサポート">その他のサポート</option>
              </select>
            </div>

            {/* 対象サイトURL */}
            <div className={styles.formGroup}>
              <span className={styles.label}>対象サイトのURL</span>
              <input
                type="text"
                name="siteUrl"
                className={styles.input}
                value={formData.siteUrl}
                onChange={handleChange}
                placeholder="例: https://example.com"
              />
            </div>

            {/* 緊急度 */}
            <div className={styles.formGroup}>
              <span className={styles.label}>緊急度</span>
              <select
                name="urgency"
                className={styles.select}
                value={formData.urgency}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                <option value="緊急（本日中）">緊急（本日中）</option>
                <option value="急ぎ（2-3日以内）">急ぎ（2-3日以内）</option>
                <option value="通常（1週間以内）">通常（1週間以内）</option>
                <option value="時間に余裕あり">時間に余裕あり</option>
              </select>
            </div>
          </>
        )}

        {/* 新規制作の場合の予算・納期フィールド */}
        {(formData.inquiryType === "ホームページ制作について" || 
          formData.inquiryType === "補助金を活用した相談" ||
          formData.inquiryType === "見積もりの依頼" ||
          formData.inquiryType === "広告ページ制作について") && (
          <>
            {/* ご予算 */}
            <div className={styles.formGroup}>
              <span className={styles.label}>ご予算</span>
              <select
                name="budget"
                className={styles.select}
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                {formData.inquiryType === "広告ページ制作について" ? (
                  <>
                    <option value="10万円以下">10万円以下</option>
                    <option value="10万円～30万円">10万円～30万円</option>
                    <option value="30万円～50万円">30万円～50万円</option>
                    <option value="50万円以上">50万円以上</option>
                  </>
                ) : (
                  <>
                    <option value="50万円以下">50万円以下</option>
                    <option value="50万円～100万円">50万円～100万円</option>
                    <option value="100万円～200万円">100万円～200万円</option>
                    <option value="200万円以上">200万円以上</option>
                  </>
                )}
                <option value="未定">未定</option>
              </select>
            </div>

            {/* ご希望納期 */}
            <div className={styles.formGroup}>
              <span className={styles.label}>ご希望納期</span>
              <select
                name="deadline"
                className={styles.select}
                value={formData.deadline}
                onChange={handleChange}
              >
                <option value="">選択してください</option>
                {formData.inquiryType === "広告ページ制作について" ? (
                  <>
                    <option value="1週間以内">1週間以内</option>
                    <option value="2週間以内">2週間以内</option>
                    <option value="1ヶ月以内">1ヶ月以内</option>
                    <option value="1ヶ月以上">1ヶ月以上</option>
                  </>
                ) : (
                  <>
                    <option value="1ヶ月以内">1ヶ月以内</option>
                    <option value="2ヶ月以内">2ヶ月以内</option>
                    <option value="3ヶ月以内">3ヶ月以内</option>
                    <option value="3ヶ月以上">3ヶ月以上</option>
                  </>
                )}
                <option value="未定">未定</option>
              </select>
            </div>
          </>
        )}

        {/* その他の内容 */}
        {formData.inquiryType === "その他" && (
          <div className={styles.formGroup}>
            <span className={styles.label}>その他の内容</span>
            <input
              type="text"
              name="other"
              className={styles.input}
              value={formData.other}
              onChange={handleChange}
            />
          </div>
        )}

        {/* 詳細内容 */}
        <div className={styles.formGroup}>
          <span className={styles.label}>
            詳細内容
            {formData.inquiryType === "サポート・設定支援" && "（具体的な症状や状況をお書きください）"}
            {formData.inquiryType === "広告ページ制作について" && "（掲載したい内容をお書きください）"}
          </span>

          {/* チャットから来た場合は読み取り専用で表示 */}
          {isFromChat ? (
            <>
              <div className={styles.chatConversationBox}>
                <div className={styles.chatConversationHeader}>
                  <strong>チャットでの相談内容（編集不可）</strong>
                </div>
                <div className={styles.chatConversationContent}>
                  {chatConversation}
                </div>
              </div>
              <textarea
                name="message"
                className={styles.textarea}
                value={formData.message.replace(`【チャットでの相談内容】\n\n${chatConversation}\n\n【追加のご要望・ご質問】\n`, '')}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    message: `【チャットでの相談内容】\n\n${chatConversation}\n\n【追加のご要望・ご質問】\n${e.target.value}`
                  }));
                }}
                rows={5}
                placeholder="追加のご要望やご質問があればこちらにご記入ください"
              />
            </>
          ) : (
            <textarea
              name="message"
              className={styles.textarea}
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder={
                formData.inquiryType === "サポート・設定支援"
                  ? "例：メールが送信できない、サイトの画像を変更したい、など具体的にお書きください"
                  : formData.inquiryType === "広告ページ制作について"
                  ? "例：掲載したい商品・サービスの内容、営業時間、連絡先など"
                  : "ご相談内容の詳細をご記入ください"
              }
            />
          )}
        </div>

        {/* 送信ボタン */}
        <button 
          type="submit" 
          className={styles.submitButton}
        >
          確認画面へ
        </button>
      </form>
    </section>
  );
}

// ローディングコンポーネント
function FormLoading() {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>お問い合わせフォーム</h1>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>読み込み中...</p>
      </div>
    </section>
  );
}

// メインコンポーネント（GoogleReCaptchaProviderとSuspenseでラップ）
export default function FormPage() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <Suspense fallback={<FormLoading />}>
        <FormContent />
      </Suspense>
    </GoogleReCaptchaProvider>
  );
}
