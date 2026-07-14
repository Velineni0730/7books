import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;


export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      if (isRegistering) {
        setIsRegistering(false);
        // Your custom success message
        setError("Account created successfully log in now to enter 7books");
      } else {
        localStorage.setItem('7books_token', data.token);
        localStorage.setItem('7books_userId', data.userId);
        // Save email to extract the username in the navbars!
        localStorage.setItem('7books_userEmail', email); 
        navigate('/dashboard'); 
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[linear-gradient(to_bottom,#eabfb3_0%,#fcf8f2_30%,#fcf8f2_70%,#eabfb3_100%)] font-switzer px-4">
      <div className="text-2xl font-bold tracking-tight mb-8 cursor-pointer text-gray-900" onClick={() => navigate('/')}>
        7books
      </div>

      <div className="bg-white/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/50">
        <h2 className="text-3xl font-bold mb-2 tracking-tight text-gray-900">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-gray-500 mb-8">
          {isRegistering ? 'Start building your aesthetic library.' : 'Enter your details to access your books.'}
        </p>

        {error && (
          <div className={`p-3 mb-6 rounded-lg text-sm font-medium ${error.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <input type="email" placeholder="Email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-gray-900" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:border-gray-900" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 shadow-lg mt-4">
            {isRegistering ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="font-bold text-gray-900 hover:underline">
            {isRegistering ? 'Log in instead' : 'New here?'}
          </button>
        </div>
      </div>
    </div>
  );
}