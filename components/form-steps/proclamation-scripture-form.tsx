"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ScriptureSelector from "@/components/scripture-selector"
import { Plus, Trash } from "lucide-react"

export default function ProclamationScriptureForm({ data, onChange, validationErrors, bibleVerses }) {
  const handleNestedChange = (field, value) => {
    onChange({
      proclamationScripture: {
        ...data.proclamationScripture,
        [field]: value,
      },
    })
  }

  // 添加新的经文部分
  const addScriptureSection = (type) => {
    const newSections = [...data.proclamationScripture.sections, { type, content: "" }]
    handleNestedChange("sections", newSections)
  }

  // 更新经文部分内容
  const updateScriptureSection = (index, content) => {
    const newSections = [...data.proclamationScripture.sections]
    newSections[index] = { ...newSections[index], content }
    handleNestedChange("sections", newSections)
  }

  // 更新经文部分类型
  const updateScriptureSectionType = (index, type) => {
    const newSections = [...data.proclamationScripture.sections]
    newSections[index] = { ...newSections[index], type }
    handleNestedChange("sections", newSections)
  }

  // 删除经文部分
  const removeScriptureSection = (index) => {
    const newSections = [...data.proclamationScripture.sections]
    newSections.splice(index, 1)
    handleNestedChange("sections", newSections)
  }

  return (
    <div className="space-y-4">
      {validationErrors.proclamationScripture && (
        <p className="text-sm text-red-500">{validationErrors.proclamationScripture}</p>
      )}

      {data.proclamationScripture.sections.map((section, index) => (
        <div key={index} className="space-y-2 p-4 border rounded-md">
          <div className="flex justify-between items-center mb-2">
            <Select value={section.type} onValueChange={(value) => updateScriptureSectionType(index, value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leader">领诵经文</SelectItem>
                <SelectItem value="congregation">会众经文</SelectItem>
                <SelectItem value="unison">齐诵经文</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeScriptureSection(index)}
              disabled={data.proclamationScripture.sections.length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>

          <ScriptureSelector
            value={section.content}
            onChange={(value) => updateScriptureSection(index, value)}
            bibleVerses={bibleVerses}
            allowCustom={true}
          />
        </div>
      ))}

      <div className="flex space-x-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => addScriptureSection("leader")} className="flex-1">
          <Plus className="h-4 w-4 mr-2" /> 添加领诵经文
        </Button>
        <Button variant="outline" size="sm" onClick={() => addScriptureSection("congregation")} className="flex-1">
          <Plus className="h-4 w-4 mr-2" /> 添加会众经文
        </Button>
        <Button variant="outline" size="sm" onClick={() => addScriptureSection("unison")} className="flex-1">
          <Plus className="h-4 w-4 mr-2" /> 添加齐诵经文
        </Button>
      </div>
    </div>
  )
}
