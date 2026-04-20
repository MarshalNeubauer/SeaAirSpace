import { Save, FileText, Loader2 } from 'lucide-react';

interface FooterProps {
  onSave: () => void;
  onPreview: () => void;
  saving: boolean;
}

export default function Footer({ onSave, onPreview, saving }: FooterProps) {
  return (
    <footer className="bg-white border-t p-2 flex gap-2 z-50 shrink-0">
      <button
        onClick={onSave}
        disabled={saving}
        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-60"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {saving ? 'SAVING...' : 'SAVE'}
      </button>
      <button
        onClick={onPreview}
        className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <FileText size={18} /> PREVIEW
      </button>
    </footer>
  );
}
