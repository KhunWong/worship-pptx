"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Import these from data files for the preview component to work
import { hymns } from "@/data/hymns"
import { bibleVerses } from "@/data/bible-verses"

export default function PptPreview({ data, initialSlide = 0 }) {
  const [currentSlide, setCurrentSlide] = useState(initialSlide)

  // 当initialSlide变化时更新当前幻灯片
  useEffect(() => {
    setCurrentSlide(initialSlide)
  }, [initialSlide])

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

  // 划分宣告经文的合理分页
  const getProclamationScriptureSlides = () => {
    const slides = []
    const sections = data.proclamationScripture.sections || []

    if (sections.length === 0) return slides

    // 检查经文长度，决定分页策略
    let currentSlide = {
      type: "proclamationScripture",
      content: {
        sections: [],
      },
    }

    let currentLength = 0
    const MAX_CHARS_PER_SLIDE = 200 // 每页最大字符数

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      if (!section.content) continue

      const text = getScriptureText(section.content)
      const sectionLength = text.length

      // 如果是领诵+会众成对的方式
      if (section.type === "leader" && i + 1 < sections.length && sections[i + 1].type === "congregation") {
        const nextText = getScriptureText(sections[i + 1].content)
        const pairLength = text.length + nextText.length

        // 如果当前页面剩余空间不足以容纳一对领诵和会众
        if (currentLength > 0 && currentLength + pairLength > MAX_CHARS_PER_SLIDE) {
          slides.push(currentSlide)
          currentSlide = {
            type: "proclamationScripture",
            content: {
              sections: [],
            },
          }
          currentLength = 0
        }

        // 添加领诵和会众经文
        currentSlide.content.sections.push({
          type: section.type,
          text: text,
        })

        currentSlide.content.sections.push({
          type: sections[i + 1].type,
          text: getScriptureText(sections[i + 1].content),
        })

        currentLength += pairLength
        i++ // 跳过下一个会众经文
      }
      // 处理齐诵经文或单独的领诵/会众经文
      else {
        // 如果当前经文太长或页面空间不足
        if (
          sectionLength > MAX_CHARS_PER_SLIDE ||
          (currentLength > 0 && currentLength + sectionLength > MAX_CHARS_PER_SLIDE)
        ) {
          if (currentLength > 0) {
            // 只有当前页有内容时才添加
            slides.push(currentSlide)
            currentSlide = {
              type: "proclamationScripture",
              content: {
                sections: [],
              },
            }
            currentLength = 0
          }

          // 对于特别长的齐诵经文，可能需要进一步分割
          if (sectionLength > MAX_CHARS_PER_SLIDE) {
            // 简单的文本分割逻辑，可以根据需要优化
            const chunks = []
            let start = 0
            while (start < text.length) {
              const end = Math.min(start + MAX_CHARS_PER_SLIDE, text.length)
              chunks.push(text.substring(start, end))
              start = end
            }

            for (const chunk of chunks) {
              slides.push({
                type: "proclamationScripture",
                content: {
                  sections: [
                    {
                      type: section.type,
                      text: chunk,
                    },
                  ],
                },
              })
            }
          } else {
            currentSlide.content.sections.push({
              type: section.type,
              text: text,
            })
            currentLength = sectionLength
          }
        } else {
          currentSlide.content.sections.push({
            type: section.type,
            text: text,
          })
          currentLength += sectionLength
        }
      }
    }

    // 添加最后一页
    if (currentSlide.content.sections.length > 0) {
      slides.push(currentSlide)
    }

    return slides
  }

  // 处理衔接经文
  const getLinkingScriptureSlides = () => {
    const slides = []

    if (!data.linkingScriptures || data.linkingScriptures.length === 0) return slides

    data.linkingScriptures.forEach((item) => {
      if (!item.content) return

      const scriptureContent = getScriptureContent(item.content)
      if (scriptureContent && scriptureContent.text) {
        slides.push({
          type: "scripture",
          content: {
            reference: scriptureContent.reference,
            text: scriptureContent.text,
          },
        })
      }
    })

    return slides
  }

  // 处理家事报告分页
  const getFamilyReportSlides = () => {
    const slides = []

    if (!data.familyReport || data.familyReport.length === 0) return slides

    const MAX_ITEMS_PER_SLIDE = 5 // 每页最多显示的条目数

    let currentItems = []
    let currentItemCount = 0

    data.familyReport.forEach((item, index) => {
      if (!item.content) return

      if (currentItemCount < MAX_ITEMS_PER_SLIDE) {
        currentItems.push({
          number: index + 1,
          text: item.content,
        })
        currentItemCount++
      } else {
        // 添加当前页并开始新页
        slides.push({
          type: "familyReport",
          content: {
            title: "家事报告",
            items: [...currentItems],
          },
        })

        currentItems = [
          {
            number: index + 1,
            text: item.content,
          },
        ]
        currentItemCount = 1
      }
    })

    // 添加最后一页
    if (currentItems.length > 0) {
      slides.push({
        type: "familyReport",
        content: {
          title: "家事报告",
          items: currentItems,
        },
      })
    }

    return slides
  }

  // Generate slides based on the structured worship format
  const generateSlides = () => {
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

    // 4. 宣告经文 - 使用分页逻辑
    const proclamationSlides = getProclamationScriptureSlides()
    slides.push(...proclamationSlides)

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

    // 6. 衔接经文 - 第一段
    if (data.linkingScriptures && data.linkingScriptures.length > 0 && data.linkingScriptures[0].content) {
      const scriptureContent = getScriptureContent(data.linkingScriptures[0].content)

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

    // 8. 衔接经文 - 第二段
    if (data.linkingScriptures && data.linkingScriptures.length > 1 && data.linkingScriptures[1].content) {
      const scriptureContent = getScriptureContent(data.linkingScriptures[1].content)

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
        subtitle: data.infoSharingSubtitle,
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

    // 13. 家事报告 - 使用分页逻辑
    const familyReportSlides = getFamilyReportSlides()
    slides.push(...familyReportSlides)

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

    return slides
  }

  const slides = generateSlides()

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
      backgroundImage: null,
    }

    // 如果有背景图片，优先使用背景图片
    if (template.backgroundImage) {
      return {
        backgroundImage: `url(${template.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        fontFamily: template.fontFamily,
      }
    }

    // 否则使用背景颜色
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
            <h2 className="text-3xl font-bold mb-3">{slide.content.title}</h2>
            {slide.content.subtitle && <h3 className="text-2xl font-medium mb-3">{slide.content.subtitle}</h3>}
            {slide.content.chapter && <p className="text-xl">{slide.content.chapter}</p>}
          </div>
        )
      case "familyReport":
        return (
          <div className="flex flex-col h-full p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">{slide.content.title}</h2>
            <div className="flex-1">
              {slide.content.items.map((item, index) => (
                <div key={index} className="mb-4 ml-16">
                  <div className="flex">
                    <span className="font-medium mr-3">{item.number}.</span>
                    <p className="text-lg">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 rounded-lg overflow-hidden relative" style={getTemplateStyles()}>
        {/* 添加半透明黑色遮罩，提高文字可读性 */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* 幻灯片内容 */}
        <div className="relative z-10 h-full">
          {slides.length > 0 ? (
            renderSlide(slides[currentSlide])
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>没有可预览的幻灯片。请添加内容。</p>
            </div>
          )}
        </div>
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
