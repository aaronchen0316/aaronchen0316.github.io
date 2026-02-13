const About = () => {
    return (
        <section id="about" style={{ padding: 'var(--spacing-section) 1.5rem', background: 'transparent' }}>
            <div className="container">
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>About Me</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px', margin: '0 auto' }}>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-color-secondary)' }}>
                        I am a developer based in [Location]. I enjoy creating things that live on the internet, whether that be websites, applications, or anything in between. My goal is to always build products that provide pixel-perfect, performant experiences.
                    </p>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-color-secondary)' }}>
                        Here are a few technologies I've been working with recently:
                    </p>
                    <ul style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(140px, 200px))',
                        gap: '0.5rem',
                        padding: 0,
                        listStyle: 'none',
                    }}>
                        {['JavaScript (ES6+)', 'React', 'Node.js', 'Vite', 'CSS3', 'Git'].map((skill) => (
                            <li key={skill} style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>
                                <span style={{ marginRight: '8px', color: 'var(--secondary-color)' }}>▹</span> {skill}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default About;
