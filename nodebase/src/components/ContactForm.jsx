import React, { useState } from 'react';
import '../styles/components/ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [currentStep, setCurrentStep] = useState('input'); // 'input', 'confirm', 'complete'

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'お問い合わせ内容を入力してください';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'お問い合わせ内容は10文字以上で入力してください';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    
    // バリデーション
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // エラーがある場合、最初のエラー要素にスクロール
      const firstErrorField = Object.keys(newErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 確認画面へ
    setCurrentStep('confirm');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep('input');
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setCurrentStep('complete');
        // フォームをリセット
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setSubmitStatus('error');
        setErrors({ submit: data.message || 'エラーが発生しました' });
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrors({ submit: 'ネットワークエラーが発生しました。後ほど再度お試しください。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewInquiry = () => {
    setCurrentStep('input');
    setSubmitStatus(null);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 入力画面
  const renderInputForm = () => (
    <form className="contact-form" onSubmit={handleConfirm}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            お名前 <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="山田 太郎"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            メールアドレス <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="example@email.com"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            電話番号
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            placeholder="090-1234-5678"
          />
        </div>

        <div className="form-group">
          <label htmlFor="company" className="form-label">
            会社名・組織名
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="form-input"
            placeholder="株式会社NodeBase"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="subject" className="form-label">
          件名
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="form-input"
          placeholder="お問い合わせの件名"
        />
      </div>

      <div className="form-group">
        <label htmlFor="message" className="form-label">
          お問い合わせ内容 <span className="required">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          className={`form-textarea ${errors.message ? 'error' : ''}`}
          placeholder="お問い合わせ内容をご記入ください"
          rows="8"
        />
        {errors.message && <span className="error-message">{errors.message}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          確認画面へ
        </button>
      </div>

      <div className="form-notice">
        <p>
          ※ ご入力いただいた個人情報は、お問い合わせへの対応以外の目的では使用いたしません。
        </p>
      </div>
    </form>
  );

  // 確認画面
  const renderConfirmForm = () => (
    <div className="confirm-form">
      <div className="confirm-header">
        <h3>入力内容の確認</h3>
        <p>以下の内容でお問い合わせを送信します。よろしければ「送信する」ボタンをクリックしてください。</p>
      </div>

      <div className="confirm-content">
        <div className="confirm-item">
          <div className="confirm-label">お名前</div>
          <div className="confirm-value">{formData.name}</div>
        </div>

        <div className="confirm-item">
          <div className="confirm-label">メールアドレス</div>
          <div className="confirm-value">{formData.email}</div>
        </div>

        {formData.phone && (
          <div className="confirm-item">
            <div className="confirm-label">電話番号</div>
            <div className="confirm-value">{formData.phone}</div>
          </div>
        )}

        {formData.company && (
          <div className="confirm-item">
            <div className="confirm-label">会社名・組織名</div>
            <div className="confirm-value">{formData.company}</div>
          </div>
        )}

        {formData.subject && (
          <div className="confirm-item">
            <div className="confirm-label">件名</div>
            <div className="confirm-value">{formData.subject}</div>
          </div>
        )}

        <div className="confirm-item">
          <div className="confirm-label">お問い合わせ内容</div>
          <div className="confirm-value confirm-message">{formData.message}</div>
        </div>
      </div>

      {errors.submit && (
        <div className="alert alert-error">
          {errors.submit}
        </div>
      )}

      <div className="confirm-actions">
        <button 
          type="button"
          className="back-button"
          onClick={handleBack}
          disabled={isSubmitting}
        >
          修正する
        </button>
        <button 
          type="button"
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              送信中...
            </>
          ) : (
            '送信する'
          )}
        </button>
      </div>
    </div>
  );

  // 完了画面
  const renderCompleteForm = () => (
    <div className="complete-form">
      <div className="complete-icon">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="38" stroke="#A8C4C7" strokeWidth="4"/>
          <path d="M22 40L34 52L58 28" stroke="#A8C4C7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <h3 className="complete-title">送信完了</h3>
      
      <div className="complete-message">
        <p>
          お問い合わせありがとうございました。
        </p>
        <p>
          ご入力いただいたメールアドレス宛に、確認メールを送信いたしました。
        </p>
        <p>
          内容を確認の上、2営業日以内に担当者よりご連絡させていただきます。
        </p>
      </div>

      <div className="complete-notice">
        <p>
          ※ 確認メールが届かない場合は、迷惑メールフォルダをご確認いただくか、
          <br />
          直接 <a href="mailto:info@nodebase.jp">info@nodebase.jp</a> までご連絡ください。
        </p>
      </div>

      <div className="complete-actions">
        <button 
          type="button"
          className="new-inquiry-button"
          onClick={handleNewInquiry}
        >
          新しいお問い合わせ
        </button>
      </div>
    </div>
  );

  return (
    <div className="contact-form-container">
      <div className="contact-form-wrapper">
        <div className="contact-header">
          <h2 className="contact-title">Contact</h2>
          <p className="contact-subtitle">お問い合わせ</p>
          {currentStep === 'input' && (
            <p className="contact-description">
              ご質問・ご相談がございましたら、お気軽にお問い合わせください。
              <br />2営業日以内にご返信させていただきます。
            </p>
          )}
        </div>

        {/* ステップインジケーター */}
        <div className="step-indicator">
          <div className={`step ${currentStep === 'input' ? 'active' : ''} ${currentStep === 'confirm' || currentStep === 'complete' ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">入力</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep === 'confirm' ? 'active' : ''} ${currentStep === 'complete' ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">確認</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep === 'complete' ? 'active completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">完了</span>
          </div>
        </div>

        {/* 各ステップの表示 */}
        {currentStep === 'input' && renderInputForm()}
        {currentStep === 'confirm' && renderConfirmForm()}
        {currentStep === 'complete' && renderCompleteForm()}
      </div>
    </div>
  );
};

export default ContactForm;