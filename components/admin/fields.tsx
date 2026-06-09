"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Localized } from "@/lib/portfolio-types"

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export function LocalizedInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: Localized
  onChange: (v: Localized) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          value={value.en}
          placeholder={`EN · ${placeholder ?? ""}`}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
        />
        <Input
          value={value.vn}
          placeholder={`VN · ${placeholder ?? ""}`}
          onChange={(e) => onChange({ ...value, vn: e.target.value })}
        />
      </div>
    </div>
  )
}

export function LocalizedTextarea({
  label,
  value,
  onChange,
}: {
  label: string
  value: Localized
  onChange: (v: Localized) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        <Textarea
          rows={3}
          value={value.en}
          placeholder="EN"
          onChange={(e) => onChange({ ...value, en: e.target.value })}
        />
        <Textarea
          rows={3}
          value={value.vn}
          placeholder="VN"
          onChange={(e) => onChange({ ...value, vn: e.target.value })}
        />
      </div>
    </div>
  )
}

export function TagsField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">
        {label} <span className="text-muted-foreground/60">{hint ?? "(comma separated)"}</span>
      </Label>
      <Input
        value={value.join(", ")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
      />
    </div>
  )
}
