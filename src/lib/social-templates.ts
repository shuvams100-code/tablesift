/**
 * Social Content Templates for TableSift Marketing
 * Each template has a topic/angle that GPT-4o-mini will expand into
 * Twitter (~280 chars) and LinkedIn (longer, professional) formats
 */

export interface SocialTopic {
    angle: string;       // The content angle/direction
    category: 'tip' | 'stat' | 'pain_point' | 'question' | 'tutorial' | 'myth_bust';
    hashtags: string[];  // Relevant hashtags
}

export const SOCIAL_TOPICS: SocialTopic[] = [
    // Pain Points — relatable frustrations
    { angle: "The frustration of copy-pasting a PDF table into Excel and watching all the columns break", category: 'pain_point', hashtags: ['#PDFtoExcel', '#DataEntry', '#Productivity'] },
    { angle: "Why does it take 45 minutes to manually type out data from a 3-page PDF?", category: 'pain_point', hashtags: ['#Automation', '#TimeSaver', '#SmallBusiness'] },
    { angle: "That moment when your PDF table paste turns into one long column in Excel", category: 'pain_point', hashtags: ['#ExcelTips', '#PDFtoExcel', '#OfficeLife'] },
    { angle: "Accountants spending hours re-typing bank statements that already exist as PDFs", category: 'pain_point', hashtags: ['#Accounting', '#Bookkeeping', '#Automation'] },
    { angle: "Getting a supplier price list as a PDF when you need it in a spreadsheet", category: 'pain_point', hashtags: ['#Procurement', '#SmallBusiness', '#DataEntry'] },

    // Stats & Facts
    { angle: "The average office worker spends 8+ hours/week on manual data entry tasks", category: 'stat', hashtags: ['#Productivity', '#Automation', '#WorkSmarter'] },
    { angle: "Manual data entry has a 1-4% error rate — that adds up fast with financial data", category: 'stat', hashtags: ['#DataQuality', '#Accuracy', '#Finance'] },
    { angle: "Companies lose approximately $20K/year per employee on manual document processing", category: 'stat', hashtags: ['#ROI', '#Automation', '#Business'] },
    { angle: "96% of businesses still receive invoices as PDFs that need manual processing", category: 'stat', hashtags: ['#InvoiceProcessing', '#Automation', '#B2B'] },
    { angle: "A PDF table can be extracted to Excel in 10 seconds with AI — vs 30 minutes manually", category: 'stat', hashtags: ['#AI', '#PDFtoExcel', '#TimeSaver'] },

    // Tips & How-To
    { angle: "The trick to preserving number formatting when extracting data from PDFs", category: 'tip', hashtags: ['#ExcelTips', '#DataEntry', '#Productivity'] },
    { angle: "How to handle multi-page tables that span across PDF pages", category: 'tip', hashtags: ['#PDFtoExcel', '#Excel', '#DataProcessing'] },
    { angle: "3 things to check before you start manually typing out PDF data", category: 'tip', hashtags: ['#WorkSmarter', '#Productivity', '#DataEntry'] },
    { angle: "The simplest way to convert a scanned document into editable spreadsheet data", category: 'tip', hashtags: ['#OCR', '#ScanToExcel', '#DigitalTransformation'] },
    { angle: "Stop cleaning up merged cells — here's a better approach to PDF extraction", category: 'tip', hashtags: ['#ExcelTips', '#PDFtoExcel', '#DataCleaning'] },

    // Questions — engagement bait
    { angle: "What's your biggest annoyance when converting PDFs to spreadsheets?", category: 'question', hashtags: ['#PDFtoExcel', '#DataEntry', '#Poll'] },
    { angle: "How many hours per week does your team spend on manual data entry?", category: 'question', hashtags: ['#DataEntry', '#Productivity', '#SmallBusiness'] },
    { angle: "Do you still copy-paste from PDFs into Excel? What's your process?", category: 'question', hashtags: ['#Excel', '#Workflow', '#Automation'] },
    { angle: "If you could automate one repetitive task in your workday, what would it be?", category: 'question', hashtags: ['#Automation', '#Productivity', '#WorkLife'] },
    { angle: "Accountants: what's the worst PDF you've ever had to extract data from?", category: 'question', hashtags: ['#Accounting', '#PDFNightmares', '#DataEntry'] },

    // Myth Busters
    { angle: "Myth: You need expensive software like Adobe Pro to extract tables from PDFs", category: 'myth_bust', hashtags: ['#PDFtoExcel', '#Affordable', '#SaaS'] },
    { angle: "Myth: OCR can't accurately handle scanned documents with low resolution", category: 'myth_bust', hashtags: ['#OCR', '#AI', '#DocumentProcessing'] },
    { angle: "Myth: Converting PDF to Excel always requires manual cleanup afterward", category: 'myth_bust', hashtags: ['#Automation', '#AI', '#CleanData'] },
    { angle: "Myth: Only large enterprises need document automation tools", category: 'myth_bust', hashtags: ['#SmallBusiness', '#Startup', '#Automation'] },
    { angle: "Myth: Free online PDF converters give you the same quality as dedicated tools", category: 'myth_bust', hashtags: ['#PDFtoExcel', '#Quality', '#DataAccuracy'] },

    // Mini Tutorials
    { angle: "Quick tutorial: How to convert a PDF bank statement to a clean Excel file", category: 'tutorial', hashtags: ['#Tutorial', '#PDFtoExcel', '#Banking'] },
    { angle: "Step by step: Extracting invoice line items from PDF to spreadsheet", category: 'tutorial', hashtags: ['#InvoiceProcessing', '#Tutorial', '#Accounting'] },
    { angle: "How to batch process 50+ PDFs into Excel files without doing them one by one", category: 'tutorial', hashtags: ['#BatchProcessing', '#Automation', '#Productivity'] },
    { angle: "Converting a product catalog from PDF to organized spreadsheet data", category: 'tutorial', hashtags: ['#Ecommerce', '#DataEntry', '#ProductCatalog'] },
    { angle: "From receipt photo to expense spreadsheet — a quick workflow", category: 'tutorial', hashtags: ['#ExpenseManagement', '#Receipts', '#SmallBusiness'] },
];

// Get a random topic that hasn't been used recently
export function getRandomSocialTopic(recentAngles: string[] = []): SocialTopic {
    const available = SOCIAL_TOPICS.filter(t => !recentAngles.includes(t.angle));
    if (available.length === 0) {
        return SOCIAL_TOPICS[Math.floor(Math.random() * SOCIAL_TOPICS.length)];
    }
    return available[Math.floor(Math.random() * available.length)];
}
