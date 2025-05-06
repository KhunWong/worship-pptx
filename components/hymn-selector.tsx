"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Edit, Save, X, Copy, GripVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function HymnSelector({ value, onChange, hymns, allowCustom = false }) {
  const [mode, setMode] = useState(value && !hymns.find((h) => h.id === value) ? "custom" : "select")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchMode, setSearchMode] = useState("name") // "name" or "number"
  const [showContent, setShowContent] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [verses, setVerses] = useState([])
  const [draggingIndex, setDraggingIndex] = useState(null)

  // 将整首诗歌拆分为段落
  useEffect(() => {
    if (value) {
      let lyricsContent = value

      // 如果是ID引用，获取诗歌内容
      if (typeof value === "string" && !value.includes("\n")) {
        const hymn = hymns.find((h) => h.id === value)
        if (hymn) {
          lyricsContent = hymn.lyrics
        }
      }

      // 分割歌词为段落
      const versesArray = lyricsContent.split("\n\n").filter((verse) => verse.trim() !== "")
      setVerses(versesArray)
    } else {
      setVerses([])
    }
  }, [value, hymns])

  const handleSelectChange = (selectedId) => {
    onChange(selectedId)
    setMode("select")
    setSearchTerm("") // 清除搜索
    setSearchResults([]) // 清除搜索结果
    setIsEditing(false) // 重置编辑状态
    setShowContent(true) // 自动展开内容
  }

  const handleCustomChange = (customText) => {
    onChange(customText)
  }

  // 开始编辑歌词
  const startEditing = () => {
    const selectedHymn = hymns.find((h) => h.id === value)
    if (selectedHymn) {
      setIsEditing(true)
    }
  }

  // 保存编辑后的歌词
  const saveEditing = () => {
    // 使用当前排序后的verses数组
    const updatedLyrics = verses.join("\n\n")
    handleCustomChange(updatedLyrics)
    setMode("custom")
    setIsEditing(false)
  }

  // 取消编辑
  const cancelEditing = () => {
    setIsEditing(false)
    // 重置为原始歌词
    if (value && typeof value === "string" && !value.includes("\n")) {
      const hymn = hymns.find((h) => h.id === value)
      if (hymn) {
        const originalVerses = hymn.lyrics.split("\n\n").filter((verse) => verse.trim() !== "")
        setVerses(originalVerses)
      }
    }
  }

  // 更新特定段落的内容
  const updateVerse = (index, newContent) => {
    const newVerses = [...verses]
    newVerses[index] = newContent
    setVerses(newVerses)
  }

  // 复制段落文本到剪贴板
  const copyVerseToClipboard = (verse) => {
    navigator.clipboard
      .writeText(verse)
      .then(() => {
        alert("已复制到剪贴板")
      })
      .catch((err) => {
        console.error("复制失败:", err)
      })
  }

  // 拖拽相关函数
  const handleDragStart = (index) => {
    setDraggingIndex(index)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggingIndex === null || draggingIndex === index) return

    // 重新排序
    const newVerses = [...verses]
    const draggedVerse = newVerses[draggingIndex]
    newVerses.splice(draggingIndex, 1)
    newVerses.splice(index, 0, draggedVerse)

    setVerses(newVerses)
    setDraggingIndex(index)
  }

  const handleDragEnd = () => {
    setDraggingIndex(null)
  }

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([])
      return
    }

    let results = []
    if (searchMode === "name") {
      results = hymns.filter(
        (hymn) =>
          hymn.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hymn.lyrics.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    } else {
      // Search by hymn number
      results = hymns.filter((hymn) => hymn.number && hymn.number.toString() === searchTerm)
    }

    setSearchResults(results)
  }, [searchTerm, searchMode, hymns])

  const selectedHymn = value && hymns.find((h) => h.id === value)

  return (
    <div className="space-y-2">
      {allowCustom && (
        <Tabs value={mode} onValueChange={setMode} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger value="select" className="py-2 px-2">
              选择诗歌
            </TabsTrigger>
            <TabsTrigger value="custom" className="py-2 px-2">
              自定义内容
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative flex-1">
                  <Input
                    placeholder={searchMode === "name" ? "搜索诗歌名称..." : "输入诗歌编号..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 h-10"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground h-8 w-8 flex items-center justify-center"
                      onClick={() => {
                        setSearchTerm("")
                        setSearchResults([])
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
                <Tabs value={searchMode} onValueChange={setSearchMode} className="w-full sm:w-auto">
                  <TabsList className="grid w-full grid-cols-2 sm:flex h-10">
                    <TabsTrigger value="name" className="px-2">
                      名称
                    </TabsTrigger>
                    <TabsTrigger value="number" className="px-2">
                      编号
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {searchResults.length > 0 ? (
                <div className="max-h-48 sm:max-h-60 overflow-y-auto border rounded-md">
                  {searchResults.map((hymn) => (
                    <div
                      key={hymn.id}
                      className={`p-3 cursor-pointer hover:bg-muted ${value === hymn.id ? "bg-muted" : ""}`}
                      onClick={() => handleSelectChange(hymn.id)}
                    >
                      <div className="font-medium">
                        {hymn.number ? `#${hymn.number} - ` : ""}
                        {hymn.title}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{hymn.lyrics.split("\n")[0]}</div>
                    </div>
                  ))}
                </div>
              ) : searchTerm.trim() !== "" ? (
                <div className="text-center p-4 text-muted-foreground">未找到匹配的诗歌</div>
              ) : null}

              {selectedHymn && !isEditing && (
                <div className="mt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted p-3 rounded-t-md">
                    <div className="font-medium mb-2 sm:mb-0">
                      {selectedHymn.number ? `#${selectedHymn.number} - ` : ""}
                      {selectedHymn.title}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowContent(!showContent)} className="h-9">
                        {showContent ? (
                          <ChevronUp className="h-4 w-4 mr-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-1" />
                        )}
                        {showContent ? "收起" : "显示全部"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={startEditing} className="h-9">
                        <Edit className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                    </div>
                  </div>

                  {showContent && (
                    <div className="border rounded-b-md p-3">
                      {verses.map((verse, index) => (
                        <Card key={index} className="mb-3 bg-gray-50">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">第 {index + 1} 节</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyVerseToClipboard(verse)}
                                className="h-7"
                              >
                                <Copy className="h-3.5 w-3.5 mr-1" />
                                复制
                              </Button>
                            </div>
                            <p className="text-sm whitespace-pre-line">{verse}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isEditing && (
                <div className="mt-2 border rounded-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted p-3">
                    <div className="font-medium mb-2 sm:mb-0">
                      编辑歌词: {selectedHymn.number ? `#${selectedHymn.number} - ` : ""}
                      {selectedHymn.title}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={saveEditing} className="h-9">
                        <Save className="h-4 w-4 mr-1" />
                        保存
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEditing} className="h-9">
                        <X className="h-4 w-4 mr-1" />
                        取消
                      </Button>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      您可以编辑每一节的内容，或拖动每一节来重新排序。歌名不可修改。
                    </p>

                    {verses.map((verse, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "mb-3 border rounded-md p-3",
                          draggingIndex === index ? "border-primary bg-primary/5" : "",
                        )}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="cursor-move p-1 mr-2 text-gray-500 hover:text-gray-700">
                              <GripVertical className="h-5 w-5" />
                            </span>
                            <span className="font-medium">第 {index + 1} 节</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => copyVerseToClipboard(verse)} className="h-7">
                            <Copy className="h-3.5 w-3.5 mr-1" />
                            复制
                          </Button>
                        </div>
                        <Textarea
                          value={verse}
                          onChange={(e) => updateVerse(index, e.target.value)}
                          rows={4}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <Textarea
              value={mode === "custom" ? value : ""}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="输入自定义内容..."
              rows={8}
            />
            <div className="mt-2 text-xs text-muted-foreground">
              提示: 每个段落之间请用空行分隔，每个段落将作为一页幻灯片显示
            </div>
          </TabsContent>
        </Tabs>
      )}

      {!allowCustom && (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="选择一首诗歌" />
          </SelectTrigger>
          <SelectContent>
            {hymns.map((hymn) => (
              <SelectItem key={hymn.id} value={hymn.id}>
                {hymn.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
