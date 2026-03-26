import { PDFDocument } from 'pdf-lib';
async function test() {
  const doc = await PDFDocument.create();
  console.log('encrypt type:', typeof doc.encrypt);
}
test();
