import { NextResponse } from "next/server";

const allCompanies = [
  {
    id: "1",
    name: "住宅会社A",
    description: "性能重視の住宅会社です。",
    type: "性能重視",
    priceRange: "3000〜5000万円",
    areaRange: "25〜40坪",
  },
  {
    id: "2",
    name: "住宅会社B",
    description: "コスパに優れる住宅会社です。",
    type: "コスパに優れる",
    priceRange: "2000〜4000万円",
    areaRange: "20〜35坪",
  },
  {
    id: "3",
    name: "住宅会社C",
    description: "ローコスト住宅が得意です。",
    type: "ローコスト",
    priceRange: "1000〜3000万円",
    areaRange: "15〜30坪",
  },
];

export async function GET() {
  return NextResponse.json(allCompanies);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { prefecture, city, budget, area, type } = body;

  const filteredCompanies = allCompanies.filter((company) => {
    const [minPrice, maxPrice] = company.priceRange.split("〜").map(Number);
    const [minArea, maxArea] = company.areaRange.split("〜").map(Number);

    // 都道府県や市町村を使用してフィルタリング（例）
    const isLocationMatch =
      (!prefecture || company.name.includes(prefecture)) &&
      (!city || company.name.includes(city));

    return (
      isLocationMatch &&
      (!type || company.type === type) &&
      (!budget || (minPrice !== undefined && maxPrice !== undefined && minPrice !== undefined && (minPrice !== undefined && budget >= minPrice) && maxPrice !== undefined && (maxPrice !== undefined && budget <= maxPrice))) &&
      (!area || (minArea !== undefined && maxArea !== undefined && minArea !== undefined && (minArea !== undefined && area >= minArea) && maxArea !== undefined && (maxArea !== undefined && area <= maxArea)))
    );
  });

  return NextResponse.json(filteredCompanies);
}

