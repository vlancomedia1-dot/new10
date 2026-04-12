import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ServicesSection } from "@/components/services-section"
import { ShowcaseSection } from "@/components/showcase-section"
import { FeaturesSection } from "@/components/features-section"
import { ProjectsSection } from "@/components/projects-section"
import { AboutSection } from "@/components/about-section"
import { TeamSection } from "@/components/team-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <ShowcaseSection />
      <FeaturesSection />
      <ProjectsSection />
      <AboutSection />
      {/* <TeamSection /> */}
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
