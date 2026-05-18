import { hero } from '../content/siteContent'

function Hero() {
  return (
    <section id="home" className="hero-section section">
      <div className="hero-copy">
        <h1>{hero.title}</h1>
        <p className="hero-tagline">{hero.tagline}</p>
        <p className="hero-subtitle">{hero.subtitle}</p>

        <div className="hero-actions">
          <a className="button-primary" href="#projects">
            View work
          </a>
          <a className="button-secondary" href="#contact">
            Contact
          </a>
        </div>

        <ul className="signal-list">
          {hero.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Hero
