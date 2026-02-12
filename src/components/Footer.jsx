const Footer = () => {
    const footerStyle = {
        padding: '2rem',
        textAlign: 'center',
        background: '#0f172a',
        color: '#64748b',
        fontSize: '0.9rem'
    };

    return (
        <footer style={footerStyle}>
            <p>Built with React & Vite using strictly vanilla CSS.</p>
            <p style={{ marginTop: '0.5rem' }}>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
