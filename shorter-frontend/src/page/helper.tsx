const ADJS = ["swift", "neat", "tiny", "bold", "keen", "crisp", "pure", "fine"];
const NOUNS = ["fox", "owl", "ray", "arc", "dot", "key", "bit", "cue"];

export const rnd = (a: any) => a[Math.floor(Math.random() * a.length)];
export const genCode = () => `${rnd(ADJS)}-${rnd(NOUNS)}`;


/* ---------------- UTILS ---------------- */

export const timeAgo = (iso?: string) => {
  if (!iso) return "—";

  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);

  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;

  return `${Math.floor(d / 30)}mo ago`;
};