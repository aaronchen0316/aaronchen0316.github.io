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
        background: '#1e293b',
        padding: '2rem',
        borderRadius: '8px',
        transition: 'transform 0.3s ease',
        cursor: 'default',
        border: '1px solid #334155'
    };

    return (
        <section id="projects" style={{ padding: '6rem 2rem' }}>
            <div className="container">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>Some Things I've Built</h2>
                <div className="grid-projects">
                    {projects.map((project, index) => (
                        <div key={index} style={cardStyle}>
                            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>{project.title}</h3>
                            <p style={{ marginBottom: '1.5rem', color: '#94a3b8' }}>{project.description}</p>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                {project.tech.map(t => (
                                    <span key={t} style={{ fontSize: '0.9rem', color: '#64748b' }}>{t}</span>
                                ))}
                            </div>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>View Project</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
