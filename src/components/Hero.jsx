const Hero = () => {
    const sectionStyle = {
        height: '80vh', /* More compact hero */
        minHeight: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 1.5rem',
        maxWidth: '1000px',
        margin: '0 auto',
        // background: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.1) 0%, transparent 40%)', // Removed for clean look
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
        maxWidth: '540px',
        fontSize: '1.05rem',
        color: 'var(--text-color-secondary)',
        marginBottom: '2rem',
        lineHeight: '1.7',
    };

    return (
        <section id="hero" style={sectionStyle}>
            <h1 style={headingStyle}>Hello, I'm [Your Name]</h1>
            <h2 style={subHeadingStyle}>A Passionate Developer</h2>
            <p style={pStyle}>
                I build accessible, pixel-perfect, responsive, and performant web experiences.
                Welcome to my digital garden.
            </p>
            <a href="#projects">
                <button>View My Work</button>
            </a>
        </section>
    );
};

export default Hero;
