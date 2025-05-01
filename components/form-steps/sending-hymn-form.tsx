"use client"

import HymnSelector from "@/components/hymn-selector"

export default function SendingHymnForm({ data, onChange, validationErrors, hymns }) {
  const handleChange = (value) => {
    onChange({ sendingHymn: value })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">请选择差遣诗歌或经文。这将在家事报告之后显示。</p>

      {validationErrors.sendingHymn && <p className="text-sm text-red-500 mb-2">{validationErrors.sendingHymn}</p>}

      <HymnSelector value={data.sendingHymn} onChange={handleChange} hymns={hymns} allowCustom={true} />
    </div>
  )
}
