import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('7books_userEmail');
    if (email) setUsername(email.split('@')[0]);
  }, []);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append('pdfFile', file);

      const userId = localStorage.getItem('7books_userId');

      if (userId) {
        formData.append('userId', userId);
      }

      const response = await fetch(
        'http://localhost:5001/api/books/upload-pdf',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      console.log('Upload Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      console.log("BOOK ID:", data.bookId);
      
      navigate('/editor', {
        state: {
          bookId: data.bookId,
        }
      });

    } catch (err) {
      console.error(err);

      alert(
        err.message || 'Failed to upload PDF'
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('7books_token');
    localStorage.removeItem('7books_userId');
    localStorage.removeItem('7books_userEmail');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,#eabfb3_0%,#fcf8f2_30%,#fcf8f2_70%,#eabfb3_100%)] font-switzer text-gray-900">

      <nav className="w-full px-4 md:px-8 h-[80px] flex justify-between items-center sticky top-0 z-50 transition-all bg-white/50 backdrop-blur-md border-b border-gray-200/50">
        <div className="text-xl md:text-2xl font-bold tracking-tight cursor-pointer" onClick={() => navigate('/')}>
          7books.in
        </div>

        <div className="hidden md:flex space-x-8 lg:space-x-12 text-sm font-medium text-gray-800">
          <Link to="/samples" className="hover:text-black transition-colors">Samples</Link>
          <Link to="/dashboard" className="hover:text-black transition-colors">E-Books</Link>
          <span className="font-bold text-black border-b-2 border-black pb-1">My E-Books</span>
          <span className="font-bold text-black border-b-2 border-black pb-1">Books</span>
          <Link to="/about" className="hover:text-black transition-colors">About Us</Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <div className="relative group">
            <button className="px-5 py-2 bg-gray-900 text-white rounded-full font-bold capitalize shadow-md hover:bg-gray-800 transition">
              {username || 'Reader'}
            </button>
            {/* Hover Dropdown for Logout */}
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible overflow-hidden">
              <button onClick={handleLogout} className="w-full px-4 py-3 text-sm text-red-500 hover:bg-gray-50 text-left font-bold transition">Log out</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col items-center">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Your Library</h1>
          <p className="text-gray-700 font-medium tracking-wide">Upload an e-book to start your aesthetic reading experience.</p>
        </div>

        <div className="w-full max-w-2xl bg-gray-900 rounded-3xl p-12 shadow-2xl flex flex-col items-center justify-center text-center hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors duration-500"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500"></div>

          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500 z-10">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 z-10 tracking-tight">Upload E-Book</h2>
          <p className="text-gray-400 text-base mb-10 max-w-md z-10 leading-relaxed">
            Drop your PDF here. We will load it directly into your customized, distraction-free reading environment.
          </p>

          <label className="cursor-pointer bg-white text-gray-900 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-transform hover:scale-[1.02] active:scale-[0.98] z-10 shadow-lg">
            Select PDF File
            <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
          </label>
        </div>
      </main>
    </div>
  );
}