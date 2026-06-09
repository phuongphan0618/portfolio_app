"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Database,
  Lock,
  Plus,
  Save,
  Trash2,
  Unplug,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  TextField,
  LocalizedInput,
  LocalizedTextarea,
  TagsField,
} from "@/components/admin/fields"
import {
  type FirebaseConfig,
  getStoredConfig,
  storeConfig,
  clearConfig,
  parseConfigInput,
  loadPortfolio,
  savePortfolio,
  getPasscode,
  setPasscode,
  isAdminUnlocked,
  setAdminUnlocked,
  isEnvConfigActive,
} from "@/lib/firebase"
import { resolveImageUrl } from "@/lib/image-link"
import { sampleData } from "@/lib/sample-data"
import type {
  Certificate,
  Localized,
  PortfolioData,
  Project,
  SkillGroup,
} from "@/lib/portfolio-types"

type Phase = "connect" | "lock" | "edit"
const empty: Localized = { en: "", vn: "" }
const newId = () => Math.random().toString(36).slice(2, 10)

export default function AdminPage() {
  const [config, setConfig] = useState<FirebaseConfig | null>(null)
  const [phase, setPhase] = useState<Phase>("connect")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  // connect
  const [configText, setConfigText] = useState("")
  // lock
  const [passInput, setPassInput] = useState("")
  const [needsNewPass, setNeedsNewPass] = useState(false)
  // edit
  const [draft, setDraft] = useState<PortfolioData>(sampleData)

  useEffect(() => {
    const stored = getStoredConfig()
    if (stored) {
      setConfig(stored)
      setPhase(isAdminUnlocked() ? "edit" : "lock")
    }
  }, [])

  // when entering lock, find out whether a passcode exists yet
  useEffect(() => {
    if (phase !== "lock" || !config) return
    setBusy(true)
    setError("")
    getPasscode(config)
      .then((p) => setNeedsNewPass(p === ""))
      .catch(() => setError("Could not reach Firestore. Check your config and security rules."))
      .finally(() => setBusy(false))
  }, [phase, config])

  // when entering edit, load existing data
  useEffect(() => {
    if (phase !== "edit" || !config) return
    setBusy(true)
    loadPortfolio(config)
      .then((live) => {
        if (live) setDraft(live)
      })
      .catch(() => setError("Could not load data."))
      .finally(() => setBusy(false))
  }, [phase, config])

  /* ---------- handlers ---------- */

  async function handleConnect() {
    setError("")
    const parsed = parseConfigInput(configText)
    if (!parsed) {
      setError("That doesn't look like a valid Firebase config. Paste the firebaseConfig object or JSON.")
      return
    }
    setBusy(true)
    try {
      await getPasscode(parsed) // connectivity check
      storeConfig(parsed)
      setConfig(parsed)
      setPhase("lock")
      setNotice("Connected to Firebase.")
    } catch {
      setError("Connected, but couldn't read Firestore. Make sure Firestore is enabled and rules allow reads.")
      storeConfig(parsed)
      setConfig(parsed)
      setPhase("lock")
    } finally {
      setBusy(false)
    }
  }

  async function handleUnlock() {
    if (!config) return
    setError("")
    setBusy(true)
    try {
      if (needsNewPass) {
        if (passInput.trim().length < 4) {
          setError("Choose a passcode of at least 4 characters.")
          return
        }
        await setPasscode(config, passInput.trim())
        setAdminUnlocked(true)
        setPhase("edit")
      } else {
        const stored = await getPasscode(config)
        if (stored === passInput.trim()) {
          setAdminUnlocked(true)
          setPhase("edit")
        } else {
          setError("Incorrect passcode.")
        }
      }
    } catch {
      setError("Something went wrong reaching Firestore.")
    } finally {
      setBusy(false)
      setPassInput("")
    }
  }

  async function handleSave() {
    if (!config) return
    setError("")
    setNotice("")
    setBusy(true)
    try {
      await savePortfolio(config, draft)
      setNotice("Saved! Your portfolio is updated.")
    } catch {
      setError("Save failed. Check Firestore write rules.")
    } finally {
      setBusy(false)
    }
  }

  function disconnect() {
    clearConfig()
    setAdminUnlocked(false)
    setConfig(null)
    setPhase("connect")
    setConfigText("")
    setNotice("")
  }

  /* ---------- draft mutation helpers ---------- */
  const patch = (p: Partial<PortfolioData>) => setDraft((d) => ({ ...d, ...p }))

  /* ---------- render ---------- */
  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio Admin</h1>
          <p className="text-sm text-muted-foreground">Connect Firebase and manage your content.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> View site
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {notice && (
        <div className="mb-5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          {notice}
        </div>
      )}

      {phase === "connect" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" /> Connect to Firebase
            </CardTitle>
            <CardDescription>
              In the Firebase console open Project settings → Your apps → SDK setup and configuration, then
              paste the <code className="rounded bg-muted px-1 py-0.5">firebaseConfig</code> object below. The
              web API key is safe to expose. Make sure Cloud Firestore is enabled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={10}
              className="font-mono text-xs"
              placeholder={`const firebaseConfig = {\n  apiKey: "...",\n  authDomain: "your-app.firebaseapp.com",\n  projectId: "your-app",\n  appId: "..."\n}`}
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
            />
            <Button onClick={handleConnect} disabled={busy}>
              {busy ? "Connecting…" : "Connect"}
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === "lock" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" /> {needsNewPass ? "Set an admin passcode" : "Enter passcode"}
            </CardTitle>
            <CardDescription>
              {needsNewPass
                ? "No passcode is set yet. Create one — it's stored in your Firestore so only you can edit."
                : "Enter the passcode you set to edit your portfolio."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Passcode</Label>
              <Input
                type="password"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUnlock} disabled={busy}>
                {needsNewPass ? "Set passcode & continue" : "Unlock"}
              </Button>
              {isEnvConfigActive() ? (
                <span className="text-xs text-muted-foreground flex items-center pl-2">
                  Connected via env
                </span>
              ) : (
                <Button variant="ghost" onClick={disconnect} disabled={busy}>
                  <Unplug className="h-4 w-4" /> Disconnect
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "edit" && (
        <div className="space-y-6">
          {/* sticky action bar */}
          <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
            <span className="text-sm text-muted-foreground">
              {busy ? "Working…" : "Editing live data"}
            </span>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/" target="_blank">
                  <ExternalLink className="h-4 w-4" /> Preview
                </Link>
              </Button>
              <Button onClick={handleSave} disabled={busy} size="sm">
                <Save className="h-4 w-4" /> Save
              </Button>
            </div>
          </div>

          {/* Basics */}
          <Card>
            <CardHeader>
              <CardTitle>Basics</CardTitle>
              <CardDescription>Shared details. Leave a field empty to hide it on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TextField label="Name" value={draft.name} onChange={(v) => patch({ name: v })} />
              <div className="space-y-1.5">
                <TextField
                  label="Profile image link"
                  value={draft.imageUrl}
                  placeholder="Paste a Google Drive / Dropbox share link or a direct image URL"
                  onChange={(v) => patch({ imageUrl: v })}
                />
                {resolveImageUrl(draft.imageUrl) && (
                  <div className="flex items-center gap-3 pt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveImageUrl(draft.imageUrl) || "/placeholder.svg"}
                      alt="Preview"
                      crossOrigin="anonymous"
                      className="h-16 w-16 rounded-lg object-cover ring-1 ring-border"
                    />
                    <span className="text-xs text-muted-foreground">Live preview</span>
                  </div>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Email" value={draft.email} onChange={(v) => patch({ email: v })} />
                <TextField label="Phone" value={draft.phone} onChange={(v) => patch({ phone: v })} />
                <TextField label="GitHub URL" value={draft.github} onChange={(v) => patch({ github: v })} />
                <TextField label="LinkedIn URL" value={draft.linkedin} onChange={(v) => patch({ linkedin: v })} />
              </div>
              <Separator />
              <LocalizedInput label="Role / Title" value={draft.role} onChange={(v) => patch({ role: v })} />
              <LocalizedInput label="Location" value={draft.location} onChange={(v) => patch({ location: v })} />
              <LocalizedTextarea label="Bio" value={draft.bio} onChange={(v) => patch({ bio: v })} />
              <LocalizedTextarea
                label="Get in touch message"
                value={draft.getInTouch}
                onChange={(v) => patch({ getInTouch: v })}
              />
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Add as many or as few groups as you like.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {draft.skills.map((g, i) => (
                <div key={i} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Group {i + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => patch({ skills: draft.skills.filter((_, j) => j !== i) })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <LocalizedInput
                    label="Group label"
                    value={g.label}
                    placeholder="e.g. Frontend"
                    onChange={(label) =>
                      patch({ skills: draft.skills.map((s, j) => (j === i ? { ...s, label } : s)) })
                    }
                  />
                  <TagsField
                    label="Items"
                    value={g.items}
                    onChange={(items) =>
                      patch({ skills: draft.skills.map((s, j) => (j === i ? { ...s, items } : s)) })
                    }
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  patch({ skills: [...draft.skills, { label: { ...empty }, items: [] } as SkillGroup] })
                }
              >
                <Plus className="h-4 w-4" /> Add skill group
              </Button>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Leave the school empty to hide this block entirely.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocalizedInput
                label="Section heading"
                value={draft.education.heading}
                placeholder="e.g. Education"
                onChange={(heading) => patch({ education: { ...draft.education, heading } })}
              />
              <LocalizedInput
                label="School"
                value={draft.education.school}
                onChange={(school) => patch({ education: { ...draft.education, school } })}
              />
              <LocalizedInput
                label="Degree"
                value={draft.education.degree}
                onChange={(degree) => patch({ education: { ...draft.education, degree } })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="GPA"
                  value={draft.education.gpa}
                  onChange={(gpa) => patch({ education: { ...draft.education, gpa } })}
                />
                <TextField
                  label="Period"
                  value={draft.education.period}
                  placeholder="2020 — 2024"
                  onChange={(period) => patch({ education: { ...draft.education, period } })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {draft.certificates.map((c, i) => (
                <div key={c.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Certificate {i + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => patch({ certificates: draft.certificates.filter((_, j) => j !== i) })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <LocalizedInput
                    label="Title"
                    value={c.title}
                    onChange={(title) =>
                      patch({ certificates: draft.certificates.map((x, j) => (j === i ? { ...x, title } : x)) })
                    }
                  />
                  <LocalizedInput
                    label="Issuer"
                    value={c.issuer}
                    onChange={(issuer) =>
                      patch({ certificates: draft.certificates.map((x, j) => (j === i ? { ...x, issuer } : x)) })
                    }
                  />
                  <TextField
                    label="Date"
                    value={c.date}
                    placeholder="2023"
                    onChange={(date) =>
                      patch({ certificates: draft.certificates.map((x, j) => (j === i ? { ...x, date } : x)) })
                    }
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  patch({
                    certificates: [
                      ...draft.certificates,
                      { id: newId(), title: { ...empty }, issuer: { ...empty }, date: "" } as Certificate,
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4" /> Add certificate
              </Button>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>The detail text appears in the pop-out chat box on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {draft.projects.map((p, i) => (
                <div key={p.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Project {i + 1}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => patch({ projects: draft.projects.filter((_, j) => j !== i) })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <LocalizedInput
                    label="Title"
                    value={p.title}
                    onChange={(title) =>
                      patch({ projects: draft.projects.map((x, j) => (j === i ? { ...x, title } : x)) })
                    }
                  />
                  <LocalizedTextarea
                    label="Short description"
                    value={p.description}
                    onChange={(description) =>
                      patch({ projects: draft.projects.map((x, j) => (j === i ? { ...x, description } : x)) })
                    }
                  />
                  <LocalizedTextarea
                    label="Detail (chat box)"
                    value={p.detail}
                    onChange={(detail) =>
                      patch({ projects: draft.projects.map((x, j) => (j === i ? { ...x, detail } : x)) })
                    }
                  />
                  <TagsField
                    label="Tags"
                    value={p.tags}
                    onChange={(tags) =>
                      patch({ projects: draft.projects.map((x, j) => (j === i ? { ...x, tags } : x)) })
                    }
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      label="GitHub URL"
                      value={p.github}
                      onChange={(github) =>
                        patch({ projects: draft.projects.map((x, j) => (j === i ? { ...x, github } : x)) })
                      }
                    />
                    <TextField
                      label="Live demo URL"
                      value={p.demo}
                      onChange={(demo) =>
                        patch({ projects: draft.projects.map((x, j) => (j === i ? { ...x, demo } : x)) })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={p.featured}
                      onCheckedChange={(featured) =>
                        patch({ projects: draft.projects.map((x, j) => (j === i ? { ...x, featured } : x)) })
                      }
                      id={`featured-${p.id}`}
                    />
                    <Label htmlFor={`featured-${p.id}`} className="text-sm">
                      Featured
                    </Label>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  patch({
                    projects: [
                      ...draft.projects,
                      {
                        id: newId(),
                        title: { ...empty },
                        description: { ...empty },
                        detail: { ...empty },
                        featured: false,
                        tags: [],
                        github: "",
                        demo: "",
                      } as Project,
                    ],
                  })
                }
              >
                <Plus className="h-4 w-4" /> Add project
              </Button>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3 pb-10">
            {isEnvConfigActive() ? (
              <span className="text-xs text-muted-foreground">
                Firebase is connected via environment variables.
              </span>
            ) : (
              <Button variant="ghost" onClick={disconnect}>
                <Unplug className="h-4 w-4" /> Disconnect Firebase
              </Button>
            )}
            <Button onClick={handleSave} disabled={busy}>
              <Save className="h-4 w-4" /> Save changes
            </Button>
          </div>
        </div>
      )}
      </div>
    </main>
  )
}
