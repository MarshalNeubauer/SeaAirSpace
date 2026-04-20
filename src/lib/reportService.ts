import { supabase, getClientSessionId } from './supabase';
import { normalizeReport } from '../types/report';
import type { Report } from '../types/report';

export async function fetchReports(): Promise<Report[]> {
  const sessionId = getClientSessionId();
  const { data, error } = await supabase
    .from('field_reports')
    .select('*')
    .eq('session_id', sessionId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map((r) => normalizeReport(r as Record<string, unknown>));
}

export async function upsertReport(report: Report): Promise<Report> {
  const sessionId = getClientSessionId();
  const { data, error } = await supabase
    .from('field_reports')
    .upsert({
      id: report.id,
      title: report.title,
      company: report.company,
      event: report.event,
      purpose: report.purpose,
      bottom_line: report.bottom_line,
      background: report.background,
      discussion: report.discussion,
      recommendation: report.recommendation,
      session_id: sessionId,
    })
    .select()
    .single();

  if (error) throw error;
  return normalizeReport(data as Record<string, unknown>);
}

export async function deleteReport(id: string): Promise<void> {
  const { error } = await supabase
    .from('field_reports')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
