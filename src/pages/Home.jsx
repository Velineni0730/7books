import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import bushido from "../assets/images/bushido.jpg";
import cream1 from "../assets/images/cream_1.png";

import atomicHabits from "../assets/images/atomicHabits.png";
import whoWillCry from "../assets/images/whoWillCryWhenYouDie.jpg";
import tuesdays from "../assets/images/tuesdaysWithMorrie.png";
import alchemist from "../assets/images/theAlchemist.png";
import mockingbird from "../assets/images/toKillAMockingbird.png";
import gandhi from "../assets/images/whyIKilledGandhi.png";

export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("7books_token");
    const email = localStorage.getItem("7books_userEmail");

    if (token) {
      setIsLoggedIn(true);

      if (email) {
        setUsername(email.split("@")[0]);
      }
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("7books_token");
    localStorage.removeItem("7books_userId");
    localStorage.removeItem("7books_userEmail");

    setIsLoggedIn(false);

  };

  const handleEbooksClick = (e) => {

    if (!isLoggedIn) {

      e.preventDefault();

      alert("Upload an e-book to start creating. Please log in first!");

      navigate("/login");

    }

  };

  return (

    <div className="min-h-screen font-switzer text-gray-900 selection:bg-gray-200 bg-[linear-gradient(to_bottom,#eabfb3_0%,#fcf8f2_30%,#fcf8f2_70%,#eabfb3_100%)]">

      <Navbar />

      {/* ================= HERO ================= */}

      <header className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-6 md:px-8 text-center">

        <p className="uppercase tracking-[0.35em] text-sm font-semibold text-gray-500 mb-6">

          Beautiful PDF Reading

        </p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.95] max-w-6xl">

          Turn your PDFs
          <br />
          into an immersive
          <br />
          digital reading
          experience.

        </h1>

        <p className="mt-10 max-w-3xl text-lg md:text-xl leading-9 text-gray-600">

          Upload your favorite PDF, personalize your reading experience
          with beautiful themes, layouts and typography, and enjoy every
          page in comfort.

        </p>

        <Link
          to={isLoggedIn ? "/dashboard" : "/login"}
          className="mt-14 px-10 py-4 rounded-full bg-gray-900 text-white font-bold shadow-xl transition-all duration-300 hover:bg-black hover:scale-105"
        >

          Start Reading

        </Link>

      </header>

      {/* ================= FEATURED BOOKS ================= */}

<section className="py-24 px-6 md:px-8">

    <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

            <p className="uppercase tracking-[0.35em] text-sm font-semibold text-gray-500 mb-4">
                Featured Collection
            </p>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Books worth experiencing.
            </h2>

            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-8">
                A carefully selected collection of timeless books that showcase
                the beautiful reading experience offered by 7Books.
            </p>

        </div>

        {(() => {

            const featuredBooks = [

                {
                    title: "Bushido",
                    subtitle: "The Samurai Code of Japan",
                    author: "Inazo Nitobe",
                    image: bushido,
                    summary:
                        "A timeless exploration of honour, discipline, courage and integrity through the philosophy of the Japanese samurai."
                },

                {
                    title: "Atomic Habits",
                    subtitle: "Tiny Changes, Remarkable Results",
                    author: "James Clear",
                    image: atomicHabits,
                    summary:
                        "Learn how small daily improvements compound into extraordinary long-term results through practical habit building."
                },

                {
                    title: "Who Will Cry When You Die?",
                    subtitle: "Life Lessons",
                    author: "Robin Sharma",
                    image: whoWillCry,
                    summary:
                        "A collection of simple yet meaningful lessons that inspire a life filled with purpose, balance and fulfillment."
                },

                {
                    title: "Tuesdays with Morrie",
                    subtitle: "An Old Man, A Young Man",
                    author: "Mitch Albom",
                    image: tuesdays,
                    summary:
                        "A heartfelt memoir exploring love, purpose, family and what truly matters in life."
                },

                {
                    title: "The Alchemist",
                    subtitle: "A Fable About Following Your Dream",
                    author: "Paulo Coelho",
                    image: alchemist,
                    summary:
                        "Follow Santiago's unforgettable journey as he pursues his Personal Legend and discovers life's greatest treasures."
                },

                {
                    title: "To Kill a Mockingbird",
                    subtitle: "A Classic Novel",
                    author: "Harper Lee",
                    image: mockingbird,
                    summary:
                        "A timeless story of justice, morality and compassion told through unforgettable characters."
                },

                {
                    title: "Why I Killed Gandhi",
                    subtitle: "Historical Account",
                    author: "Nathuram Godse",
                    image: gandhi,
                    summary:
                        "A historical account presenting Nathuram Godse's perspective surrounding the assassination of Mahatma Gandhi."
                }

            ];

            return (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

                    {featuredBooks.map((book) => (

                        <div
                            key={book.title}
                            className="group bg-white/75 backdrop-blur-md rounded-[28px] overflow-hidden border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                        >

                            <div className="aspect-[2/3] overflow-hidden">

                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                            </div>

                            <div className="p-6">

                                <h3 className="text-2xl font-bold tracking-tight">
                                    {book.title}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    {book.subtitle}
                                </p>

                                <p className="mt-5 text-gray-600 leading-7 text-[15px]">
                                    {book.summary}
                                </p>

                                <p className="mt-6 text-sm font-semibold text-gray-900">
                                    by {book.author}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            );

        })()}

    </div>

</section>

{/* ================= EXPERIENCE ================= */}

<section className="py-28 px-6 md:px-8">

    <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-[0.9fr_1.3fr] gap-20 items-center">

            <div>

                <p className="uppercase tracking-[0.35em] text-sm font-semibold text-gray-500 mb-5">
                    Designed for Readers
                </p>

                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-8">

                    Reading should feel
                    <br />
                    effortless.

                </h2>

                <p className="text-lg leading-9 text-gray-600 mb-8">

                    7Books transforms ordinary PDF files into beautiful reading
                    experiences with elegant typography, immersive themes and
                    layouts designed for long, comfortable reading sessions.

                </p>

                <div className="space-y-4">

                    <div className="flex items-center gap-4">

                        <div className="w-3 h-3 rounded-full bg-gray-900"></div>

                        <span className="text-gray-700 font-medium">
                            Multiple reading themes
                        </span>

                    </div>

                    <div className="flex items-center gap-4">

                        <div className="w-3 h-3 rounded-full bg-gray-900"></div>

                        <span className="text-gray-700 font-medium">
                            Beautiful typography
                        </span>

                    </div>

                    <div className="flex items-center gap-4">

                        <div className="w-3 h-3 rounded-full bg-gray-900"></div>

                        <span className="text-gray-700 font-medium">
                            Comfortable day & night reading
                        </span>

                    </div>

                    <div className="flex items-center gap-4">

                        <div className="w-3 h-3 rounded-full bg-gray-900"></div>

                        <span className="text-gray-700 font-medium">
                            Fully customizable layouts
                        </span>

                    </div>

                </div>

            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-[36px] p-6 border border-white/60 shadow-2xl">

                <img
                    src={cream1}
                    alt="7Books Reader"
                    className="w-full rounded-3xl"
                />

            </div>

        </div>

    </div>

</section>

{/* ================= CTA ================= */}

<section className="pb-32 px-6 md:px-8">

    <div className="max-w-5xl mx-auto">

        <div className="relative overflow-hidden rounded-[40px] bg-gray-900 px-10 md:px-20 py-20 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)]">

            <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>

            <div className="relative z-10">

                <p className="uppercase tracking-[0.35em] text-sm font-semibold text-gray-400 mb-5">
                    Start Your Journey
                </p>

                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">

                    Your next great book
                    <br />
                    is waiting.

                </h2>

                <p className="mt-8 max-w-2xl mx-auto text-lg leading-8 text-gray-300">

                    Upload any PDF and discover a reading experience
                    designed for comfort, focus and beautifully crafted
                    typography.

                </p>

                <Link
                    to={isLoggedIn ? "/dashboard" : "/login"}
                    className="inline-flex mt-12 px-10 py-4 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
                >

                    Start Reading

                </Link>

            </div>

        </div>

    </div>

</section>

</div>

    );

}