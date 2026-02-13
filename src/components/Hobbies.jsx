const Hobbies = () => {
    const hobbies = [
        {
            name: 'Photography',
            description: 'Capturing moments and exploring different perspectives through the lens.',
            icon: '📷'
        },
        {
            name: 'Traveling',
            description: 'Exploring new places and experiencing different cultures.',
            icon: '✈️'
        },
        {
            name: 'Home Projects',
            description: 'Building and creating things around the house.',
            icon: '🏠'
        },
        {
            name: 'Recreational Sports',
            description: 'Staying active through various sports and outdoor activities.',
            icon: '⚽'
        }
    ];

    const cardStyle = {
        background: 'var(--card-bg)',
        padding: '1.5rem',
        borderRadius: '6px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '1rem'
    };

    return (
        <section id="hobbies" style={{ padding: 'var(--spacing-section) 1.5rem' }}>
            <div className="container">
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Hobbies & Interests</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem'
                }}>
                    {hobbies.map((hobby, index) => (
                        <div key={index} style={cardStyle}>
                            <div style={{ fontSize: '2.5rem' }}>{hobby.icon}</div>
                            <h3 style={{ color: 'var(--text-color)', fontSize: '1.2rem', margin: 0 }}>{hobby.name}</h3>
                            <p style={{ color: 'var(--text-color-secondary)', fontSize: '0.95rem', margin: 0 }}>{hobby.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hobbies;
