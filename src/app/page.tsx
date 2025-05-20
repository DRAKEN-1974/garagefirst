import HeroSection from '@/app/components/HeroSection'
import Navbar from '@/app/components/Navbar'
import ServicesSection from '@/app/components/ServicesSection'
import Footer from '@/app/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <Footer />
    </main>
  )
}