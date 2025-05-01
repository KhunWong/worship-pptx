"use client"

import ScriptureSelector from "@/components/scripture-selector"

export default function SecondLinkingScriptureForm({ data, onChange, validationErrors, bibleVerses }) {
  const handleChange = (value) => {
    onChange({ secondLinkingScripture: value })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">请选择第二段衔接经文。这段经文将在第二首诗歌之后显示。</p>

      {validationErrors.secondLinkingScripture && (
        <p className="text-sm text-red-500 mb-2">{validationErrors.secondLinkingScripture}</p>
      )}

      <ScriptureSelector
        value={data.secondLinkingScripture}
        onChange={handleChange}
        bibleVerses={bibleVerses}
        allowCustom={true}
      />
    </div>
  )
}
