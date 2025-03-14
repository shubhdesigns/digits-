import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

interface CertificateProps {
  userName: string;
  courseName: string;
  completionDate: Date;
  onClose: () => void;
}

const Certificate: React.FC<CertificateProps> = ({
  userName,
  courseName,
  completionDate,
  onClose,
}) => {
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userName}-${courseName}-certificate.pdf`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full mx-4">
        <div
          ref={certificateRef}
          className="bg-gradient-to-br from-primary/10 to-secondary/10 p-12 rounded-lg border-8 border-double border-primary/20"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-8">Certificate of Completion</h1>
            <img src="/digits-logo.png" alt="DIGITS Inc Logo" className="mx-auto h-24 mb-8" />
            <p className="text-xl mb-4">This is to certify that</p>
            <h2 className="text-3xl font-bold text-secondary mb-4">{userName}</h2>
            <p className="text-xl mb-8">has successfully completed the course</p>
            <h3 className="text-2xl font-bold text-primary mb-8">"{courseName}"</h3>
            <p className="text-lg mb-12">on {format(completionDate, 'MMMM dd, yyyy')}</p>
            <div className="flex justify-between items-center mt-16">
              <div className="text-center">
                <div className="w-48 h-px bg-gray-400 mb-2"></div>
                <p className="text-sm">Date</p>
              </div>
              <div className="text-center">
                <div className="w-48 h-px bg-gray-400 mb-2"></div>
                <p className="text-sm">DIGITS Inc Signature</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={downloadCertificate}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Download Certificate
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate; 