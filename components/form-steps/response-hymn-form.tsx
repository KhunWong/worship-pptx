"use client"

import HymnSelector from "@/components/hymn-selector"

export default function ResponseHymnForm({ data, onChange, validationErrors, hymns }) {
  const handleChange = (value) => {
    onChange({ responseHymn: value })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">请选择回应诗歌。这首诗歌将在信息分享之后显示。</p>

      {validationErrors.responseHymn && <p className="text-sm text-red-500 mb-2">{validationErrors.responseHymn}</p>}

      <HymnSelector value={data.responseHymn} onChange={handleChange} hymns={hymns} allowCustom={true} />
    </div>
  )
}
