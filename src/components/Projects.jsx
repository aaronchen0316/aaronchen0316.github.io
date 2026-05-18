import { useState } from 'react'
import SectionHeader from './SectionHeader'
import { engineeringProjects, researchProjects } from '../content/siteContent'

const PROJECT_GROUPS = {
  research: researchProjects,
  engineering: engineeringProjects,
}

function Projects() {
  const [activeGroup, setActiveGroup] = useState('research')
  const items = PROJECT_GROUPS[activeGroup]

  return (
    <section id="projects" className="section">
      <SectionHeader
        eyebrow="Projects"
        title="Research and software"
        description="Selected papers and software projects in materials modeling, machine learning, and technical tooling."
      />

      <div className="segmented-control" role="tablist" aria-label="Project type">
        <button
          type="button"
          className={activeGroup === 'research' ? 'is-active' : ''}
          onClick={() => setActiveGroup('research')}
        >
          Research
        </button>
        <button
          type="button"
          className={activeGroup === 'engineering' ? 'is-active' : ''}
          onClick={() => setActiveGroup('engineering')}
        >
          Engineering
        </button>
      </div>

      <div className="project-grid">
        {items.map((project) => (
          <article key={project.title} className="project-card">
            {project.image ? (
              <img className="project-image" src={project.image} alt={project.title} />
            ) : (
              <div className="project-image project-image-fallback">
                <span>Build</span>
              </div>
            )}

            <div className="project-body">
              <div className="tag-row">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <h3>{project.title}</h3>
              <p>{project.summary}</p>

              <a href={project.link} target={project.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                View {activeGroup === 'research' ? 'paper' : 'project'}
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
