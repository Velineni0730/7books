import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function About() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("7books_token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <div className="min-h-screen font-switzer text-gray-900 bg-[linear-gradient(to_bottom,#eabfb3_0%,#fcf8f2_30%,#fcf8f2_70%,#eabfb3_100%)]">

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-24">

        {/* ================= HERO ================= */}

        <section className="text-center mb-28">

          <p className="uppercase tracking-[0.3em] text-sm text-gray-500 font-semibold mb-5">
            About
          </p>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Reading,
            <br />
            Reimagined.
          </h1>

          <p className="mt-8 max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-8">
            7Books is built for readers who value simplicity, beautiful
            typography, and a distraction-free reading experience. Whether
            you're studying, learning, or enjoying your favourite book,
            everything is designed to keep your focus on the words—not the
            interface.
          </p>

        </section>

        {/* ================= INTRO ================= */}

        <section className="grid lg:grid-cols-2 gap-12 items-center mb-32">

          {/* Left */}

          <div>

            <p className="uppercase tracking-[0.25em] text-sm text-gray-500 font-semibold mb-3">
              The Idea Behind 7Books
            </p>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              A Better Way
              <br />
              to Read Digital Books.
            </h2>

            <div className="space-y-6 text-gray-700 leading-8 text-lg">

              <p>
                Digital books have become part of everyday life, yet many
                reading applications still feel cluttered, distracting, or
                overloaded with features that interrupt the reading experience.
                7Books was created with a different philosophy.
              </p>

              <p>
                We believe reading should feel calm. The interface should stay
                in the background while the content takes centre stage. Clean
                layouts, carefully chosen typography, elegant colour themes,
                and intuitive controls work together to make every reading
                session comfortable.
              </p>

              <p>
                Whether you're reading novels, technical documentation,
                academic material, or personal notes, your library stays with
                you wherever you sign in. Simply upload your PDF, personalize
                the appearance, and continue reading from anywhere.
              </p>

            </div>

          </div>

          {/* Right Card */}

          <div className="relative">

            <div className="bg-gray-900 rounded-3xl p-10 md:p-12 text-white shadow-2xl overflow-hidden">

              <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-white/5 blur-3xl" />

              <div className="relative z-10">

                <p className="uppercase tracking-[0.25em] text-xs text-gray-400 mb-4">
                  Designed For
                </p>

                <h3 className="text-3xl font-bold mb-8">
                  Every Reader.
                </h3>

                <div className="space-y-5">

                  {[
                    "Students preparing for exams",
                    "Professionals reading documentation",
                    "Book enthusiasts",
                    "Researchers and lifelong learners",
                    "Anyone who enjoys a clean reading experience",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4"
                    >
                      <div className="w-3 h-3 rounded-full bg-white" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}

                </div>

              </div>

            </div>

          </div>

        </section>
                {/* ================= WHY 7BOOKS ================= */}

        <section className="mb-32">

          <div className="text-center mb-16">

            <p className="uppercase tracking-[0.25em] text-sm text-gray-500 font-semibold mb-4">
              Why 7Books
            </p>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything revolves around
              <br />
              the reading experience.
            </h2>

            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-8">
              Every feature inside 7Books exists for one reason—to help you
              spend more time reading and less time navigating complicated
              interfaces.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1 */}

            <div className="group bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 p-10">

              <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mb-8">

                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>

              </div>

              <h3 className="text-2xl font-bold mb-5">
                Upload Your Library
              </h3>

              <p className="text-gray-600 leading-8">
                Import your favourite PDF books in seconds and organize them
                into your personal digital library. Your collection is always
                ready whenever inspiration strikes.
              </p>

            </div>

            {/* Card 2 */}

            <div className="group bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 p-10">

              <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mb-8">

                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L15 12l-5.25-5"
                  />
                </svg>

              </div>

              <h3 className="text-2xl font-bold mb-5">
                Distraction-Free
              </h3>

              <p className="text-gray-600 leading-8">
                Carefully designed layouts, elegant typography, and customizable
                themes allow you to focus entirely on the content instead of
                unnecessary interface elements.
              </p>

            </div>

            {/* Card 3 */}

            <div className="group bg-white/70 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg hover:shadow-2xl transition-all duration-500 p-10">

              <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mb-8">

                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

              </div>

              <h3 className="text-2xl font-bold mb-5">
                Read Anywhere
              </h3>

              <p className="text-gray-600 leading-8">
                Your books remain available wherever you log in, making it easy
                to continue reading across different devices without interrupting
                your progress.
              </p>

            </div>

          </div>

        </section>

        {/* ================= STATS ================= */}

        <section className="mb-32">

          <div className="rounded-[40px] bg-gray-900 text-white p-10 md:p-16 shadow-2xl relative overflow-hidden">

            <div className="absolute -left-20 top-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -right-20 bottom-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center">

              <div>

                <div className="text-5xl font-bold mb-3">
                  7
                </div>

                <p className="uppercase tracking-[0.2em] text-sm text-gray-400">
                  Curated E-Books
                </p>

              </div>

              <div>

                <div className="text-5xl font-bold mb-3">
                  6+
                </div>

                <p className="uppercase tracking-[0.2em] text-sm text-gray-400">
                  Reading Themes
                </p>

              </div>

              <div>

                <div className="text-5xl font-bold mb-3">
                  ∞
                </div>

                <p className="uppercase tracking-[0.2em] text-sm text-gray-400">
                  Reading Possibilities
                </p>

              </div>

            </div>

          </div>

        </section>

                {/* ================= CLOSING ================= */}

        <section className="max-w-5xl mx-auto text-center">

          <p className="uppercase tracking-[0.25em] text-sm text-gray-500 font-semibold mb-5">
            Our Philosophy
          </p>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Technology should disappear.
            <br />
            The book should remain.
          </h2>

          <p className="mt-10 text-lg md:text-xl text-gray-600 leading-9 max-w-3xl mx-auto">
            Reading has always been one of the simplest and most meaningful ways
            to learn, explore ideas, and discover new perspectives. At 7Books,
            every design decision is made with that purpose in mind. Instead of
            overwhelming readers with unnecessary complexity, we focus on
            creating an experience that feels quiet, elegant, and comfortable,
            allowing every page to become the centre of attention.
          </p>

          <div className="mt-16">

            <Link
              to={isLoggedIn ? "/dashboard" : "/login"}
              className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-gray-900 text-white font-bold text-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Start Reading
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}