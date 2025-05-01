"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Edit, Save, X } from "lucide-react"

export default function HymnSelector({ value, onChange, hymns, allowCustom = false }) {
  const [mode, setMode] = useState(value && !hymns.find((h) => h.id === value) ? "custom" : "select")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchMode, setSearchMode] = useState("name") // "name" or "number"
  const [showContent, setShowContent] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedLyrics, setEditedLyrics] = useState("")

  const handleSelectChange = (selectedId) => {
    onChange(selectedId)
    setMode("select")
    setSearchTerm("") // 清除搜索
    setSearchResults([]) // 清除搜索结果
    setIsEditing(false) // 重置编辑状态
  }

  const handleCustomChange = (customText) => {
    onChange(customText)
  }

  // 开始编辑歌词
  const startEditing = () => {
    const selectedHymn = hymns.find((h) => h.id === value)
    if (selectedHymn) {
      setEditedLyrics(selectedHymn.lyrics)
      setIsEditing(true)
    }
  }

  // 保存编辑后的歌词
  const saveEditing = () => {
    handleCustomChange(editedLyrics)
    setMode("custom")
    setIsEditing(false)
  }

  // 取消编辑
  const cancelEditing = () => {
    setIsEditing(false)
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">选择诗歌</TabsTrigger>
            <TabsTrigger value="custom">自定义内容</TabsTrigger>
          </TabsList>

          <TabsContent value="select">
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    placeholder={searchMode === "name" ? "搜索诗歌名称..." : "输入诗歌编号..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        setSearchTerm("")
                        setSearchResults([])
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
                <Tabs value={searchMode} onValueChange={setSearchMode} className="w-auto">
                  <TabsList>
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
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {searchResults.map((hymn) => (
                    <div
                      key={hymn.id}
                      className={`p-2 cursor-pointer hover:bg-muted ${value === hymn.id ? "bg-muted" : ""}`}
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
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">
                      {selectedHymn.number ? `#${selectedHymn.number} - ` : ""}
                      {selectedHymn.title}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setShowContent(!showContent)}>
                        {showContent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        {showContent ? "收起" : "显示全部"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={startEditing}>
                        <Edit className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                    </div>
                  </div>
                  {showContent && <div className="text-sm whitespace-pre-line mt-1">{selectedHymn.lyrics}</div>}
                </div>
              )}

              {isEditing && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      编辑歌词: {selectedHymn.number ? `#${selectedHymn.number} - ` : ""}
                      {selectedHymn.title}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={saveEditing}>
                        <Save className="h-4 w-4 mr-1" />
                        保存
                      </Button>
                      <Button variant="ghost" size="sm" onClick={cancelEditing}>
                        <X className="h-4 w-4 mr-1" />
                        取消
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm">
                    <Textarea
                      value={editedLyrics}
                      onChange={(e) => setEditedLyrics(e.target.value)}
                      rows={8}
                      placeholder="编辑歌词内容..."
                      className="w-full"
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      提示: 每个段落之间请用空行分隔，每个段落将作为一页幻灯片显示
                    </div>
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
          <SelectTrigger>
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
