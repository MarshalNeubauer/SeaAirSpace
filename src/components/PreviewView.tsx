import { useState } from 'react';
import { Copy, CheckCircle2, Download, FileDown } from 'lucide-react';
import PptxGenJS from 'pptxgenjs';
import type { Report } from '../types/report';

interface PreviewViewProps {
  report: Report;
}

const BLUE_900 = '1E3A5F';
const YELLOW_500 = 'EAB308';
const SLATE_700 = '334155';
const SLATE_400 = '94A3B8';

export default function PreviewView({ report }: PreviewViewProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = `
TITLE: ${report.title || 'Meeting Readout'}
COMPANY: ${report.company}
PURPOSE: ${report.purpose}

BOTTOM LINE:
${report.bottom_line.map((b) => `• ${b}`).join('\n')}

BACKGROUND:
${report.background.map((b) => `• ${b}`).join('\n')}

DISCUSSION:
${report.discussion.map((n) => `• ${n}`).join('\n')}

RECOMMENDATIONS:
• ${report.recommendation}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportPptx = () => {
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    const slide = pptx.addSlide();

    // Header bar background
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 0.7,
      fill: { color: BLUE_900 },
    });

    // DSCA circle
    slide.addShape(pptx.ShapeType.ellipse, {
      x: 0.35, y: 0.15, w: 0.55, h: 0.55,
      fill: { color: YELLOW_500 },
    });
    slide.addText('DSCA', {
      x: 0.35, y: 0.15, w: 0.55, h: 0.55,
      fontSize: 12, bold: true, color: BLUE_900,
      align: 'center', valign: 'middle',
    });

    // Company title
    slide.addText(`${report.company || 'COMPANY'} — Final Report`, {
      x: 1.05, y: 0.1, w: 7, h: 0.65,
      fontSize: 22, bold: true, color: 'FFFFFF',
      valign: 'middle',
    });

    // Event label
    slide.addText(report.event || 'EVENT', {
      x: 9, y: 0.1, w: 3.5, h: 0.65,
      fontSize: 12, bold: true, color: YELLOW_500,
      align: 'right', valign: 'middle',
    });

    // Yellow title strip
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 0.85, w: '100%', h: 0.45,
      fill: { color: YELLOW_500 },
    });
    slide.addText(report.title || 'Meeting Summary Report', {
      x: 0.35, y: 0.85, w: 12, h: 0.45,
      fontSize: 16, bold: true, color: BLUE_900,
      valign: 'middle',
    });

    // Column positions (inches)
    const colX = [0.35, 4.35, 8.35];
    const colW = 3.65;
    const bodyY = 1.55;

    // Section helper
    const addSection = (title: string, body: string, x: number, y: number, maxH: number) => {
      slide.addText(title, {
        x, y, w: colW, h: 0.35,
        fontSize: 11, bold: true, color: BLUE_900,
      });
      slide.addShape(pptx.ShapeType.line, {
        x, y: y + 0.35, w: colW, h: 0,
        line: { color: BLUE_900, width: 0.75, dashType: 'solid' },
      });
      slide.addText(body, {
        x, y: y + 0.42, w: colW, h: maxH - 0.42,
        fontSize: 12, color: SLATE_700,
        valign: 'top', wrap: true,
      });
    };

    // Left column — Purpose
    addSection('PURPOSE', report.purpose, colX[0], bodyY, 2.8);

    // Left column — Bottom Line
    const bottomLineItems = report.bottom_line.filter((b) => b.trim());
    addSection('BOTTOM LINE', bottomLineItems.map((b) => `• ${b}`).join('\n'), colX[0], bodyY + 3.0, 3.7);

    // Center column — Background
    const bgItems = report.background.filter((b) => b.trim());
    addSection('BACKGROUND', bgItems.map((b) => `• ${b}`).join('\n'), colX[1], bodyY, 6.7);

    // Right column — Discussion
    const discItems = report.discussion.filter((n) => n.trim());
    addSection('DISCUSSION', discItems.map((n) => `• ${n}`).join('\n'), colX[2], bodyY, 3.7);

    // Right column — Way Ahead
    addSection('WAY AHEAD / RECOMMENDATION', report.recommendation, colX[2], bodyY + 4.0, 2.7);

    // Footer bar
    slide.addShape(pptx.ShapeType.rect, {
      x: 0, y: 7.15, w: '100%', h: 0.35,
      fill: { color: 'F1F5F9' },
    });
    slide.addText('FIELD REPORT', {
      x: 0.35, y: 7.15, w: 3, h: 0.35,
      fontSize: 9, bold: true, color: SLATE_400,
      valign: 'middle',
    });
    slide.addText('DSCA Liaison Division', {
      x: 9, y: 7.15, w: 3.5, h: 0.35,
      fontSize: 9, color: SLATE_400,
      align: 'right', valign: 'middle',
    });

    const fileName = `${(report.company || 'company').replace(/\s+/g, '_')}_${(report.title || 'report').replace(/\s+/g, '_')}`;
    pptx.writeFile({ fileName: `${fileName}.pptx` });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 no-print">
        <button
          onClick={copyToClipboard}
          className="flex-1 bg-slate-800 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm active:scale-95 transition-transform"
        >
          {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          {copied ? 'COPIED' : 'COPY TEXT'}
        </button>
        <button
          onClick={exportPptx}
          className="flex-1 bg-blue-900 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 font-bold text-sm active:scale-95 transition-transform"
        >
          <FileDown size={16} />
          EXPORT PPTX
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 bg-white border py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download size={16} />
        </button>
      </div>

      {/* Slide — 16:9 landscape aspect */}
      <div className="bg-white shadow-2xl border rounded-sm overflow-hidden print:shadow-none print:border-none" style={{ aspectRatio: '16/9' }}>
        <div className="h-full flex flex-col">
          {/* Header bar */}
          <div className="flex items-center justify-between bg-blue-900 px-6 py-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center text-blue-900 font-serif font-black text-[10px] text-center leading-none">
                DSCA
              </div>
              <h1 className="text-white font-black uppercase tracking-tight text-base">
                {report.company || 'COMPANY'} — Final Report
              </h1>
            </div>
            <div className="text-yellow-500 text-[10px] font-bold tracking-widest">
              {report.event || 'EVENT'}
            </div>
          </div>

          {/* Title strip */}
          <div className="bg-yellow-500 px-6 py-1.5 shrink-0">
            <h2 className="text-blue-900 font-bold text-sm uppercase tracking-wide">
              {report.title || 'Meeting Summary Report'}
            </h2>
          </div>

          {/* Body — 3-column layout */}
          <div className="flex-1 grid grid-cols-3 gap-0 text-[10pt] leading-snug overflow-hidden">
            {/* Left column */}
            <div className="p-5 space-y-4 border-r border-slate-200 overflow-hidden">
              <section>
                <h3 className="font-bold uppercase text-[9pt] tracking-wider text-blue-900 mb-1 border-b border-blue-900/20 pb-0.5">Purpose</h3>
                <p className="text-slate-700">{report.purpose}</p>
              </section>

              <section>
                <h3 className="font-bold uppercase text-[9pt] tracking-wider text-blue-900 mb-1 border-b border-blue-900/20 pb-0.5">Bottom Line</h3>
                <ul className="list-disc ml-4 space-y-0.5 text-slate-700">
                  {report.bottom_line
                    .filter((b) => b.trim())
                    .map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                </ul>
              </section>
            </div>

            {/* Center column */}
            <div className="p-5 space-y-4 border-r border-slate-200 overflow-hidden">
              <section>
                <h3 className="font-bold uppercase text-[9pt] tracking-wider text-blue-900 mb-1 border-b border-blue-900/20 pb-0.5">Background</h3>
                <ul className="list-disc ml-4 space-y-0.5 text-slate-700">
                  {report.background
                    .filter((b) => b.trim())
                    .map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                </ul>
              </section>
            </div>

            {/* Right column */}
            <div className="p-5 space-y-4 overflow-hidden">
              <section>
                <h3 className="font-bold uppercase text-[9pt] tracking-wider text-blue-900 mb-1 border-b border-blue-900/20 pb-0.5">Discussion</h3>
                <ul className="list-disc ml-4 space-y-0.5 text-slate-700">
                  {report.discussion
                    .filter((n) => n.trim())
                    .map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                </ul>
              </section>

              <section>
                <h3 className="font-bold uppercase text-[9pt] tracking-wider text-blue-900 mb-1 border-b border-blue-900/20 pb-0.5">Way Ahead / Recommendation</h3>
                <p className="text-slate-700">{report.recommendation}</p>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-100 px-6 py-1.5 flex justify-between items-center shrink-0 border-t border-slate-200">
            <span className="text-[8px] text-slate-400 font-semibold tracking-widest uppercase">Field Report</span>
            <span className="text-[8px] text-slate-400">DSCA Liaison Division</span>
          </div>
        </div>
      </div>
    </div>
  );
}
