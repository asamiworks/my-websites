export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || (new Date().getFullYear() - 1).toString();
  const area = searchParams.get("area");
  const cityCode = searchParams.get("city");
  
  if (!area) {
    return new Response(
      JSON.stringify({ error: "Area parameter is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 都道府県コードを2桁に補正
  const areaCode = area.padStart(2, '0');
  
  // divisionパラメータを追加（00=住宅地）
  const division = "00"; // 住宅地のコード
  const apiUrl = `https://www.reinfolib.mlit.go.jp/ex-api/external/XCT001?year=${year}&area=${areaCode}&division=${division}`;
  
  console.log("API URL:", apiUrl);
  console.log("API Key exists:", !!process.env.API_KEY);

  try {
    const res = await fetch(apiUrl, {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.API_KEY || '',
      },
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      throw new Error(`API Error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    console.log("API Response data count:", data.data?.length || 0);
    
    // 市区町村でフィルタリング（必要な場合）
    if (cityCode && data.data && Array.isArray(data.data)) {
      const cityCodeSuffix = cityCode.substring(2); // 先頭2桁（都道府県）を除く
      const filteredData = data.data.filter((item: any) => {
        const itemCityCode = item["標準地番号 市区町村コード 市区町村コード"];
        return itemCityCode === cityCodeSuffix;
      });
      
      console.log(`Filtered data count: ${filteredData.length} (city: ${cityCode})`);
      
      return new Response(JSON.stringify({ 
        ...data, 
        data: filteredData 
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Detailed error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to fetch land price data",
        detail: error.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}