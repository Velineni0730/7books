import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { renderAsync } from "docx-preview";

const API_URL = import.meta.env.VITE_API_URL;


// ─── THEMES: 6 colour themes + 1 "Book Theme" (filled after cover extraction) ──
const BASE_THEMES = {
  book:     { name: "Book",     pageBg: "#ffffff", pageText: "#111111", outerBg: "#333333", isBook: true },
  cream:    { name: "Cream",    pageBg: "#fdf6e3", pageText: "#2c1810", outerBg: "#e8d5b7" },
  sepia:    { name: "Sepia",    pageBg: "#f4ede1", pageText: "#5c3d1e", outerBg: "#c9a87c" },
  forest:   { name: "Forest",   pageBg: "#f0f4ee", pageText: "#1a3020", outerBg: "#7a9e7e" },
  midnight: { name: "Midnight", pageBg: "#1e2235", pageText: "#c8d0e8", outerBg: "#0d0f1a" },
  dark:     { name: "Dark",     pageBg: "#1f2937", pageText: "#f3f4f6", outerBg: "#111827" },
  rose:     { name: "Rose",     pageBg: "#fff1f3", pageText: "#881337", outerBg: "#fecdd3" },
};

// ─── FONTS: 7 options ──────────────────────────────────────────────────────────
const FONTS = [
  { label: "Switzer",    value: "Switzer, sans-serif",                  pageBg: "#f8f8f8", pageText: "#111" },
  { label: "Garamond",   value: "Garamond, 'EB Garamond', serif",       pageBg: "#fdf8f0", pageText: "#2a1a0a" },
  { label: "Serif",      value: "Georgia, 'Times New Roman', serif",    pageBg: "#faf8f5", pageText: "#1a1208" },
  { label: "Mono",       value: "'Courier New', Courier, monospace",    pageBg: "#f4f4f2", pageText: "#1a1a1a" },
  { label: "Humanist",   value: "'Gill Sans', 'Segoe UI', sans-serif",  pageBg: "#f2f6fb", pageText: "#0d1b2a" },
  { label: "Futura",     value: "'Futura', 'Century Gothic', sans-serif", pageBg: "#f9f5ff", pageText: "#1a0a2e" },
  { label: "Palatino",   value: "'Palatino Linotype', Palatino, serif", pageBg: "#fefaf4", pageText: "#2c1f0a" },
];

// ─── FONT STYLES ──────────────────────────────────────────────────────────────
const FONT_STYLES = [
  { label: "Normal",        fontWeight: "normal", fontStyle: "normal",  textDecoration: "none" },
  { label: "Bold",          fontWeight: "bold",   fontStyle: "normal",  textDecoration: "none" },
  { label: "Italic",        fontWeight: "normal", fontStyle: "italic",  textDecoration: "none" },
  { label: "Bold Italic",   fontWeight: "bold",   fontStyle: "italic",  textDecoration: "none" },
  { label: "Light",         fontWeight: "300",    fontStyle: "normal",  textDecoration: "none" },
  { label: "Underline",     fontWeight: "normal", fontStyle: "normal",  textDecoration: "underline" },
];

// ─── PRESET FONT COLORS ───────────────────────────────────────────────────────
const COLOR_PRESETS = [
  "#111111", "#2c1810", "#1a3020", "#0d1b2a", "#881337",
  "#c8d0e8", "#f3f4f6", "#f4ede1", "#7a4f2e", "#ffffff",
];

// ─── Walk every DOM node and stamp styles directly (beats inline styles) ──────
function stampStyles(root, { color, fontSize, lineHeight, fontFamily, fontWeight, fontStyle, textDecoration }) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let node = walker.currentNode;
  while (node) {
    const el = node;
    const tag = el.tagName?.toLowerCase();
    if (!["svg", "img", "canvas", "picture", "video"].includes(tag)) {
      el.style.setProperty("color",           color,          "important");
      el.style.setProperty("font-family",     fontFamily,     "important");
      el.style.setProperty("line-height",     String(lineHeight), "important");
      el.style.setProperty("font-weight",     fontWeight,     "important");
      el.style.setProperty("font-style",      fontStyle,      "important");
      el.style.setProperty("text-decoration", textDecoration, "important");
      if      (tag === "h1") el.style.setProperty("font-size", `${fontSize * 1.75}px`, "important");
      else if (tag === "h2") el.style.setProperty("font-size", `${fontSize * 1.4}px`,  "important");
      else if (tag === "h3") el.style.setProperty("font-size", `${fontSize * 1.2}px`,  "important");
      else                   el.style.setProperty("font-size", `${fontSize}px`,         "important");
    }
    node = walker.nextNode();
  }
}

// ─── Extract dominant colours from a canvas/image ─────────────────────────────
function extractColorsFromImage(imgEl) {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width  = 40;
      canvas.height = 60;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imgEl, 0, 0, 40, 60);
      const data = ctx.getImageData(0, 0, 40, 60).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 16) {
        r += data[i]; g += data[i+1]; b += data[i+2]; count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      // Determine light/dark and create palette
      const lum = 0.299*r + 0.587*g + 0.114*b;
      const outerBg = `rgb(${Math.round(r*0.55)},${Math.round(g*0.55)},${Math.round(b*0.55)})`;
      const pageBg  = lum > 128
        ? `rgb(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b+60)})`
        : `rgb(${Math.max(0,r-40)},${Math.max(0,g-40)},${Math.max(0,b-40)})`;
      const pageText = lum > 128 ? "#1a1008" : "#f0ede8";
      resolve({ outerBg, pageBg, pageText });
    } catch {
      resolve({ outerBg: "#333", pageBg: "#fff", pageText: "#111" });
    }
  });
}

export default function Editor() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookId   = location.state?.bookId;

  const [book,         setBook]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [rendered,     setRendered]     = useState(false);
  const [allPages,     setAllPages]     = useState([]);
  const [totalPages,   setTotalPages]   = useState(0);
  const [currentPage,  setCurrentPage]  = useState(0);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft,   setTitleDraft]   = useState("");

  // UI
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [doubleView,  setDoubleView]  = useState(true);

  // Theme
  const [themes,      setThemes]      = useState(BASE_THEMES);
  const [activeTheme, setActiveTheme] = useState("book");

  // Typography
  const [fontColor,      setFontColor]      = useState(null);
  const [fontSize,       setFontSize]       = useState(16);
  const [lineHeight,     setLineHeight]     = useState(1.6);
  const [activeFontIdx,  setActiveFontIdx]  = useState(0);
  const [activeStyleIdx, setActiveStyleIdx] = useState(0);
  const [zoom,           setZoom]           = useState(1);

  const viewerRef  = useRef(null);
  const hiddenRef  = useRef(null);
  const styleRef   = useRef(null);
  const typoRef    = useRef({});

  const theme      = themes[activeTheme];
  const activeFont = FONTS[activeFontIdx];
  const fontStyle  = FONT_STYLES[activeStyleIdx];
  const effectiveColor = fontColor ?? theme.pageText;

  // Keep typoRef fresh so stamp can always read latest values
  useEffect(() => {
    typoRef.current = {
      color:          effectiveColor,
      fontSize,
      lineHeight,
      fontFamily:     activeFont.value,
      fontWeight:     fontStyle.fontWeight,
      fontStyle:      fontStyle.fontStyle,
      textDecoration: fontStyle.textDecoration,
    };
  }, [effectiveColor, fontSize, lineHeight, activeFont, fontStyle]);

  // ── 1. Fetch book ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!bookId) { navigate("/dashboard"); return; }
    fetch(`${API_URL}/api/books/${bookId}`)
      .then(r => r.json())
      .then(data => { setBook(data); setTitleDraft(data.title || ""); setLoading(false); })
      .catch(() => setLoading(false));
  }, [bookId, navigate]);

  // ── 2. Render DOCX into hidden container ──────────────────────────────────
  useEffect(() => {
    if (!book?.docxUrl || !hiddenRef.current || rendered) return;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/${book.docxUrl}`);
        const blob = await res.blob();
        hiddenRef.current.innerHTML = "";
        await renderAsync(blob, hiddenRef.current, null, {
          inWrapper: false, ignoreWidth: false, ignoreHeight: false,
          breakPages: true, useBase64URL: true,
        });
        const sections = Array.from(hiddenRef.current.querySelectorAll("section.docx"));
        setAllPages(sections);
        setTotalPages(sections.length);
        setRendered(true);

        // Extract book cover colours from first page image
        const coverImg = sections[0]?.querySelector("img");
        if (coverImg) {
          const doExtract = (img) => {
            extractColorsFromImage(img).then(({ outerBg, pageBg, pageText }) => {
              setThemes(prev => ({
                ...prev,
                book: { ...prev.book, outerBg, pageBg, pageText }
              }));
            });
          };
          if (coverImg.complete) doExtract(coverImg);
          else coverImg.onload = () => doExtract(coverImg);
        }
      } catch (err) {
        console.error("Render failed:", err);
      }
    })();
  }, [book, rendered]);

  // ── 3. Show current spread — scale-to-fit each page, anchored to the spine ──
  // docx-preview stamps a fixed pixel width on every section (e.g. 816px).
  // We wrap each page in a "slot" div that fills its half (or full) of the
  // reading area, then scale the inner page to fit that slot while keeping
  // proportions. In double-page view the left page is pinned to the RIGHT
  // edge of its slot and the right page is pinned to the LEFT edge of its
  // slot, so the two pages meet at the centre spine like a real open book —
  // any leftover space only shows up on the outer edges, not in the middle.
  useEffect(() => {
    if (!rendered || !viewerRef.current || allPages.length === 0) return;
    viewerRef.current.innerHTML = "";

    const spread   = doubleView ? 2 : 1;
    const startIdx = currentPage * spread;

    for (let i = 0; i < spread; i++) {
      const pg = allPages[startIdx + i];

      // Outer slot — fills exactly 1/spread of the viewer
      const slot = document.createElement("div");
      slot.style.flex          = "1";
      slot.style.width         = "0";
      slot.style.minWidth      = "0";
      slot.style.height        = "100%";
      slot.style.display       = "flex";
      slot.style.alignItems    = "stretch";
      slot.style.justifyContent = "stretch";
      slot.style.overflow      = "hidden";
      slot.style.position      = "relative";

      if (pg) {
        const clone = pg.cloneNode(true);
        const rect = pg.getBoundingClientRect();
        const naturalW = rect.width  || parseFloat(clone.style.width)  || 816;
        const naturalH = rect.height || parseFloat(clone.style.height) || 1056;
        const padX = 140;
        const padY = 160; // 80px top + 80px bottom


        // Reset inline layout — we control sizing via transform
        clone.style.cssText      = "";
        clone.style.width        = `${naturalW}px`;
        clone.style.height       = `${naturalH}px`;
        clone.style.background   = theme.pageBg;
        clone.style.boxShadow    = "0 4px 20px rgba(0,0,0,.18)";
        clone.style.borderRadius = "4px";
        clone.style.boxSizing    = "border-box";
        clone.style.flexShrink   = "0";
        clone.style.position     = "relative";
        clone.style.padding = "20px 20px"; // docx-preview adds 20px padding to each section


        slot.appendChild(clone);

        // Is this the left half or right half of an open double-page spread?
        const isLeftPage  = spread === 2 && i === 0;
        const isRightPage = spread === 2 && i === 1;

        // Scale + position the clone to fill its slot — recalculate on every resize
        const fit = () => {
          const sw = slot.offsetWidth  || 1;
          const sh = slot.offsetHeight || 1;
          const scaleX = sw / naturalW;
          const scaleY = sh / naturalH;

          // Fill the available area while keeping proportions
          const s = Math.min(scaleX, scaleY);

          clone.style.position       = "absolute";
          clone.style.top            = "50%";
          clone.style.transformOrigin = isLeftPage ? "right center" : isRightPage ? "left center" : "center center";

          if (isLeftPage) {
            // Pin to the right edge of the slot (touches the spine)
            clone.style.left   = "auto";
            clone.style.right  = "0";
            clone.style.transform = `translateY(-50%) scale(${s})`;
          } else if (isRightPage) {
            // Pin to the left edge of the slot (touches the spine)
            clone.style.left   = "0";
            clone.style.right  = "auto";
            clone.style.transform = `translateY(-50%) scale(${s})`;
          } else {
            // Single-page view — just centre it
            clone.style.left   = "50%";
            clone.style.right  = "auto";
            clone.style.transform = `translate(-50%, -50%) scale(${s})`;
          }
        };

        // Run immediately and on any container resize
        const ro = new ResizeObserver(fit);
        ro.observe(slot);
        fit(); // first pass
        slot._ro = ro; // store for cleanup
      }

      viewerRef.current.appendChild(slot);
    }

    stampStyles(viewerRef.current, typoRef.current);

    // Cleanup ResizeObservers when this effect re-runs
    return () => {
      Array.from(viewerRef.current?.children || []).forEach(slot => {
        slot._ro?.disconnect();
      });
    };
  }, [rendered, currentPage, doubleView, allPages, theme.pageBg]);

  // ── 4. Live-stamp styles on any typography change ──────────────────────────
  useEffect(() => {
    if (!viewerRef.current) return;
    stampStyles(viewerRef.current, {
      color: effectiveColor, fontSize, lineHeight,
      fontFamily: activeFont.value,
      fontWeight: fontStyle.fontWeight,
      fontStyle: fontStyle.fontStyle,
      textDecoration: fontStyle.textDecoration,
    });
  }, [effectiveColor, fontSize, lineHeight, activeFont, fontStyle]);

  // ── 5. Structural CSS ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      document.head.appendChild(styleRef.current);
    }
    // Only structural — sizing is handled by ResizeObserver + transform scale
    styleRef.current.textContent = `
      #docx-viewer > div {
        position: relative;
      }
      /* Prevent docx-preview's internal wrapper from adding unwanted scroll */
      #docx-viewer section.docx {
        overflow: hidden !important;
      }
    `;
  }, []);

  useEffect(() => () => styleRef.current?.remove(), []);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const spread       = doubleView ? 2 : 1;
  const totalSpreads = Math.ceil(totalPages / spread);
  const prevPage     = () => setCurrentPage(p => Math.max(0, p - 1));
  const nextPage     = () => setCurrentPage(p => Math.min(totalSpreads - 1, p + 1));

  useEffect(() => { setCurrentPage(0); }, [doubleView]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") nextPage();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   prevPage();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [totalSpreads]);

  // ── Title save ─────────────────────────────────────────────────────────────
  const saveTitle = async () => {
    setEditingTitle(false);
    if (titleDraft === book.title) return;
    setBook(b => ({ ...b, title: titleDraft }));
    try {
      await fetch(`${API_URL}/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: titleDraft }),
      });
    } catch { /* silent */ }
  };

  // ── Loading states ─────────────────────────────────────────────────────────
  if (loading) return <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#111", color:"#fff", fontSize:"18px", fontWeight:700 }}>Loading…</div>;
  if (!book)   return <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>Book not found.</div>;

  const isDark      = ["midnight","dark"].includes(activeTheme);
  const sidebarBg   = isDark ? "rgba(12,14,24,0.95)"    : "rgba(255,255,255,0.78)";
  const sc          = isDark ? "#d1d5db"                : "#111827";   // sidebar colour
  const bc          = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"; // border
  const chip        = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"; // chip bg

  return (
    <div style={{ display:"flex", height:"100dvh", width:"100vw", overflow:"hidden", background: theme.outerBg, transition:"background 0.4s" }}>

      {/* Off-screen DOCX render container */}
      <div ref={hiddenRef} style={{ position:"absolute", left:"-9999px", top:0, width:"800px", visibility:"hidden", pointerEvents:"none" }} />

      {/* ═══ SIDEBAR ═══════════════════════════════════════════════════════════ */}
      <aside style={{
        width: sidebarOpen ? "268px" : "0",
        minWidth: sidebarOpen ? "268px" : "0",
        overflow: "hidden",
        flexShrink: 0,
        transition: "width 0.28s ease, min-width 0.28s ease",
        background: sidebarBg,
        backdropFilter: "blur(24px)",
        borderRight: `1px solid ${bc}`,
        color: sc,
        zIndex: 30,
      }}>
        <div style={{ width:"268px", height:"100dvh", display:"flex", flexDirection:"column", padding:"18px 15px 16px", boxSizing:"border-box", overflowY:"auto", gap:0 }}>

          {/* ── BOOK TITLE (editable) ─────────────────────────────────────── */}
          <SLabel>Book</SLabel>
          {editingTitle ? (
            <div style={{ display:"flex", gap:"6px", marginBottom:"14px" }}>
              <input
                autoFocus
                value={titleDraft}
                onChange={e => setTitleDraft(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditingTitle(false); }}
                style={{
                  flex:1, padding:"5px 8px", borderRadius:"7px", fontSize:"12px", fontWeight:600,
                  border:`1.5px solid ${bc}`, background: chip, color: sc, outline:"none",
                }}
              />
              <SmBtn onClick={saveTitle} color={sc} bg={chip} label="✓" />
            </div>
          ) : (
            <div
              onClick={() => setEditingTitle(true)}
              title="Click to rename"
              style={{
                fontSize:"13px", fontWeight:700, lineHeight:1.35, marginBottom:"14px",
                cursor:"pointer", padding:"4px 6px", borderRadius:"7px",
                border:`1.5px solid transparent`,
                overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical",
                transition:"border-color 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = bc}
              onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
            >
              {book.title || "Untitled"}
              <span style={{ fontSize:"10px", opacity:0.35, marginLeft:"5px" }}>✎</span>
            </div>
          )}

          <HR color={bc} />

          {/* ── VIEW ───────────────────────────────────────────────────────── */}
          <Section label="View">
            <div style={{ display:"flex", gap:"6px" }}>
              {[{l:"Single",val:false},{l:"Double",val:true}].map(({l,val}) => (
                <TglBtn key={l} active={doubleView===val} onClick={() => setDoubleView(val)} label={l} sc={sc} chip={chip} />
              ))}
            </div>
          </Section>

          {/* ── ZOOM (+ / - / reset, no slider) ───────────────────────────── */}
          <Section label={`Zoom  ${Math.round(zoom * 100)}%`}>
            <div style={{ display:"flex", gap:"6px" }}>
              <SmBtn onClick={() => setZoom(z => parseFloat(Math.max(0.5, z - 0.1).toFixed(1)))} color={sc} bg={chip} label="−" />
              <SmBtn onClick={() => setZoom(1)}  color={sc} bg={chip} label="↺" style={{ flex:1 }} />
              <SmBtn onClick={() => setZoom(z => parseFloat(Math.min(2.0, z + 0.1).toFixed(1)))} color={sc} bg={chip} label="+" />
            </div>
          </Section>

          {/* ── ENVIRONMENT (7 themes: Book wide, then 6 in 2-col grid) ──── */}
          <Section label="Environment">
            {/* Book theme — full-width pill */}
            <ThemeBtn
              t={themes.book} tKey="book" active={activeTheme}
              onClick={() => setActiveTheme("book")}
              wide
            />
            {/* 6 colour themes in 2-col grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px", marginTop:"6px" }}>
              {["cream","sepia","forest","midnight","dark","rose"].map(key => (
                <ThemeBtn key={key} t={themes[key]} tKey={key} active={activeTheme} onClick={() => setActiveTheme(key)} />
              ))}
            </div>
          </Section>

          {/* ── FONT (7 options shown as colour pills, 2-col grid, Switzer wide) */}
          <Section label="Font">
            {/* Switzer — full-width pill */}
            <FontBtn ff={FONTS[0]} idx={0} active={activeFontIdx} onClick={() => setActiveFontIdx(0)} wide />
            {/* 6 remaining in 2-col grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px", marginTop:"6px" }}>
              {FONTS.slice(1).map((ff, i) => (
                <FontBtn key={ff.label} ff={ff} idx={i+1} active={activeFontIdx} onClick={() => setActiveFontIdx(i+1)} />
              ))}
            </div>
          </Section>

          {/* ── FONT STYLE ─────────────────────────────────────────────────── */}
          <Section label="Style">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"6px" }}>
              {FONT_STYLES.map((fs, i) => (
                <button key={fs.label} onClick={() => setActiveStyleIdx(i)}
                  style={{
                    padding:"6px 0", borderRadius:"8px", fontSize:"11px",
                    fontWeight: fs.fontWeight,
                    fontStyle: fs.fontStyle,
                    textDecoration: fs.textDecoration,
                    background: activeStyleIdx === i ? (isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.09)") : chip,
                    color: sc,
                    border: `2px solid ${activeStyleIdx === i ? sc : "transparent"}`,
                    opacity: activeStyleIdx === i ? 1 : 0.55,
                    cursor:"pointer", transition:"all 0.15s",
                  }}>
                  {fs.label}
                </button>
              ))}
            </div>
          </Section>

          {/* ── FONT SIZE ──────────────────────────────────────────────────── */}
          <Section label={`Font Size  ${fontSize}px`}>
            <div style={{ display:"flex", gap:"6px" }}>
              <SmBtn onClick={() => setFontSize(s => Math.max(10, s-1))} color={sc} bg={chip} label="−" />
              <SmBtn onClick={() => setFontSize(16)} color={sc} bg={chip} label="↺" style={{ flex:1 }} />
              <SmBtn onClick={() => setFontSize(s => Math.min(28, s+1))} color={sc} bg={chip} label="+" />
            </div>
          </Section>

          {/* ── LINE HEIGHT ────────────────────────────────────────────────── */}
          <Section label={`Line Height  ×${lineHeight.toFixed(1)}`}>
            <div style={{ display:"flex", gap:"6px" }}>
              <SmBtn onClick={() => setLineHeight(h => parseFloat(Math.max(1.0, h-0.1).toFixed(1)))} color={sc} bg={chip} label="−" />
              <SmBtn onClick={() => setLineHeight(1.6)} color={sc} bg={chip} label="↺" style={{ flex:1 }} />
              <SmBtn onClick={() => setLineHeight(h => parseFloat(Math.min(3.0, h+0.1).toFixed(1)))} color={sc} bg={chip} label="+" />
            </div>
          </Section>

          {/* ── FONT COLOR ─────────────────────────────────────────────────── */}
          <Section label="Font Color">
            {/* Preset swatches */}
            <div style={{ display:"flex", gap:"5px", flexWrap:"wrap", marginBottom:"8px" }}>
              {COLOR_PRESETS.map(c => (
                <button key={c} onClick={() => setFontColor(c)}
                  title={c}
                  style={{
                    width:"22px", height:"22px", borderRadius:"5px",
                    background: c,
                    border: `2px solid ${fontColor===c ? sc : (c==="#ffffff" ? bc : "transparent")}`,
                    cursor:"pointer", flexShrink:0,
                    boxShadow: fontColor===c ? `0 0 0 2px ${sc}40` : "none",
                    transition:"all 0.12s",
                  }} />
              ))}
            </div>
            {/* Custom picker */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
              <div style={{ position:"relative", width:"30px", height:"28px" }}>
                <div style={{ width:"30px", height:"28px", borderRadius:"6px", background: fontColor ?? theme.pageText, border:`1.5px solid ${bc}` }} />
                <input type="color" value={fontColor ?? theme.pageText}
                  onChange={e => setFontColor(e.target.value)}
                  style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", height:"100%" }} />
              </div>
              <span style={{ fontSize:"11px", opacity:0.5, fontFamily:"monospace", flex:1 }}>{fontColor ?? theme.pageText}</span>
              {fontColor && (
                <button onClick={() => setFontColor(null)}
                  style={{ fontSize:"11px", fontWeight:700, opacity:0.45, cursor:"pointer", background:"none", border:"none", color:sc, padding:0 }}>
                  Reset
                </button>
              )}
            </div>
          </Section>

          {/* ── BACK ───────────────────────────────────────────────────────── */}
          <div style={{ marginTop:"auto", paddingTop:"12px", borderTop:`1px solid ${bc}` }}>
            <button onClick={() => navigate("/dashboard")}
              style={{ width:"100%", padding:"9px 0", borderRadius:"9px", fontSize:"12px", fontWeight:700, border:`1px solid ${bc}`, background:chip, color:sc, cursor:"pointer" }}>
              ← Library
            </button>
          </div>
        </div>
      </aside>

      {/* ═══ SIDEBAR TOGGLE TAB ════════════════════════════════════════════════ */}
      <button
        onClick={() => setSidebarOpen(o => !o)}
        style={{
          position:"absolute", left: sidebarOpen ? "268px" : "0", top:"50%", transform:"translateY(-50%)",
          zIndex:40, width:"15px", height:"42px",
          background: isDark ? "rgba(20,24,38,0.97)" : "rgba(255,255,255,0.92)",
          border:`1px solid ${bc}`, borderLeft: sidebarOpen ? "none" : undefined,
          borderRadius: sidebarOpen ? "0 6px 6px 0" : "6px 0 0 6px",
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          color:sc, fontSize:"11px", transition:"left 0.28s ease",
          boxShadow:"2px 0 8px rgba(0,0,0,0.08)",
        }}
        title={sidebarOpen ? "Hide panel" : "Show panel"}
      >{sidebarOpen ? "‹" : "›"}</button>

      {/* ═══ READING AREA ══════════════════════════════════════════════════════ */}
      <main style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", minWidth:0 }}>

        {/* Centre spine — sits between the two pages */}
        {doubleView && (
          <div style={{
            position:"absolute", left:"50%", top:"24px", bottom:"36px", width:"1px",
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)",
            pointerEvents:"none", zIndex:10,
          }} />
        )}

        {/* Pages — each slot fills half (double) or full (single) of the reading
            area; in double view the pages are pinned to the spine so they meet
            in the middle instead of floating centred with a gap between them. */}
        <div ref={viewerRef} id="docx-viewer" style={{
          display:"flex",
          flexDirection:"row",
          position:"absolute",
          inset: "24px 24px 36px 24px",
          alignItems:"stretch",
          transform:`scale(${zoom})`,
          transformOrigin:"center center",
          transition:"transform 0.1s ease-out",
        }} />

        {/* Navigation arrows */}
        <NavArrow dir="left"  onClick={prevPage} disabled={currentPage===0}             isDark={isDark} />
        <NavArrow dir="right" onClick={nextPage} disabled={currentPage>=totalSpreads-1} isDark={isDark} />

        {/* Page counter */}
        {totalPages > 0 && (
          <div style={{
            position:"absolute", bottom:"13px", left:"50%", transform:"translateX(-50%)",
            fontSize:"11px", fontWeight:700, letterSpacing:"0.05em",
            color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
            background: isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)",
            backdropFilter:"blur(8px)", padding:"4px 14px", borderRadius:"20px", pointerEvents:"none",
          }}>
            {doubleView
              ? `${currentPage*2+1}–${Math.min(currentPage*2+2,totalPages)} / ${totalPages}`
              : `${currentPage+1} / ${totalPages}`}
          </div>
        )}
      </main>

      {/* Mobile portrait lock */}
      <style>{`
        @media screen and (max-width:768px) and (orientation:portrait) {
          #portrait-lock { position:fixed;inset:0;z-index:9999;background:#111;color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;text-align:center;padding:40px; }
        }
        @media not screen and (max-width:768px) and (orientation:portrait) {
          #portrait-lock { display:none!important; }
        }
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(128,128,128,0.22);border-radius:2px}
      `}</style>
      <div id="portrait-lock">Rotate your device for the best reading experience 🔄</div>
    </div>
  );
}

// ─── Tiny building blocks ─────────────────────────────────────────────────────

function HR({ color }) {
  return <div style={{ height:"1px", background:color, margin:"0 0 16px" }} />;
}

function SLabel({ children }) {
  return <div style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.32, marginBottom:"3px" }}>{children}</div>;
}

function Section({ label, children }) {
  return (
    <div style={{ marginBottom:"16px" }}>
      <SLabel>{label}</SLabel>
      <div style={{ marginTop:"6px" }}>{children}</div>
    </div>
  );
}

function SmBtn({ onClick, color, bg, label, style: extra = {} }) {
  return (
    <button onClick={onClick} style={{
      minWidth:"30px", height:"30px", borderRadius:"7px", border:"none",
      background:bg, color, fontSize:"15px", fontWeight:700,
      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
      flexShrink:0, lineHeight:1, ...extra,
    }}>{label}</button>
  );
}

function TglBtn({ active, onClick, label, sc, chip }) {
  return (
    <button onClick={onClick} style={{
      flex:1, padding:"7px 0", borderRadius:"8px", fontSize:"12px", fontWeight:700,
      border:`2px solid ${active ? sc : "transparent"}`,
      background: active ? "transparent" : chip,
      color:sc, cursor:"pointer", opacity: active ? 1 : 0.5, transition:"all 0.15s",
    }}>{label}</button>
  );
}

function ThemeBtn({ t, tKey, active, onClick, wide=false }) {
  const isActive = active === tKey;
  return (
    <button onClick={onClick} style={{
      width: wide ? "100%" : undefined,
      padding:"9px 0", borderRadius:"9px", fontSize:"12px", fontWeight:700,
      background: t.pageBg, color: t.pageText,
      border:`2px solid ${isActive ? t.pageText : "transparent"}`,
      opacity: isActive ? 1 : 0.65,
      cursor:"pointer", transition:"all 0.15s",
      display:"block",
    }}>{t.name}</button>
  );
}

function FontBtn({ ff, idx, active, onClick, wide=false }) {
  const isActive = active === idx;
  return (
    <button onClick={onClick} style={{
      width: wide ? "100%" : undefined,
      padding:"8px 0", borderRadius:"9px", fontSize:"12px", fontWeight:600,
      fontFamily: ff.value,
      background: ff.pageBg,
      color: ff.pageText,
      border:`2px solid ${isActive ? ff.pageText : "transparent"}`,
      opacity: isActive ? 1 : 0.6,
      cursor:"pointer", transition:"all 0.15s",
      display:"block",
    }}>{ff.label}</button>
  );
}

function NavArrow({ dir, onClick, disabled, isDark }) {
  const isLeft = dir === "left";
  const [hov, setHov] = useState(false);
  const bg = isDark
    ? (hov && !disabled ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)")
    : (hov && !disabled ? "rgba(0,0,0,0.11)"       : "rgba(0,0,0,0.06)");
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:"absolute",
        [isLeft ? "left" : "right"]: "12px",
        top:"50%", transform:"translateY(-50%)",
        width:"40px", height:"72px", borderRadius:"10px", border:"none",
        background: bg,
        color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.38)",
        fontSize:"26px", cursor: disabled ? "default" : "pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        opacity: disabled ? 0.15 : 1,
        transition:"background 0.18s, opacity 0.18s",
        backdropFilter:"blur(4px)", zIndex:20,
      }}
    >{isLeft ? "‹" : "›"}</button>
  );
}