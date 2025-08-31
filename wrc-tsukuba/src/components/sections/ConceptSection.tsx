import styles from './ConceptSection.module.css';

const ConceptSection = () => {
  const concepts = [
    {
      id: 1,
      title: '日本最大級の広さ',
      description: '圧倒的な敷地面積でのびのびと走行できる環境。混雑しにくい快適空間。',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <line x1="12" y1="3" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <circle cx="12" cy="12" r="5"/>
        </svg>
      ),
      color: 'purple'
    },
    {
      id: 2,
      title: '選べる4つのコース',
      description: '初心者から上級者まで対応。バラエティ豊かなコース設計で飽きずに楽しめる。',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16"/>
          <circle cx="7" cy="6" r="1" fill="currentColor"/>
          <circle cx="12" cy="12" r="1" fill="currentColor"/>
          <circle cx="17" cy="18" r="1" fill="currentColor"/>
        </svg>
      ),
      color: 'pink'
    },
    {
      id: 3,
      title: '無人受付システム',
      description: '予約不要でいつでも利用可能。マイペースで楽しめる環境を提供。',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="8" y1="14" x2="16" y2="14"/>
        </svg>
      ),
      color: 'orange'
    }
  ];

  return (
    <section className={styles.conceptSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>WRC-Tsukubaの3つの魅力</h2>
          <p className={styles.subtitle}>
            ラジコンを楽しむための理想的な環境をご用意しています
          </p>
        </div>

        <div className={styles.conceptGrid}>
          {concepts.map((concept, index) => (
            <div 
              key={concept.id} 
              className={`${styles.conceptCard} ${styles[concept.color]}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={styles.iconWrapper}>
                {concept.icon}
              </div>
              <h3 className={styles.conceptTitle}>{concept.title}</h3>
              <p className={styles.conceptDescription}>{concept.description}</p>
              <div className={styles.decorativeElement}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;