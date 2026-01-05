import { google } from 'googleapis';

const NEXUS_SPREADSHEET_ID = process.env.NEXUS_SPREADSHEET_ID;
const SITE_ID = process.env.SITE_ID || 'tilwen';

async function getAuthClient() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_BASE64, 'base64').toString()
    );
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    return auth;
  }
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  return auth;
}

export interface SiteConfig {
  site_id: string;
  site_name: string;
  site_url: string;
  legal_entity: string;
  contact_email: string;
  contact_phone: string;
  whatsapp: string;
  jurisdiction_country: string;
  jurisdiction_city: string;
  address_line1: string;
  address_line2: string;
  site_type: string;
  parent_brand: string;
  year_founded: string;
  currency_default: string;
  language_default: string;
}

export interface LegalSection {
  template_id: string;
  section_order: number;
  section_title: string;
  content: string;
}

// Default site config for Tilwen (fallback if not in Nexus)
const defaultSiteConfig: SiteConfig = {
  site_id: 'tilwen',
  site_name: 'Tilwen',
  site_url: 'https://tilwen.com',
  legal_entity: 'Tilwen',
  contact_email: 'hello@tilwen.com',
  contact_phone: '',
  whatsapp: '',
  jurisdiction_country: 'Morocco',
  jurisdiction_city: 'Marrakech',
  address_line1: 'Marrakech',
  address_line2: 'Morocco',
  site_type: 'ecommerce',
  parent_brand: 'Dancing with Lions',
  year_founded: '2024',
  currency_default: 'EUR',
  language_default: 'en',
};

// Get site configuration from Nexus
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    if (!NEXUS_SPREADSHEET_ID) {
      console.warn('NEXUS_SPREADSHEET_ID not set, using defaults');
      return defaultSiteConfig;
    }

    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SPREADSHEET_ID,
      range: 'Sites!A:P',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return defaultSiteConfig;

    const headers = rows[0];
    const sites = rows.slice(1).map((row) => {
      const site: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        site[header] = row[index] || '';
      });
      return site as unknown as SiteConfig;
    });

    const found = sites.find((site) => site.site_id === SITE_ID);
    return found || defaultSiteConfig;
  } catch (error) {
    console.error('Error fetching site config:', error);
    return defaultSiteConfig;
  }
}

// Get legal content for a specific template from Nexus_Legal_Pages
export async function getLegalContent(templateId: string): Promise<LegalSection[]> {
  try {
    if (!NEXUS_SPREADSHEET_ID) {
      console.warn('NEXUS_SPREADSHEET_ID not set');
      return [];
    }

    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Try Nexus_Legal_Pages first (newer format)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SPREADSHEET_ID,
      range: 'Nexus_Legal_Pages!A:E',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      // Fallback to Legal_Content
      return getLegalContentFallback(templateId);
    }

    const sections = rows.slice(1)
      .filter((row) => row[0] === templateId)
      .map((row) => ({
        template_id: row[0] || '',
        section_order: parseInt(row[2]) || 0,
        section_title: row[3] || '',
        content: row[4] || '',
      }))
      .sort((a, b) => a.section_order - b.section_order);

    return sections;
  } catch (error) {
    console.error('Error fetching legal content:', error);
    return getLegalContentFallback(templateId);
  }
}

// Fallback to Legal_Content tab
async function getLegalContentFallback(templateId: string): Promise<LegalSection[]> {
  try {
    if (!NEXUS_SPREADSHEET_ID) return [];

    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: NEXUS_SPREADSHEET_ID,
      range: 'Legal_Content!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length < 2) return [];

    const sections = rows.slice(1)
      .filter((row) => row[0] === templateId)
      .map((row) => ({
        template_id: row[0] || '',
        section_order: parseInt(row[1]) || 0,
        section_title: row[2] || '',
        content: row[3] || '',
      }))
      .sort((a, b) => a.section_order - b.section_order);

    return sections;
  } catch (error) {
    console.error('Error fetching legal content fallback:', error);
    return [];
  }
}

// Replace template variables with site config values
export function processTemplate(content: string, config: SiteConfig): string {
  const replacements: Record<string, string> = {
    '{{site_id}}': config.site_id,
    '{{site_name}}': config.site_name,
    '{{site_url}}': config.site_url,
    '{{legal_entity}}': config.legal_entity,
    '{{contact_email}}': config.contact_email,
    '{{contact_phone}}': config.contact_phone,
    '{{whatsapp}}': config.whatsapp,
    '{{jurisdiction_country}}': config.jurisdiction_country,
    '{{jurisdiction_city}}': config.jurisdiction_city,
    '{{address_line1}}': config.address_line1,
    '{{address_line2}}': config.address_line2,
    '{{year_founded}}': config.year_founded,
  };

  let processed = content;
  for (const [key, value] of Object.entries(replacements)) {
    processed = processed.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
  }
  return processed;
}

// Get fully processed legal page
export async function getLegalPage(templateId: string): Promise<{ title: string; sections: { title: string; content: string }[] } | null> {
  const config = await getSiteConfig();
  const sections = await getLegalContent(templateId);
  
  if (sections.length === 0) {
    console.error('No legal content found for template:', templateId);
    return null;
  }

  const titleMap: Record<string, string> = {
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'disclaimer': 'Disclaimer',
    'intellectual-property': 'Intellectual Property',
    'shipping': 'Shipping Policy',
    'returns': 'Returns Policy',
  };

  return {
    title: titleMap[templateId] || templateId,
    sections: sections.map((section) => ({
      title: section.section_title,
      content: processTemplate(section.content, config),
    })),
  };
}

// Get legal links for footer
export async function getLegalLinks(): Promise<{ label: string; href: string }[]> {
  // These are the standard legal pages available from Nexus
  return [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'IP', href: '/intellectual-property' },
  ];
}
