import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("7books_token");
        const email = localStorage.getItem("7books_userEmail");

        if (token) {
            setIsLoggedIn(true);
            if (email) setUsername(email.split("@")[0]);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("7books_token");
        localStorage.removeItem("7books_userId");
        localStorage.removeItem("7books_userEmail");

        setIsLoggedIn(false);
        navigate("/");
    };

    const handleProtectedRoute = (e, path) => {
        if (!isLoggedIn) {
            e.preventDefault();
            alert("Please login first.");
            navigate("/login");
            return;
        }

        navigate(path);
    };

    const activeClass = (path) =>
        location.pathname === path
            ? "font-bold text-black border-b-2 border-black pb-1"
            : "hover:text-black transition-colors";

    return (
        <nav className="w-full px-4 md:px-8 h-[80px] flex justify-between items-center sticky top-0 z-50 bg-white/50 backdrop-blur-md border-b border-gray-200/50">

            <div
                className="text-xl md:text-2xl font-bold tracking-tight cursor-pointer"
                onClick={() => navigate("/")}
            >
                7books.in
            </div>

            <div className="hidden md:flex space-x-10 lg:space-x-14 text-sm font-medium text-gray-800">

                <Link to="/samples" className={activeClass("/samples")}>
                    Samples
                </Link>

                <Link
                    to="/dashboard"
                    onClick={(e) => handleProtectedRoute(e, "/dashboard")}
                    className={activeClass("/dashboard")}
                >
                    E-Books
                </Link>

                <Link
                    to="/editor"
                    onClick={(e) => handleProtectedRoute(e, "/editor")}
                    className={activeClass("/editor")}
                >
                    My E-Books
                </Link>

                <Link
                    to="/about"
                    className={activeClass("/about")}
                >
                    About Us
                </Link>

            </div>

            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">

                {isLoggedIn ? (
                    <div className="relative group">

                        <button className="px-5 py-2 bg-gray-900 text-white rounded-full font-bold capitalize shadow-md hover:bg-gray-800 transition">
                            {username}
                        </button>

                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity overflow-hidden">

                            <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 text-sm text-red-500 hover:bg-gray-50 text-left font-bold"
                            >
                                Log out
                            </button>

                        </div>

                    </div>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="font-bold hover:text-black"
                        >
                            Log in
                        </Link>

                        <Link
                            to="/login"
                            className="px-5 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 shadow-md font-bold"
                        >
                            Register
                        </Link>
                    </>
                )}

            </div>
        </nav>
    );
}