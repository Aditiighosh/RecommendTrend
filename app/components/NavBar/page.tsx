"use client"

import React, { useState } from "react";
import Link from "next/link";

const navStyles = {
    container: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: '#ffffff',
      
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      display: 'flex',
      
      alignItems: 'center',
    },
    link: {
      textDecoration: 'none',
      color: '#4B0082',
      fontWeight: 500,
      textShadow: '0 0 10px #a855f7, 0 0 20px #a855f7',
      fontFamily: "'Fraunces', serif",
      fontSize: '1.5rem',
      transition: 'color 0.2s ease',
      ':hover': {
        color: '#0066ff',
      },
    },
    mainContent: {
      paddingTop: '80px',
    }
  };
  
export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav style={navStyles.container} className="bg-gradient-to-r from-purple-900 to-purple-200 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className=" text-3xl  font-bold"
          style={{
            textShadow: '0 0 10px #a855f7, 0 0 20px #a855f7',
            fontFamily: "'Fraunces', serif",
          }}
        >
          <a  href="#">Recommend Trend</a>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <a style={navStyles.link} href="#" className="hover:text-gray-200 transition">
            Home
          </a>
          <a style={navStyles.link}href ="#" className="hover:text-gray-200 transition">
            About
          </a>
          <a style={navStyles.link}href="#" className="hover:text-gray-200 transition">
            Services
          </a>
          <a style={navStyles.link}href="#" className="hover:text-gray-200 transition">
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#45226e]">
          <a
            href="/components/Landing/page"
            className="block px-4 py-2 hover:bg-blue-700 transition"
          >
            Home
          </a>
          <Link
            href="/components/About/page"
            className="block px-4 py-2 hover:bg-blue-700 transition"
          >
            About
          </Link>
          <a
            href="#"
            className="block px-4 py-2 hover:bg-blue-700 transition"
          >
            Services
          </a>
          <a
            href="#"
            className="block px-4 py-2 hover:bg-blue-700 transition"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
};

