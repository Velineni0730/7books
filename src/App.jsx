import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;