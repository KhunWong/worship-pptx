"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function FamilyReportForm({ data, onChange, validationErrors }) {
  const handleChange = (value) => {
    onChange({ familyReport: value })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">请输入家事报告内容。这将在回应诗歌之后显示。</p>

      <div className="space-y-2">
        <Label htmlFor="family-report">家事报告内容</Label>
        {validationErrors.familyReport && <p className="text-sm text-red-500">{validationErrors.familyReport}</p>}
        <Textarea
          id="family-report"
          value={data.familyReport}
          onChange={(e) => handleChange(e.target.value)}
          rows={6}
          placeholder="输入家事报告内容..."
        />
      </div>
    </div>
  )
}
