"use client";

type Company = {
  id: string;
  name: string;
  description: string;
  type: string;
  priceRange: string;
};

type Props = {
  companies: Company[];
};

export default function CompanyList({ companies }: Props) {
  if (!companies || companies.length === 0) {
    return <p>検索結果がありません。</p>;
  }

  return (
    <ul>
      {companies.map((company) => (
        <li key={company.id}>
          <h3>{company.name}</h3>
          <p>{company.description}</p>
          <p>{company.type}</p>
          <p>{company.priceRange}</p>
        </li>
      ))}
    </ul>
  );
}
