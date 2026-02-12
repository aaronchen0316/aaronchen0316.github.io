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
        padding: scrolled ? '1rem 2rem' : '1.5rem 2rem',
        backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
    };

    const logoStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'var(--primary-color)',
    };

    const linkContainerStyle = {
        display: 'flex',
        gap: '2rem',
    };

    const linkStyle = {
        color: '#fff',
        fontWeight: '500',
        fontSize: '1rem',
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
