import { Thing, WithContext, SoftwareApplication, Organization, FAQPage } from 'schema-dts';

export function JsonLd() {
    const schema: WithContext<SoftwareApplication> = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'TableSift',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        description: 'Convert screenshots, images, and PDFs into Excel spreadsheets and CSV files instantly using AI.',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
        },
        author: {
            '@type': 'Organization',
            name: 'TableSift AI',
            url: 'https://tablesift.com',
        }
    };

    const faqSchema: WithContext<FAQPage> = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'How does it convert images to Excel?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'TableSift uses advanced computer vision AI to analyze table structures in images and reconstruct them into clean CSV/Excel formats.'
                }
            },
            {
                '@type': 'Question',
                name: 'Is my data safe?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. We process data in-memory and delete it immediately after extraction. We do not store your documents.'
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
