import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Hobbies from './components/Hobbies'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Projects />
      <Hobbies />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
