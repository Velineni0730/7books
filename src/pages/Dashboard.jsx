import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('7books_userEmail');
    if (email) setUsername(email.split('@')[0]);
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const userId = localStorage.getItem('7books_userId') || '000000000000000000000001';
      const res = await fetch(`http://localhost:5001/api/books/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
    } catch (err) {
      console.error('Could not load books:', err);
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('pdfFile', file);
      const userId = localStorage.getItem('7books_userId');
      if (userId) formData.append('userId', userId);

      const response = await fetch('http://localhost:5001/api/books/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Upload failed');
      navigate('/editor', { state: { bookId: data.bookId } });
    } catch (err) {
      alert(err.message || 'Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('7books_token');
    localStorage.removeItem('7books_userId');
    localStorage.removeItem('7books_userEmail');
    navigate('/');
  };

  const openBook = (bookId) => {
    navigate('/editor', { state: { bookId } });
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#eabfb3_0%,#fcf8f2_30%,#fcf8f2_70%,#eabfb3_100%)] font-switzer text-gray-900">

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-20">
        <div className="flex flex-col items-center justify-center text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">Your Library</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-xl">
            {books.length > 0
              ? `${books.length} book${books.length !== 1 ? 's' : ''} in your collection`
              : 'Upload your first e-book to get started'}
          </p>
        </div>

        {/* Books grid */}
        {books.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mb-16">
            {books.map(book => (
              <div key={book._id}
                onClick={() => openBook(book._id)}
                className="group cursor-pointer">
                <div className="bg-gray-900 rounded-2xl aspect-[3/4] flex items-end p-4 mb-3 shadow-lg group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                  {/* Book color accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                  <div className="absolute top-4 left-4 right-4">
                    <div className="w-8 h-1 bg-white/20 rounded mb-2" />
                    <div className="w-12 h-1 bg-white/10 rounded" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-white font-bold text-sm leading-tight line-clamp-2">
                      {book.title}
                    </p>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-500 truncate px-1">
                  {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Upload card */}
        <div className="max-w-2xl mx-auto mt-10">
          <div className="bg-gray-900 rounded-3xl p-12 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500">
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />

            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-500 z-10">
              {uploading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white mb-3 z-10 tracking-tight">
              {uploading ? "Converting..." : "Upload E-Book"}
            </h2>
            <p className="text-gray-400 text-sm mb-8 max-w-xs z-10 leading-relaxed">
              {uploading
                ? "This takes about 10 seconds. Hang tight."
                : "Upload a PDF and we'll build your personalized reading experience."}
            </p>

            {!uploading && (
              <label className="cursor-pointer bg-white text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-transform hover:scale-[1.02] active:scale-[0.98] z-10 shadow-lg">
                Select PDF File
                <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
              </label>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}