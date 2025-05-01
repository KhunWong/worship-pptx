"use client"

import HymnSelector from "@/components/hymn-selector"

export default function FirstHymnForm({ data, onChange, validationErrors, hymns }) {
  const handleChange = (value) => {
    onChange({ firstHymn: value })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        请选择崇拜中的第一首诗歌。您可以从列表中选择，也可以添加自定义内容。
      </p>

      {validationErrors.firstHymn && <p className="text-sm text-red-500 mb-2">{validationErrors.firstHymn}</p>}

      <HymnSelector value={data.firstHymn} onChange={handleChange} hymns={hymns} allowCustom={true} />
    </div>
  )
}
