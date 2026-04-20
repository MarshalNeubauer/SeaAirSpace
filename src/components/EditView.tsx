import { useState } from 'react';
import { Trash2, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import classGuidanceImage from '../assets/image.png';
import type { Report } from '../types/report';

interface EditViewProps {
  report: Report;
  onChange: (r: Report) => void;
}

type StringArrayField = 'bottom_line' | 'background' | 'discussion';

interface CardSectionProps {
  title: string;
  items: string[];
  placeholder: string;
  addLabel: string;
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

function CardSection({
  title,
  items,
  placeholder,
  addLabel,
  onAdd,
  onUpdate,
  onRemove,
}: CardSectionProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-3 bg-slate-800 text-white font-bold text-sm">{title}</div>
      <div className="p-3 space-y-3">
        {items.map((val, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-1 bg-blue-200 rounded flex-shrink-0 mt-1" />
            <textarea
              className="flex-1 text-sm p-1 outline-none min-h-[60px] resize-none"
              placeholder={placeholder}
              value={val}
              onChange={(e) => onUpdate(i, e.target.value)}
            />
            <button
              onClick={() => onRemove(i)}
              className="text-slate-200 hover:text-red-400 transition-colors self-start mt-1"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={onAdd}
          className="w-full py-2 border-2 border-dashed border-slate-100 text-slate-400 text-[10px] font-bold rounded-lg hover:border-blue-200 hover:text-blue-400 transition-colors"
        >
          {addLabel}
        </button>
      </div>
    </div>
  );
}

export default function EditView({ report, onChange }: EditViewProps) {
  const [classGuidanceOpen, setClassGuidanceOpen] = useState(false);
  const addItem = (field: StringArrayField) => {
    onChange({ ...report, [field]: [...report[field], ''] });
  };

  const updateItem = (field: StringArrayField, index: number, value: string) => {
    const arr = [...report[field]];
    arr[index] = value;
    onChange({ ...report, [field]: arr });
  };

  const removeItem = (field: StringArrayField, index: number) => {
    onChange({ ...report, [field]: report[field].filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <section className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-blue-800 font-bold border-b pb-2">
          <Building2 size={18} />
          <h2 className="text-sm uppercase tracking-wide">Engagement Details</h2>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase">Document Title</label>
          <input
            type="text"
            placeholder="e.g., Leidos Discussion with Director Miller"
            className="w-full p-2 border-b focus:border-blue-500 outline-none transition-all text-sm"
            value={report.title}
            onChange={(e) => onChange({ ...report, title: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Prime Company</label>
            <input
              type="text"
              placeholder="e.g., Leidos"
              className="w-full p-2 border-b focus:border-blue-500 outline-none text-sm"
              value={report.company}
              onChange={(e) => onChange({ ...report, company: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase">Venue</label>
            <input
              type="text"
              className="w-full p-2 border-b focus:border-blue-500 outline-none text-sm"
              value={report.event}
              onChange={(e) => onChange({ ...report, event: e.target.value })}
            />
          </div>
        </div>
      </section>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-800 text-white font-bold text-sm">Purpose</div>
        <div className="p-3">
          <textarea
            className="w-full p-2 bg-slate-50 rounded text-sm min-h-[80px] outline-none resize-none"
            value={report.purpose}
            onChange={(e) => onChange({ ...report, purpose: e.target.value })}
          />
        </div>
      </div>

      <CardSection
        title="Bottom Line"
        items={report.bottom_line}
        placeholder="Enter key takeaway..."
        addLabel="+ ADD BOTTOM LINE DETAIL"
        onAdd={() => addItem('bottom_line')}
        onUpdate={(i, v) => updateItem('bottom_line', i, v)}
        onRemove={(i) => removeItem('bottom_line', i)}
      />

      <CardSection
        title="Background"
        items={report.background}
        placeholder="Enter background detail..."
        addLabel="+ ADD BACKGROUND DETAIL"
        onAdd={() => addItem('background')}
        onUpdate={(i, v) => updateItem('background', i, v)}
        onRemove={(i) => removeItem('background', i)}
      />

      <CardSection
        title="Discussion"
        items={report.discussion}
        placeholder="Enter discussion note..."
        addLabel="+ ADD DISCUSSION DETAIL"
        onAdd={() => addItem('discussion')}
        onUpdate={(i, v) => updateItem('discussion', i, v)}
        onRemove={(i) => removeItem('discussion', i)}
      />

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-3 bg-slate-800 text-white font-bold text-sm">
          Way Ahead / Recommendation
        </div>
        <div className="p-3">
          <textarea
            className="w-full p-2 bg-slate-50 rounded text-sm min-h-[60px] outline-none resize-none"
            value={report.recommendation}
            onChange={(e) => onChange({ ...report, recommendation: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setClassGuidanceOpen((o) => !o)}
          className="w-full flex items-center justify-between p-3 bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 transition-colors"
        >
          <span>Class Guidance</span>
          {classGuidanceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {classGuidanceOpen && (
          <div className="p-3 bg-slate-50">
            <img
              src={classGuidanceImage}
              alt="Class Guidance"
              className="w-full rounded border border-slate-200 shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
