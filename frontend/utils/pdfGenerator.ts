import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportConfig {
  areaName: string;
  timePeriod: string;
  reportType: string;
  includeSections: {
    rainfall: boolean;
    floodPrediction: boolean;
    drainage: boolean;
    sensors: boolean;
    cctv: boolean;
    alerts: boolean;
    interventions: boolean;
    routing: boolean;
    beforeAfter: boolean;
  };
}

export const generatePdfReport = (config: ReportConfig) => {
  const doc = new jsPDF();

  const primaryColor = [15, 23, 42]; // Slate-900

  // Header Bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FloodTwin — Urban Flood Nowcasting System', 14, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Pune Municipal Corporation', 150, 14);

  // Document Title & Metadata
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`${config.reportType.toUpperCase()}`, 14, 34);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Location: ${config.areaName}, Pune`, 14, 41);
  doc.text(`Time Frame: ${config.timePeriod}`, 14, 47);
  doc.text(`Report Ref: #PMC-882-${Math.floor(1000 + Math.random() * 9000)}`, 140, 41);
  doc.text(`Generated Date: ${new Date().toLocaleDateString('en-IN')}`, 140, 47);

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 52, 196, 52);

  let currentY = 60;

  // Executive Summary Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Summary', 14, currentY);
  currentY += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const summaryText = `This ${config.reportType} presents hydrodynamic observations, IoT sensor telemetry readings, and municipal intervention actions recorded for ${config.areaName}, Pune during ${config.timePeriod}. Peak rainfall velocity reached 85 mm/hr, causing localized underpass standing water depth of 48 cm. Mobile Dewatering Pump Unit #4 was dispatched and restored standing water level to normal range (14 cm) within 20 minutes.`;
  
  const splitText = doc.splitTextToSize(summaryText, 180);
  doc.text(splitText, 14, currentY);
  currentY += splitText.length * 5 + 6;

  // Hydrodynamic Observations Table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Telemetry & Hydrodynamic Observations', 14, currentY);
  currentY += 4;

  const tableRows = [];
  if (config.includeSections.rainfall) {
    tableRows.push(['Doppler Rain Gauge', 'Rainfall Intensity', '85 mm/hr', 'Convective Cloudburst Cell', 'High']);
  }
  if (config.includeSections.sensors) {
    tableRows.push(['IoT Sensor S-01', 'Water Depth Sump', '48 cm', 'JM Road Underpass Sump', 'Alert']);
  }
  if (config.includeSections.drainage) {
    tableRows.push(['Trunk Main Pipe P-101', 'Hydraulic Load', '98%', 'Capacity Overload Surcharge', 'Warning']);
  }
  if (config.includeSections.cctv) {
    tableRows.push(['CCTV CAM-01', 'Vision Verification', '48 cm Depth', 'Traffic Halted (0 km/h)', 'Confirmed']);
  }

  autoTable(doc, {
    startY: currentY,
    head: [['Asset Node', 'Parameter', 'Peak Value', 'Observation Notes', 'Status']],
    body: tableRows,
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // Before vs After Interventions Table
  if (config.includeSections.beforeAfter) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('3. Intervention Impact (Before vs After Analysis)', 14, currentY);
    currentY += 4;

    autoTable(doc, {
      startY: currentY,
      head: [['Metric Parameter', 'Before Intervention', 'After Intervention', 'Net Improvement']],
      body: [
        ['Standing Water Depth', '48 cm (Critical)', '14 cm (Normal Range)', '-34 cm (-70%)'],
        ['Drainage Network Capacity', '98% Overloaded', '44% Normal Flow', '-54% Capacity Headroom'],
        ['Traffic Flow Velocity', '0 km/h (Halted)', '38 km/h (Normal Speed)', '+38 km/h Restored'],
        ['Evacuation Delay Time', '+14 min Reroute', '0 min Direct Travel', '100% Traffic Clearance'],
      ],
      headStyles: { fillColor: [71, 85, 105], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Official Sign-Off Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 270, 196, 270);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Official Resolution Status: RESOLVED', 14, 277);
  doc.text('Pune Municipal Corporation • Flood Control Operations', 14, 282);

  doc.setFont('helvetica', 'normal');
  doc.text('Page 1 of 1', 180, 282);

  // Save PDF
  doc.save(`FloodTwin_${config.areaName.replace(/\s+/g, '_')}_Report.pdf`);
};
