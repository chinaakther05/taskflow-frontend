import DashboardPreview from "@/components/modules/homepage/DashboardPreview";
import FAQ from "@/components/modules/homepage/FAQ";
import Features from "@/components/modules/homepage/Features";
import FinalCTA from "@/components/modules/homepage/FinalCTA";
import Hero from "@/components/modules/homepage/Hero";
import HowItWorks from "@/components/modules/homepage/HowItWorks";
import Pricing from "@/components/modules/homepage/Pricing";
import RoleBasedAccess from "@/components/modules/homepage/RoleBasedAccess";
import Trusted from "@/components/modules/homepage/Trusted";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <Trusted/>
      <Features />
      <HowItWorks />
      <RoleBasedAccess />
      <DashboardPreview />
      <Pricing />
      <FAQ />
      <FinalCTA />
    </div>
  );
}