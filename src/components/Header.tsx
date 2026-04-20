import { History, Save } from 'lucide-react';

interface HeaderProps {
  onShowList: () => void;
  onSave: () => void;
  saving: boolean;
}

export default function Header({ onShowList, onSave, saving }: HeaderProps) {
  return (
    <header className="bg-[#002B5B] text-white p-4 sticky top-0 z-50 shadow-md flex justify-between items-center">
      <div>
        <h1 className="text-lg font-bold leading-none tracking-tight">Sea Air Space 2026</h1>
        <p className="text-[10px] opacity-70 uppercase tracking-widest mt-1">Field Intake Module</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onShowList}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <History size={20} />
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-full transition-colors"
        >
          <Save size={20} />
        </button>
      </div>
    </header>
  );
}
