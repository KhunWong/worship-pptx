"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ScriptureSelector from "@/components/scripture-selector"
import { Plus, Trash, ChevronUp, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ProclamationScriptureForm({ data, onChange, validationErrors, bibleVerses }) {
  const [expandedSections, setExpandedSections] = useState({})
  const [sectionCharCount, setSectionCharCount] = useState({})

  const handleNestedChange = (field, value) => {
    onChange({
      proclamationScripture: {
        ...data.proclamationScripture,
        [field]: value,
      },
    })
  }

  // 检查经文长度并计算分页
  useEffect(() => {
    const newCharCount = {}
    data.proclamationScripture.sections.forEach((section, index) => {
      if (section.content) {
        const verse =
          typeof section.content === "string" && !section.content.includes("\n")
            ? bibleVerses.find((v) => v.id === section.content)?.text || section.content
            : section.content

        newCharCount[index] = verse.length
      }
    })
    setSectionCharCount(newCharCount)
  }, [data.proclamationScripture.sections, bibleVerses])

  // 自动收起刚添加完内容的部分
  useEffect(() => {
    const hasContent = (section) => section.content && section.content.trim() !== ""
    const newExpandedState = {}

    data.proclamationScripture.sections.forEach((section, index) => {
      // 如果有内容但之前没有展开过，则设为折叠；保持已有的展开状态
      newExpandedState[index] = expandedSections[index] !== undefined ? expandedSections[index] : !hasContent(section)
    })

    setExpandedSections(newExpandedState)
  }, [data.proclamationScripture.sections.length])

  // 添加新的经文部分
  const addScriptureSection = (type) => {
    const newSections = [...data.proclamationScripture.sections, { type, content: "" }]
    handleNestedChange("sections", newSections)

    // 新增的部分默认展开
    setExpandedSections({
      ...expandedSections,
      [newSections.length - 1]: true,
    })
  }

  // 更新经文部分内容
  const updateScriptureSection = (index, content) => {
    const newSections = [...data.proclamationScripture.sections]
    newSections[index] = { ...newSections[index], content }
    handleNestedChange("sections", newSections)

    // 内容更新后自动收起
    if (content && content.trim() !== "") {
      setTimeout(() => {
        setExpandedSections({
          ...expandedSections,
          [index]: false,
        })
      }, 500)
    }
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

    // 更新展开状态
    const newExpandedSections = { ...expandedSections }
    delete newExpandedSections[index]

    // 重新映射索引
    const remappedExpanded = {}
    Object.keys(newExpandedSections).forEach((key) => {
      const numKey = Number.parseInt(key)
      if (numKey > index) {
        remappedExpanded[numKey - 1] = newExpandedSections[key]
      } else {
        remappedExpanded[numKey] = newExpandedSections[key]
      }
    })

    setExpandedSections(remappedExpanded)
  }

  // 切换展开/折叠状态
  const toggleSection = (index) => {
    setExpandedSections({
      ...expandedSections,
      [index]: !expandedSections[index],
    })
  }

  // 获取经文内容
  const getScriptureContent = (scriptureValue) => {
    if (!scriptureValue) return null

    if (typeof scriptureValue === "string" && !scriptureValue.includes("\n")) {
      const verse = bibleVerses.find((v) => v.id === scriptureValue)
      return verse ? verse : { reference: "自定义经文", text: scriptureValue }
    }

    return { reference: "自定义经文", text: scriptureValue }
  }

  // 检查是否是成对的领诵和会众
  const isPair = (indexA, indexB) => {
    const sectionA = data.proclamationScripture.sections[indexA]
    const sectionB = data.proclamationScripture.sections[indexB]
    return (
      (sectionA?.type === "leader" && sectionB?.type === "congregation") ||
      (sectionA?.type === "congregation" && sectionB?.type === "leader")
    )
  }

  return (
    <div className="space-y-4">
      {validationErrors.proclamationScripture && (
        <p className="text-sm text-red-500">{validationErrors.proclamationScripture}</p>
      )}

      {data.proclamationScripture.sections.map((section, index) => {
        const isExpanded = expandedSections[index]
        const hasContent = section.content && section.content.trim() !== ""
        const scriptureContent = getScriptureContent(section.content)

        return (
          <Card
            key={index}
            className={cn("overflow-hidden", hasContent && !isExpanded ? "bg-green-50 border-green-200" : "")}
          >
            <CardContent className="p-0">
              {/* 折叠状态显示内容摘要 */}
              {hasContent && !isExpanded && (
                <div
                  className="p-3 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection(index)}
                >
                  <div className="flex flex-1">
                    <span className="font-medium mr-2">
                      {section.type === "leader" ? "领诵:" : section.type === "congregation" ? "会众:" : "齐诵:"}
                    </span>
                    <span className="text-sm truncate">{scriptureContent?.text || "未设置内容"}</span>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSection(index)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" /> 编辑
                    </Button>
                  </div>
                </div>
              )}

              {/* 展开状态显示编辑界面 */}
              {isExpanded && (
                <div className="p-3 space-y-3">
                  <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
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

                    <div className="flex items-center">
                      {hasContent && (
                        <Button variant="ghost" size="sm" onClick={() => toggleSection(index)} className="mr-1">
                          <ChevronUp className="h-4 w-4 mr-1" /> 收起
                        </Button>
                      )}
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
                  </div>

                  <ScriptureSelector
                    value={section.content}
                    onChange={(value) => updateScriptureSection(index, value)}
                    bibleVerses={bibleVerses}
                    allowCustom={true}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => addScriptureSection("leader")} className="h-10">
                <Plus className="h-4 w-4 mr-1 sm:mr-2" /> 添加领诵经文
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>领诵经文应当与会众经文配对使用</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => addScriptureSection("congregation")} className="h-10">
                <Plus className="h-4 w-4 mr-1 sm:mr-2" /> 添加会众经文
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>会众经文应当与领诵经文配对使用</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={() => addScriptureSection("unison")} className="h-10">
                <Plus className="h-4 w-4 mr-1 sm:mr-2" /> 添加齐诵经文
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>齐诵经文通常单独使用</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>提示: 领诵和会众经文会以成对的方式显示在幻灯片中。齐诵经文可以单独显示。</p>
        <p>如果经文内容过长，系统会自动分页显示。</p>
      </div>
    </div>
  )
}
