"use client"

import ScriptureSelector from "@/components/scripture-selector"

export default function FirstLinkingScriptureForm({ data, onChange, validationErrors, bibleVerses }) {
  const handleChange = (value) => {
    onChange({ firstLinkingScripture: value })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">请选择第一段衔接经文。这段经文将在第一首诗歌之后显示。</p>

      {validationErrors.firstLinkingScripture && (
        <p className="text-sm text-red-500 mb-2">{validationErrors.firstLinkingScripture}</p>
      )}

      <ScriptureSelector
        value={data.firstLinkingScripture}
        onChange={handleChange}
        bibleVerses={bibleVerses}
        allowCustom={true}
      />
    </div>
  )
}
