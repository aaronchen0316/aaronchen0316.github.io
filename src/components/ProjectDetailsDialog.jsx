import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

function ProjectDetailsDialog({ project, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previouslyFocused = document.activeElement
    dialog.showModal()

    return () => {
      dialog.close()
      previouslyFocused?.focus?.()
    }
  }, [])

  return createPortal(
    <dialog
      ref={dialogRef}
      className={`project-details-dialog ${project.repository ? 'has-repository' : ''}`}
      aria-labelledby="project-details-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="project-details-content">
        <div className="project-details-media">
          <img src={project.image} alt="" />
        </div>
        <button type="button" className="project-details-close" aria-label="Close project details" onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
        <div className="project-details-copy">
          <p className="eyebrow">Engineering project</p>
          <h2 id="project-details-title">{project.title}</h2>
          <p>{project.description}</p>
          {project.repository ? (
            <a className="project-details-repository" href={project.repository} target="_blank" rel="noreferrer">
              View GitHub repository <span aria-hidden="true">↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </dialog>,
    document.body,
  )
}

export default ProjectDetailsDialog
