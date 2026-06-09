export type Lang = "en" | "vn"

/** A string that has separate English and Vietnamese values (entered by hand). */
export interface Localized {
  en: string
  vn: string
}

export interface SkillGroup {
  /** Group label, localized (e.g. "Frontend" / "Giao diện"). */
  label: Localized
  items: string[]
}

export interface Certificate {
  id: string
  title: Localized
  issuer: Localized
  date: string
}

export interface Project {
  id: string
  title: Localized
  /** Short one-line description shown on the card. */
  description: Localized
  /** Long detail shown in the pop-out "chat box". */
  detail: Localized
  featured: boolean
  tags: string[]
  github: string
  demo: string
}

export interface Education {
  /** Section heading, localized (e.g. "Education" / "Học vấn"). */
  heading: Localized
  school: Localized
  degree: Localized
  gpa: string
  period: string
}

export interface PortfolioData {
  name: string
  imageUrl: string
  role: Localized
  bio: Localized
  location: Localized
  email: string
  phone: string
  github: string
  linkedin: string
  /** Optional custom "get in touch" blurb. Does not repeat the contact info. */
  getInTouch: Localized
  skills: SkillGroup[]
  education: Education
  certificates: Certificate[]
  projects: Project[]
}
