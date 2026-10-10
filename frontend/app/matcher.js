// Pencocokan judul film di sisi frontend (backend tidak diubah).
// Backend butuh judul PERSIS sama (case-sensitive), jadi di sini kita
// cari judul aslinya dulu, baru dikirim ke backend.

// "WALL·E" -> "walle", "Déjà Vu" -> "deja vu", "  THE   dark KNIGHT " -> "the dark knight"
export function normalize(text) {
  return String(text || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")      // buang aksen
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")          // buang tanda baca
    .replace(/\s+/g, " ")
    .trim();
}

// Tanpa "the" / "a" / "an" di depan: "avengers" cocok dengan "The Avengers"
function stripArticle(s) {
  return s.replace(/^(the|a|an)\s+/, "");
}

function distance(a, b) {
  if (a === b) return 0;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

// Dipanggil sekali setelah daftar judul dari /movies diterima
export function buildIndex(titles) {
  return titles.map((title) => {
    const n = normalize(title);
    return { title, n, nShort: stripArticle(n) };
  });
}

// Cari judul asli yang paling cocok. Mengembalikan { exact, suggestions }
export function findMovie(index, query, limit = 6) {
  const q = normalize(query);
  if (!q) return { exact: null, suggestions: [] };
  const qShort = stripArticle(q);

  const exact = index.find((m) => m.n === q || m.nShort === qShort);
  if (exact) return { exact: exact.title, suggestions: [] };

  const scored = [];
  for (const m of index) {
    let score = 0;
    if (m.n.startsWith(q) || m.nShort.startsWith(qShort)) score = 100 - Math.min(m.n.length - q.length, 50);
    else if (m.n.includes(q)) score = 60 - Math.min(m.n.indexOf(q), 30);
    else if (q.length >= 4) {
      // toleransi typo kecil, mis. "avnegers" -> "avengers"
      const d = distance(qShort, m.nShort.slice(0, qShort.length + 2));
      const limitD = qShort.length <= 5 ? 1 : 2;
      if (d <= limitD) score = 40 - d * 10;
    }
    if (score > 0) scored.push({ title: m.title, score });
  }
  scored.sort((a, b) => b.score - a.score);
  const suggestions = scored.slice(0, limit).map((s) => s.title);
  return { exact: null, suggestions };
}
