import { WithContext, SoftwareApplication, FAQPage } from 'schema-dts';

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
        description: 'Best AI table extractor and PDF to Excel converter. Extract tables from PDF, convert Image to Excel AI, and turn screenshots into spreadsheets with 99.9% accuracy.',
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
                name: 'Is TableSift free to use?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! TableSift offers a free tier with 1 conversion per day. For more conversions, we offer Pro, Business, and Enterprise plans.'
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
        </>
    );
}
