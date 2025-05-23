import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const generatePDF = async (data) => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Fetch the custom font
  const fontBytes = await fetch("/Roboto-Regular.ttf").then((res) =>
    res.arrayBuffer()
  );
  const customFont = await pdfDoc.embedFont(fontBytes);

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;

  const formattedData = data
    .map((item) => `${item.name} ${item.notes && `(${item.notes})`}`)
    .join("\n\n");

  const lines = formattedData.split("\n"); // Split text into lines manually for simplicity

  let yOffset = height - 10;
  lines.forEach((line) => {
    page.drawText(line, {
      x: 10,
      y: yOffset,
      size: fontSize,
      font: customFont,
      color: rgb(0, 0, 0),
    });
    yOffset -= fontSize + 4;
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "speed_dating_choices.pdf";
  link.click();
  URL.revokeObjectURL(url);
};

export default generatePDF;
