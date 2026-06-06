import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';

// We import pdfjs directly from react-pdf to prevent version crashes
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// The Official Vite + React-PDF worker setup. One worker for everything.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Your friend's exact theme definitions
// Upgraded themes with Light/Dark awareness
const themes = {
  classic: { r: 0, g: 0, b: 0, name: 'Classic', isDark: true },
  claude: { r: 42, g: 37, b: 34, name: 'Claude Warm', isDark: true },
  chatgpt: { r: 52, g: 53, b: 65, name: 'ChatGPT Cool', isDark: true },
  sepia: { r: 40, g: 35, b: 25, name: 'Sepia Dark', isDark: true },
  midnight: { r: 25, g: 30, b: 45, name: 'Midnight Blue', isDark: true },
  cream: { r: 252, g: 248, b: 242, name: 'Cream Light', isDark: false },
  light: { r: 255, g: 255, b: 255, name: 'Pure White', isDark: false }
};

export default function Editor() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ref for our invisible canvas where the pixel math happens
  const renderCanvasRef = useRef(null);
  
  // Grab the PDF file URL passed from the Dashboard
  const pdfUrl = location.state?.pdfUrl;
  const bookTitle = location.state?.title || "Untitled Book";

  // Navigation & Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); 
  
  // The exact state needed for your friend's engine
  const [selectedTheme, setSelectedTheme] = useState('claude');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  // We will store the processed image URLs for the left and right pages here
  const [leftPageImage, setLeftPageImage] = useState(null);
  const [rightPageImage, setRightPageImage] = useState(null);
  const [pdfDocProxy, setPdfDocProxy] = useState(null);
  
  // --- YOUR FRIEND'S EXACT PIXEL & PDF ENGINE ---
  const processPdfToTheme = async (originalPdfUrl, themeKey) => {
    if (!originalPdfUrl) return;
    setIsProcessing(true);

    try {
      // 1. Fetch the raw PDF data (With safety net for page refreshes)
      let pdfData;
      try {
        const response = await fetch(originalPdfUrl);
        pdfData = await response.arrayBuffer();
      } catch (fetchError) {
        alert("The file was lost from memory (usually due to a page refresh). Please select your PDF again.");
        navigate('/dashboard');
        return;
      }

      const theme = themes[themeKey];
      const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
      const totalPages = pdf.numPages;
      
      setNumPages(totalPages);
      setProgress({ current: 0, total: totalPages, status: 'Processing pages...' });

      // 2. Exact Chunking Logic (to save memory)
      const CHUNK_SIZE = 50; 
      const chunks = [];

      for (let chunkStart = 0; chunkStart < totalPages; chunkStart += CHUNK_SIZE) {
        const chunkDoc = await PDFDocument.create();
        const chunkEnd = Math.min(chunkStart + CHUNK_SIZE, totalPages);

        for (let i = chunkStart; i < chunkEnd; i++) {
          setProgress({ current: i + 1, total: totalPages, status: `Converting page ${i + 1} of ${totalPages}...` });

          const page = await pdf.getPage(i + 1);
          const scale = 3; // His exact high-res scale factor
          const viewport = page.getViewport({ scale });

          // Create the invisible canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = { canvasContext: ctx, viewport: viewport };
          await page.render(renderContext).promise;

          // --- THE EXACT PIXEL MATH (Upgraded for Light & Dark) ---
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          const bgR = theme.r;
          const bgG = theme.g;
          const bgB = theme.b;
          
          // If Dark mode, text becomes off-white (220). If Light mode, text becomes dark gray (40).
          const textTarget = theme.isDark ? 220 : 40;

          for (let j = 0; j < data.length; j += 4) {
            const r = data[j];
            const g = data[j + 1];
            const b = data[j + 2];

            // Calculate original pixel brightness (0-255)
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            
            // Factor: 1 = original black text, 0 = original white background
            const factor = 1 - (brightness / 255);

            data[j] = bgR + (textTarget - bgR) * factor;         // Red
            data[j + 1] = bgG + (textTarget - bgG) * factor;     // Green
            data[j + 2] = bgB + (textTarget - bgB) * factor;     // Blue
          }
          ctx.putImageData(imageData, 0, 0);
          // -----------------------------

          // Convert to PNG and embed into the chunk
          const imgBytes = await new Promise(resolve => canvas.toBlob(blob => blob.arrayBuffer().then(resolve), 'image/png'));
          const jpgImage = await chunkDoc.embedPng(imgBytes);
          const newPage = chunkDoc.addPage([viewport.width, viewport.height]);
          
          newPage.drawImage(jpgImage, {
            x: 0, y: 0, width: viewport.width, height: viewport.height
          });

          // Memory cleanup (Exact implementation)
          canvas.width = 1; 
          canvas.height = 1;
          ctx.clearRect(0, 0, 1, 1);
          page.cleanup();
        }

        const chunkBytes = await chunkDoc.save();
        chunks.push(chunkBytes);
        await new Promise(resolve => setTimeout(resolve, 10)); // UI breather
      }

      setProgress(prev => ({ ...prev, status: 'Merging PDF chunks...' }));

      // 3. Merging Chunks
      const finalPdfDoc = await PDFDocument.create();
      for (let i = 0; i < chunks.length; i++) {
        const chunkDoc = await PDFDocument.load(chunks[i]);
        const copiedPages = await finalPdfDoc.copyPages(chunkDoc, chunkDoc.getPageIndices());
        copiedPages.forEach(p => finalPdfDoc.addPage(p));
        chunks[i] = null; 
      }

      setProgress(prev => ({ ...prev, status: 'Finalizing...' }));
      const modifiedPdfBytes = await finalPdfDoc.save();
      
      // 4. Feed the raw bytes directly to React-PDF (Bypasses Blob URL errors!)
      setPdfDocProxy(modifiedPdfBytes);

    } catch (error) {
      console.error("Error processing PDF:", error);
      alert("Failed to process the PDF. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };
  // --- THE TRIGGER ---
  // When the theme changes OR a new PDF is uploaded, run the engine
  useEffect(() => {
    if (pdfUrl && selectedTheme) {
      processPdfToTheme(pdfUrl, selectedTheme);
    }
  }, [pdfUrl, selectedTheme]);

  // If someone tries to open the editor directly without a PDF, send them back
  useEffect(() => {
    if (!pdfUrl) {
      navigate('/dashboard');
    }
  }, [pdfUrl, navigate]);

  if (!pdfUrl) return null;

  return (
    // Outer Container
    <div className="h-screen w-full bg-[#eef0f2] flex p-[15px] gap-[15px] font-switzer overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`h-full bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col transition-all duration-300 relative z-20 overflow-hidden shrink-0 ${
          isSidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 border-none'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 truncate pr-4" title={bookTitle}>
              {bookTitle.replace('.pdf', '')}
            </h2>
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* Themes Section - Now using the exact keys from your friend's logic */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Reading Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(themes).map((key) => (
                <button 
                  key={key}
                  onClick={() => setSelectedTheme(key)}
                  className={`w-full py-3 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedTheme === key ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-200 hover:bg-gray-50'}`}
                  style={{ backgroundColor: `rgb(${themes[key].r}, ${themes[key].g}, ${themes[key].b})` }}
                >
                  <span className={`text-xs font-bold ${key === 'light' || key === 'classic' ? 'text-gray-900' : 'text-white'}`}>
                    {themes[key].name}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Processing Status & Document Info */}
          <div className="mt-auto pt-6 border-t border-gray-100">
            {isProcessing ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-500">
                  <span>Processing Theme...</span>
                  <span>{Math.round((progress.current / progress.total) * 100) || 0}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-gray-400 text-center">{progress.status}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 font-medium text-center">Ready: {numPages} Pages</p>
            )}
          </div>
        </div>
      </aside>

      {/* --- CENTER STAGE: THE BOOK ENGINE --- */}
      <main className="flex-1 h-full relative flex items-center justify-center">
        
        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="absolute -left-4 top-4 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-30"
        >
          <svg className={`w-5 h-5 text-gray-600 transition-transform ${!isSidebarOpen && 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Navigation Arrows */}
        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 2))} disabled={currentPage <= 1 || isProcessing} className="absolute left-4 md:left-8 z-30 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={() => setCurrentPage(Math.min(numPages, currentPage + 2))} disabled={currentPage >= numPages || isProcessing} className="absolute right-4 md:right-8 z-30 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-md hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* --- THE ACTUAL BOOK --- */}
        {/* --- THE ACTUAL BOOK --- */}
        <div 
          className={`h-full aspect-[1.4/1] max-w-full shadow-2xl flex transition-all duration-500 ease-in-out rounded-xl overflow-hidden mx-auto ${isProcessing ? 'opacity-50 blur-sm pointer-events-none' : 'opacity-100'}`}
          style={{ backgroundColor: `rgb(${themes[selectedTheme]?.r || 255}, ${themes[selectedTheme]?.g || 255}, ${themes[selectedTheme]?.b || 255})` }}
        >
          
          {pdfDocProxy ? (
            <Document 
              file={{ data: pdfDocProxy }} 
              className="w-full h-full flex"
            >
              
              {/* LEFT PAGE */}
              <div className="w-1/2 h-full relative overflow-hidden flex items-center justify-center p-8">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 pointer-events-none z-10"></div>
                 
                 {currentPage === 1 ? (
                   <div className="opacity-30 italic text-gray-400">This page intentionally left blank.</div>
                 ) : (
                   <Page 
                      pageNumber={currentPage} 
                      className="h-full w-full object-contain" 
                      renderTextLayer={false} 
                      renderAnnotationLayer={false} 
                      height={800} 
                   />
                 )}
                 {currentPage > 1 && <div className="absolute bottom-4 left-0 right-0 text-center text-xs opacity-40">{currentPage}</div>}
              </div>

              {/* THE SPINE */}
              <div className="w-[1px] h-full bg-black/10 shadow-[-2px_0_5px_rgba(0,0,0,0.1)] z-10 shrink-0"></div>

              {/* RIGHT PAGE */}
              <div className="w-1/2 h-full relative overflow-hidden flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/5 pointer-events-none z-10"></div>
                
                {currentPage === 1 ? (
                   <Page 
                      pageNumber={1} 
                      className="h-full w-full object-contain" 
                      renderTextLayer={false} 
                      renderAnnotationLayer={false} 
                      height={800}
                   />
                ) : (
                   currentPage + 1 <= numPages && (
                     <Page 
                        pageNumber={currentPage + 1} 
                        className="h-full w-full object-contain" 
                        renderTextLayer={false} 
                        renderAnnotationLayer={false} 
                        height={800}
                     />
                   )
                )}
                {currentPage > 0 && currentPage + 1 <= numPages && <div className="absolute bottom-4 left-0 right-0 text-center text-xs opacity-40">{currentPage + 1}</div>}
              </div>

            </Document>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 font-medium">
               <svg className="animate-spin h-10 w-10 mb-4 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               Building Book Architecture...
            </div>
          )}

        </div>
      </main>
    </div>
  );
}