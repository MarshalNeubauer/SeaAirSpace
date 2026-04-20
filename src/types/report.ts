export interface Report {
  id: string;
  title: string;
  company: string;
  event: string;
  purpose: string;
  bottom_line: string[];
  background: string[];
  discussion: string[];
  recommendation: string;
  created_at?: string;
  updated_at?: string;
}

export function createBlankReport(): Report {
  return {
    id: crypto.randomUUID(),
    title: '',
    company: '',
    event: 'Sea-Air-Space 2026',
    purpose: [''],
    bottom_line: [''],
    background: [''],
    discussion: [''],
    recommendation: [''],
  };
}

type LegacyDiscussionItem = { category: string; notes: string[] };

export function normalizeReport(raw: Record<string, unknown>): Report {
  let discussion: string[] = [];
  const rawDisc = raw.discussion;
  if (Array.isArray(rawDisc)) {
    if (rawDisc.length === 0) {
      discussion = [''];
    } else if (typeof rawDisc[0] === 'string') {
      discussion = rawDisc as string[];
    } else {
      discussion = (rawDisc as LegacyDiscussionItem[]).flatMap((d) => d.notes);
    }
  }
  return { ...(raw as unknown as Report), discussion };
}
