function modulo(value, length) {
  return ((value % length) + length) % length
}

const CARD_POSITIONS = [-2, -1, 0, 1, 2]

function getLinkLabel(track) {
  return track === 'research' ? 'View paper' : 'View project'
}

function ProjectCard({ project, track, position, isActive }) {
  const linkProps = project.link.startsWith('http')
    ? { target: '_blank', rel: 'noreferrer' }
    : {}
  const showSummary = position === 0 && track !== 'research'
  const isVisibleCard = Math.abs(position) <= 1

  return (
    <article className={`carousel-card position-${position} ${isActive ? 'is-active' : ''}`}>
      <div className="carousel-card-media">
        {project.image ? (
          <img className="project-image" src={project.image} alt={project.title} />
        ) : (
          <div className="project-image project-image-fallback">
            <span>Build</span>
          </div>
        )}
      </div>

      {isVisibleCard ? (
        <div className="carousel-card-body">
          {project.tags?.length ? (
            <div className="tag-row">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}

          <h3>{project.title}</h3>
          {showSummary && project.summary ? <p>{project.summary}</p> : null}

          <a href={project.link} {...linkProps}>
            {getLinkLabel(track)}
          </a>
        </div>
      ) : (
        <div className="carousel-card-titleband">
          <h3>{project.title}</h3>
        </div>
      )}
    </article>
  )
}

function ProjectCarousel({ items, activeIndex, onPrevious, onNext, track }) {
  const cards = CARD_POSITIONS.map((position) => {
    const item = items[modulo(activeIndex + position, items.length)]
    return (
      <ProjectCard
        key={`${track}-${item.title}-${position}`}
        project={item}
        track={track}
        position={position}
        isActive={position === 0}
      />
    )
  })

  return (
    <div className={`project-carousel project-carousel-${track}`}>
      <div className="carousel-toolbar">
        <button type="button" className="carousel-arrow" aria-label={`Previous ${track} item`} onClick={onPrevious}>
          <span aria-hidden="true">←</span>
        </button>

        <div className="carousel-status" aria-live="polite">
          <span>{track === 'research' ? 'Research' : 'Engineering'}</span>
          <strong>
            {activeIndex + 1} / {items.length}
          </strong>
        </div>

        <button type="button" className="carousel-arrow" aria-label={`Next ${track} item`} onClick={onNext}>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="carousel-stage" aria-label={`${track} project carousel`}>
        {cards}
      </div>
    </div>
  )
}

export default ProjectCarousel
