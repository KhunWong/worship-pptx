"use client"

import HymnSelector from "@/components/hymn-selector"

export default function SecondHymnForm({ data, onChange, validationErrors, hymns }) {
  const handleChange = (value) => {
    onChange({ secondHymn: value })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        请选择崇拜中的第二首诗歌。您可以从列表中选择，也可以添加自定义内容。
      </p>

      {validationErrors.secondHymn && <p className="text-sm text-red-500 mb-2">{validationErrors.secondHymn}</p>}

      <HymnSelector value={data.secondHymn} onChange={handleChange} hymns={hymns} allowCustom={true} />
    </div>
  )
}
