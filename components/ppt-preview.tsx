"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Import these from data files for the preview component to work
import { hymns } from "@/data/hymns"
import { bibleVerses } from "@/data/bible-verses"

export default function PptPreview({ data }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Helper function to get scripture text from ID or use custom text
  const getScriptureText = (scriptureValue) => {
    if (!scriptureValue) return ""

    const verse = bibleVerses.find((v) => v.id === scriptureValue)
    return verse ? verse.text : scriptureValue
  }

  // Helper function to get hymn content from ID or use custom text
  const getHymnContent = (hymnValue) => {
    if (!hymnValue) return null

    const hymn = hymns.find((h) => h.id === hymnValue)
    return hymn || { title: "自定义诗歌", lyrics: hymnValue }
  }

  // Helper function to get scripture content from ID or use custom text
  const getScriptureContent = (scriptureValue) => {
    if (!scriptureValue) return null

    const scripture = bibleVerses.find((s) => s.id === scriptureValue)
    return scripture || { reference: "自定义经文", text: scriptureValue }
  }

  // Generate slides based on the structured worship format
  const slides = []

  // 1. 标题页
  slides.push({
    type: "title",
    content: {
      title: data.title,
      date: data.date,
    },
  })

  // 2. 序乐标题页
  slides.push({
    type: "fixedTitle",
    content: {
      title: "序乐",
    },
  })

  // 3. 宣告标题页
  slides.push({
    type: "fixedTitle",
    content: {
      title: "宣告",
    },
  })

  // 修改宣告经文部分的处理逻辑

  // 4. 宣告经文
  if (data.proclamationScripture.sections && data.proclamationScripture.sections.length > 0) {
    slides.push({
      type: "proclamationScripture",
      content: {
        sections: data.proclamationScripture.sections.map((section) => ({
          type: section.type,
          text: getScriptureText(section.content),
        })),
      },
    })
  }

  // 5. 第一首诗歌
  if (data.firstHymn) {
    const hymnContent = getHymnContent(data.firstHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        slides.push({
          type: "hymn",
          content: {
            title: hymnContent.title,
            verse: verse,
            number: index + 1,
            total: verses.length,
          },
        })
      })
    }
  }

  // 6. 衔接经文
  if (data.firstLinkingScripture) {
    const scriptureContent = getScriptureContent(data.firstLinkingScripture)

    if (scriptureContent && scriptureContent.text) {
      slides.push({
        type: "scripture",
        content: {
          reference: scriptureContent.reference,
          text: scriptureContent.text,
        },
      })
    }
  }

  // 7. 第二首诗歌
  if (data.secondHymn) {
    const hymnContent = getHymnContent(data.secondHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        slides.push({
          type: "hymn",
          content: {
            title: hymnContent.title,
            verse: verse,
            number: index + 1,
            total: verses.length,
          },
        })
      })
    }
  }

  // 8. 衔接经文
  if (data.secondLinkingScripture) {
    const scriptureContent = getScriptureContent(data.secondLinkingScripture)

    if (scriptureContent && scriptureContent.text) {
      slides.push({
        type: "scripture",
        content: {
          reference: scriptureContent.reference,
          text: scriptureContent.text,
        },
      })
    }
  }

  // 9. 第三首诗歌
  if (data.thirdHymn) {
    const hymnContent = getHymnContent(data.thirdHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        slides.push({
          type: "hymn",
          content: {
            title: hymnContent.title,
            verse: verse,
            number: index + 1,
            total: verses.length,
          },
        })
      })
    }
  }

  // 10. 使徒信经（固定内容，分两页显示）
  const creedText = data.fixedContent.apostlesCreed
  const creedParts = creedText.split("===PAGE_BREAK===")

  slides.push({
    type: "faithConfession",
    content: {
      title: "使徒信经",
      text: creedParts[0],
      page: 1,
      totalPages: 2,
    },
  })

  slides.push({
    type: "faithConfession",
    content: {
      title: "使徒信经",
      text: creedParts[1],
      page: 2,
      totalPages: 2,
    },
  })

  // 11. 信息分享标题页
  slides.push({
    type: "infoSharing",
    content: {
      title: data.infoSharingTitle,
      chapter: data.infoSharingChapter,
    },
  })

  // 12. 回应诗歌
  if (data.responseHymn) {
    const hymnContent = getHymnContent(data.responseHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        slides.push({
          type: "hymn",
          content: {
            title: hymnContent.title,
            verse: verse,
            number: index + 1,
            total: verses.length,
          },
        })
      })
    }
  }

  // 13. 家事报告
  if (data.familyReport) {
    slides.push({
      type: "familyReport",
      content: {
        title: "家事报告",
        text: data.familyReport,
      },
    })
  }

  // 14. 差遣诗歌/经文
  if (data.sendingHymn) {
    const hymnContent = getHymnContent(data.sendingHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        slides.push({
          type: "hymn",
          content: {
            title: hymnContent.title,
            verse: verse,
            number: index + 1,
            total: verses.length,
          },
        })
      })
    }
  }

  // 15. 主祷文标题页
  slides.push({
    type: "fixedTitle",
    content: {
      title: "公祷",
    },
  })

  // 16. 结束页
  slides.push({
    type: "fixedTitle",
    content: {
      title: "平安散会",
    },
  })

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // Get template styles
  const getTemplateStyles = () => {
    const template = data.template || {
      primaryColor: "#3b82f6",
      secondaryColor: "#1e3a8a",
      fontFamily: "sans-serif",
    }

    return {
      backgroundColor: template.primaryColor,
      color: "white",
      fontFamily: template.fontFamily,
    }
  }

  const renderSlide = (slide) => {
    switch (slide.type) {
      case "title":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h1 className="text-3xl font-bold mb-4">{slide.content.title}</h1>
            <p className="text-xl">{slide.content.date}</p>
          </div>
        )
      case "fixedTitle":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h1 className="text-5xl font-bold">{slide.content.title}</h1>
          </div>
        )
      case "proclamationScripture":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-semibold mb-6">宣告经文</h2>
            <div className="space-y-6 w-full">
              {slide.content.sections.map((section, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-xl font-medium mb-2">
                    {section.type === "leader" ? "领诵:" : section.type === "congregation" ? "会众:" : "齐诵:"}
                  </h3>
                  <p className="text-lg italic">{section.text}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "scripture":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-semibold mb-6">{slide.content.reference}</h2>
            <p className="text-xl italic">{slide.content.text}</p>
          </div>
        )
      case "hymn":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-semibold mb-2">{slide.content.title}</h2>
            <p className="text-sm mb-6">
              第 {slide.content.number} 节 / 共 {slide.content.total} 节
            </p>
            <p className="text-xl whitespace-pre-line">{slide.content.verse}</p>
          </div>
        )
      case "faithConfession":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-semibold mb-2">{slide.content.title}</h2>
            <p className="text-sm mb-6">
              第 {slide.content.page} 页 / 共 {slide.content.totalPages} 页
            </p>
            <p className="text-xl whitespace-pre-line">{slide.content.text}</p>
          </div>
        )
      case "infoSharing":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-3xl font-bold mb-6">{slide.content.title}</h2>
            {slide.content.chapter && <p className="text-2xl">{slide.content.chapter}</p>}
          </div>
        )
      case "familyReport":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-semibold mb-6">{slide.content.title}</h2>
            <p className="text-xl whitespace-pre-line">{slide.content.text}</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 rounded-lg overflow-hidden relative" style={getTemplateStyles()}>
        {slides.length > 0 ? (
          renderSlide(slides[currentSlide])
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>没有可预览的幻灯片。请添加内容。</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button variant="outline" size="sm" onClick={prevSlide} disabled={currentSlide === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> 上一页
        </Button>

        <span className="text-sm">
          幻灯片 {currentSlide + 1} / {slides.length}
        </span>

        <Button variant="outline" size="sm" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
          下一页 <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
