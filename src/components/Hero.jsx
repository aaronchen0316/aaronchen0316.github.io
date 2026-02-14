import { useState, useEffect } from 'react';

const Hero = () => {
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const sectionStyle = {
        height: isMobile ? 'auto' : '80vh', // Auto height on mobile
        minHeight: isMobile ? 'auto' : '500px', // No min-height on mobile
        display: 'flex',
        flexDirection: 'column',
        justifyContent: isMobile ? 'flex-start' : 'center', // Top-align on mobile
        alignItems: 'flex-start',
        padding: isMobile ? '3rem 1rem 5rem' : '0 1.5rem', // Generous padding on mobile
        maxWidth: '1000px',
        margin: '0 auto',
    };

    const headingStyle = {
        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
        marginBottom: '0.5rem',
        color: 'var(--text-color)',
        fontWeight: '700',
    };

    const subHeadingStyle = {
        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
        color: 'var(--text-color-secondary)',
        marginBottom: '1.5rem',
        fontWeight: '400',
    };

    const pStyle = {
        maxWidth: '650px',
        fontSize: '1.05rem',
        color: 'var(--text-color-secondary)',
        marginBottom: '2rem',
        lineHeight: '1.7',
    };

    return (
        <section id="hero" style={sectionStyle}>
            <h1 style={headingStyle}>Hello, I'm Aaron Chen</h1>
            <h2 style={subHeadingStyle}>Research Scientist & ML Engineer</h2>

            <p style={pStyle}>
                Bridging the gap between <strong>Machine Learning</strong> and <strong>Materials Science</strong>.
                I build simulation-driven systems and AI tools that accelerate energy research and materials discovery.
                I enjoy creating things that live on the internet, whether that be websites, applications, or anything in between.
            </p>

            <div style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-color)', marginBottom: '1rem', fontWeight: 500 }}>
                    Technologies I work with:
                </p>
                <ul style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.8rem',
                    padding: 0,
                    listStyle: 'none',
                }}>
                    {['Deep Learning', 'Machine Learning Force Field', 'Bayesian Optimization', 'MD/DFT', 'Materials Informatics'].map((skill) => (
                        <li key={skill} style={{
                            color: 'var(--primary-color)',
                            fontSize: '0.9rem',
                            background: 'var(--card-bg)',
                            padding: '0.3rem 0.8rem',
                            borderRadius: '20px',
                            border: '1px solid var(--border-color)'
                        }}>
                            {skill}
                        </li>
                    ))}
                </ul>
            </div>

            <a href="#projects">
                <button>View My Projects</button>
            </a>
        </section>
    );
};

export default Hero;
