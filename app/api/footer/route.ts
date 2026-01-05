import { NextResponse } from "next/server";
import { getNexusData, getSettings } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_ID = "tilwen";

export async function GET() {
  try {
    // Get site settings for contact info
    const settings = await getSettings();

    // Get site config from Nexus to get site_type
    const allSites = await getNexusData("Sites");
    const siteConfig = allSites.find((s: any) => s.site_id === SITE_ID);
    const siteType = siteConfig?.site_type || "ecommerce";

    // Get footer links from Nexus_Footer_Links (filtered by brand_id)
    const allFooterLinks = await getNexusData("Nexus_Footer_Links");
    const footerLinksData = allFooterLinks.filter(
      (row: any) => row.brand_id === SITE_ID
    );

    // Get newsletter config from Nexus_Newsletter
    const allNewsletterConfig = await getNexusData("Nexus_Newsletter");
    const newsletterConfig = allNewsletterConfig.find(
      (row: any) => row.brand_id === SITE_ID
    );

    // Build contact column from settings
    const contactLinks: any[] = [];

    if (settings.contactEmail) {
      contactLinks.push({
        order: 1,
        label: settings.contactEmail,
        href: `mailto:${settings.contactEmail}`,
        type: "email",
      });
    }
    if (settings.pinterest) {
      contactLinks.push({
        order: 2,
        label: "Pinterest",
        href: settings.pinterest,
        type: "social",
      });
    }
    if (settings.instagram) {
      contactLinks.push({
        order: 3,
        label: "Instagram",
        href: settings.instagram,
        type: "social",
      });
    }

    // Get legal pages from Nexus_Legal_Pages (single source of truth)
    let legal: any[] = [];
    try {
      const legalPages = await getNexusData("Nexus_Legal_Pages");
      
      // Get unique page_ids (each page has multiple sections)
      const pageIds = Array.from(new Set(legalPages.map((p: any) => p.page_id).filter(Boolean)));
      
      // Get page titles from the data
      const pageTitleMap: Record<string, string> = {};
      legalPages.forEach((p: any) => {
        if (p.page_id && p.page_title && !pageTitleMap[p.page_id]) {
          pageTitleMap[p.page_id] = p.page_title;
        }
      });
      
      // Short labels for footer display
      const shortLabels: Record<string, string> = {
        privacy: "Privacy",
        terms: "Terms",
        disclaimer: "Disclaimer",
        "intellectual-property": "IP",
      };
      
      // Order for display
      const displayOrder = ["privacy", "terms", "disclaimer", "intellectual-property"];
      
      legal = displayOrder
        .filter((id) => pageIds.includes(id))
        .map((id) => ({
          label: shortLabels[id] || pageTitleMap[id] || id,
          href: `/${id}`,
        }));
    } catch (e) {
      console.error("Could not fetch legal pages from Nexus:", e);
    }

    // Get currencies from Nexus_Currencies (filtered by site_type)
    let currencies: any[] = [];
    try {
      const allCurrencies = await getNexusData("Nexus_Currencies");
      currencies = allCurrencies
        .filter((c: any) => {
          const allowedTypes = (c.show_for_site_types || "").split(",").map((t: string) => t.trim());
          return allowedTypes.includes(siteType) || allowedTypes.includes("all");
        })
        .map((c: any) => ({
          code: c.currency_code,
          symbol: c.currency_symbol,
          label: c.currency_label,
        }));
    } catch (e) {
      console.error("Could not fetch currencies from Nexus:", e);
    }

    // Build columns from Nexus_Footer_Links data
    // Columns: brand_id, column_number, column_title, link_order, link_label, link_href, link_type
    const columnsMap: Record<number, { title: string; links: any[] }> = {};

    footerLinksData.forEach((row: any) => {
      const colNum = parseInt(row.column_number) || 2;
      const colTitle = row.column_title || "";
      const order = parseInt(row.link_order) || 1;
      const label = row.link_label || "";
      const href = row.link_href || "";
      const type = row.link_type || "link";

      if (!columnsMap[colNum]) {
        columnsMap[colNum] = { title: colTitle, links: [] };
      }

      // Only add if there's a label (href can be empty for address lines)
      if (label) {
        columnsMap[colNum].links.push({ order, label, href, type });
      }
    });

    // Convert to array and sort
    const navColumns = Object.entries(columnsMap)
      .map(([num, data]) => ({
        number: parseInt(num),
        title: data.title,
        links: data.links.sort((a, b) => a.order - b.order),
      }))
      .sort((a, b) => a.number - b.number);

    // Build final columns array with contact column first
    const columns = [
      {
        number: 1,
        title: settings.siteName || "Tilwen",
        links: contactLinks.length > 0 ? contactLinks : [
          { order: 1, label: "hello@tilwen.com", href: "mailto:hello@tilwen.com", type: "email" },
        ],
      },
      ...navColumns,
    ];

    const footerData = {
      brandId: SITE_ID,
      newsletter: {
        show: newsletterConfig?.show_newsletter !== "FALSE",
        title: newsletterConfig?.newsletter_title || "New Arrivals",
        description: newsletterConfig?.newsletter_description || "Be the first to see new rugs. No spam, just beautiful things.",
        brandName: settings.siteName,
      },
      columns,
      legal: legal.length > 0 ? legal : [],
      currencies: currencies.length > 0 ? currencies : [],
      copyright: {
        year: new Date().getFullYear(),
        name: settings.siteName,
      },
    };

    const response = NextResponse.json({
      success: true,
      data: footerData,
    });

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error: any) {
    console.error("Footer fetch error:", error);

    // Return minimal fallback on error - no hardcoded content
    return NextResponse.json({
      success: true,
      data: {
        brandId: SITE_ID,
        newsletter: {
          show: false,
          title: "",
          description: "",
          brandName: "Tilwen",
        },
        columns: [],
        legal: [],
        currencies: [],
        copyright: {
          year: new Date().getFullYear(),
          name: "Tilwen",
        },
      },
    });
  }
}
