const About = () => {
    return (
        <section id="about" style={{ padding: '6rem 2rem', background: '#1e293b' }}>
            <div className="container">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>About Me</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <p style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>
                        I am a developer based in [Location]. I enjoy creating things that live on the internet, whether that be websites, applications, or anything in between. My goal is to always build products that provide pixel-perfect, performant experiences.
                    </p>
                    <p style={{ fontSize: '1.2rem', color: '#cbd5e1' }}>
                        Here are a few technologies I've been working with recently:
                    </p>
                    <ul style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(140px, 200px))',
                        gap: '10px',
                        padding: 0,
                        listStyle: 'none',
                    }}>
                        {['JavaScript (ES6+)', 'React', 'Node.js', 'Vite', 'CSS3', 'Git'].map((skill) => (
                            <li key={skill} style={{ color: 'var(--primary-color)', display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px' }}>▹</span> {skill}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default About;
