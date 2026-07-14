import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('7books_token');
    const email = localStorage.getItem('7books_userEmail');
    if (token) {
      setIsLoggedIn(true);
      if (email) setUsername(email.split('@')[0]);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('7books_token');
    localStorage.removeItem('7books_userId');
    localStorage.removeItem('7books_userEmail');
    setIsLoggedIn(false);
  };

  const handleEbooksClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("Upload an e-book to start creating. Please log in first!");
      navigate('/login');
    }
  };

  return (
    <div className="font-switzer relative text-gray-900 selection:bg-gray-200 min-h-screen bg-[linear-gradient(to_bottom,#eabfb3_0%,#fcf8f2_30%,#fcf8f2_70%,#eabfb3_100%)]">
      
    <Navbar />

      {/* Hero Section */}
      <header className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 md:px-8 text-center pb-20">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl leading-tight">
          Create your own e-book from text or a downloaded PDF.
        </h1>
        <p className="mt-8 text-base md:text-lg text-gray-700 max-w-2xl font-medium tracking-wide">
          Aesthetically pleasing, fully customizable, and focused on your reading experience.
        </p>
        <Link to={isLoggedIn ? "/dashboard" : "/login"} className="mt-12 px-10 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-transform hover:scale-105 shadow-xl">
          Start Creating
        </Link>
      </header>

      {/* Curated Aesthetics (Samples) Section - FIXED */}
      <section id="samples" className="w-full px-4 md:px-8 py-24 bg-white/40 backdrop-blur-sm border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto">
              <div className="mb-12 flex justify-between items-end">
                  <div>
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Curated Aesthetics.</h2>
                      <p className="text-gray-500 mt-2 font-medium">Explore what you can build with our editor.</p>
                  </div>
                  <button className="hidden md:block text-sm font-bold hover:underline underline-offset-4">View all samples &rarr;</button>
              </div>

              {/* Grid Layout for Books */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Sample Card 1 */}
                  <div className="group cursor-pointer">
                      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm group-hover:shadow-xl transition-all duration-300 border border-gray-100">
                          <div className="aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-100 mb-6 relative">
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold">Image Placeholder</div>
                          </div>
                          <div className="px-2 pb-2">
                              <h3 className="font-bold text-lg tracking-tight">Bushido</h3>
                              <p className="text-sm text-gray-500 font-medium">The Samurai Code of Japan</p>
                              <div className="flex gap-2 mt-4">
                                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-600">Cinzel Font</span>
                                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-md text-gray-600">Dark Mode</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
}