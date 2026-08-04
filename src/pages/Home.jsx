import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import Listings from "../components/Listings";
import Deals from "../components/Deals";
import Team from "../components/Team";
import AppDownload from "../components/AppDownload";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Listings />
      <Deals />
      <Team />
      <AppDownload />
    </main>
  );
}
