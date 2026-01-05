import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;
const NEXUS_SHEET_ID = process.env.NEXUS_SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")!;

const SITE_ID = "tilwen";

async function getSheets() {
  const auth = new google.auth.JWT({
    email: CLIENT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  aboutText: string;
  contactEmail: string;
  instagram?: string;
  pinterest?: string;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Settings!A:B",
    });

    const rows = response.data.values || [];
    const settings: Record<string, string> = {};

    rows.forEach((row) => {
      if (row[0] && row[1]) {
        settings[row[0]] = row[1];
      }
    });

    return {
      siteName: settings["site_name"] || "Tilwen",
      tagline: settings["tagline"] || "Moroccan rugs with character and soul",
      aboutText:
        settings["about_text"] ||
        "Tilwen brings you Moroccan rugs — vintage and contemporary — chosen for their character and soul. Each piece is one-of-a-kind, handpicked for the quality that only comes from being made by hand.",
      contactEmail: settings["contact_email"] || "hello@tilwen.com",
      instagram: settings["instagram"] || undefined,
      pinterest: settings["pinterest"] || undefined,
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      siteName: "Tilwen",
      tagline: "Moroccan rugs with character and soul",
      aboutText:
        "Tilwen brings you Moroccan rugs — vintage and contemporary — chosen for their character and soul. Each piece is one-of-a-kind, handpicked for the quality that only comes from being made by hand.",
      contactEmail: "hello@tilwen.com",
    };
  }
}

// Fetch data from any sheet tab
export async function getSheetData(tabName: string) {
  try {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${tabName}!A1:ZZ`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
  } catch (error: any) {
    console.error(`Error fetching sheet "${tabName}":`, error.message);
    return [];
  }
}

// Fetch data from Nexus database
export async function getNexusData(tabName: string) {
  if (!NEXUS_SHEET_ID) {
    console.error("NEXUS_SHEET_ID is not set");
    return [];
  }

  try {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SHEET_ID,
      range: `${tabName}!A1:ZZ`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return [];

    const headers = rows[0];
    return rows.slice(1).map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });
  } catch (error: any) {
    console.error(`Error fetching Nexus sheet "${tabName}":`, error.message);
    return [];
  }
}

// ============================================
// NEWSLETTER SUBSCRIPTION SYSTEM
// ============================================

// Brand name mapping for newsletter
const BRAND_NAMES: Record<string, string> = {
  tilwen: "Tilwen",
  "slow-morocco": "Slow Morocco",
  "slow-namibia": "Slow Namibia",
  "slow-turkiye": "Slow Türkiye",
  "slow-tunisia": "Slow Tunisia",
  "slow-mauritius": "Slow Mauritius",
  "riad-di-siena": "Riad di Siena",
  "dancing-with-lions": "Dancing with Lions",
};

// Generate random unsubscribe token
function generateUnsubscribeToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Subscribe to newsletter
export async function subscribeToNewsletter(
  email: string,
  brand?: string
): Promise<{ success: boolean; message: string; isResubscribe?: boolean }> {
  if (!NEXUS_SHEET_ID) {
    console.error("[Newsletter] NEXUS_SHEET_ID not configured");
    return { success: false, message: "Configuration error" };
  }

  const brandName = brand || BRAND_NAMES[SITE_ID] || "Tilwen";

  console.log("[Newsletter] Subscribing:", { email, brandName, SITE_ID, NEXUS_SHEET_ID });

  try {
    const sheets = await getSheets();

    // Check if already subscribed
    const existingRows = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SHEET_ID,
      range: "Newsletter_Subscribers!A1:F",
    });

    const rows = existingRows.data.values || [];
    const headers = rows[0] || [];
    const emailIndex = headers.indexOf("email");
    const brandIndex = headers.indexOf("brand");
    const statusIndex = headers.indexOf("status");

    // Find existing subscription for this email + brand
    let existingRowIndex = -1;
    let existingStatus = "";

    for (let i = 1; i < rows.length; i++) {
      if (
        rows[i][emailIndex]?.toLowerCase() === email.toLowerCase() &&
        rows[i][brandIndex] === brandName
      ) {
        existingRowIndex = i;
        existingStatus = rows[i][statusIndex];
        break;
      }
    }

    const now = new Date().toISOString();
    const token = generateUnsubscribeToken();

    if (existingRowIndex > 0) {
      if (existingStatus === "active") {
        console.log("[Newsletter] Already subscribed:", email);
        return { success: true, message: "You're already subscribed." };
      }

      // Reactivate subscription
      console.log("[Newsletter] Reactivating subscription:", email);
      await sheets.spreadsheets.values.update({
        spreadsheetId: NEXUS_SHEET_ID,
        range: `Newsletter_Subscribers!D${existingRowIndex + 1}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [["active"]],
        },
      });

      return { success: true, message: "Welcome back.", isResubscribe: true };
    }

    // New subscription
    console.log("[Newsletter] Adding new subscription:", email);
    await sheets.spreadsheets.values.append({
      spreadsheetId: NEXUS_SHEET_ID,
      range: "Newsletter_Subscribers!A:F",
      valueInputOption: "RAW",
      requestBody: {
        values: [[email, brandName, now, "active", token, ""]],
      },
    });

    console.log("[Newsletter] Successfully subscribed:", email);
    return { success: true, message: "You're in." };
  } catch (error) {
    console.error("[Newsletter] Error subscribing:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

// Unsubscribe from newsletter
export async function unsubscribeFromNewsletter(
  token: string
): Promise<{ success: boolean; message: string }> {
  if (!NEXUS_SHEET_ID) {
    return { success: false, message: "Configuration error" };
  }

  try {
    const sheets = await getSheets();

    const existingRows = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SHEET_ID,
      range: "Newsletter_Subscribers!A1:F",
    });

    const rows = existingRows.data.values || [];
    const headers = rows[0] || [];
    const tokenIndex = headers.indexOf("unsubscribe_token");
    const statusIndex = headers.indexOf("status");

    // Find subscription by token
    let rowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][tokenIndex] === token) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex < 0) {
      return { success: false, message: "Invalid or expired link." };
    }

    if (rows[rowIndex][statusIndex] === "unsubscribed") {
      return { success: true, message: "You've already been removed." };
    }

    // Update status and add unsubscribed_at timestamp
    const now = new Date().toISOString();
    await sheets.spreadsheets.values.update({
      spreadsheetId: NEXUS_SHEET_ID,
      range: `Newsletter_Subscribers!D${rowIndex + 1}:F${rowIndex + 1}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [["unsubscribed", rows[rowIndex][tokenIndex], now]],
      },
    });

    return { success: true, message: "You've been removed." };
  } catch (error) {
    console.error("[Newsletter] Error unsubscribing:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
