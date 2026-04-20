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
    <div className="space-y-6">
      <div className="flex gap-2 no-print">
        <button
          onClick={copyToClipboard}
          className="flex-1 bg-slate-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm active:scale-95 transition-transform"
        >
          {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
          {copied ? 'COPIED' : 'COPY TEXT'}
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 bg-white border py-3 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download size={18} />
        </button>
      </div>

      <div className="bg-white shadow-2xl border min-h-[800px] p-8 text-[11pt] leading-tight space-y-6 print:shadow-none print:border-none">
        <div className="flex justify-between items-center border-b-4 border-yellow-500 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-serif font-bold text-xs text-center border-2 border-yellow-500">
              DSCA
            </div>
            <div>
              <h1 className="text-xl font-black uppercase text-blue-900 tracking-tighter">
                {report.company || 'COMPANY'} — Final Report
              </h1>
            </div>
          </div>
          <div className="text-right text-[10px] font-bold text-slate-400">
            SAS {report.event.slice(-4)}
          </div>
        </div>

        <div className="border-y-2 border-slate-800 py-2 text-center">
          <h2 className="text-md font-bold underline">
            Title: {report.title || 'Meeting Summary Report'}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8 text-[10pt]">
          <div className="space-y-6">
            <section>
              <h3 className="font-bold underline uppercase mb-2">Purpose:</h3>
              <p>{report.purpose}</p>
            </section>

            <section>
              <h3 className="font-bold underline uppercase mb-2">Bottom Line:</h3>
              <ul className="list-disc ml-5 space-y-1">
                {report.bottom_line
                  .filter((b) => b.trim())
                  .map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
              </ul>
            </section>

            <section>
              <h3 className="font-bold underline uppercase mb-2">Background:</h3>
              <ul className="list-disc ml-5 space-y-1">
                {report.background
                  .filter((b) => b.trim())
                  .map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="font-bold underline uppercase mb-2">Discussion:</h3>
              <ul className="list-disc ml-5 space-y-1">
                {report.discussion
                  .filter((n) => n.trim())
                  .map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
              </ul>
            </section>

            <section className="mt-8">
              <h3 className="font-bold underline uppercase mb-2">Way Ahead/Recommendation:</h3>
              <p className="italic">• {report.recommendation}</p>
            </section>
          </div>
        </div>

        <div className="pt-20 text-[9px] text-slate-400 italic border-t flex justify-between">
          <span>FIELD_REPORT</span>
        </div>
      </div>
    </div>
  );
}
