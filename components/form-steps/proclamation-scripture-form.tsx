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
        <div key={index} className="space-y-2 p-3 sm:p-4 border rounded-md">
          <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-2 gap-2">
            <Select value={section.type} onValueChange={(value) => updateScriptureSectionType(index, value)}>
              <SelectTrigger className="w-full sm:w-[180px] min-h-[40px]">
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
              className="h-9 w-9"
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
        <Button variant="outline" size="sm" onClick={() => addScriptureSection("leader")} className="h-10">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" /> 添加领诵经文
        </Button>
        <Button variant="outline" size="sm" onClick={() => addScriptureSection("congregation")} className="h-10">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" /> 添加会众经文
        </Button>
        <Button variant="outline" size="sm" onClick={() => addScriptureSection("unison")} className="h-10">
          <Plus className="h-4 w-4 mr-1 sm:mr-2" /> 添加齐诵经文
        </Button>
      </div>
    </div>
  )
}
