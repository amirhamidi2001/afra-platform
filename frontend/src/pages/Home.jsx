import Hero from "../components/home/Hero"
import About from "../components/home/About"
import Counts from "../components/home/Counts"
import WhyUs from "../components/home/WhyUs"
import Features from "../components/home/Features"
import Courses from "../components/home/Courses"
import Trainers from "../components/home/Trainers"

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <About />
      <Counts />
      <WhyUs />
      <Features />
      <Courses />
      <Trainers />
    </main>
  )
}