import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Hobbies from './components/Hobbies'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

function App() {
  return (
    <div className="site-shell">
      <div className="page-orb page-orb-a" aria-hidden="true" />
      <div className="page-orb page-orb-b" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Hobbies />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App
