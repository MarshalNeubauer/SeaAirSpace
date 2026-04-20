type View = 'edit' | 'preview' | 'list';

interface NavTabsProps {
  view: View;
  onChangeView: (v: View) => void;
}

export default function NavTabs({ view, onChangeView }: NavTabsProps) {
  return (
    <div className="flex bg-white border-b sticky top-[60px] z-40">
      <button
        onClick={() => onChangeView('edit')}
        className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
          view === 'edit' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
        }`}
      >
        INPUT
      </button>
      <button
        onClick={() => onChangeView('preview')}
        className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
          view === 'preview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'
        }`}
      >
        PREVIEW
      </button>
    </div>
  );
}
