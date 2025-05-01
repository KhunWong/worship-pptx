"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import ScriptureSelector from "@/components/scripture-selector"
import HymnSelector from "@/components/hymn-selector"
import { Button } from "@/components/ui/button"
import { Plus, Trash, CheckCircle, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function WorshipForm({ data, onChange, hymns, bibleVerses, templates, validationErrors = {} }) {
  const [completedSections, setCompletedSections] = useState({})

  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  const handleNestedChange = (parent, field, value) => {
    onChange({
      [parent]: {
        ...data[parent],
        [field]: value,
      },
    })
  }

  // 添加新的经文部分
  const addScriptureSection = (type) => {
    const newSections = [...data.proclamationScripture.sections, { type, content: "" }]
    handleNestedChange("proclamationScripture", "sections", newSections)
  }

  // 更新经文部分内容
  const updateScriptureSection = (index, content) => {
    const newSections = [...data.proclamationScripture.sections]
    newSections[index] = { ...newSections[index], content }
    handleNestedChange("proclamationScripture", "sections", newSections)
  }

  // 更新经文部分类型
  const updateScriptureSectionType = (index, type) => {
    const newSections = [...data.proclamationScripture.sections]
    newSections[index] = { ...newSections[index], type }
    handleNestedChange("proclamationScripture", "sections", newSections)
  }

  // 删除经文部分
  const removeScriptureSection = (index) => {
    const newSections = [...data.proclamationScripture.sections]
    newSections.splice(index, 1)
    handleNestedChange("proclamationScripture", "sections", newSections)
  }

  // 检查各部分是否已完成
  useEffect(() => {
    const completed = {
      basicInfo: data.title && data.date && data.template,
      proclamationScripture: data.proclamationScripture.sections.some((section) => section.content),
      firstHymn: !!data.firstHymn,
      firstLinkingScripture: !!data.firstLinkingScripture,
      secondHymn: !!data.secondHymn,
      secondLinkingScripture: !!data.secondLinkingScripture,
      thirdHymn: !!data.thirdHymn,
      infoSharing: !!data.infoSharingTitle,
      responseHymn: !!data.responseHymn,
      familyReport: !!data.familyReport,
      sendingHymn: !!data.sendingHymn,
    }
    setCompletedSections(completed)
  }, [data])

  return (
    <div className="space-y-8">
      {/* 1. 标题页 */}
      <Card
        id="title"
        className={cn(
          validationErrors.title || validationErrors.date || validationErrors.template
            ? "border-red-200"
            : completedSections.basicInfo
              ? "border-green-200"
              : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>1. 标题页</CardTitle>
            <CardDescription>输入崇拜服务的基本信息</CardDescription>
          </div>
          {!validationErrors.title &&
            !validationErrors.date &&
            !validationErrors.template &&
            completedSections.basicInfo && <CheckCircle className="h-5 w-5 text-green-500" />}
          {(validationErrors.title || validationErrors.date || validationErrors.template) && (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title-input">崇拜标题</Label>
            <Input id="title-input" value={data.title} onChange={(e) => handleChange("title", e.target.value)} />
            {validationErrors.title && <p className="text-sm text-red-500">{validationErrors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-input">崇拜日期</Label>
            <Input
              id="date-input"
              type="date"
              value={data.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
            {validationErrors.date && <p className="text-sm text-red-500">{validationErrors.date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-select">模板</Label>
            <Select value={data.template} onValueChange={(value) => handleChange("template", value)}>
              <SelectTrigger id="template-select">
                <SelectValue placeholder="选择一个模板" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.template && <p className="text-sm text-red-500">{validationErrors.template}</p>}
          </div>
        </CardContent>
      </Card>

      {/* 4. 宣告经文 */}
      <Card
        id="proclamationScripture"
        className={cn(
          validationErrors.proclamationScripture
            ? "border-red-200"
            : completedSections.proclamationScripture
              ? "border-green-200"
              : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>4. 宣告经文</CardTitle>
            <CardDescription>添加宣告经文内容</CardDescription>
          </div>
          {!validationErrors.proclamationScripture && completedSections.proclamationScripture && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validationErrors.proclamationScripture && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* 5. 第一首诗歌 */}
      <Card
        id="firstHymn"
        className={cn(
          validationErrors.firstHymn ? "border-red-200" : completedSections.firstHymn ? "border-green-200" : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>5. 第一首诗歌</CardTitle>
            <CardDescription>选择第一首诗歌</CardDescription>
          </div>
          {!validationErrors.firstHymn && completedSections.firstHymn && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validationErrors.firstHymn && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardHeader>
        <CardContent>
          {validationErrors.firstHymn && <p className="text-sm text-red-500 mb-2">{validationErrors.firstHymn}</p>}
          <HymnSelector
            value={data.firstHymn}
            onChange={(value) => handleChange("firstHymn", value)}
            hymns={hymns}
            allowCustom={true}
          />
        </CardContent>
      </Card>

      {/* 6. 衔接经文 */}
      <Card
        id="firstLinkingScripture"
        className={cn(
          validationErrors.firstLinkingScripture
            ? "border-red-200"
            : completedSections.firstLinkingScripture
              ? "border-green-200"
              : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>6. 衔接经文</CardTitle>
            <CardDescription>选择第一段衔接经文</CardDescription>
          </div>
          {!validationErrors.firstLinkingScripture && completedSections.firstLinkingScripture && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validationErrors.firstLinkingScripture && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardHeader>
        <CardContent>
          {validationErrors.firstLinkingScripture && (
            <p className="text-sm text-red-500 mb-2">{validationErrors.firstLinkingScripture}</p>
          )}
          <ScriptureSelector
            value={data.firstLinkingScripture}
            onChange={(value) => handleChange("firstLinkingScripture", value)}
            bibleVerses={bibleVerses}
            allowCustom={true}
          />
        </CardContent>
      </Card>

      {/* 7. 第二首诗歌 */}
      <Card
        id="secondHymn"
        className={cn(
          validationErrors.secondHymn ? "border-red-200" : completedSections.secondHymn ? "border-green-200" : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>7. 第二首诗歌</CardTitle>
            <CardDescription>选择第二首诗歌</CardDescription>
          </div>
          {!validationErrors.secondHymn && completedSections.secondHymn && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validationErrors.secondHymn && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardHeader>
        <CardContent>
          {validationErrors.secondHymn && <p className="text-sm text-red-500 mb-2">{validationErrors.secondHymn}</p>}
          <HymnSelector
            value={data.secondHymn}
            onChange={(value) => handleChange("secondHymn", value)}
            hymns={hymns}
            allowCustom={true}
          />
        </CardContent>
      </Card>

      {/* 8. 衔接经文 */}
      <Card
        id="secondLinkingScripture"
        className={cn(
          validationErrors.secondLinkingScripture
            ? "border-red-200"
            : completedSections.secondLinkingScripture
              ? "border-green-200"
              : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>8. 衔接经文</CardTitle>
            <CardDescription>选择第二段衔接经文</CardDescription>
          </div>
          {!validationErrors.secondLinkingScripture && completedSections.secondLinkingScripture && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validationErrors.secondLinkingScripture && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardHeader>
        <CardContent>
          {validationErrors.secondLinkingScripture && (
            <p className="text-sm text-red-500 mb-2">{validationErrors.secondLinkingScripture}</p>
          )}
          <ScriptureSelector
            value={data.secondLinkingScripture}
            onChange={(value) => handleChange("secondLinkingScripture", value)}
            bibleVerses={bibleVerses}
            allowCustom={true}
          />
        </CardContent>
      </Card>

      {/* 9. 第三首诗歌 */}
      <Card
        id="thirdHymn"
        className={cn(
          validationErrors.thirdHymn ? "border-red-200" : completedSections.thirdHymn ? "border-green-200" : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>9. 第三首诗歌</CardTitle>
            <CardDescription>选择第三首诗歌</CardDescription>
          </div>
          {!validationErrors.thirdHymn && completedSections.thirdHymn && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validationErrors.thirdHymn && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardHeader>
        <CardContent>
          {validationErrors.thirdHymn && <p className="text-sm text-red-500 mb-2">{validationErrors.thirdHymn}</p>}
          <HymnSelector
            value={data.thirdHymn}
            onChange={(value) => handleChange("thirdHymn", value)}
            hymns={hymns}
            allowCustom={true}
          />
        </CardContent>
      </Card>

      {/* 11. 信息分享标题页 */}
      <Card
        id="infoSharingTitle"
        className={cn(
          validationErrors.infoSharingTitle
            ? "border-red-200"
            : completedSections.infoSharing
              ? "border-green-200"
              : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>11. 信息分享</CardTitle>
            <CardDescription>输入信息分享的标题和章节</CardDescription>
          </div>
          {!validationErrors.infoSharingTitle && completedSections.infoSharing && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validationErrors.infoSharingTitle && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="info-sharing-title">标题</Label>
            <Input
              id="info-sharing-title"
              value={data.infoSharingTitle}
              onChange={(e) => handleChange("infoSharingTitle", e.target.value)}
            />
            {validationErrors.infoSharingTitle && (
              <p className="text-sm text-red-500">{validationErrors.infoSharingTitle}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="info-sharing-chapter">章节</Label>
            <Input
              id="info-sharing-chapter"
              value={data.infoSharingChapter}
              onChange={(e) => handleChange("infoSharingChapter", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 12. 回应诗歌 */}
      <Card
        id="responseHymn"
        className={cn(
          validationErrors.responseHymn ? "border-red-200" : completedSections.responseHymn ? "border-green-200" : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>12. 回应诗歌</CardTitle>
            <CardDescription>选择回应诗歌</CardDescription>
          </div>
          {!validationErrors.responseHymn && completedSections.responseHymn && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validationErrors.responseHymn && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardHeader>
        <CardContent>
          {validationErrors.responseHymn && (
            <p className="text-sm text-red-500 mb-2">{validationErrors.responseHymn}</p>
          )}
          <HymnSelector
            value={data.responseHymn}
            onChange={(value) => handleChange("responseHymn", value)}
            hymns={hymns}
            allowCustom={true}
          />
        </CardContent>
      </Card>

      {/* 13. 家事报告 */}
      <Card
        id="familyReport"
        className={cn(
          validationErrors.familyReport ? "border-red-200" : completedSections.familyReport ? "border-green-200" : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>13. 家事报告</CardTitle>
            <CardDescription>输入家事报告内容</CardDescription>
          </div>
          {!validationErrors.familyReport && completedSections.familyReport && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validationErrors.familyReport && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {validationErrors.familyReport && <p className="text-sm text-red-500">{validationErrors.familyReport}</p>}
            <Textarea
              value={data.familyReport}
              onChange={(e) => handleChange("familyReport", e.target.value)}
              rows={4}
              placeholder="输入家事报告内容..."
            />
          </div>
        </CardContent>
      </Card>

      {/* 14. 差遣诗歌/经文 */}
      <Card
        id="sendingHymn"
        className={cn(
          validationErrors.sendingHymn ? "border-red-200" : completedSections.sendingHymn ? "border-green-200" : "",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>14. 差遣诗歌/经文</CardTitle>
            <CardDescription>选择差遣诗歌或经文</CardDescription>
          </div>
          {!validationErrors.sendingHymn && completedSections.sendingHymn && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {validationErrors.sendingHymn && <AlertCircle className="h-5 w-5 text-red-500" />}
        </CardHeader>
        <CardContent>
          {validationErrors.sendingHymn && <p className="text-sm text-red-500 mb-2">{validationErrors.sendingHymn}</p>}
          <HymnSelector
            value={data.sendingHymn}
            onChange={(value) => handleChange("sendingHymn", value)}
            hymns={hymns}
            allowCustom={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}
