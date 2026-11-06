'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Menu, X } from 'lucide-react';

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Markets', href: '#markets' },
  { label: 'Features', href: '#features' },
  { label: 'FinPilot', href: '#finpilot' },
  { label: 'About', href: '#about' },
];

export function Wordmark() {
  return (
    <span className="wordmark">
      <span className="wordmark-mark"><LayoutDashboard aria-hidden="true" /></span>
      Stockify
    </span>
  );
}

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-bar">
        <Link href="/" aria-label="Stockify home"><Wordmark /></Link>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)}
        </nav>
        <div className="nav-actions">
          <Link className="nav-signin" href="/login">Sign In</Link>
          <Link className="btn btn-primary btn-small" href="/signup">Get Started</Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <nav id="nav-menu" className="nav-menu" hidden={!open} aria-label="Menu">
        {LINKS.map((link) => (
          <a key={link.label} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
        ))}
        <Link href="/login">Sign In</Link>
      </nav>
    </header>
  );
}
