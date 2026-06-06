import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Editor() {
    const location = useLocation();
    const navigate = useNavigate();

    const bookId = location.state?.bookId;

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    const [fontSize, setFontSize] = useState(18);
    const [lineHeight, setLineHeight] = useState(1.8);

    const [theme, setTheme] = useState({
        background: '#fcf8f2',
        text: '#1f2937'
    });

    useEffect(() => {
        if (!bookId) {
            navigate('/dashboard');
            return;
        }

        console.log("BOOK ID RECEIVED:", bookId);

        fetch(`http://localhost:5001/api/books/${bookId}`)
            .then(res => res.json())
            .then(data => {
                console.log("BOOK DATA:", data);
                setBook(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

    }, [bookId, navigate]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-xl">
                Loading Book...
            </div>
        );
    }

    if (!book) {
        return (
            <div className="h-screen flex items-center justify-center text-xl">
                Book Not Found
            </div>
        );
    }

    return (
        <div
            className="h-screen flex"
            style={{
                background: theme.background,
                color: theme.text
            }}
        >

            {/* Sidebar */}
            <aside className="w-80 border-r bg-white p-6 overflow-y-auto">

                <h1 className="text-2xl font-bold mb-6">
                    {book.title}
                </h1>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        Font Size
                    </label>

                    <input
                        type="range"
                        min="12"
                        max="40"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                    />
                </div>

                <div className="mb-6">
                    <label className="block font-semibold mb-2">
                        Line Height
                    </label>

                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(Number(e.target.value))}
                    />
                </div>

                <button
                    className="w-full p-3 rounded bg-gray-900 text-white"
                    onClick={() =>
                        setTheme({
                            background: '#fcf8f2',
                            text: '#1f2937'
                        })
                    }
                >
                    Cream Theme
                </button>

            </aside>

            {/* Book */}
            <main className="flex-1 overflow-y-auto p-10">

                <div
                    className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-12"
                >

                    {book.bookContent?.map((item, index) => (
                        <p
                            key={index}
                            style={{
                                fontSize: `${fontSize}px`,
                                lineHeight
                            }}
                            className="mb-6"
                        >
                            {item.content}
                        </p>
                    ))}

                </div>

            </main>

        </div>
    );
}