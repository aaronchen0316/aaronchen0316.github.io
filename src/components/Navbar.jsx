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
        backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: scrolled ? '1px solid var(--border-color)' : 'none'
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

    return (
        <nav style={navStyle}>
            <div style={logoStyle}>MyPortfolio</div>
            <div style={linkContainerStyle}>
                <a href="#hero" style={linkStyle}>Home</a>
                <a href="#about" style={linkStyle}>About</a>
                <a href="#projects" style={linkStyle}>Projects</a>
                <a href="#contact" style={linkStyle}>Contact</a>
            </div>
        </nav>
    );
};

export default Navbar;
