'use client';

import { useState } from 'react';
import styles from './CourseOverview.module.css';

interface Course {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  features: string[];
  color: string;
  images: string[]; // 複数画像に対応
}

const CourseOverview = () => {
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({
    0: 0,
    1: 0,
    2: 0,
    3: 0
  });

  const courses: Course[] = [
    {
      id: 0,
      name: 'クロカンコース',
      description: 'ジャンプ台や起伏がある本格オフロードコース！ダイナミックな走行が楽しめます。',
      difficulty: 5,
      features: ['ダイナミックなジャンプ台', '起伏に富んだ地形', '上級者も大満足'],
      color: 'green',
      images: [
        '/images/CrocanCourse01.jpg',
        '/images/CrocanCourse02.jpg',
        '/images/CrocanCourse03.jpg'
      ]
    },
    {
      id: 1,
      name: 'フラットダートコース',
      description: '初心者でも安心！平坦な土のコースでドリフト練習に最適です。',
      difficulty: 2,
      features: ['平坦で走りやすい', 'ドリフト練習に最適', '初心者におすすめ'],
      color: 'yellow',
      images: [
        '/images/flat_dirt_course_01.jpg',
        '/images/flat_dirt_course_02.jpg', // 画像が追加されるまで同じ画像を使用
        '/images/flat_dirt_course_03.jpg'
      ]
    },
    {
      id: 2,
      name: 'バギーコース',
      description: 'テクニカルなコーナーが楽しいバギー専用コース。技術向上に最適です。',
      difficulty: 4,
      features: ['連続コーナー', 'テクニカルレイアウト', 'バギー専用設計'],
      color: 'purple',
      images: [
        '/images/buggy_course.png',
        '/images/buggy_course.png', // 画像が追加されるまで同じ画像を使用
        '/images/buggy_course.png'
      ]
    },
    {
      id: 3,
      name: 'キッズコース',
      description: 'お子様も安心して楽しめる優しいコース。親子で楽しい時間を過ごせます。',
      difficulty: 1,
      features: ['安全第一の設計', '広々としたスペース', '親子で楽しめる'],
      color: 'pink',
      images: [
        '/images/kids_course.png',
        '/images/kids_course.png', // 画像が追加されるまで同じ画像を使用
        '/images/kids_course.png'
      ]
    }
  ];

  // 画像切り替え関数
  const handleImageChange = (courseId: number, direction: 'prev' | 'next') => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const currentIndex = currentImageIndex[courseId];
    const imagesLength = course.images.length;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % imagesLength;
    } else {
      newIndex = currentIndex === 0 ? imagesLength - 1 : currentIndex - 1;
    }
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [courseId]: newIndex
    }));
  };

  // スワイプ処理用の状態
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // スワイプの最小距離
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (courseId: number) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleImageChange(courseId, 'next');
    } else if (isRightSwipe) {
      handleImageChange(courseId, 'prev');
    }
  };

  return (
    <section id="course-overview" className={styles.courseSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>4つの個性的なコース</h2>
          <p className={styles.subtitle}>
            初心者から上級者まで、みんなが楽しめる多彩なコース
          </p>
        </div>

        <div className={styles.courseSelector}>
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course.id)}
              className={`${styles.courseButton} ${
                selectedCourse === course.id ? styles.active : ''
              } ${styles[course.color]}`}
            >
              <div className={styles.courseName}>{course.name}</div>
              <div className={styles.difficultyBar}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.bar} ${
                      i < course.difficulty ? styles.filled : ''
                    }`}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className={styles.courseDetail}>
          <div className={styles.detailContent}>
            <div className={styles.visualSection}>
              <div className={`${styles.courseVisual} ${styles[courses[selectedCourse].color]}`}>
                {courses[selectedCourse].images && courses[selectedCourse].images.length > 0 ? (
                  <div 
                    className={styles.carouselContainer}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => onTouchEnd(selectedCourse)}
                  >
                    <img 
                      src={courses[selectedCourse].images[currentImageIndex[selectedCourse] || 0]} 
                      alt={`${courses[selectedCourse].name} - 画像${(currentImageIndex[selectedCourse] || 0) + 1}`}
                      className={styles.courseImage}
                    />
                    
                    {/* 前へボタン */}
                    <button
                      className={`${styles.carouselButton} ${styles.prevButton}`}
                      onClick={() => handleImageChange(selectedCourse, 'prev')}
                      aria-label="前の画像"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                      </svg>
                    </button>
                    
                    {/* 次へボタン */}
                    <button
                      className={`${styles.carouselButton} ${styles.nextButton}`}
                      onClick={() => handleImageChange(selectedCourse, 'next')}
                      aria-label="次の画像"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                      </svg>
                    </button>
                    
                    {/* インジケーター */}
                    <div className={styles.carouselIndicators}>
                      {courses[selectedCourse].images.map((_, index) => (
                        <button
                          key={index}
                          className={`${styles.indicator} ${
                            index === (currentImageIndex[selectedCourse] || 0) ? styles.active : ''
                          }`}
                          onClick={() => setCurrentImageIndex(prev => ({
                            ...prev,
                            [selectedCourse]: index
                          }))}
                          aria-label={`画像${index + 1}を表示`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.trackPattern}>
                    {/* コースのビジュアル表現（画像がない場合のフォールバック） */}
                    {selectedCourse === 0 && (
                      <>
                        <div className={styles.jump}></div>
                        <div className={styles.jump}></div>
                        <div className={styles.hill}></div>
                      </>
                    )}
                    {selectedCourse === 1 && (
                      <>
                        <div className={styles.flat}></div>
                        <div className={styles.curve}></div>
                      </>
                    )}
                    {selectedCourse === 2 && (
                      <>
                        <div className={styles.corner}></div>
                        <div className={styles.corner}></div>
                        <div className={styles.straight}></div>
                      </>
                    )}
                    {selectedCourse === 3 && (
                      <>
                        <div className={styles.gentle}></div>
                        <div className={styles.wide}></div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.infoSection}>
              <h3 className={styles.courseName}>{courses[selectedCourse].name}</h3>
              <p className={styles.courseDescription}>
                {courses[selectedCourse].description}
              </p>

              <div className={styles.difficulty}>
                <h4>難易度</h4>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`${styles.star} ${
                        i < courses[selectedCourse].difficulty ? styles.filled : ''
                      }`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>

              <div className={styles.features}>
                <h4>コースの特徴</h4>
                <ul>
                  {courses[selectedCourse].features.map((feature, index) => (
                    <li key={index}>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className={styles.note}>
          ※ 現在コースは準備中です。完成をお楽しみに！
        </p>
      </div>
    </section>
  );
};

export default CourseOverview;