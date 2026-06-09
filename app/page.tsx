"use client"

import { AnimatedBackground } from "@/components/animated-background"
import { LanguageToggle } from "@/components/language-toggle"
import { Hero } from "@/components/hero"
import { Skills } from "@/components/skills"
import { Education } from "@/components/education"
import { Projects } from "@/components/projects"
import { GetInTouch } from "@/components/get-in-touch"

export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      <AnimatedBackground />
      <LanguageToggle />
      <Hero />
      <Skills />
      <Education />
      <Projects />
      <GetInTouch />
    </main>
  )
}
