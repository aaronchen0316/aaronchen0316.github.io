import SectionHeader from './SectionHeader'
function Contact() {
  return (
    <section id="contact" className="section section-contact section-compact">
      <SectionHeader
        eyebrow="Contact"
        title="Get in touch"
      />

      <div className="contact-card">
        <div>
          <span className="contact-label">Email</span>
          <a className="contact-link" href="mailto:aaronchen0316@gmail.com">
            aaronchen0316@gmail.com
          </a>
        </div>

        <div className="contact-actions">
          <a className="button-primary" href="mailto:aaronchen0316@gmail.com">
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
