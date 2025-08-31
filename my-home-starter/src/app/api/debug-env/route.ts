export async function GET() {
  return new Response(JSON.stringify({
    hasApiKey: !!process.env.API_KEY,
    hasEstatKey: !!process.env.ESTAT_API_KEY,
    apiKeyFirst5: process.env.API_KEY?.substring(0, 5) + '...',
    estatKeyFirst5: process.env.ESTAT_API_KEY?.substring(0, 5) + '...',
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('API')).sort()
  }), {
    headers: { "Content-Type": "application/json" },
  });
}
