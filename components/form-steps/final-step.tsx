"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Download } from "lucide-react"

export default function FinalStep({ data, onGenerate }) {
  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">所有步骤已完成！</h3>
        <p className="text-muted-foreground">您已成功完成所有崇拜PPT内容的填写。现在可以生成PPT文件了。</p>
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={onGenerate} className="px-8">
          <Download className="mr-2 h-5 w-5" /> 生成PPT文件
        </Button>
      </div>

      <div className="border-t pt-4 mt-6">
        <h4 className="font-medium mb-2">崇拜内容摘要：</h4>
        <ul className="space-y-1 text-sm">
          <li>
            <span className="font-medium">标题：</span>
            {data.title}
          </li>
          <li>
            <span className="font-medium">日期：</span>
            {data.date}
          </li>
          <li>
            <span className="font-medium">第一首诗歌：</span>
            {typeof data.firstHymn === "string" && data.firstHymn.length < 30 ? data.firstHymn : "已设置"}
          </li>
          <li>
            <span className="font-medium">第二首诗歌：</span>
            {typeof data.secondHymn === "string" && data.secondHymn.length < 30 ? data.secondHymn : "已设置"}
          </li>
          <li>
            <span className="font-medium">第三首诗歌：</span>
            {typeof data.thirdHymn === "string" && data.thirdHymn.length < 30 ? data.thirdHymn : "已设置"}
          </li>
          <li>
            <span className="font-medium">信息分享：</span>
            {data.infoSharingTitle}
          </li>
          <li>
            <span className="font-medium">回应诗歌：</span>
            {typeof data.responseHymn === "string" && data.responseHymn.length < 30 ? data.responseHymn : "已设置"}
          </li>
          <li>
            <span className="font-medium">差遣诗歌：</span>
            {typeof data.sendingHymn === "string" && data.sendingHymn.length < 30 ? data.sendingHymn : "已设置"}
          </li>
        </ul>
      </div>
    </div>
  )
}
