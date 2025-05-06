"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash, GripVertical } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function FamilyReportForm({ data, onChange, validationErrors }) {
  const [draggingIndex, setDraggingIndex] = useState(null)

  const handleChange = (index, value) => {
    const newReports = [...(data.familyReport || [])]
    newReports[index].content = value
    onChange({ familyReport: newReports })
  }

  const addReport = () => {
    const newReports = [...(data.familyReport || []), { content: "" }]
    onChange({ familyReport: newReports })
  }

  const removeReport = (index) => {
    if (!data.familyReport || data.familyReport.length <= 1) return

    const newReports = [...data.familyReport]
    newReports.splice(index, 1)
    onChange({ familyReport: newReports })
  }

  // 拖拽相关函数
  const handleDragStart = (index) => {
    setDraggingIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggingIndex === null || draggingIndex === index) return

    // 重新排序
    const newReports = [...data.familyReport]
    const draggedReport = newReports[draggingIndex]
    newReports.splice(draggingIndex, 1)
    newReports.splice(index, 0, draggedReport)

    onChange({ familyReport: newReports })
    setDraggingIndex(index)
  }

  const handleDragEnd = () => {
    setDraggingIndex(null)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        请输入家事报告内容。每条家事报告将显示为一项，自动带有序号。您可以通过拖动来调整顺序。
      </p>

      {validationErrors.familyReport && <p className="text-sm text-red-500">{validationErrors.familyReport}</p>}

      {(data.familyReport || []).map((report, index) => (
        <div
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={cn(
            "flex items-start border rounded-md p-3",
            draggingIndex === index ? "border-primary bg-primary/5" : "",
          )}
        >
          <span className="cursor-move p-1 mr-2 text-gray-500 hover:text-gray-700 mt-2">
            <GripVertical className="h-5 w-5" />
          </span>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">事项 {index + 1}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeReport(index)}
                disabled={data.familyReport.length <= 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>

            <Textarea
              value={report.content}
              onChange={(e) => handleChange(index, e.target.value)}
              rows={3}
              placeholder={`输入家事报告内容 #${index + 1}...`}
            />
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={addReport} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> 添加家事报告
      </Button>

      <div className="mt-4 text-sm text-gray-500">
        <p>提示: 家事报告将自动以左对齐方式显示，并使用序号标记。</p>
        <p>如果报告内容过多，系统会自动分页显示。</p>
      </div>
    </div>
  )
}
