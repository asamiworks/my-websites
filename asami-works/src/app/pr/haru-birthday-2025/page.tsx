"use client";

import React, { useState, useEffect } from 'react';
import { Instagram, MapPin, Calendar, Clock, Sparkles, Heart, Gift, Star } from 'lucide-react';
import styles from './styles.module.css';

const HaruBirthdayLP = () => {
  const [eventStatus, setEventStatus] = useState<'countdown' | 'ongoing' | 'ended'>('countdown');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      // イベント開始: 9月4日 20:00 (JST)
      const eventStart = new Date('2025-09-04T20:00:00+09:00');
      // イベント終了: 9月6日 5:00 (JST) - 翌朝5時までと仮定
      const eventEnd = new Date('2025-09-06T05:00:00+09:00');
      const now = new Date();

      if (now < eventStart) {
        // カウントダウン中
        const difference = eventStart.getTime() - now.getTime();
        setEventStatus('countdown');
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else if (now >= eventStart && now < eventEnd) {
        // イベント開催中
        setEventStatus('ongoing');
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        // イベント終了
        setEventStatus('ended');
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 星空エフェクト
  const StarryNight = () => (
    <div className={styles.starryContainer}>
      {[...Array(60)].map((_, i) => (
        <div
          key={i}
          className={styles.star}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <StarryNight />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
         
          
          {/* タイトル */}
          <div className={styles.titleWrapper}>
            <h1 className={styles.mainTitle}>HARU</h1>
            <p className={styles.subtitle}>Birthday Event 2025</p>
          </div>

           

           {/* メインポスター */}
           <div className={styles.posterWrapper}>
            <div className={styles.spotlightEffect} />
            <img 
              src="/pr/haru-birthday-2025/poster-main.png"
              alt="HARU Birthday Event 2025"
              className={styles.mainPoster}
            />
          </div>
          
         

          {/* カウントダウン/ステータス表示 */}
          <div className={styles.timerSection}>
            {eventStatus === 'countdown' && (
              <>
                <h3 className={styles.timerTitle}>✨ Event Starts In ✨</h3>
                <div className={styles.timerGrid}>
                  <div className={styles.timerItem}>
                    <div className={styles.timerNumber}>{timeLeft.days}</div>
                    <div className={styles.timerLabel}>DAYS</div>
                  </div>
                  <div className={styles.timerItem}>
                    <div className={styles.timerNumber}>{timeLeft.hours}</div>
                    <div className={styles.timerLabel}>HOURS</div>
                  </div>
                  <div className={styles.timerItem}>
                    <div className={styles.timerNumber}>{timeLeft.minutes}</div>
                    <div className={styles.timerLabel}>MINUTES</div>
                  </div>
                  <div className={styles.timerItem}>
                    <div className={styles.timerNumber}>{timeLeft.seconds}</div>
                    <div className={styles.timerLabel}>SECONDS</div>
                  </div>
                </div>
              </>
            )}
            
            {eventStatus === 'ongoing' && (
              <div className={styles.eventOngoing}>
                <h2 className={styles.birthdayMessage}>🎉 Happy Birthday!! 🎉</h2>
                <p className={styles.ongoingText}>✨ イベント開催中 ✨</p>
                <p className={styles.ongoingSubtext}>皆様のご来店お待ちしております🥂</p>
              </div>
            )}
            
            {eventStatus === 'ended' && (
              <div className={styles.eventEnded}>
                <h3 className={styles.thanksTitle}>Thank You 💝</h3>
                <div className={styles.thanksMessage}>
                  <p>バースデーイベントにご来店いただき<br />
                  本当にありがとうございました🥺✨</p>
                  
                  <p>みんなのおかげで<br />
                  最高の誕生日になりました🎂</p>
                  
                  <p>たくさんの笑顔と<br />
                  温かいお祝いの言葉<br />
                  一生忘れません💕</p>
                  
                  <p>これからも<br />
                  はるをよろしくお願いします🌻</p>
                  
                  <p className={styles.signOff}>Love, HARU 🥰</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Special Message Section */}
      <section className={styles.messageSection}>
        <div className={styles.sectionWrapper}>
          <h2 className={styles.sectionHeading}>Special Message</h2>

          {/* メッセージカード */}
          <div className={styles.messageCard}>
            <div className={styles.messageHeader}>
              <Heart className={styles.heartIcon} />
              <h3>Message from HARU</h3>
            </div>
            
            <div className={styles.messageText}>
              <p>今年もバースデーやるよん🥂🌻</p>
              
              <p>ポスターは<br />
              はるかさんが作ってくれたんだけど<br />
              ちょーーお気に入り🥰</p>
              
              <p>9/4の誕生日当日と<br />
              金土の方が来やすい人のために<br />
              9/5の金曜日も！</p>
              
              <p>もしかしたーーら<br />
              9/6も来てくれるお客さん多かったら<br />
              バースデードレス着ようかな🤔</p>
              
              <p className={styles.highlightMessage}>
                今年は初のオリシャン出すよ🍾<br />
                2種類作った！
              </p>
            </div>
          </div>

          {/* シャンパン画像 */}
          <div className={styles.champagneWrapper}>
            <img 
              src="/pr/haru-birthday-2025/champagne.png"
              alt="HARU Special Champagne"
              className={styles.champagneImage}
            />
          </div>

          {/* 続きのメッセージ */}
          <div className={styles.messageCard}>
            <div className={styles.messageText}>
              <p>せっかくだからみんなに飲んで欲しいし、<br />
              キャバの割には値段抑えめのつもり！☁️</p>
              
              <p>オリシャンには特典つける予定📸<br />
              これがちょーーこだわって作るから<br />
              楽しみにしてて欲しいなぁ〜🤤</p>
              
              <div className={styles.appealBox}>
                <p className={styles.appealTitle}>💝 はる応援隊の皆様へ</p>
                <p>はるが病まないように<br />
                来店予定教えてください🙇</p>
                <p className={styles.appealNote}>
                  行けるよーの一言で<br />
                  とっても救われます🥺
                </p>
              </div>
            </div>

            {/* Instagram Link */}
            <div className={styles.socialLink}>
              <a 
                href="https://www.instagram.com/haru_juliette_/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.instagramBtn}
              >
                <Instagram />
                <span>Follow @haru_juliette_</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Special Features */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionWrapper}>
          <h2 className={styles.sectionHeading}>Birthday Special</h2>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIconWrapper}>
                <Gift />
              </div>
              <h3>Original Champagne</h3>
              <p>2種類の特別なオリジナルシャンパンをご用意！<br />お手頃価格でご提供します✨</p>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIconWrapper}>
                <Sparkles />
              </div>
              <h3>Special Benefits</h3>
              <p>オリシャンご注文で特別な特典をプレゼント📸<br />こだわりの特典をお楽しみに！</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Information - 最後に配置 */}
      <section className={styles.infoSection}>
        <div className={styles.sectionWrapper}>
          <h2 className={styles.sectionHeading}>Event Information</h2>
          
          <div className={styles.infoCard}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Calendar className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>開催日程</p>
                  <p className={styles.infoText}>9月4日(木)・9月5日(金)</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <Clock className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>営業時間</p>
                  <p className={styles.infoText}>20:00 〜 LAST</p>
                </div>
              </div>
              
              <div className={styles.infoItem}>
                <MapPin className={styles.infoIcon} />
                <div>
                  <p className={styles.infoLabel}>会場</p>
                  <p className={styles.infoText}>Juliette Lounge</p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className={styles.mapWrapper}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3233.4537752833817!2d139.97208254050983!3d35.862395120114726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60189dabfd451341%3A0x6dc2ff8a5d174925!2zSnVsaWV0dGUgTG91bmdlIOOCreODo-ODkOOCr-ODqQ!5e0!3m2!1sja!2sjp!4v1756714586823!5m2!1sja!2sjp" 
                width="100%" 
                height="350" 
                style={{ border: 0 }}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Instagram CTA */}
            <div className={styles.infoCta}>
              <p className={styles.ctaText}>最新情報はInstagramでチェック！</p>
              <a 
                href="https://www.instagram.com/haru_juliette_/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.instagramBtn}
              >
                <Instagram />
                <span>@haru_juliette_</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default HaruBirthdayLP;