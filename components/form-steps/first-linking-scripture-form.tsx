"use client"

import ScriptureSelector from "@/components/scripture-selector"
import { Button } from "@/components/ui/button"
import { Plus, Trash } from "lucide-react"

export default function FirstLinkingScriptureForm({ data, onChange, validationErrors, bibleVerses, linkingIndex = 0 }) {
  const handleChange = (value) => {
    // 确保linkingScriptures数组存在并至少有linkingIndex+1个元素
    const linkingScriptures = [...(data.linkingScriptures || [])]
    while (linkingScriptures.length <= linkingIndex) {
      linkingScriptures.push({ content: "" })
    }

    linkingScriptures[linkingIndex].content = value
    onChange({ linkingScriptures })
  }

  const addScripture = () => {
    const linkingScriptures = [...(data.linkingScriptures || [])]
    linkingScriptures.push({ content: "" })
    onChange({ linkingScriptures })
  }

  const removeScripture = (index) => {
    if (!data.linkingScriptures || data.linkingScriptures.length <= 1) return

    const linkingScriptures = [...data.linkingScriptures]
    linkingScriptures.splice(index, 1)
    onChange({ linkingScriptures })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">请选择衔接经文。这段经文将在诗歌之后显示。</p>

      {validationErrors.firstLinkingScripture && (
        <p className="text-sm text-red-500 mb-2">{validationErrors.firstLinkingScripture}</p>
      )}

      {data.linkingScriptures &&
        data.linkingScriptures.map((scripture, index) => (
          <div key={index} className="space-y-2 border rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">衔接经文 {index + 1}</h4>
              {index > 0 && (
                <Button variant="ghost" size="sm" onClick={() => removeScripture(index)}>
                  <Trash className="h-4 w-4 mr-1" /> 删除
                </Button>
              )}
            </div>
            <ScriptureSelector
              value={scripture.content}
              onChange={(value) => {
                const linkingScriptures = [...(data.linkingScriptures || [])]
                linkingScriptures[index].content = value
                onChange({ linkingScriptures })
              }}
              bibleVerses={bibleVerses}
              allowCustom={true}
            />
          </div>
        ))}

      <Button variant="outline" size="sm" onClick={addScripture} className="w-full">
        <Plus className="h-4 w-4 mr-1" /> 添加经文
      </Button>
    </div>
  )
}
