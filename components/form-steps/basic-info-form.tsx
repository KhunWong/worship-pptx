"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BasicInfoForm({ data, onChange, validationErrors, templates }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title-input">崇拜标题</Label>
        <Input id="title-input" value={data.title} onChange={(e) => handleChange("title", e.target.value)} />
        {validationErrors.title && <p className="text-sm text-red-500">{validationErrors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date-input">崇拜日期</Label>
        <Input id="date-input" type="date" value={data.date} onChange={(e) => handleChange("date", e.target.value)} />
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
    </div>
  )
}
