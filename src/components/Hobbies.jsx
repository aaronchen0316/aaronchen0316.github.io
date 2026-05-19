import SectionHeader from './SectionHeader'
import { hobbies } from '../content/siteContent'

function Hobbies() {
  return (
    <section id="hobbies" className="section section-hobbies">
      <SectionHeader
        eyebrow="Hobbies"
        title="Interests outside work"
        description="A few interests that shape observation, pacing, and time away from research and engineering work."
      />

      <div className="hobby-grid">
        {hobbies.map((hobby) => (
          <article key={hobby.title} className="hobby-card">
            <h3>{hobby.title}</h3>
            <p>{hobby.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Hobbies
