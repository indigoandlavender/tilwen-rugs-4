import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  const graphqlQuery = `
    query SearchProducts($query: String!) {
      products(first: 12, query: $query) {
        edges {
          node {
            handle
            title
            featuredImage {
              url
              altText
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
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
        body: JSON.stringify({
          query: graphqlQuery,
          variables: { query },
        }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const products = data.data.products.edges.map((edge: any) => ({
      handle: edge.node.handle,
      title: edge.node.title,
      image: edge.node.featuredImage?.url || null,
      price: edge.node.priceRange.minVariantPrice.amount,
      currency: edge.node.priceRange.minVariantPrice.currencyCode,
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ products: [], error: "Search failed" });
  }
}
