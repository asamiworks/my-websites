import React from 'react';

const CompanyShowcase = () => {
  // 実際の実装では、Firestoreから取得
  const companies = [
    {
      name: "住友林業",
      specialty: "木の家",
      rating: 4.8,
      projects: "1,000+"
    },
    {
      name: "積水ハウス",
      specialty: "鉄骨住宅",
      rating: 4.7,
      projects: "2,000+"
    },
    {
      name: "地域工務店A",
      specialty: "自然素材",
      rating: 4.9,
      projects: "300+"
    },
    {
      name: "ローコスト住宅B",
      specialty: "コスパ重視",
      rating: 4.6,
      projects: "500+"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            厳選された住宅会社
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            全国500社以上の優良住宅会社から、あなたに最適な会社をご紹介します
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {company.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                得意分野: {company.specialty}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-gray-700 ml-1">{company.rating}</span>
                </div>
                <span className="text-gray-500 text-sm">
                  実績 {company.projects}件
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            他にも多数の住宅会社が登録されています
          </p>
        </div>
      </div>
    </section>
  );
};

export default CompanyShowcase;