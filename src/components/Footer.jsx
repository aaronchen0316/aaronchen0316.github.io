const Footer = () => {
    const footerStyle = {
        padding: '1.5rem',
        textAlign: 'center',
        background: 'var(--footer-bg)',
        color: 'var(--text-color-secondary)',
        fontSize: '0.85rem'
    };

    return (
        <footer style={footerStyle}>
            <p>Built with React & Vite using strictly vanilla CSS.</p>
            <p style={{ marginTop: '0.5rem' }}>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
