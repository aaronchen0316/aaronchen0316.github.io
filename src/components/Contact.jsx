const Contact = () => {
    return (
        <section id="contact" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#fff' }}>Get In Touch</h2>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '3rem' }}>
                    I'm currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
                <a href="mailto:email@example.com">
                    <button style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>Say Hello</button>
                </a>
            </div>
        </section>
    );
};

export default Contact;
