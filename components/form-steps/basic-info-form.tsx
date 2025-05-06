"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

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
        <Label>模板</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.slice(0, 2).map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer overflow-hidden ${data.template === template.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleChange("template", template.id)}
            >
              <CardContent className="p-2">
                <div className="aspect-video relative overflow-hidden rounded-sm">
                  <Image
                    src={template.backgroundImage || `/placeholder.svg?height=200&width=400&text=${template.name}`}
                    alt={template.name}
                    width={400}
                    height={225}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <span className="text-white font-medium">{template.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
