"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { label: "Features",     href: "#features",     scroll: "features" },
  { label: "How It Works", href: "#how-it-works",  scroll: "how-it-works" },
  { label: "Testimonials", href: "#testimonials",  scroll: "testimonials" },
  { label: "FAQ",          href: "#faq",           scroll: "faq" },
];

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ["features", "how-it-works", "testimonials", "faq"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) { setActiveSection(id); return; }
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = useCallback((link: typeof navLinks[0], e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (pathname === "/") {
      const el = document.getElementById(link.scroll);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`/#${link.scroll}`);
    }
  }, [pathname, router]);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300, display: "flex", justifyContent: "center", paddingTop: "12px", paddingLeft: "16px", paddingRight: "16px" }}>
      <div style={{
        width: "100%", maxWidth: "1100px",
        background: scrolled ? "rgba(10,15,30,0.96)" : "rgba(10,15,30,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5)" : "0 2px 20px rgba(0,0,0,0.3)",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: "56px" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #3B82F6, #06B6D4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(59,130,246,0.5)",
              fontSize: 16,
            }}>✦</div>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "white" }}>SkillBridge AI</span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px", flex: 1, justifyContent: "center" }}
            className="sb-desktop-nav">
            {navLinks.map((link) => (
              <a key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(link, e)}
                style={{
                  padding: "8px 14px",
                  fontSize: "13.5px",
                  fontWeight: 500,
                  borderRadius: "8px",
                  textDecoration: "none",
                  cursor: "pointer",
                  color: activeSection === link.scroll ? "white" : "#94A3B8",
                  background: activeSection === link.scroll ? "rgba(255,255,255,0.07)" : "transparent",
                  transition: "all 0.2s ease",
                }}>
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}
            className="sb-desktop-nav">
            <Link href="/login" style={{
              padding: "8px 16px", fontSize: "13.5px", fontWeight: 500,
              color: "#CBD5E1", textDecoration: "none",
              transition: "color 0.2s",
            }}>
              Sign In
            </Link>
            <Link href="/signup" style={{
              padding: "8px 16px", fontSize: "13.5px", fontWeight: 600,
              background: "linear-gradient(135deg, #3B82F6, #2563EB)",
              color: "white", textDecoration: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
              transition: "opacity 0.2s",
            }}>
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sb-mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: "8px", fontSize: "20px", lineHeight: 1 }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: "76px", left: "16px", right: "16px",
          borderRadius: "16px", overflow: "hidden",
          background: "rgba(10,15,30,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          zIndex: 1400,
        }}>
          <div style={{ padding: "12px" }}>
            {navLinks.map((link) => (
              <a key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(link, e)}
                style={{
                  display: "block", padding: "12px 16px",
                  fontSize: "14px", color: "#CBD5E1", textDecoration: "none",
                  borderRadius: "10px",
                }}>
                {link.label}
              </a>
            ))}
          </div>
          <div style={{ padding: "12px", paddingTop: 0, display: "flex", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <Link href="/login" style={{
              flex: 1, textAlign: "center", fontSize: "14px", color: "#CBD5E1",
              padding: "10px", borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)", textDecoration: "none",
            }}>Sign In</Link>
            <Link href="/signup" style={{
              flex: 1, textAlign: "center", fontSize: "14px", fontWeight: 700,
              background: "linear-gradient(135deg, #3B82F6, #2563EB)", color: "white",
              padding: "10px", borderRadius: "10px", textDecoration: "none",
            }}>Get Started</Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .sb-desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .sb-mobile-menu-btn { display: none !important; } }
      `}</style>
    </nav>
  );
}
