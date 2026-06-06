import Hero from "@/components/home/Hero";
import Instructor from "@/components/home/Instructor";
import Programs from "@/components/home/Programs";
import ThreeSteps from "@/components/home/ThreeSteps";
import WhatYouGet from "@/components/home/WhatYouGet";

export default function LandingPage() {
  return (
    <div>
      <Hero></Hero>
      <WhatYouGet></WhatYouGet>
      <Instructor></Instructor>
      <ThreeSteps></ThreeSteps>
      <Programs></Programs>
    </div>
  );
}
