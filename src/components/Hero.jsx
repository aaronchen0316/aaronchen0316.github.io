const Hero = () => {
    const sectionStyle = {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 10%',
        background: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.1) 0%, transparent 40%)',
    };

    const headingStyle = {
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        marginBottom: '1rem',
        background: 'linear-gradient(to right, #fff, #94a3b8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    const subHeadingStyle = {
        fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
        color: 'var(--primary-color)',
        marginBottom: '2rem',
    };

    const pStyle = {
        maxWidth: '600px',
        fontSize: '1.1rem',
        color: '#94a3b8',
        marginBottom: '3rem',
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
