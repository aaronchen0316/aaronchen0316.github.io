import { useState, useEffect } from 'react';

const Projects = () => {
    const papers = [
        {
            title: "A comprehensive picture of roughness evolution in organic crystalline growth: the role of molecular aspect ratio",
            categories: ["Organic Semiconductors", "Crystalline Growth", "Molecular Dynamics"],
            link: "https://pubs.rsc.org/en/content/articlehtml/2022/mh/d2mh00854h",
            image: "/papers/esb.png"
        },
        {
            title: "Solvent-molecule interactions govern crystal-habit selection in naphthalene tetracarboxylic diimides",
            categories: ["Crystal Habit", "Organic Electronics", "Solvent Effects"],
            link: "https://pubs.acs.org/doi/abs/10.1021/acs.chemmater.9b03142",
            image: "/papers/ntcdi.webp"
        },
        {
            title: "Transferable Force Field for Gallium Nitride Crystal Growth from the Melt Using On-The-Fly Active Learning",
            categories: ["Machine Learning", "Force Fields", "Crystal Growth"],
            link: "https://pubs.acs.org/doi/abs/10.1021/acs.jctc.3c00587",
            image: "/papers/force field paper.webp"
        },
        {
            title: "Diffusion-limited crystal growth of gallium nitride using active machine learning",
            categories: ["Active Learning", "Gallium Nitride", "Crystal Growth"],
            link: "https://pubs.acs.org/doi/abs/10.1021/acs.cgd.3c01504",
            image: "/papers/gan paper.webp"
        },
        {
            title: "A multiscale approach to uncover the self-assembly of ligand-covered palladium nanocubes",
            categories: ["Multiscale Modeling", "Self-Assembly", "Nanocrystals"],
            link: "https://pubs.rsc.org/en/content/articlelanding/2023/sm/d3sm01140b/unauth",
            image: "/papers/pd.jpeg"
        },
        {
            title: "Steering Amine-CO2 Chemistry: A Molecular Insight into the Amino Site Relationship of Carbamate and Protonated Amine",
            categories: ["CO2 Capture", "Molecular Insight", "Amine Chemistry"],
            link: "https://pubs.acs.org/doi/full/10.1021/acsomega.5c03663",
            image: "/papers/solvent.webp"
        },
        {
            title: "Neutrophil membrane-coated nanoparticles inhibit synovial inflammation and alleviate joint damage in inflammatory arthritis",
            categories: ["Nanotechnology", "Drug Delivery", "Rheumatoid Arthritis"],
            link: "https://www.nature.com/articles/s41565-018-0254-4",
            image: "/papers/np.png"
        }
    ];

    const [startIndex, setStartIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const visibleCount = isMobile ? 1 : 3;

    const nextSlide = () => {
        setStartIndex((prev) => (prev + 1) % papers.length);
    };

    const prevSlide = () => {
        setStartIndex((prev) => (prev - 1 + papers.length) % papers.length);
    };

    // Get the visible papers with wrapping
    const getVisiblePapers = () => {
        const visible = [];
        for (let i = 0; i < visibleCount; i++) {
            visible.push(papers[(startIndex + i) % papers.length]);
        }
        return visible;
    };

    const cardStyle = {
        background: 'var(--card-bg)',
        borderRadius: '8px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        aspectRatio: '1 / 1',
        height: 'auto',
        textDecoration: 'none'
    };

    const placeholderStyle = {
        height: '50%',
        width: '100%',
        background: 'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af',
        fontSize: '0.8rem',
        borderBottom: '1px solid var(--border-color)'
    };

    return (
        <section id="projects" style={{ padding: 'var(--spacing-section) 1.5rem' }}>
            <div className="container">
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Academic Projects</h2>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Left Arrow */}
                    <button
                        onClick={prevSlide}
                        style={{
                            cursor: 'pointer',
                            fontSize: isMobile ? '1.5rem' : '2rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-color-secondary)',
                            fontWeight: 300,
                            padding: isMobile ? '0 0.5rem' : '0 1rem',
                            userSelect: 'none'
                        }}
                    >
                        &lt;
                    </button>

                    {/* Carousel Window */}
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                            gap: '1.5rem',
                        }}>
                            {getVisiblePapers().map((paper, index) => (
                                <a
                                    key={index}
                                    href={paper.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        ...cardStyle,
                                        // Scale up cards by 10% on mobile
                                        transform: isMobile ? 'scale(1.1)' : 'scale(1)',
                                        margin: isMobile ? '1.5rem 0' : '0'
                                    }}
                                >
                                    {/* Paper Image or Placeholder */}
                                    {paper.image ? (
                                        <img
                                            src={paper.image}
                                            alt={paper.title}
                                            style={{
                                                width: '100%',
                                                height: '50%',
                                                objectFit: 'contain',
                                                background: '#fff',
                                                borderBottom: '1px solid var(--border-color)',
                                                display: 'block'
                                            }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}

                                    {/* Fallback Placeholder (shown if no image or on error) */}
                                    <div style={{
                                        ...placeholderStyle,
                                        display: paper.image ? 'none' : 'flex'
                                    }}>
                                        [Paper Figure]
                                    </div>

                                    <div style={{ padding: '1rem', height: '50%', display: 'flex', flexDirection: 'column' }}>
                                        <h3 style={{
                                            color: 'var(--text-color)',
                                            marginBottom: '0.5rem',
                                            fontSize: isMobile ? '1rem' : '0.95rem',
                                            lineHeight: '1.3',
                                            fontWeight: 600,
                                            margin: 0,
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {paper.title}
                                        </h3>

                                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: 'auto' }}>
                                            {paper.categories.map(cat => (
                                                <span key={cat} style={{
                                                    fontSize: isMobile ? '0.65rem' : '0.7rem',
                                                    color: 'var(--text-color-secondary)',
                                                    border: '1px solid var(--border-color)',
                                                    padding: '0.1rem 0.5rem',
                                                    borderRadius: '10px',
                                                    fontWeight: 400,
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Arrow */}
                    <button
                        onClick={nextSlide}
                        style={{
                            cursor: 'pointer',
                            fontSize: isMobile ? '1.5rem' : '2rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-color-secondary)',
                            fontWeight: 300,
                            padding: isMobile ? '0 0.5rem' : '0 1rem',
                            userSelect: 'none'
                        }}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Projects;
