import { useEffect, useState } from 'react'
import { navLinks } from '../content/siteContent'

const SECTION_IDS = navLinks.map((link) => link.href.replace('#', ''))

function Navbar() {
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: [0.2, 0.45, 0.7],
      },
    )

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false)
    window.addEventListener('resize', closeMenu)
    return () => window.removeEventListener('resize', closeMenu)
  }, [])

  return (
    <header className="site-header">
      <div className="nav-frame">
        <a className="brand-mark" href="#home" aria-label="Aaron Chen home">
          <span className="brand-glyph">AC</span>
          <span className="brand-copy">
            <strong>Aaron Chen</strong>
            <small>Research x Engineering</small>
          </span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '')
            const isActive = activeSection === sectionId

            return (
              <a
                key={link.href}
                href={link.href}
                className={isActive ? 'is-active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
