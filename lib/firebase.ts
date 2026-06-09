"use client"

import { initializeApp, getApps, deleteApp, type FirebaseApp } from "firebase/app"
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  type Firestore,
} from "firebase/firestore"
import type { PortfolioData } from "./portfolio-types"

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId: string
}

const CONFIG_KEY = "portfolio.firebaseConfig"
const PASS_KEY = "portfolio.adminUnlocked"

const DATA_DOC = { col: "portfolio", id: "main" }
const SETTINGS_DOC = { col: "portfolio", id: "settings" }

/* ---------- config persistence (localStorage) ---------- */

export function isEnvConfigActive(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  )
}

export function getStoredConfig(): FirebaseConfig | null {
  // Check environment variables first
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID

  if (apiKey && projectId && appId) {
    return {
      apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
      projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || undefined,
      appId,
    }
  }

  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(CONFIG_KEY)
    return raw ? (JSON.parse(raw) as FirebaseConfig) : null
  } catch {
    return null
  }
}

export function storeConfig(config: FirebaseConfig) {
  window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

export function clearConfig() {
  window.localStorage.removeItem(CONFIG_KEY)
}

export function isAdminUnlocked(): boolean {
  if (typeof window === "undefined") return false
  return window.sessionStorage.getItem(PASS_KEY) === "1"
}

export function setAdminUnlocked(v: boolean) {
  if (v) window.sessionStorage.setItem(PASS_KEY, "1")
  else window.sessionStorage.removeItem(PASS_KEY)
}

/**
 * Parse a Firebase config either from a JSON object or from the
 * `const firebaseConfig = { ... }` snippet the Firebase console shows.
 */
export function parseConfigInput(input: string): FirebaseConfig | null {
  const text = input.trim()
  if (!text) return null
  try {
    // Try strict JSON first.
    return normalizeConfig(JSON.parse(text))
  } catch {
    // Fall back to extracting the object literal from a code snippet.
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      // eslint-disable-next-line no-new-func
      const obj = Function(`"use strict";return (${match[0]})`)()
      return normalizeConfig(obj)
    } catch {
      return null
    }
  }
}

function normalizeConfig(obj: Record<string, unknown>): FirebaseConfig | null {
  if (!obj || typeof obj !== "object") return null
  const cfg: FirebaseConfig = {
    apiKey: String(obj.apiKey ?? ""),
    authDomain: String(obj.authDomain ?? ""),
    projectId: String(obj.projectId ?? ""),
    storageBucket: obj.storageBucket ? String(obj.storageBucket) : undefined,
    messagingSenderId: obj.messagingSenderId ? String(obj.messagingSenderId) : undefined,
    appId: String(obj.appId ?? ""),
  }
  if (!cfg.apiKey || !cfg.projectId || !cfg.appId) return null
  return cfg
}

/* ---------- app init ---------- */

const APP_NAME = "portfolio-app"

function getDb(config: FirebaseConfig): Firestore {
  let app: FirebaseApp | undefined = getApps().find((a) => a.name === APP_NAME)
  // Recreate if config changed.
  if (app && (app.options as { projectId?: string }).projectId !== config.projectId) {
    deleteApp(app)
    app = undefined
  }
  if (!app) {
    app = initializeApp(config, APP_NAME)
  }
  return getFirestore(app)
}

/* ---------- data access ---------- */

export async function loadPortfolio(config: FirebaseConfig): Promise<PortfolioData | null> {
  const db = getDb(config)
  const snap = await getDoc(doc(db, DATA_DOC.col, DATA_DOC.id))
  if (!snap.exists()) return null
  return snap.data() as PortfolioData
}

export async function savePortfolio(config: FirebaseConfig, data: PortfolioData): Promise<void> {
  const db = getDb(config)
  await setDoc(doc(db, DATA_DOC.col, DATA_DOC.id), data)
}

/** Returns the stored passcode, or "" if none set yet. */
export async function getPasscode(config: FirebaseConfig): Promise<string> {
  const db = getDb(config)
  const snap = await getDoc(doc(db, SETTINGS_DOC.col, SETTINGS_DOC.id))
  if (!snap.exists()) return ""
  return String((snap.data() as { passcode?: string }).passcode ?? "")
}

export async function setPasscode(config: FirebaseConfig, passcode: string): Promise<void> {
  const db = getDb(config)
  await setDoc(doc(db, SETTINGS_DOC.col, SETTINGS_DOC.id), { passcode }, { merge: true })
}
