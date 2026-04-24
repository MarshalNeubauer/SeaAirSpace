import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NavTabs from './components/NavTabs';
import EditView from './components/EditView';
import PreviewView from './components/PreviewView';
import ReportList from './components/ReportList';
import Footer from './components/Footer';
import { fetchReports, upsertReport, deleteReport } from './lib/reportService';
import { createBlankReport } from './types/report';
import type { Report } from './types/report';

type View = 'edit' | 'preview' | 'list';

export default function App() {
  const [report, setReport] = useState<Report>(createBlankReport());
  const [savedReports, setSavedReports] = useState<Report[]>([]);
  const [view, setView] = useState<View>('edit');
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const loadReports = useCallback(async () => {
    setLoadingList(true);
    try {
      const reports = await fetchReports();
      setSavedReports(reports);
    } catch {
      showToast('Failed to load reports.');
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await upsertReport(report);
      setReport(saved);
      setSavedReports((prev) => {
        const filtered = prev.filter((r) => r.id !== saved.id);
        return [saved, ...filtered];
      });
      showToast('Report saved.');
    } catch {
      showToast('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReport(id);
      setSavedReports((prev) => prev.filter((r) => r.id !== id));
      if (report.id === id) setReport(createBlankReport());
      showToast('Report deleted.');
    } catch {
      showToast('Delete failed.');
    }
  };

  const handleSelectReport = (r: Report) => {
    setReport(r);
    setView('edit');
  };

  const handleNewReport = () => {
    setReport(createBlankReport());
    setView('edit');
  };

  const handleShowList = () => {
    loadReports();
    setView('list');
  };

  return (
    <div className="flex flex-col bg-slate-50 font-sans text-slate-900" style={{ height: '100dvh' }}>
      <Header onShowList={handleShowList} onSave={handleSave} saving={saving} />

      {view !== 'list' && (
        <NavTabs view={view} onChangeView={(v) => setView(v as View)} />
      )}

      <main className="flex-1 overflow-y-auto">
        <div className={`mx-auto p-4 space-y-6 ${view === 'preview' ? 'max-w-5xl' : 'max-w-xl'}`}>
          {view === 'edit' && <EditView report={report} onChange={setReport} />}
          {view === 'preview' && <PreviewView report={report} />}
          {view === 'list' && (
            <ReportList
              reports={savedReports}
              loading={loadingList}
              onSelect={handleSelectReport}
              onDelete={handleDelete}
              onNew={handleNewReport}
            />
          )}
        </div>
      </main>

      {view !== 'list' && (
        <Footer onSave={handleSave} onPreview={() => setView('preview')} saving={saving} />
      )}

      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
