import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { renderAsync } from "docx-preview";

// Clean, aesthetic themes. 
// outerBg is the "desk" the book sits on. pageBg is the paper.
const themes = {
  cream:    { name: "Cream",    pageBg: "#fdf6e3", pageText: "#2c1810", outerBg: "#e8d5b7" },
  sepia:    { name: "Sepia",    pageBg: "#f4ede1", pageText: "#5c3d1e", outerBg: "#c9a87c" },
  midnight: { name: "Midnight", pageBg: "#1e2235", pageText: "#c8d0e8", outerBg: "#0d0f1a" },
  dark:     { name: "Dark",     pageBg: "#1f2937", pageText: "#f3f4f6", outerBg: "#111827" },
  rose:     { name: "Rose",     pageBg: "#fff1f3", pageText: "#881337", outerBg: "#fecdd3" },
};

export default function Editor() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const bookId = location.state?.bookId;
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rendered, setRendered] = useState(false);
  
  const [activeTheme, setActiveTheme] = useState("cream");
  const [zoom, setZoom] = useState(1); 
  
  const viewerRef = useRef(null);
  const styleRef = useRef(null);
  const theme = themes[activeTheme];

  // 1. Fetch the book data from MongoDB
  useEffect(() => {
    if (!bookId) { navigate("/dashboard"); return; }
    fetch(`http://localhost:5001/api/books/${bookId}`)
      .then(r => r.json())
      .then(data => { setBook(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [bookId, navigate]);

  // 2. Render the DOCX file once
  useEffect(() => {
    if (!book?.docxUrl || !viewerRef.current || rendered) return;
    
    const load = async () => {
      try {
        const res = await fetch(`http://localhost:5001/${book.docxUrl}`);
        const blob = await res.blob();
        viewerRef.current.innerHTML = "";
        
        await renderAsync(blob, viewerRef.current, null, {
          inWrapper: false, // NUCLEAR OPTION: Kills the default grey wrapper & vertical stacking
          ignoreWidth: false,
          ignoreHeight: false,
          breakPages: true, 
          useBase64URL: true,
        });
        setRendered(true);
      } catch (err) {
        console.error("Render failed:", err);
      }
    };
    load();
  }, [book, rendered]);

  // 3. Inject CSS to force side-by-side pages and theme colors
  const injectStyles = useCallback(() => {
    if (!styleRef.current) {
      styleRef.current = document.createElement("style");
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent = `
      /* Force the container into a horizontal flexbox */
      #docx-container {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        align-items: flex-start !important;
        gap: 40px !important; /* Space between the left and right pages */
        padding: 40px !important;
      }
      
      /* Override the default page blocks */
      #docx-container > section.docx {
        background: ${theme.pageBg} !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2) !important;
        border-radius: 4px !important;
        margin: 0 !important; /* Forces them to sit side-by-side */
        transition: background 0.3s ease !important;
      }
      
      /* Bruteforce EVERY text element to take the theme color */
      #docx-container * {
        color: ${theme.pageText} !important;
      }
    `;
  }, [theme]);

  useEffect(() => {
    if (rendered) injectStyles();
  }, [rendered, injectStyles]);

  // Cleanup styles when leaving the page
  useEffect(() => {
    return () => { if (styleRef.current) styleRef.current.remove(); };
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white">Loading your book...</div>;
  if (!book) return <div className="h-screen flex items-center justify-center">Book not found</div>;

  return (
    <div className="h-screen flex overflow-hidden font-switzer transition-colors duration-500" style={{ background: theme.outerBg }}>
      
      {/* --- MINIMAL SIDEBAR --- */}
      <aside className="w-72 h-full flex flex-col shrink-0 bg-white/50 backdrop-blur-xl border-r border-black/5 shadow-2xl z-20">
        <div className="p-6 flex flex-col h-full">
          
          <h1 className="text-lg font-bold tracking-tight truncate mb-8" title={book.title}>
            {book.title}
          </h1>

          {/* Smooth Zoom Control */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-bold uppercase tracking-wider opacity-60">Zoom</label>
              <span className="text-xs font-bold">{Math.round(zoom * 100)}%</span>
            </div>
            <input 
              type="range" min="0.5" max="2.0" step="0.01" 
              value={zoom} 
              onChange={(e) => setZoom(parseFloat(e.target.value))} 
              className="w-full accent-gray-900 cursor-pointer" 
            />
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-4 block">Environment</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(themes).map(([key, t]) => (
                <button 
                  key={key} 
                  onClick={() => setActiveTheme(key)}
                  className="py-3 rounded-xl text-xs font-bold transition-all border-2"
                  style={{
                    background: t.pageBg,
                    color: t.pageText,
                    borderColor: activeTheme === key ? t.pageText : "transparent",
                    opacity: activeTheme === key ? 1 : 0.7
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-auto pt-6 border-t border-black/5">
            <button 
              onClick={() => navigate("/dashboard")} 
              className="w-full py-3 rounded-xl text-sm font-bold border border-black/10 hover:bg-black/5 transition-colors"
            >
              ← Back to Library
            </button>
          </div>
        </div>
      </aside>

      {/* --- READING CANVAS --- */}
      <main className="flex-1 overflow-auto relative custom-scrollbar">
        <div className="min-h-full w-full flex items-start justify-center">
          
          {/* This div handles the zoom scaling smoothly from the center */}
          <div 
            style={{ 
              transform: `scale(${zoom})`, 
              transformOrigin: "center top",
              transition: "transform 0.1s ease-out",
              width: "100%"
            }}
          >
            {/* The actual document renders inside here. ID is critical for our CSS to win. */}
            <div ref={viewerRef} id="docx-container" />
          </div>

        </div>
      </main>

    </div>
  );
}