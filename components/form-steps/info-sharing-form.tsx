"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InfoSharingForm({ data, onChange, validationErrors }) {
  const handleChange = (field, value) => {
    onChange({ [field]: value })
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">请输入信息分享的标题和章节。这将显示在使徒信经之后。</p>

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
    </div>
  )
}
