"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Lang, Localized, PortfolioData } from "./portfolio-types"
import { sampleData } from "./sample-data"
import { getStoredConfig, loadPortfolio } from "./firebase"

interface Ctx {
  lang: Lang
  setLang: (l: Lang) => void
  toggleLang: () => void
  data: PortfolioData
  /** true while the live Firebase fetch is still running */
  loading: boolean
  /** true if the data shown is the built-in placeholder */
  isSample: boolean
  t: (l: Localized | undefined) => string
}

const PortfolioContext = createContext<Ctx | null>(null)

const LANG_KEY = "portfolio.lang"

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")
  const [data, setData] = useState<PortfolioData>(sampleData)
  const [loading, setLoading] = useState(true)
  const [isSample, setIsSample] = useState(true)

  // restore preferred language
  useEffect(() => {
    const saved = window.localStorage.getItem(LANG_KEY) as Lang | null
    if (saved === "en" || saved === "vn") setLangState(saved)
  }, [])

  // load live data from Firebase if configured
  useEffect(() => {
    let active = true
    const config = getStoredConfig()
    if (!config) {
      setLoading(false)
      return
    }
    loadPortfolio(config)
      .then((live) => {
        if (!active) return
        if (live) {
          setData(live)
          setIsSample(false)
        }
      })
      .catch(() => {})
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    window.localStorage.setItem(LANG_KEY, l)
  }
  const toggleLang = () => setLang(lang === "en" ? "vn" : "en")

  const t = (l: Localized | undefined) => {
    if (!l) return ""
    return (lang === "vn" ? l.vn : l.en) || l.en || l.vn || ""
  }

  return (
    <PortfolioContext.Provider value={{ lang, setLang, toggleLang, data, loading, isSample, t }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider")
  return ctx
}
