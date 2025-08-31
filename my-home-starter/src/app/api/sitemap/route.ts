import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://my-home-starter.com";

  const pages = [
    "/", 
    "/about",
    "/contact",
    "/create-account",
    "/Housing-concierge",
    "/login",
    "/my-page",
    "/my-page/chat",
    "/privacy-policy",
    "/start-home-building",
    "/start-home-building/total-budget",
    "/start-home-building/building-location",
    "/start-home-building/house-size",
    "/start-home-building/house-type-diagnosis",
    "/start-home-building/summary"
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
      .map(
        (page) => `
      <url>
        <loc>${baseUrl}${page}</loc>
        <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
        <priority>${page === "/" ? "1.0" : "0.8"}</priority>
      </url>
    `
      )
      .join("")}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
