"use client"

import HymnSelector from "@/components/hymn-selector"

export default function ThirdHymnForm({ data, onChange, validationErrors, hymns }) {
  const handleChange = (value) => {
    onChange({ thirdHymn: value })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        请选择崇拜中的第三首诗歌。您可以从列表中选择，也可以添加自定义内容。
      </p>

      {validationErrors.thirdHymn && <p className="text-sm text-red-500 mb-2">{validationErrors.thirdHymn}</p>}

      <HymnSelector value={data.thirdHymn} onChange={handleChange} hymns={hymns} allowCustom={true} />
    </div>
  )
}
