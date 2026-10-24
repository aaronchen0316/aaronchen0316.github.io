import { useState } from 'react'
import SectionHeader from './SectionHeader'
import ProjectCarousel from './ProjectCarousel'
import ProjectDetailsDialog from './ProjectDetailsDialog'
import { engineeringProjects, researchProjects } from '../content/siteContent'

const PROJECT_GROUPS = {
  research: researchProjects,
  engineering: engineeringProjects,
}

function Projects() {
  const [activeGroup, setActiveGroup] = useState('research')
  const [openProject, setOpenProject] = useState(null)
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
        onOpenProject={setOpenProject}
      />
      {openProject ? (
        <ProjectDetailsDialog project={openProject} onClose={() => setOpenProject(null)} />
      ) : null}
    </section>
  )
}

export default Projects
