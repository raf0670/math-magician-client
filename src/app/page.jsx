import Community from "@/components/home/Community";
import FAQ from "@/components/home/FAQ";
import Hero from "@/components/home/Hero";
import Instructor from "@/components/home/Instructor";
import Programs from "@/components/home/Programs";
import ReadyToCrack from "@/components/home/ReadyToCrack";
import Testimonials from "@/components/home/Testimonials";
import ThreeSteps from "@/components/home/ThreeSteps";
import WhatYouGet from "@/components/home/WhatYouGet";

export default function LandingPage() {
  return (
    <div>
      <Hero></Hero>
      <WhatYouGet></WhatYouGet>
      <Instructor></Instructor>
      <ThreeSteps></ThreeSteps>
      <div id="programs-section">
        <Programs></Programs>
      </div>
      {/* <Testimonials></Testimonials> */}
      <Community></Community>
      <FAQ></FAQ>
      <ReadyToCrack></ReadyToCrack>
    </div>
  );
}
