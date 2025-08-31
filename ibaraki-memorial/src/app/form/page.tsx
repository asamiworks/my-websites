"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../styles/Form.module.css";

type FormState = "input" | "confirm" | "thanks";

export default function ContactForm() {
  const [mounted, setMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    options: [] as string[],
    visitDates: ["", "", ""] as [string, string, string],
    visitTimes: ["", "", ""] as [string, string, string],
    phonePreference: "",
    phoneNumber: "",
    phoneTimeSlots: [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formState, setFormState] = useState<FormState>("input");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateDateOptions = () => {
    if (!mounted) return [];
    
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      
      dates.push({
        value: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        label: `${month}月${day}日（${dayOfWeek}）`
      });
    }
    
    return dates;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newOptions = checked
        ? [...prev.options, value]
        : prev.options.filter((option) => option !== value);
      
      if (!checked && value === "見学をしたい") {
        return { ...prev, options: newOptions, visitDates: ["", "", ""], visitTimes: ["", "", ""] };
      }
      
      return { ...prev, options: newOptions };
    });
    setErrors({ ...errors, options: "" });
  };

  const handleVisitDateChange = (index: number, value: string) => {
    const newVisitDates = [...formData.visitDates] as [string, string, string];
    newVisitDates[index] = value;
    setFormData({ ...formData, visitDates: newVisitDates });
    setErrors({ ...errors, visitDates: "" });
  };

  const handleVisitTimeChange = (index: number, value: string) => {
    const newVisitTimes = [...formData.visitTimes] as [string, string, string];
    newVisitTimes[index] = value;
    setFormData({ ...formData, visitTimes: newVisitTimes });
    setErrors({ ...errors, visitDates: "" });
  };

  const handlePhonePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      phonePreference: value,
      phoneNumber: value === "no" ? "" : prev.phoneNumber,
      phoneTimeSlots: value === "no" ? [] : prev.phoneTimeSlots
    }));
    setErrors({ ...errors, phonePreference: "", phoneNumber: "", phoneTimeSlots: "" });
  };

  const handlePhoneTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newPhoneTimeSlots = checked
        ? [...prev.phoneTimeSlots, value]
        : prev.phoneTimeSlots.filter((slot) => slot !== value);
      return { ...prev, phoneTimeSlots: newPhoneTimeSlots };
    });
    setErrors({ ...errors, phoneTimeSlots: "" });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "お名前を入力してください";
    if (!formData.email.trim()) newErrors.email = "メールアドレスを入力してください";
    else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(formData.email))
      newErrors.email = "正しいメールアドレスを入力してください";
    if (formData.options.length === 0) newErrors.options = "ご希望内容を選択してください";
    
    if (formData.options.includes("見学をしたい")) {
      const hasAtLeastOneComplete = formData.visitDates.some((date, index) => 
        date !== "" && formData.visitTimes[index] !== ""
      );
      if (!hasAtLeastOneComplete) {
        newErrors.visitDates = "見学希望日時を少なくとも1つ選択してください（日付と時間の両方が必要です）";
      }
    }
    
    if (!formData.phonePreference) {
      newErrors.phonePreference = "電話でのご連絡希望を選択してください";
    }
    
    if (formData.phonePreference === "yes" && !formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "電話番号を入力してください";
    } else if (formData.phonePreference === "yes" && 
               !/^[0-9０-９\-ー－()（）]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "正しい電話番号を入力してください";
    }
    
    if (formData.phonePreference === "yes" && formData.phoneTimeSlots.length === 0) {
      newErrors.phoneTimeSlots = "電話可能時間帯を選択してください";
    }
    
    if (formData.options.includes("その他") && !formData.message.trim()) {
      newErrors.message = "「その他」を選択した場合、お問い合わせ内容の入力が必要です";
    }
    
    return newErrors;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setFormState("confirm");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      interface SubmitData {
        name: string;
        email: string;
        message: string;
        options: string[];
        phonePreference: string;
        phoneNumber?: string;
        phoneTimeSlots: string[];
        visitDates?: string[];
        visitTimes?: string[];
      }

      const submitData: SubmitData = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        options: formData.options,
        phonePreference: formData.phonePreference,
        phoneTimeSlots: formData.phoneTimeSlots
      };

      if (formData.phonePreference === "yes") {
        submitData.phoneNumber = formData.phoneNumber;
      }

      if (formData.options.includes("見学をしたい")) {
        submitData.visitDates = formData.visitDates;
        submitData.visitTimes = formData.visitTimes;
      }

      const response = await fetch('https://ibaraki-memorial.com/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const responseText = await response.text();
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSONパースエラー:', parseError);
        console.error('レスポンス内容:', responseText);
        alert('サーバーエラーが発生しました。管理者にお問い合わせください。');
        return;
      }

      if (response.ok && result.success) {
        setFormState("thanks");
        setFormData({
          name: "",
          email: "",
          message: "",
          options: [],
          visitDates: ["", "", ""],
          visitTimes: ["", "", ""],
          phonePreference: "",
          phoneNumber: "",
          phoneTimeSlots: [],
        });
      } else {
        alert(result.message || '送信に失敗しました。もう一度お試しください。');
      }
    } catch (err) {
      console.error('送信エラー:', err);
      alert('送信エラーが発生しました。時間をおいてもう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setFormState("input");
  };

  const handleNewInquiry = () => {
    setFormState("input");
    setErrors({});
  };

  if (formState === "input") {
    return (
      <section className={styles.formSection}>
        <h2 className={styles.formTitle}>お問い合わせフォーム</h2>
        <p className={styles.formDescription}>
          見学のご予約や料金についてなど、お気軽にお問い合わせください。
        </p>

        <form onSubmit={handleConfirm} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              お名前<span className={styles.required}>必須</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? styles.errorInput : ""}
              placeholder="山田 太郎"
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              メールアドレス<span className={styles.required}>必須</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.errorInput : ""}
              placeholder="example@email.com"
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              ご希望内容<span className={styles.required}>必須</span>
            </label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  name="options"
                  value="見学をしたい"
                  checked={formData.options.includes("見学をしたい")}
                  onChange={handleCheckboxChange}
                />
                <span>見学をしたい</span>
              </label>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  name="options"
                  value="料金について詳しく知りたい"
                  checked={formData.options.includes("料金について詳しく知りたい")}
                  onChange={handleCheckboxChange}
                />
                <span>料金について詳しく知りたい</span>
              </label>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  name="options"
                  value="資料請求"
                  checked={formData.options.includes("資料請求")}
                  onChange={handleCheckboxChange}
                />
                <span>資料請求</span>
              </label>
              <label className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  name="options"
                  value="その他"
                  checked={formData.options.includes("その他")}
                  onChange={handleCheckboxChange}
                />
                <span>その他</span>
              </label>
            </div>
            {errors.options && <p className={styles.error}>{errors.options}</p>}
          </div>

          {formData.options.includes("見学をしたい") && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                見学希望日時<span className={styles.required}>必須</span>
              </label>
              <p className={styles.formHelp}>
                ご希望の見学日時を第3希望まで選択してください（少なくとも1つは必須）
              </p>
              <div className={styles.visitDateTimeGroup}>
                {[0, 1, 2].map((index) => (
                  <div key={index} className={styles.visitDateTimeItem}>
                    <label className={styles.visitLabel}>第{index + 1}希望</label>
                    <div className={styles.dateTimeInputs}>
                      {mounted ? (
                        <select
                          value={formData.visitDates[index]}
                          onChange={(e) => handleVisitDateChange(index, e.target.value)}
                          className={`${styles.dateSelect} ${errors.visitDates && index === 0 ? styles.errorInput : ""}`}
                        >
                          <option value="">日付を選択</option>
                          {generateDateOptions().map((date) => (
                            <option key={date.value} value={date.value}>
                              {date.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <select disabled className={styles.dateSelect}>
                          <option>読み込み中...</option>
                        </select>
                      )}
                      <select
                        value={formData.visitTimes[index]}
                        onChange={(e) => handleVisitTimeChange(index, e.target.value)}
                        disabled={!formData.visitDates[index]}
                        className={`${styles.timeSelect} ${errors.visitDates && index === 0 ? styles.errorInput : ""}`}
                      >
                        <option value="">時間を選択</option>
                        <option value="09:00">9:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="12:00">12:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              {errors.visitDates && <p className={styles.error}>{errors.visitDates}</p>}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>
              電話でのご連絡<span className={styles.required}>必須</span>
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioItem}>
                <input
                  type="radio"
                  name="phonePreference"
                  value="yes"
                  checked={formData.phonePreference === "yes"}
                  onChange={handlePhonePreferenceChange}
                />
                <span>電話連絡を希望する</span>
              </label>
              <label className={styles.radioItem}>
                <input
                  type="radio"
                  name="phonePreference"
                  value="no"
                  checked={formData.phonePreference === "no"}
                  onChange={handlePhonePreferenceChange}
                />
                <span>電話連絡を希望しない（メールのみ）</span>
              </label>
            </div>
            {errors.phonePreference && <p className={styles.error}>{errors.phonePreference}</p>}
          </div>

          {formData.phonePreference === "yes" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                電話番号<span className={styles.required}>必須</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? styles.errorInput : ""}
                placeholder="090-1234-5678"
              />
              {errors.phoneNumber && <p className={styles.error}>{errors.phoneNumber}</p>}
            </div>
          )}

          {formData.phonePreference === "yes" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>
                電話可能時間帯<span className={styles.required}>必須</span>
              </label>
              <p className={styles.formHelp}>
                ご都合の良い時間帯をお選びください（複数選択可）
              </p>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="phoneTimeSlots"
                    value="土曜日 09:00-10:00"
                    checked={formData.phoneTimeSlots.includes("土曜日 09:00-10:00")}
                    onChange={handlePhoneTimeChange}
                  />
                  <span>土曜日 09:00-10:00</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="phoneTimeSlots"
                    value="土曜日 10:00-11:00"
                    checked={formData.phoneTimeSlots.includes("土曜日 10:00-11:00")}
                    onChange={handlePhoneTimeChange}
                  />
                  <span>土曜日 10:00-11:00</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="phoneTimeSlots"
                    value="土曜日 11:00-12:00"
                    checked={formData.phoneTimeSlots.includes("土曜日 11:00-12:00")}
                    onChange={handlePhoneTimeChange}
                  />
                  <span>土曜日 11:00-12:00</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="phoneTimeSlots"
                    value="日曜日 09:00-10:00"
                    checked={formData.phoneTimeSlots.includes("日曜日 09:00-10:00")}
                    onChange={handlePhoneTimeChange}
                  />
                  <span>日曜日 09:00-10:00</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="phoneTimeSlots"
                    value="日曜日 10:00-11:00"
                    checked={formData.phoneTimeSlots.includes("日曜日 10:00-11:00")}
                    onChange={handlePhoneTimeChange}
                  />
                  <span>日曜日 10:00-11:00</span>
                </label>
                <label className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    name="phoneTimeSlots"
                    value="日曜日 11:00-12:00"
                    checked={formData.phoneTimeSlots.includes("日曜日 11:00-12:00")}
                    onChange={handlePhoneTimeChange}
                  />
                  <span>日曜日 11:00-12:00</span>
                </label>
              </div>
              {errors.phoneTimeSlots && <p className={styles.error}>{errors.phoneTimeSlots}</p>}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label}>
              お問い合わせ内容
              {formData.options.includes("その他") ? (
                <span className={styles.required}>必須</span>
              ) : (
                <span className={styles.optional}>任意</span>
              )}
            </label>
            <textarea
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? styles.errorInput : ""}
              placeholder="ご質問やご要望などをご記入ください"
            />
            {errors.message && <p className={styles.error}>{errors.message}</p>}
          </div>

          <button type="submit" className={styles.submitButton}>
            入力内容を確認する
          </button>
        </form>
      </section>
    );
  }

  if (formState === "confirm") {
    const formatVisitDates = () => {
      const validDates = formData.visitDates
        .map((date, index) => {
          if (date && formData.visitTimes[index]) {
            return { date, time: formData.visitTimes[index], index };
          }
          return null;
        })
        .filter(item => item !== null);

      if (validDates.length === 0) return "（なし）";
      
      return validDates.map((item) => {
        const [year, month, day] = item!.date.split('-');
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const weekday = weekdays[dateObj.getDay()];
        
        return `第${item!.index + 1}希望: ${year}年${Number(month)}月${Number(day)}日（${weekday}） ${item!.time}`;
      }).join("、");
    };

    return (
      <section className={styles.formSection}>
        <h2 className={styles.formTitle}>入力内容の確認</h2>
        <p className={styles.confirmDescription}>
          以下の内容でよろしければ「送信する」ボタンを押してください。
        </p>

        <div className={styles.confirmBox}>
          <dl className={styles.confirmList}>
            <div className={styles.confirmItem}>
              <dt>お名前</dt>
              <dd>{formData.name}</dd>
            </div>

            <div className={styles.confirmItem}>
              <dt>メールアドレス</dt>
              <dd>{formData.email}</dd>
            </div>

            <div className={styles.confirmItem}>
              <dt>ご希望内容</dt>
              <dd>{formData.options.join("、") || "（なし）"}</dd>
            </div>

            {formData.options.includes("見学をしたい") && (
              <div className={styles.confirmItem}>
                <dt>見学希望日時</dt>
                <dd>{formatVisitDates()}</dd>
              </div>
            )}

            <div className={styles.confirmItem}>
              <dt>電話でのご連絡</dt>
              <dd>{formData.phonePreference === "yes" ? "希望する" : "希望しない"}</dd>
            </div>

            {formData.phonePreference === "yes" && (
              <>
                <div className={styles.confirmItem}>
                  <dt>電話番号</dt>
                  <dd>{formData.phoneNumber}</dd>
                </div>
                <div className={styles.confirmItem}>
                  <dt>電話可能時間帯</dt>
                  <dd>{formData.phoneTimeSlots.join("、") || "（なし）"}</dd>
                </div>
              </>
            )}

            <div className={styles.confirmItem}>
              <dt>お問い合わせ内容</dt>
              <dd className={styles.messageContent}>
                {formData.message || "（なし）"}
              </dd>
            </div>
          </dl>

          <div className={styles.confirmActions}>
            <button 
              onClick={handleBack} 
              className={styles.backButton}
              disabled={isSubmitting}
            >
              修正する
            </button>
            <button 
              onClick={handleSubmit} 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.formSection}>
      <div className={styles.thanksContainer}>
        <div className={styles.thanksIcon}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="#00bf63">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        
        <h2 className={styles.thanksTitle}>お問い合わせありがとうございました</h2>
        
        <div className={styles.thanksMessage}>
          <p>
            お問い合わせを受け付けました。<br />
            ご入力いただいたメールアドレスに確認メールをお送りしております。
          </p>
          <p>
            2〜3営業日以内に担当者よりご連絡させていただきます。<br />
            お急ぎの場合は、お電話でもお問い合わせください。
          </p>
        </div>

        <div className={styles.thanksContact}>
          <p className={styles.phoneNumber}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#00bf63">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            （有）カツミ石材 090-3068-5360
          </p>
          <p className={styles.businessHours}>受付時間: 9:00〜17:00（年中無休）</p>
        </div>

        <div className={styles.thanksActions}>
          <button 
            onClick={handleNewInquiry}
            className={styles.newInquiryButton}
          >
            新しいお問い合わせ
          </button>
          <Link href="/" className={styles.homeButton}>
            トップページへ戻る
          </Link>
        </div>
      </div>
    </section>
  );
}