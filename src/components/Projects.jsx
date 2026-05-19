import { useState } from 'react'
import SectionHeader from './SectionHeader'
import ProjectCarousel from './ProjectCarousel'
import { engineeringProjects, researchProjects } from '../content/siteContent'

const PROJECT_GROUPS = {
  research: researchProjects,
  engineering: engineeringProjects,
}

function Projects() {
  const [activeGroup, setActiveGroup] = useState('research')
  const [activeIndexes, setActiveIndexes] = useState({
    research: 0,
    engineering: 0,
  })
  const items = PROJECT_GROUPS[activeGroup]

  function shiftCarousel(direction) {
    setActiveIndexes((current) => ({
      ...current,
      [activeGroup]: (current[activeGroup] + direction + items.length) % items.length,
    }))
  }

  return (
    <section id="projects" className="section section-projects">
      <SectionHeader
        eyebrow="Projects"
        title="Research and software"
        description="Research papers and software projects presented as the main body of work across materials modeling, machine learning, and scientific tooling."
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

      <ProjectCarousel
        items={items}
        track={activeGroup}
        activeIndex={activeIndexes[activeGroup]}
        onPrevious={() => shiftCarousel(-1)}
        onNext={() => shiftCarousel(1)}
      />
    </section>
  )
}

export default Projects
