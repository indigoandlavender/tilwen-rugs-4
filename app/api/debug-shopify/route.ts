import { NextResponse } from "next/server";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;

export async function GET() {
  const query = `
    query GetProducts {
      products(first: 3) {
        edges {
          node {
            id
            handle
            title
            featuredImage {
              url
              altText
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({ query }),
        cache: "no-store",
      }
    );

    const json = await response.json();
    
    return NextResponse.json({
      domain: SHOPIFY_STORE_DOMAIN,
      tokenPresent: !!SHOPIFY_STOREFRONT_TOKEN,
      tokenFirst10: SHOPIFY_STOREFRONT_TOKEN?.substring(0, 10) + "...",
      responseStatus: response.status,
      data: json,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
