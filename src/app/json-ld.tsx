import { WithContext, SoftwareApplication, FAQPage, HowTo } from 'schema-dts';

export function JsonLd() {
    const schema: WithContext<SoftwareApplication> = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'TableSift',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web',
        url: 'https://tablesift.com',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
        },
        description: 'Best AI table extractor and PDF to Excel converter. Extract tables from PDF, convert Image to Excel AI, and turn screenshots into spreadsheets with 99.9% accuracy. Built for accountants, auditors, and operations teams.',
        featureList: [
            'PDF to Excel converter',
            'Extract tables from PDF',
            'Image to Excel AI',
            'JPG to CSV conversion',
            'PNG to Excel conversion',
            'AI-powered table extraction',
            'Optical Character Recognition (OCR)',
            '99.9% accuracy rate',
            'Bulk file processing',
            'Zero data retention',
            'Convert PDF table to CSV',
            'Instant Excel/CSV download',
            'Bank statement extraction',
            'GST invoice to Excel',
            'Scanned document OCR',
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '2500',
            bestRating: '5',
        },
        author: {
            '@type': 'Organization',
            name: 'TableSift AI',
            url: 'https://tablesift.com',
        },
        screenshot: 'https://tablesift.com/og-image.png',
    };

    const howToSchema: WithContext<HowTo> = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: 'How to Convert PDF to Excel with AI',
        description: 'Extract tables from any PDF or image and convert them to Excel spreadsheets in 3 simple steps.',
        totalTime: 'PT30S',
        step: [
            {
                '@type': 'HowToStep',
                name: 'Upload your PDF or Image',
                text: 'Upload your document - supports scanned docs, photos, bank statements, invoices, and high-resolution PDFs.',
                position: 1
            },
            {
                '@type': 'HowToStep',
                name: 'AI Identifies Data',
                text: 'Our vision AI automatically identifies rows, columns, headers, and table structures in your document.',
                position: 2
            },
            {
                '@type': 'HowToStep',
                name: 'Download Results',
                text: 'Download your perfectly formatted Excel (.xlsx) or CSV file instantly.',
                position: 3
            }
        ]
    };

    const faqSchema: WithContext<FAQPage> = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'How to convert PDF to Excel with AI?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Upload your file to our PDF to Excel converter. Our AI table extractor will automatically identify and extract tables from PDF to Excel or CSV with 99.9% accuracy.'
                }
            },
            {
                '@type': 'Question',
                name: 'How does TableSift convert images to Excel?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'TableSift uses advanced computer vision AI to analyze table structures in images (PNG, JPG, screenshots) and reconstructs them into clean, editable Excel/CSV files.'
                }
            },
            {
                '@type': 'Question',
                name: 'Can I convert bank statements PDF to Excel?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! TableSift is designed to extract data from bank statements, converting them into structured Excel spreadsheets with columns for date, description, and amounts perfectly preserved.'
                }
            },
            {
                '@type': 'Question',
                name: 'Can accountants use TableSift for GST invoices?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. TableSift is trusted by CA firms and accountants to extract data from GST invoices, ITR documents, and Tally exports. Perfect for tax season workflows.'
                }
            },
            {
                '@type': 'Question',
                name: 'Is TableSift free to use?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! TableSift offers 10 free fuels (conversions) to start. For high-volume workflows, we offer Starter, Pro, Business, and Enterprise plans.'
                }
            },
            {
                '@type': 'Question',
                name: 'Is my data secure with TableSift?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Absolutely. TableSift processes data in volatile memory and deletes it immediately after extraction. We never store your documents on our servers.'
                }
            },
            {
                '@type': 'Question',
                name: 'What file formats does TableSift support?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'TableSift supports PDF, PNG, JPG, JPEG, and screenshot images. Output formats include Excel (.xlsx) and CSV.'
                }
            },
            {
                '@type': 'Question',
                name: 'Can I process bulk invoices or vendor bills?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. TableSift Pro plan supports bulk file uploads, making it ideal for operations teams, BPOs, and agencies processing hundreds of documents daily.'
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}

