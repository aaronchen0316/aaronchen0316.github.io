const Contact = () => {
    return (
        <section id="contact" style={{ padding: 'var(--spacing-section) 1.5rem', textAlign: 'center' }}>
            <div className="container" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-color)' }}>Get In Touch</h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-color-secondary)', marginBottom: '2rem' }}>
                    My inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
                <a href="mailto:aaronchen0316@gmail.com">
                    <button style={{ padding: '0.8rem 1.6rem' }}>Say Hello</button>
                </a>
            </div>
        </section>
    );
};

export default Contact;
