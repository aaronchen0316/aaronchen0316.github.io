import { useState, useEffect } from 'react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);

    const navStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: scrolled ? '0.8rem 1.5rem' : '1.2rem 1.5rem',
        backgroundColor: 'var(--nav-bg)', // Always have background on mobile
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)' // Always show border
    };

    const logoStyle = {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: 'var(--text-color)',
        letterSpacing: '-0.5px'
    };

    const linkContainerStyle = {
        display: 'flex',
        gap: '1.5rem',
    };

    const linkStyle = {
        color: 'var(--text-color)',
        fontWeight: '500',
        fontSize: '0.95rem',
    };

    // Add media query styles for mobile
    const mobileStyles = `
        @media (max-width: 768px) {
            nav {
                padding: 0.6rem 1rem !important;
            }
            nav > div:first-child {
                font-size: 1rem !important;
            }
            nav > div:last-child {
                gap: 0.8rem !important;
            }
            nav a {
                font-size: 0.85rem !important;
            }
        }
    `;

    return (
        <>
            <style>{mobileStyles}</style>
            <nav style={navStyle}>
                <div style={logoStyle}>MyPortfolio</div>
                <div style={linkContainerStyle}>
                    <a href="#hero" style={linkStyle}>Home</a>
                    <a href="#projects" style={linkStyle}>Projects</a>
                    <a href="#hobbies" style={linkStyle}>Hobbies</a>
                    <a href="#contact" style={linkStyle}>Contact</a>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
