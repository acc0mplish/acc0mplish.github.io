export type WorkspaceView = 'all' | 'needs-review' | 'documents';
export type WorkspaceStatus = 'needs-review' | 'reviewed' | 'completed';
export type WorkspaceAction = 'review' | 'complete' | 'reopen';
export interface WorkspaceEntry {
  /** Authored English labels remain searchable alongside Korean source fields. */
  searchAliases?: string[];
  id: string;
  kind: 'task' | 'document';
  title: string;
  summary: string;
  content: string;
  owner: string;
  updated: string;
  status: WorkspaceStatus;
}
function isWorkspaceEntry(entry: unknown): entry is WorkspaceEntry {
  if (!entry || typeof entry !== 'object') return false;
  const item = entry as WorkspaceEntry;
  return typeof item.id === 'string' && item.id.trim().length > 0
    && (item.kind === 'task' || item.kind === 'document')
    && ['needs-review', 'reviewed', 'completed'].includes(item.status)
    && ['title', 'summary', 'content', 'owner', 'updated'].every(key => typeof item[key as keyof WorkspaceEntry] === 'string');
}

/** Searches the same sample records used by the visible lists and their metrics. */
export function filterWorkspaceEntries(entries: readonly WorkspaceEntry[], view: WorkspaceView, query: string): WorkspaceEntry[] {
  if (!['all', 'needs-review', 'documents'].includes(view)) return [];
  const normalized = query.trim().toLocaleLowerCase();
  return entries.filter(isWorkspaceEntry).filter(entry => {
    if (view === 'needs-review' && entry.status !== 'needs-review') return false;
    if (view === 'documents' && entry.kind !== 'document') return false;
    return !normalized || [entry.title, entry.summary, entry.content, entry.owner, ...(entry.searchAliases ?? [])].some(text => text.toLocaleLowerCase().includes(normalized));
  });
}

/** Explicit transitions prevent skipping review or changing a record twice. */
export function transitionWorkspaceEntry(entries: WorkspaceEntry[], id: string, action: WorkspaceAction): WorkspaceEntry[] {
  const entry = entries.find(item => isWorkspaceEntry(item) && item.id === id);
  if (!entry) return entries;
  let next: WorkspaceStatus | undefined;
  if (action === 'review' && entry.status === 'needs-review') next = 'reviewed';
  if (action === 'complete' && entry.status === 'reviewed') next = 'completed';
  if (action === 'reopen' && entry.status !== 'needs-review') next = 'needs-review';
  if (!next) return entries;
  return entries.map(item => item === entry ? { ...item, status: next } : item);
}

export function workspaceMetrics(entries: readonly WorkspaceEntry[]) {
  const valid = entries.filter(isWorkspaceEntry);
  return {
    total: valid.length,
    needsReview: valid.filter(item => item.status === 'needs-review').length,
    reviewed: valid.filter(item => item.status === 'reviewed').length,
    completed: valid.filter(item => item.status === 'completed').length,
    documents: valid.filter(item => item.kind === 'document').length,
  };
}
