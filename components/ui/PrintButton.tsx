'use client';

import { useState } from 'react';
import { Printer, FileImage, FileText, ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  contentId: string;
}

export default function PrintButton({ title, contentId }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<'pdf' | 'png' | null>(null);

  async function exportPDF() {
    setLoading('pdf');
    setOpen(false);
    try {
      const { default: jsPDF }      = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const el = document.getElementById(contentId);
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1A1A1A',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.width / canvas.height;
      const w = pdfW - 20;
      const h = w / ratio;

      pdf.setFillColor(26, 26, 26);
      pdf.rect(0, 0, pdfW, pdfH, 'F');

      pdf.setFontSize(14);
      pdf.setTextColor(229, 229, 229);
      pdf.text(title, 10, 12);

      pdf.setFontSize(9);
      pdf.setTextColor(136, 136, 136);
      pdf.text(`Dicetak: ${new Date().toLocaleString('id-ID')}`, 10, 18);

      pdf.addImage(imgData, 'PNG', 10, 22, w, Math.min(h, pdfH - 30));
      pdf.save(`${title.replace(/\s+/g, '_')}.pdf`);
    } finally {
      setLoading(null);
    }
  }

  async function exportPNG() {
    setLoading('png');
    setOpen(false);
    try {
      const { default: html2canvas } = await import('html2canvas');

      const el = document.getElementById(contentId);
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1A1A1A',
      });

      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center">
        <button
          onClick={() => exportPDF()}
          disabled={!!loading}
          className="btn-secondary flex items-center gap-2 rounded-r-none border-r-0 text-sm"
        >
          {loading === 'pdf'
            ? <span className="w-4 h-4 border-2 border-dark-muted border-t-dark-text rounded-full animate-spin" />
            : <Printer className="w-4 h-4" />
          }
          Cetak Raport
        </button>
        <button
          onClick={() => setOpen(v => !v)}
          disabled={!!loading}
          className="btn-secondary rounded-l-none px-2 text-sm"
          aria-label="Pilih format ekspor"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden min-w-[160px]">
            <button
              onClick={exportPDF}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-dark-text hover:bg-dark-border transition-colors"
            >
              <FileText className="w-4 h-4 text-red-400" />
              Export PDF
            </button>
            <button
              onClick={exportPNG}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-dark-text hover:bg-dark-border transition-colors"
            >
              <FileImage className="w-4 h-4 text-blue-400" />
              Export PNG
            </button>
          </div>
        </>
      )}
    </div>
  );
}
