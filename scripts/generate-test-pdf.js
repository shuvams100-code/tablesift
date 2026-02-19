/* eslint-disable */
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');

async function createPdf() {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    for (let i = 1; i <= 10; i++) {
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();

        page.drawText(`Sample Table Data - Page ${i}`, {
            x: 50,
            y: height - 50,
            size: 20,
            font: boldFont,
            color: rgb(0, 0, 0),
        });

        // Draw a simple table
        const tableTop = height - 100;
        const colWidth = 120;
        const rowHeight = 30;

        // Headers
        page.drawText('ID', { x: 50, y: tableTop, size: 12, font: boldFont });
        page.drawText('Product', { x: 50 + colWidth, y: tableTop, size: 12, font: boldFont });
        page.drawText('Price', { x: 50 + colWidth * 2, y: tableTop, size: 12, font: boldFont });
        page.drawText('Quantity', { x: 50 + colWidth * 3, y: tableTop, size: 12, font: boldFont });

        // Rows
        for (let r = 1; r <= 5; r++) {
            const y = tableTop - (r * rowHeight);
            page.drawText(`${i}-${r}`, { x: 50, y, size: 12, font: timesRomanFont });
            page.drawText(`Item ${i}-${r}`, { x: 50 + colWidth, y, size: 12, font: timesRomanFont });
            page.drawText(`$${(10 + r * i).toFixed(2)}`, { x: 50 + colWidth * 2, y, size: 12, font: timesRomanFont });
            page.drawText(`${r * 2}`, { x: 50 + colWidth * 3, y, size: 12, font: timesRomanFont });
        }

        // Grid lines
        for (let r = 0; r <= 6; r++) {
            const y = tableTop + 15 - (r * rowHeight);
            page.drawLine({
                start: { x: 45, y },
                end: { x: 550, y },
                thickness: 1,
                color: rgb(0.8, 0.8, 0.8),
            });
        }
    }

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('test-multi-page-tables.pdf', pdfBytes);
    console.log('Successfully generated test-multi-page-tables.pdf');
}

createPdf().catch(err => console.error(err));
