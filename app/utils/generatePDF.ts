import jsPDF from "jspdf";

const generatePDF = (data: Record<string, string>) => {
  const doc = new jsPDF();
  doc.text("Техническое задание", 20, 10);
  Object.entries(data).forEach(([key, value], index) => {
    doc.text(`${key}: ${value}`, 20, 20 + index * 10);
  });
  doc.save("project_details.pdf");
};

export default generatePDF;
