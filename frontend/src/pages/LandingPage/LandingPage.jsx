import Analytics from './components/Analytics'
import Features from './components/Features'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import { Briefcase } from 'lucide-react'

function LandingPage() {
  return (
    <div className='min-h-screen'>
      <Header />
      <Hero />
      <Features />
      <Analytics />
      <Footer />
    </div>
  )
}

export default LandingPage
