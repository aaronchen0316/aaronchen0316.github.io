import SectionHeader from './SectionHeader'
import { experienceThemes } from '../content/siteContent'

function Experience() {
  return (
    <section id="experience" className="section section-experience">
      <SectionHeader
        eyebrow="Experience"
        title="Focus areas"
      />

      <div className="experience-grid">
        {experienceThemes.map((theme) => (
          <article key={theme.title} className="experience-card">
            <span className="experience-period">{theme.period}</span>
            <h3>{theme.title}</h3>
            <p>{theme.summary}</p>
            <ul>
              {theme.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Experience
