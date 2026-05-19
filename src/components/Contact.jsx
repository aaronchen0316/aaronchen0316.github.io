import SectionHeader from './SectionHeader'
import { contact } from '../content/siteContent'

function Contact() {
  return (
    <section id="contact" className="section section-contact section-compact">
      <SectionHeader
        eyebrow="Contact"
        title="Get in touch"
        description={contact.intro}
      />

      <div className="contact-card">
        <div>
          <span className="contact-label">Email</span>
          <a className="contact-link" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
        </div>

        <div className="contact-actions">
          <a className="button-primary" href={`mailto:${contact.email}`}>
            Email
          </a>
          <a className="button-secondary" href="#home">
            Back to top
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
