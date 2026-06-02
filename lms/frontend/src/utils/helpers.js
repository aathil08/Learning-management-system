export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const timeAgo = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)   return 'just now';
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export const categoryColor = {
  'Web Development': '#0ea5e9',
  'Mobile':          '#8b5cf6',
  'Data Science':    '#10b981',
  'Design':          '#f59e0b',
  'DevOps':          '#ef4444',
  'Other':           '#64748b',
};

export const levelColor = {
  'Beginner':     '#10b981',
  'Intermediate': '#f59e0b',
  'Advanced':     '#ef4444',
};

export const ALL_CATEGORIES = [
  'All', 'Web Development', 'Mobile', 'Data Science', 'Design', 'DevOps', 'Other',
];

export const ALL_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export const truncate = (str, n = 100) =>
  str?.length > n ? str.slice(0, n) + '…' : str;
