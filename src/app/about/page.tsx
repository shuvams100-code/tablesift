import { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
    title: 'About TableSift | AI-Powered Document Conversion',
    description: 'Learn about TableSift, the next-generation document conversion engine that transforms PDFs and images into Excel spreadsheets with 99.9% accuracy.',
    openGraph: {
        title: 'About TableSift | Redefining Data Extraction with AI',
        description: 'We built TableSift because we were tired of dumb converters. Our AI sifts through the noise to deliver 99.9% accurate spreadsheets.',
        url: 'https://tablesift.com/about',
    },
    alternates: {
        canonical: 'https://tablesift.com/about',
    },
};

export default function AboutPage() {
    return <AboutPageClient />;
}
