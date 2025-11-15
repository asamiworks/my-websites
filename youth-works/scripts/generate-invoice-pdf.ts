import { PDFService } from '../src/lib/services/pdfService';
import { InvoiceService } from '../src/lib/services/invoiceService';

/**
 * CLI script to generate PDF for a single invoice
 * Usage: tsx scripts/generate-invoice-pdf.ts <invoiceId>
 */
async function generatePDF() {
  const invoiceId = process.argv[2];

  if (!invoiceId) {
    console.error('Error: Invoice ID is required');
    process.exit(1);
  }

  const invoiceService = new InvoiceService();
  const pdfService = new PDFService();

  try {
    const invoice = await invoiceService.getById(invoiceId);

    if (!invoice) {
      console.error(`Error: Invoice not found: ${invoiceId}`);
      process.exit(1);
    }

    const filePath = await pdfService.generateAndSave(invoice);

    // Output the file path for the parent process to read
    console.log(filePath);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

generatePDF();
