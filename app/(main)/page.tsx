import Hero from "./HeroSections"
import WhyChooseSection from "./WhyChoose"
import FAQSection from "./FAQ"
import AIModelSection from "./AIModelSection"
import FeatureDemo from "./FeatureSection"
export default function Home() {
  return (
    <>
    <Hero></Hero>
    <AIModelSection></AIModelSection>
    <FeatureDemo></FeatureDemo>
    <WhyChooseSection></WhyChooseSection>
    <FAQSection></FAQSection>
    </>
  );
}
