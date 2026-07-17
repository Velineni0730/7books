import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import cream1 from "../assets/images/cream_1.png";
import rose2 from "../assets/images/rose_2.png";
import dark3 from "../assets/images/dark_3.png";
import dark4 from "../assets/images/dark_4.png";
import dark5 from "../assets/images/dark_5.png";
import forest6 from "../assets/images/forest_6.png";
import sepia7 from "../assets/images/sepia_7.png";

export default function Samples() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("7books_token");
        if (token) setIsLoggedIn(true);
    }, []);

    return (

        <div className="min-h-screen font-switzer bg-[linear-gradient(to_bottom,#eabfb3_0%,#fcf8f2_30%,#fcf8f2_70%,#eabfb3_100%)] text-gray-900">

            <Navbar />

            <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-28">

                {/* ================= HERO ================= */}

                <section className="text-center mb-40">

                    <p className="uppercase tracking-[0.35em] text-sm font-semibold text-gray-500 mb-5">
                        Samples
                    </p>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                        Curated
                        <br />
                        Reading Experiences
                    </h1>

                    <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-8">

                        Explore how a single book transforms across different themes,
                        layouts, typography, and reading environments. Every screenshot
                        below comes directly from the 7Books editor.

                    </p>

                </section>

                {/* ================= SAMPLE 1 ================= */}

                <section className="grid lg:grid-cols-[1.7fr_0.8fr] gap-20 items-center mb-44">

                    <div
                        className="bg-white/70 backdrop-blur-md rounded-[34px] p-6 shadow-2xl border border-white/50 hover:shadow-[0_30px_70px_rgba(0,0,0,0.18)] transition duration-500">

                        <img
                            src={cream1}
                            alt="Book Theme"
                            className="w-full rounded-2xl"
                        />

                    </div>

                    <div>

                        <p className="uppercase tracking-[0.25em] text-sm text-gray-500 font-semibold mb-3">
                            Book Theme
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight mb-6">
                            Inspired by the
                            <br />
                            original book.
                        </h2>

                        <p className="text-lg text-gray-600 leading-8">

                            The Book Theme automatically builds a reading environment using
                            the colours from the book cover, creating an experience that
                            feels close to reading the original printed edition.

                        </p>

                    </div>

                </section>

                {/* ================= SAMPLE 2 ================= */}

                <section className="grid lg:grid-cols-[0.8fr_1.7fr] gap-20 items-center mb-44">

                    <div className="order-2 lg:order-1">

                        <p className="uppercase tracking-[0.25em] text-sm text-gray-500 font-semibold mb-3">
                            Rose Theme
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight mb-6">
                            Soft.
                            <br />
                            Elegant.
                        </h2>

                        <p className="text-lg text-gray-600 leading-8">
                            A warm colour palette with gentle contrast that creates a calm,
                            welcoming atmosphere. Ideal for long reading sessions while adding
                            a subtle touch of personality to every page.
                        </p>

                    </div>

                    <div
                        className="order-1 lg:order-2 bg-white/70 backdrop-blur-md rounded-[34px] p-6 shadow-2xl border border-white/50 hover:shadow-[0_30px_70px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1">

                        <img
                            src={rose2}
                            alt="Rose Theme"
                            className="w-full rounded-2xl"
                        />

                    </div>

                </section>


                {/* ================= SAMPLE 3 ================= */}

                <section className="grid lg:grid-cols-[1.7fr_0.8fr] gap-20 items-center mb-44">

                    <div
                        className="bg-[#141923] rounded-[34px] p-6 shadow-2xl hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1">

                        <img
                            src={dark3}
                            alt="Dark Theme"
                            className="w-full rounded-2xl"
                        />

                    </div>

                    <div>

                        <p className="uppercase tracking-[0.25em] text-sm text-gray-500 font-semibold mb-3">
                            Dark Theme
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight mb-6">
                            Comfortable
                            <br />
                            after sunset.
                        </h2>

                        <p className="text-lg text-gray-600 leading-8">
                            Designed for late-night reading with balanced contrast, reduced
                            glare, and typography that remains comfortable even during extended
                            reading sessions.
                        </p>

                    </div>

                </section>

                {/* ================= SAMPLE 4 ================= */}

                <section className="grid lg:grid-cols-[0.8fr_1.7fr] gap-20 items-center mb-44">

                    <div className="order-2 lg:order-1">

                        <p className="uppercase tracking-[0.25em] text-sm text-gray-500 font-semibold mb-3">
                            Single Page View
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight mb-6">
                            One page.
                            <br />
                            Complete focus.
                        </h2>

                        <p className="text-lg text-gray-600 leading-8">
                            Immerse yourself in every chapter with a clean single-page layout.
                            Perfect for distraction-free reading where every word receives your
                            complete attention.
                        </p>

                    </div>

                    <div
                        className="order-1 lg:order-2 bg-[#141923] rounded-[34px] p-6 shadow-2xl hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1">

                        <img
                            src={dark4}
                            alt="Single Page View"
                            className="w-full rounded-2xl"
                        />

                    </div>

                </section>



                {/* ================= SAMPLE 5 ================= */}

                <section className="grid lg:grid-cols-[1.7fr_0.8fr] gap-20 items-center mb-44">

                    <div
                        className="bg-[#141923] rounded-[34px] p-6 shadow-2xl hover:shadow-[0_30px_70px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1">

                        <img
                            src={dark5}
                            alt="Reader Controls"
                            className="w-full rounded-2xl"
                        />

                    </div>

                    <div>

                        <p className="uppercase tracking-[0.25em] text-sm text-gray-500 font-semibold mb-3">
                            Reader Controls
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight mb-6">
                            Tailor every
                            <br />
                            reading session.
                        </h2>

                        <p className="text-lg text-gray-600 leading-8">
                            Choose themes, fonts, layouts, typography, spacing, colours and
                            page views—all designed to help you create a reading experience
                            that feels uniquely yours.
                        </p>

                    </div>

                </section>

                {/* ================= SAMPLE 6 ================= */}

                <section className="grid lg:grid-cols-[0.8fr_1.7fr] gap-20 items-center mb-44">

                    <div className="order-2 lg:order-1">

                        <p className="uppercase tracking-[0.25em] text-sm text-gray-500 font-semibold mb-3">
                            Forest Theme
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight mb-6">
                            Calm.
                            <br />
                            Natural.
                        </h2>

                        <p className="text-lg text-gray-600 leading-8">
                            Inspired by soft greens and natural paper tones, Forest Theme
                            creates a relaxed environment that's gentle on the eyes during long
                            reading sessions while maintaining excellent readability.
                        </p>

                    </div>

                    <div
                        className="order-1 lg:order-2 bg-white/70 backdrop-blur-md rounded-[34px] p-6 shadow-2xl border border-white/50 hover:shadow-[0_30px_70px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1">

                        <img
                            src={forest6}
                            alt="Forest Theme"
                            className="w-full rounded-2xl"
                        />

                    </div>

                </section>



                {/* ================= SAMPLE 7 ================= */}

                <section className="grid lg:grid-cols-[1.7fr_0.8fr] gap-20 items-center mb-48">

                    <div
                        className="bg-white/70 backdrop-blur-md rounded-[34px] p-6 shadow-2xl border border-white/50 hover:shadow-[0_30px_70px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-1">

                        <img
                            src={sepia7}
                            alt="Sepia Theme"
                            className="w-full rounded-2xl"
                        />

                    </div>

                    <div>

                        <p className="uppercase tracking-[0.25em] text-sm text-gray-500 font-semibold mb-3">
                            Sepia Theme
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight mb-6">
                            A timeless
                            <br />
                            reading experience.
                        </h2>

                        <p className="text-lg text-gray-600 leading-8">
                            Inspired by classic paperbacks and aged manuscripts, Sepia Theme
                            recreates the familiar warmth of printed books while remaining
                            perfectly suited for modern digital reading.
                        </p>

                    </div>

                </section>



                {/* ================= CTA ================= */}

                <section className="max-w-5xl mx-auto">

                    <div className="relative overflow-hidden rounded-[40px] bg-gray-900 px-10 md:px-20 py-20 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)]">

                        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-3xl" />

                        <div className="relative z-10">

                            <p className="uppercase tracking-[0.3em] text-sm text-gray-400 font-semibold mb-5">
                                Your Library Awaits
                            </p>

                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-8">
                                Ready to start
                                <br />
                                your next chapter?
                            </h2>

                            <p className="max-w-2xl mx-auto text-lg text-gray-300 leading-8 mb-12">
                                Upload your favourite PDF, personalize the reading experience,
                                and discover how enjoyable digital books can feel when the
                                interface gets out of the way.
                            </p>

                            <Link
                                to={isLoggedIn ? "/dashboard" : "/login"}
                                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
                            >
                                Start Reading
                            </Link>

                        </div>

                    </div>

                </section>

            </main>

        </div>

    );
}