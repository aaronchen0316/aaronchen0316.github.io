const Projects = () => {
    const projects = [
        {
            title: 'Project One',
            description: 'A brief description of what this project does and tech stack used.',
            tech: ['React', 'Node.js', 'MongoDB'],
            link: '#'
        },
        {
            title: 'Project Two',
            description: 'Another cool project implementation with some interesting features.',
            tech: ['Vue', 'Firebase', 'Sass'],
            link: '#'
        },
        {
            title: 'Project Three',
            description: 'Small utility library published on NPM.',
            tech: ['TypeScript', 'Jest'],
            link: '#'
        }
    ];

    const cardStyle = {
        background: 'var(--card-bg)',
        padding: '1.5rem',
        borderRadius: '6px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    };

    return (
        <section id="projects" style={{ padding: 'var(--spacing-section) 1.5rem' }}>
            <div className="container">
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Projects</h2>
                <div className="grid-projects">
                    {projects.map((project, index) => (
                        <div key={index} style={cardStyle}>
                            <h3 style={{ color: 'var(--text-color)', marginBottom: '0.8rem', fontSize: '1.2rem' }}>{project.title}</h3>
                            <p style={{ marginBottom: '1.2rem', color: 'var(--text-color-secondary)', fontSize: '0.95rem' }}>{project.description}</p>
                            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                                {project.tech.map(t => (
                                    <span key={t} style={{ fontSize: '0.85rem', color: 'var(--primary-color)', background: '#f5f5f4', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t}</span>
                                ))}
                            </div>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                <span style={{ textDecoration: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>View Project &rarr;</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
