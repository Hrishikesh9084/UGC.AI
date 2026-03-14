import PricingPage from '../pages/pricingPage'
import { HeroSection } from './hero-section'
import { FeatureSection } from './feature-section'
import { FaqSection } from './faq-section'
import CtaSection from './cta-section'
import { LogoMarquee } from './logo-marquee'
import Creations from './creations'

const Home = () => {
    return (
        <div>
            <HeroSection />
            <LogoMarquee  />
            <FeatureSection />
            <Creations/>
            <PricingPage />
            <FaqSection />
            <CtaSection />
        </div>
    )
}

export default Home
