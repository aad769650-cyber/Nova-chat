import Hero from "./HeroSections"
import WhyChooseSection from "./WhyChoose"
import FAQSection from "./FAQ"
import AIModelSection from "./AIModelSection"
import FeatureDemo from "./FeatureSection"
import PricingSection from "./Pricing"
export default function Home() {
  return (
    <>
    <Hero></Hero>
    <AIModelSection></AIModelSection>
    <FeatureDemo></FeatureDemo>
    <PricingSection></PricingSection>
    <WhyChooseSection></WhyChooseSection>
    <FAQSection></FAQSection>
    </>
  );
}
