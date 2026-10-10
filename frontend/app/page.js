"use client";

import { useEffect, useMemo, useState } from "react";
import { buildIndex, findMovie } from "./matcher";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ---------- helper ---------- */

// Genre dari backend berupa string dipisah spasi, mis. "Action Science Fiction"
function splitGenres(str) {
  if (!str) return [];
  return String(str)
    .replace(/Science Fiction/g, "Science-Fiction")
    .replace(/TV Movie/g, "TV-Movie")
    .split(/\s+/)
    .filter(Boolean)
    .map((g) => g.replace("-", " "));
}

// Warna kartu dibuat dari judul (tidak ada poster)
function hueOf(title) {
  let h = 0;
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}
function cardBg(title) {
  const h = (345 + (hueOf(title) % 50)) % 360; // merah - wine - oranye tua
  return {
    background: `linear-gradient(155deg, hsl(${h} 72% 27%) 0%, hsl(${(h + 10) % 360} 75% 9%) 100%)`
  };
}

function money(n) {
  if (!n) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${Math.round(n / 1e6)}M`;
  return `$${Math.round(n / 1e3)}K`;
}
function runtime(m) {
  if (!m) return "—";
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
function year(d) {
  return d ? d.slice(0, 4) : "—";
}
function longDate(d) {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  return isNaN(dt) ? d : dt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
function genresOf(item, det) {
  return det?.g?.length ? det.g : splitGenres(item?.genre);
}

/* ---------- komponen kecil ---------- */

// Lingkaran rating TMDB (0-10)
function RatingRing({ value }) {
  if (!value) return <div className="ring none"><span>NR</span></div>;
  return (
    <div className="ring" style={{ "--p": `${value * 10}%` }} title={`TMDB rating ${value}/10`}>
      <span>{value.toFixed(1)}</span>
    </div>
  );
}

// Kartu 3D: miring mengikuti kursor, tiap lapisan punya kedalaman sendiri
function MovieCard({ title, item, det, label, big, onOpen }) {
  function move(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(px - 0.5) * 18}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 18}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  }
  function leave(e) {
    const el = e.currentTarget;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "0%");
  }
  const genres = genresOf(item, det).slice(0, 4);

  return (
    <div className={big ? "tilt big" : "tilt"} onMouseMove={move} onMouseLeave={leave}>
      <article className="card3d" style={cardBg(title)}>
        <div className="glare" />
        {label && <span className="tag z2">{label}</span>}
        <div className="top z3">
          <h3>{title}</h3>
          <RatingRing value={det?.r} />
        </div>
        <div className="pills z2">
          {genres.map((g) => <span key={g}>{g}</span>)}
        </div>
        {det?.tg && <p className="tagline z1">“{det.tg}”</p>}
        <p className="desc z1">{det?.o || "Deskripsi untuk film ini belum tersedia."}</p>
        <div className="facts z2">
          <span>📅 {year(det?.d)}</span>
          <span>⏱ {runtime(det?.rt)}</span>
          {det?.v ? <span>👥 {det.v.toLocaleString("en-US")} votes</span> : null}
        </div>
        {item?.score != null && (
          <div className="sim z2">
            <div className="simtext"><b>Similarity</b><b>{item.score}%</b></div>
            <div className="bar"><i style={{ width: `${Math.min(item.score, 100)}%` }} /></div>
          </div>
        )}
        <button className="explore z3" onClick={() => onOpen(title, item?.score)}>
          Explore this movie
        </button>
      </article>
    </div>
  );
}

// Popup detail film
function MovieModal({ title, score, det, genreFallback, onClose, onSimilar }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const genres = det?.g?.length ? det.g : splitGenres(genreFallback);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <button className="x" onClick={onClose} aria-label="Close">×</button>

        <div className="mhead" style={cardBg(title)}>
          <div>
            <h2>{title}</h2>
            {det?.tg && <p className="mtag">“{det.tg}”</p>}
            <div className="pills">{genres.map((g) => <span key={g}>{g}</span>)}</div>
          </div>
          <RatingRing value={det?.r} />
        </div>

        <div className="mbody">
          <h4>Overview</h4>
          <p className="mover">{det?.o || "Deskripsi untuk film ini belum tersedia."}</p>

          <div className="mgrid">
            <div><b>Release date</b><span>{longDate(det?.d)}</span></div>
            <div><b>Running time</b><span>{runtime(det?.rt)}</span></div>
            <div><b>Budget</b><span>{money(det?.b)}</span></div>
            <div><b>Revenue</b><span>{money(det?.rv)}</span></div>
            <div><b>Language</b><span>{det?.l?.length ? det.l.join(", ") : "—"}</span></div>
            <div><b>Votes</b><span>{det?.v ? det.v.toLocaleString("en-US") : "—"}</span></div>
          </div>

          {score != null && (
            <div className="sim light">
              <div className="simtext"><b>Similarity dengan film yang kamu cari</b><b>{score}%</b></div>
              <div className="bar"><i style={{ width: `${Math.min(score, 100)}%` }} /></div>
            </div>
          )}

          {det?.c?.length ? (
            <>
              <h4>Production companies</h4>
              <p className="mover">{det.c.join("  ·  ")}</p>
            </>
          ) : null}

          <div className="mactions">
            <button className="dark" onClick={() => onSimilar(title)}>Cari film serupa</button>
            {det?.h && (
              <a className="ghost" href={det.h} target="_blank" rel="noreferrer">Official website ↗</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- halaman utama ---------- */

export default function Home() {
  const [index, setIndex] = useState([]);
  const [details, setDetails] = useState({});
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState("");
  const [result, setResult] = useState([]);
  const [didYouMean, setDidYouMean] = useState([]);
  const [modal, setModal] = useState(null); // { title, score }

  // Daftar judul dari backend (/movies) + detail film dari file JSON statis
  useEffect(() => {
    fetch(`${API}/movies`)
      .then((r) => r.json())
      .then((d) => setIndex(buildIndex(d.movies || [])))
      .catch(() => setError("Tidak bisa terhubung ke backend. Pastikan server berjalan di " + API));
    fetch("/movie-details.json")
      .then((r) => r.json())
      .then(setDetails)
      .catch(() => {});
  }, []);

  const live = useMemo(
    () => (query.trim().length >= 2 ? findMovie(index, query, 6) : { exact: null, suggestions: [] }),
    [index, query]
  );
  const dropdown = live.exact ? [live.exact] : live.suggestions;

  async function runSearch(title) {
    setLoading(true);
    setError("");
    setDidYouMean([]);
    try {
      // `title` sudah judul asli (huruf besar/kecil benar), jadi backend langsung cocok
      const res = await fetch(`${API}/recommend?movie=${encodeURIComponent(title)}`);
      const data = await res.json();
      if (data.error) {
        setResult([]);
        setSearched("");
        setError(`Film "${title}" tidak ditemukan.`);
      } else {
        setSearched(data.input || title);
        setResult(data.recommendation || []);
        setQuery(data.input || title);
      }
    } catch {
      setError("Tidak bisa terhubung ke backend. Pastikan server berjalan di " + API);
    }
    setLoading(false);
  }

  function search(e) {
    if (e) e.preventDefault();
    setShowList(false);
    if (!query.trim()) return;
    const { exact, suggestions } = findMovie(index, query, 6);
    if (exact) return runSearch(exact);
    setResult([]);
    setSearched("");
    setDidYouMean(suggestions);
    setError(
      suggestions.length
        ? `Judul "${query.trim()}" belum persis ketemu. Maksud kamu salah satu ini?`
        : `Film "${query.trim()}" tidak ditemukan.`
    );
  }

  function pick(title) {
    setQuery(title);
    setShowList(false);
    runSearch(title);
  }

  function similarFrom(title) {
    setModal(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    pick(title);
  }

  const openModal = (title, score) => setModal({ title, score });
  const closeModal = () => setModal(null);

  const top = result[0];
  const searchedDet = details[searched];
  const genres = useMemo(() => {
    if (searchedDet?.g?.length) return searchedDet.g.slice(0, 4);
    const count = {};
    result.forEach((r) => splitGenres(r.genre).forEach((g) => (count[g] = (count[g] || 0) + 1)));
    return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([g]) => g);
  }, [result, searchedDet]);

  const modalItem = modal ? result.find((r) => r.title === modal.title) : null;

  return (
    <main>
      {/* HERO */}
      <header className="hero">
        <div className="hero-inner">
          <div className="logo">CIN<i></i>MA <small>AI</small></div>
          <div className="script">Tonight&apos;s feature presentation</div>
          <h1><span className="r">Find your next</span><span className="y">favourite movie</span></h1>
          <p>One favorite movie is the beginning of a new journey. Let AI discover your next unforgettable story, perfectly matched to your taste.</p>

          <form className="searchbox" onSubmit={search} autoComplete="off">
            <input
              placeholder="Search movie, e.g. avatar"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowList(true); }}
              onFocus={() => setShowList(true)}
              onBlur={() => setTimeout(() => setShowList(false), 150)}
              aria-label="Search movie"
            />
            <button type="submit" disabled={loading}>{loading ? "..." : "Search"}</button>
            {showList && dropdown.length > 0 && (
              <ul className="suggest">
                {dropdown.map((t) => (
                  <li key={t} onMouseDown={() => pick(t)}>{t}</li>
                ))}
              </ul>
            )}
          </form>
        </div>
      </header>

      {error && (
        <section className="notice">
          <p>{error}</p>
          {didYouMean.length > 0 && (
            <div className="chips">
              {didYouMean.map((t) => (
                <button key={t} onClick={() => pick(t)}>{t}</button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* MOVIE PROFILE */}
      {searched && top && (
        <>
          <section className="profile-wrap">
          <div className="profile">
            <div className="profile-head">
              <div>
                <h2>{searched}</h2>
                <div className="genres">{genres.join("  |  ")}</div>
              </div>
              <div className="meta">
                <div><b>Rating</b><span>{searchedDet?.r ? `${searchedDet.r}/10` : "—"}</span></div>
                <div><b>Released</b><span>{year(searchedDet?.d)}</span></div>
                <div><b>Top match</b><span>{top.score}%</span></div>
              </div>
            </div>
            <hr />
            <div className="profile-body">
              <MovieCard title={searched} det={searchedDet} label="YOU SEARCHED" big onOpen={openModal} />
              <MovieCard title={top.title} item={top} det={details[top.title]} label="BEST MATCH" big onOpen={openModal} />
            </div>
          </div>
          </section>

          <section className="quote">
            <p>“Every great film begins with a great recommendation.”</p>
            <b>CINEMA AI</b>
          </section>

          {/* RELATED MOVIES */}
          <section className="related">
            <h2><span></span>RELATED MOVIES<span></span></h2>
            <div className="grid">
              {result.map((item) => (
                <MovieCard key={item.title} title={item.title} item={item} det={details[item.title]} onOpen={openModal} />
              ))}
            </div>
          </section>
        </>
      )}

      {!searched && !error && (
        <section className="empty">
          <div className="screen">
            <div className="script">The lights begin to fade…</div>
            <h2>The screen is ready to shine.</h2>
            <p>Choose a movie you love, and let AI create a personalized journey through stories perfectly made for you.</p>
            <div className="chips">
              <span>Handpicked For You:</span>
              <button onClick={() => pick("Avatar")}>Avatar</button>
              <button onClick={() => pick("The Dark Knight")}>The Dark Knight</button>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer>
        <div className="cols">
          <div>
            <div className="logo dark-logo">CIN<i></i>MA</div>
            <p>AI Movie Recommendation System<br />Hybrid semantic + genre + keyword similarity.</p>
          </div>
          <div>
            <h6>ABOUT</h6>
            <p>Rekomendasi film berbasis Sentence Transformer (all-MiniLM-L6-v2). Data film: TMDB 5000 Movies.</p>
          </div>
          <div>
            <h6>MENU</h6>
            <p>Home<br />Search<br />Related Movies</p>
          </div>
        </div>
        <div className="bottombar">© 2026 Cinema AI</div>
      </footer>

      {modal && (
        <MovieModal
          title={modal.title}
          score={modal.score}
          det={details[modal.title]}
          genreFallback={modalItem?.genre}
          onClose={closeModal}
          onSimilar={similarFrom}
        />
      )}
    </main>
  );
}
