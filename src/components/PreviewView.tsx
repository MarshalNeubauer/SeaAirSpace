import { useState } from 'react';
import { Copy, CheckCircle2, Download } from 'lucide-react';
import type { Report } from '../types/report';

interface PreviewViewProps {
  report: Report;
}

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
                <p className="text-slate-700">• {report.recommendation}</p>
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
