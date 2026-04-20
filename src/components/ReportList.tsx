import { FileText, History, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import type { Report } from '../types/report';

interface ReportListProps {
  reports: Report[];
  loading: boolean;
  onSelect: (r: Report) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export default function ReportList({
  reports,
  loading,
  onSelect,
  onDelete,
  onNew,
}: ReportListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
        <History size={16} /> Saved Sessions
      </h2>

      {reports.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <FileText size={48} className="mx-auto mb-4 opacity-20" />
          <p>No reports saved yet.</p>
        </div>
      ) : (
        reports.map((r) => (
          <div
            key={r.id}
            className="w-full bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center hover:border-blue-400 transition-all group"
          >
            <button className="flex-1 text-left" onClick={() => onSelect(r)}>
              <h3 className="font-bold text-blue-900">{r.company || 'Unnamed Engagement'}</h3>
              <p className="text-[10px] text-slate-400 uppercase">{r.title || 'No Title'}</p>
              {r.updated_at && (
                <p className="text-[9px] text-slate-300 mt-1">
                  {new Date(r.updated_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(r.id);
                }}
                className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              <ChevronRight
                size={18}
                className="text-slate-300 group-hover:text-blue-400 transition-colors"
              />
            </div>
          </div>
        ))
      )}

      <button
        onClick={onNew}
        className="w-full py-4 text-blue-600 font-bold border-2 border-dashed border-blue-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
      >
        + START NEW REPORT
      </button>
    </div>
  );
}
