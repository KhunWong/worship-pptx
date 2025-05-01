"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function ScriptureSelector({ value, onChange, bibleVerses, allowCustom = false }) {
  const [mode, setMode] = useState(() => {
    if (value && !bibleVerses.find((v) => v.id === value)) {
      return "custom"
    }
    return "browse" // 默认为浏览圣经
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [volume, setVolume] = useState("")
  const [chapter, setChapter] = useState("")
  const [verse, setVerse] = useState("")
  const [showContent, setShowContent] = useState(false)

  const handleSelectChange = (selectedId) => {
    onChange(selectedId)
    setMode("select")
    setSearchTerm("") // 清除搜索
    setSearchResults([]) // 清除搜索结果
  }

  const handleCustomChange = (customText) => {
    onChange(customText)
  }

  // Get unique Bible volumes
  const volumes = [...new Set(bibleVerses.map((v) => v.volume))].sort()

  // Get chapters for selected volume
  const chapters = volume
    ? [...new Set(bibleVerses.filter((v) => v.volume === volume).map((v) => v.chapter))].sort((a, b) => a - b)
    : []

  // Get verses for selected volume and chapter
  const verses =
    volume && chapter
      ? bibleVerses
          .filter((v) => v.volume === volume && v.chapter === Number.parseInt(chapter))
          .sort((a, b) => {
            const verseA = Number.parseInt(a.verse.split("-")[0])
            const verseB = Number.parseInt(b.verse.split("-")[0])
            return verseA - verseB
          })
      : []

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([])
      return
    }

    const results = bibleVerses.filter(
      (verse) =>
        verse.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verse.text.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setSearchResults(results)
  }, [searchTerm, bibleVerses])

  const selectedScripture = value && bibleVerses.find((v) => v.id === value)

  return (
    <div className="space-y-2">
      {allowCustom && (
        <Tabs value={mode} onValueChange={setMode} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select">搜索经文</TabsTrigger>
            <TabsTrigger value="browse">浏览圣经</TabsTrigger>
            <TabsTrigger value="custom">自定义内容</TabsTrigger>
          </TabsList>

          <TabsContent value="select">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="搜索经文..."
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

              {searchResults.length > 0 ? (
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  {searchResults.map((verse) => (
                    <div
                      key={verse.id}
                      className={`p-2 cursor-pointer hover:bg-muted ${value === verse.id ? "bg-muted" : ""}`}
                      onClick={() => handleSelectChange(verse.id)}
                    >
                      <div className="font-medium">{verse.reference}</div>
                      <div className="text-sm text-muted-foreground truncate">{verse.text}</div>
                    </div>
                  ))}
                </div>
              ) : searchTerm.trim() !== "" ? (
                <div className="text-center p-4 text-muted-foreground">未找到匹配的经文</div>
              ) : null}

              {selectedScripture && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{selectedScripture.reference}</div>
                    <Button variant="ghost" size="sm" onClick={() => setShowContent(!showContent)}>
                      {showContent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {showContent ? "收起" : "显示全部"}
                    </Button>
                  </div>
                  {showContent && <div className="text-sm mt-1">{selectedScripture.text}</div>}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="browse">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="volume">卷</Label>
                  <Select value={volume} onValueChange={setVolume}>
                    <SelectTrigger id="volume">
                      <SelectValue placeholder="选择卷" />
                    </SelectTrigger>
                    <SelectContent>
                      {volumes.map((vol) => (
                        <SelectItem key={vol} value={vol}>
                          {vol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="chapter">章</Label>
                  <Select value={chapter} onValueChange={setChapter} disabled={!volume}>
                    <SelectTrigger id="chapter">
                      <SelectValue placeholder="选择章" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chap) => (
                        <SelectItem key={chap} value={chap.toString()}>
                          {chap}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="verse">节</Label>
                  <Select
                    value={verse}
                    onValueChange={(v) => {
                      setVerse(v)
                      handleSelectChange(v)
                    }}
                    disabled={!volume || !chapter}
                  >
                    <SelectTrigger id="verse">
                      <SelectValue placeholder="选择节" />
                    </SelectTrigger>
                    <SelectContent>
                      {verses.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.verse}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedScripture && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{selectedScripture.reference}</div>
                    <Button variant="ghost" size="sm" onClick={() => setShowContent(!showContent)}>
                      {showContent ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      {showContent ? "收起" : "显示全部"}
                    </Button>
                  </div>
                  {showContent && <div className="text-sm mt-1">{selectedScripture.text}</div>}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <Textarea
              value={mode === "custom" ? value : ""}
              onChange={(e) => handleCustomChange(e.target.value)}
              placeholder="输入自定义内容..."
              rows={4}
            />
          </TabsContent>
        </Tabs>
      )}

      {!allowCustom && (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="选择一段经文" />
          </SelectTrigger>
          <SelectContent>
            {bibleVerses.map((verse) => (
              <SelectItem key={verse.id} value={verse.id}>
                {verse.reference}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
