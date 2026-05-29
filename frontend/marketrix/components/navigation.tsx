"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-display font-bold text-lg">
              M
            </div>
            <span className="text-lg font-display font-bold gradient-text hidden sm:inline">
              Marketrix
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? "text-violet-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="btn-ghost">
              <LogIn size={18} />
              <span>Login</span>
            </button>
            <button className="btn-primary">
              <UserPlus size={18} />
              <span>Sign Up</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  isActive(link.href)
                    ? "bg-violet-600/20 text-violet-400"
                    : "text-slate-300 hover:bg-white/10"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-4 border-t border-white/10">
              <button className="btn-secondary flex-1">Login</button>
              <button className="btn-primary flex-1">Sign Up</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
