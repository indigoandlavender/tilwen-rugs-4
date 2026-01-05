import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;

export async function POST(request: NextRequest) {
  try {
    const { variantId } = await request.json();

    if (!variantId) {
      return NextResponse.json(
        { error: "Variant ID is required" },
        { status: 400 }
      );
    }

    // Step 1: Create a cart with the item
    const cartCreateQuery = `
      mutation cartCreate($merchandiseId: ID!) {
        cartCreate(input: {
          lines: [{ merchandiseId: $merchandiseId, quantity: 1 }]
        }) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query: cartCreateQuery,
          variables: { merchandiseId: variantId },
        }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      return NextResponse.json(
        { error: data.errors[0].message },
        { status: 500 }
      );
    }

    if (data.data.cartCreate.userErrors.length > 0) {
      console.error("User errors:", data.data.cartCreate.userErrors);
      return NextResponse.json(
        { error: data.data.cartCreate.userErrors[0].message },
        { status: 400 }
      );
    }

    const checkoutUrl = data.data.cartCreate.cart.checkoutUrl;

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "No checkout URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
