import pptxgen from "pptxgenjs"

export const generatePPT = (data) => {
  // Create a new presentation
  const pres = new pptxgen()

  // Set presentation properties
  pres.layout = "LAYOUT_16x9"

  // Get template settings
  const template = data.template || {
    primaryColor: "#3b82f6",
    secondaryColor: "#1e3a8a",
    fontFamily: "Arial",
    backgroundImage: null,
  }

  // Helper function to get scripture text from ID or use custom text
  const getScriptureText = (scriptureValue) => {
    if (!scriptureValue) return ""

    if (typeof scriptureValue === "string" && scriptureValue.length > 0 && !scriptureValue.includes("\n")) {
      const verse = bibleVerses.find((v) => v.id === scriptureValue)
      return verse ? verse.text : scriptureValue
    }

    return scriptureValue
  }

  // Helper function to get hymn content from ID or use custom text
  const getHymnContent = (hymnValue) => {
    if (!hymnValue) return null

    if (typeof hymnValue === "string" && hymnValue.length > 0 && !hymnValue.includes("\n")) {
      const hymn = hymns.find((h) => h.id === hymnValue)
      return hymn || { title: "自定义诗歌", lyrics: hymnValue }
    }

    return { title: "自定义诗歌", lyrics: hymnValue }
  }

  // 创建幻灯片背景设置
  const getSlideBackground = () => {
    if (template.backgroundImage) {
      return { path: template.backgroundImage }
    }
    return { color: template.primaryColor }
  }

  // 添加半透明黑色遮罩（如果使用背景图片）
  const addOverlay = (slide) => {
    if (template.backgroundImage) {
      slide.addShape(pres.ShapeType.RECTANGLE, {
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
        fill: { color: "000000", transparency: 40 },
      })
    }
  }

  // 1. 标题页
  const titleSlide = pres.addSlide()
  titleSlide.background = getSlideBackground()
  addOverlay(titleSlide)

  titleSlide.addText(data.title, {
    x: "10%",
    y: "40%",
    w: "80%",
    h: "20%",
    fontSize: 44,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
    bold: true,
  })

  titleSlide.addText(data.date, {
    x: "10%",
    y: "60%",
    w: "80%",
    h: "10%",
    fontSize: 24,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
  })

  // 2. 序乐标题页
  const preludeSlide = pres.addSlide()
  preludeSlide.background = getSlideBackground()
  addOverlay(preludeSlide)

  preludeSlide.addText("序乐", {
    x: "10%",
    y: "40%",
    w: "80%",
    h: "20%",
    fontSize: 60,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
    bold: true,
  })

  // 3. 宣告标题页
  const proclamationSlide = pres.addSlide()
  proclamationSlide.background = getSlideBackground()
  addOverlay(proclamationSlide)

  proclamationSlide.addText("宣告", {
    x: "10%",
    y: "40%",
    w: "80%",
    h: "20%",
    fontSize: 60,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
    bold: true,
  })

  // 4. 宣告经文 - 使用智能分页
  if (data.proclamationScripture.sections && data.proclamationScripture.sections.length > 0) {
    // 经文分页的辅助函数
    const createProclamationSlides = () => {
      const MAX_CHARS_PER_SLIDE = 200 // 每页最大字符数
      const sections = data.proclamationScripture.sections.filter((s) => s.content)

      if (sections.length === 0) return

      let currentSections = []
      let currentLength = 0

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const text = getScriptureText(section.content)
        const sectionLength = text ? text.length : 0

        // 领诵和会众成对处理
        if (section.type === "leader" && i + 1 < sections.length && sections[i + 1].type === "congregation") {
          const nextText = getScriptureText(sections[i + 1].content)
          const pairLength = sectionLength + (nextText ? nextText.length : 0)

          // 如果当前页面剩余空间不足以容纳一对领诵和会众
          if (currentLength > 0 && currentLength + pairLength > MAX_CHARS_PER_SLIDE) {
            // 创建当前页并开始新页
            createScriptureSlide(currentSections)
            currentSections = []
            currentLength = 0
          }

          // 添加领诵和会众经文
          currentSections.push({
            type: section.type,
            text: text,
          })

          currentSections.push({
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
              createScriptureSlide(currentSections)
              currentSections = []
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
                const tempSections = [
                  {
                    type: section.type,
                    text: chunk,
                  },
                ]
                createScriptureSlide(tempSections)
              }
            } else {
              currentSections.push({
                type: section.type,
                text: text,
              })
              currentLength = sectionLength
            }
          } else {
            currentSections.push({
              type: section.type,
              text: text,
            })
            currentLength += sectionLength
          }
        }
      }

      // 处理最后一页
      if (currentSections.length > 0) {
        createScriptureSlide(currentSections)
      }
    }

    // 创建经文幻灯片
    const createScriptureSlide = (sections) => {
      const scriptureSlide = pres.addSlide()
      scriptureSlide.background = getSlideBackground()
      addOverlay(scriptureSlide)

      scriptureSlide.addText("宣告经文", {
        x: "10%",
        y: "10%",
        w: "80%",
        h: "10%",
        fontSize: 32,
        color: "FFFFFF",
        fontFace: template.fontFamily,
        align: "center",
        bold: true,
      })

      let yPos = 25

      sections.forEach((section) => {
        const label = section.type === "leader" ? "领诵:" : section.type === "congregation" ? "会众:" : "齐诵:"

        scriptureSlide.addText(label, {
          x: "10%",
          y: `${yPos}%`,
          w: "80%",
          h: "5%",
          fontSize: 24,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
          bold: true,
        })

        scriptureSlide.addText(section.text, {
          x: "10%",
          y: `${yPos + 6}%`,
          w: "80%",
          h: "10%",
          fontSize: 20,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
          italic: true,
        })

        yPos += 20 // 为下一个部分增加垂直空间
      })
    }

    // 执行经文分页创建
    createProclamationSlides()
  }

  // 5. 第一首诗歌
  if (data.firstHymn) {
    const hymnContent = getHymnContent(data.firstHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        const hymnSlide = pres.addSlide()
        hymnSlide.background = getSlideBackground()
        addOverlay(hymnSlide)

        hymnSlide.addText(hymnContent.title, {
          x: "10%",
          y: "10%",
          w: "80%",
          h: "10%",
          fontSize: 32,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
          bold: true,
        })

        hymnSlide.addText(`第 ${index + 1} 节 / 共 ${verses.length} 节`, {
          x: "10%",
          y: "20%",
          w: "80%",
          h: "5%",
          fontSize: 16,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
        })

        hymnSlide.addText(verse, {
          x: "10%",
          y: "30%",
          w: "80%",
          h: "60%",
          fontSize: 24,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
        })
      })
    }
  }

  // 6. 衔接经文 - 支持多个经文
  if (data.linkingScriptures && data.linkingScriptures.length > 0) {
    data.linkingScriptures.forEach((item) => {
      if (!item.content) return

      const scriptureContent =
        typeof item.content === "string" && !item.content.includes("\n")
          ? bibleVerses.find((v) => v.id === item.content)
          : { reference: "经文", text: item.content }

      if (scriptureContent && scriptureContent.text) {
        const scriptureSlide = pres.addSlide()
        scriptureSlide.background = getSlideBackground()
        addOverlay(scriptureSlide)

        scriptureSlide.addText(scriptureContent.reference, {
          x: "10%",
          y: "30%",
          w: "80%",
          h: "10%",
          fontSize: 32,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
          bold: true,
        })

        scriptureSlide.addText(scriptureContent.text, {
          x: "10%",
          y: "45%",
          w: "80%",
          h: "30%",
          fontSize: 24,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
          italic: true,
        })
      }
    })
  }

  // 7. 第二首诗歌
  if (data.secondHymn) {
    const hymnContent = getHymnContent(data.secondHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        const hymnSlide = pres.addSlide()
        hymnSlide.background = getSlideBackground()
        addOverlay(hymnSlide)

        hymnSlide.addText(hymnContent.title, {
          x: "10%",
          y: "10%",
          w: "80%",
          h: "10%",
          fontSize: 32,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
          bold: true,
        })

        hymnSlide.addText(`第 ${index + 1} 节 / 共 ${verses.length} 节`, {
          x: "10%",
          y: "20%",
          w: "80%",
          h: "5%",
          fontSize: 16,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
        })

        hymnSlide.addText(verse, {
          x: "10%",
          y: "30%",
          w: "80%",
          h: "60%",
          fontSize: 24,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
        })
      })
    }
  }

  // 8. 第三首诗歌
  if (data.thirdHymn) {
    const hymnContent = getHymnContent(data.thirdHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        const hymnSlide = pres.addSlide()
        hymnSlide.background = getSlideBackground()
        addOverlay(hymnSlide)

        hymnSlide.addText(hymnContent.title, {
          x: "10%",
          y: "10%",
          w: "80%",
          h: "10%",
          fontSize: 32,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
          bold: true,
        })

        hymnSlide.addText(`第 ${index + 1} 节 / 共 ${verses.length} 节`, {
          x: "10%",
          y: "20%",
          w: "80%",
          h: "5%",
          fontSize: 16,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
        })

        hymnSlide.addText(verse, {
          x: "10%",
          y: "30%",
          w: "80%",
          h: "60%",
          fontSize: 24,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
        })
      })
    }
  }

  // 9. 使徒信经（固定内容，分两页显示）
  const creedText = data.fixedContent.apostlesCreed
  const creedParts = creedText.split("===PAGE_BREAK===")

  // First page of Apostles' Creed
  const creedSlide1 = pres.addSlide()
  creedSlide1.background = getSlideBackground()
  addOverlay(creedSlide1)

  creedSlide1.addText("使徒信经", {
    x: "10%",
    y: "10%",
    w: "80%",
    h: "10%",
    fontSize: 32,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
    bold: true,
  })

  creedSlide1.addText("第 1 页 / 共 2 页", {
    x: "10%",
    y: "20%",
    w: "80%",
    h: "5%",
    fontSize: 16,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
  })

  creedSlide1.addText(creedParts[0], {
    x: "10%",
    y: "30%",
    w: "80%",
    h: "60%",
    fontSize: 24,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
  })

  // Second page of Apostles' Creed
  const creedSlide2 = pres.addSlide()
  creedSlide2.background = getSlideBackground()
  addOverlay(creedSlide2)

  creedSlide2.addText("使徒信经", {
    x: "10%",
    y: "10%",
    w: "80%",
    h: "10%",
    fontSize: 32,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
    bold: true,
  })

  creedSlide2.addText("第 2 页 / 共 2 页", {
    x: "10%",
    y: "20%",
    w: "80%",
    h: "5%",
    fontSize: 16,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
  })

  creedSlide2.addText(creedParts[1], {
    x: "10%",
    y: "30%",
    w: "80%",
    h: "60%",
    fontSize: 24,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
  })

  // 10. 信息分享标题页 - 添加副标题支持
  const infoSlide = pres.addSlide()
  infoSlide.background = getSlideBackground()
  addOverlay(infoSlide)

  infoSlide.addText(data.infoSharingTitle, {
    x: "10%",
    y: "35%",
    w: "80%",
    h: "15%",
    fontSize: 44,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
    bold: true,
  })

  if (data.infoSharingSubtitle) {
    infoSlide.addText(data.infoSharingSubtitle, {
      x: "10%",
      y: "50%",
      w: "80%",
      h: "10%",
      fontSize: 36,
      color: "FFFFFF",
      fontFace: template.fontFamily,
      align: "center",
    })
  }

  if (data.infoSharingChapter) {
    const yPos = data.infoSharingSubtitle ? 62 : 55
    infoSlide.addText(data.infoSharingChapter, {
      x: "10%",
      y: `${yPos}%`,
      w: "80%",
      h: "10%",
      fontSize: 32,
      color: "FFFFFF",
      fontFace: template.fontFamily,
      align: "center",
    })
  }

  // 11. 回应诗歌
  if (data.responseHymn) {
    const hymnContent = getHymnContent(data.responseHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        const hymnSlide = pres.addSlide()
        hymnSlide.background = getSlideBackground()
        addOverlay(hymnSlide)

        hymnSlide.addText(hymnContent.title, {
          x: "10%",
          y: "10%",
          w: "80%",
          h: "10%",
          fontSize: 32,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
          bold: true,
        })

        hymnSlide.addText(`第 ${index + 1} 节 / 共 ${verses.length} 节`, {
          x: "10%",
          y: "20%",
          w: "80%",
          h: "5%",
          fontSize: 16,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
        })

        hymnSlide.addText(verse, {
          x: "10%",
          y: "30%",
          w: "80%",
          h: "60%",
          fontSize: 24,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
        })
      })
    }
  }

  // 12. 家事报告 - 支持分页和序号列表
  if (data.familyReport && data.familyReport.length > 0) {
    const MAX_ITEMS_PER_SLIDE = 5 // 每页最多显示的条目数
    const validReports = data.familyReport.filter((item) => item.content)

    if (validReports.length > 0) {
      // 分批处理家事报告
      for (let i = 0; i < validReports.length; i += MAX_ITEMS_PER_SLIDE) {
        const batchReports = validReports.slice(i, i + MAX_ITEMS_PER_SLIDE)

        const familySlide = pres.addSlide()
        familySlide.background = getSlideBackground()
        addOverlay(familySlide)

        familySlide.addText("家事报告", {
          x: "10%",
          y: "10%",
          w: "80%",
          h: "10%",
          fontSize: 36,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
          bold: true,
        })

        // 左对齐显示每个条目
        let yPos = 25
        batchReports.forEach((report, index) => {
          // 添加序号
          familySlide.addText(`${i + index + 1}.`, {
            x: "16%",
            y: `${yPos}%`,
            w: "5%",
            h: "5%",
            fontSize: 24,
            color: "FFFFFF",
            fontFace: template.fontFamily,
            align: "left",
            bold: true,
          })

          // 添加内容
          familySlide.addText(report.content, {
            x: "22%",
            y: `${yPos}%`,
            w: "68%",
            h: "10%",
            fontSize: 24,
            color: "FFFFFF",
            fontFace: template.fontFamily,
            align: "left",
          })

          yPos += 10 // 为下一个条目增加垂直空间
        })

        // 添加页码（如果有多页）
        if (validReports.length > MAX_ITEMS_PER_SLIDE) {
          const pageNumber = Math.floor(i / MAX_ITEMS_PER_SLIDE) + 1
          const totalPages = Math.ceil(validReports.length / MAX_ITEMS_PER_SLIDE)

          familySlide.addText(`第 ${pageNumber} 页 / 共 ${totalPages} 页`, {
            x: "10%",
            y: "90%",
            w: "80%",
            h: "5%",
            fontSize: 16,
            color: "FFFFFF",
            fontFace: template.fontFamily,
            align: "center",
          })
        }
      }
    }
  }

  // 13. 差遣诗歌/经文
  if (data.sendingHymn) {
    const hymnContent = getHymnContent(data.sendingHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        const hymnSlide = pres.addSlide()
        hymnSlide.background = getSlideBackground()
        addOverlay(hymnSlide)

        hymnSlide.addText(hymnContent.title, {
          x: "10%",
          y: "10%",
          w: "80%",
          h: "10%",
          fontSize: 32,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
          bold: true,
        })

        hymnSlide.addText(`第 ${index + 1} 节 / 共 ${verses.length} 节`, {
          x: "10%",
          y: "20%",
          w: "80%",
          h: "5%",
          fontSize: 16,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
        })

        hymnSlide.addText(verse, {
          x: "10%",
          y: "30%",
          w: "80%",
          h: "60%",
          fontSize: 24,
          color: "FFFFFF",
          fontFace: template.fontFamily,
          align: "center",
        })
      })
    }
  }

  // 14. 主祷文标题页
  const prayerSlide = pres.addSlide()
  prayerSlide.background = getSlideBackground()
  addOverlay(prayerSlide)

  prayerSlide.addText("公祷", {
    x: "10%",
    y: "40%",
    w: "80%",
    h: "20%",
    fontSize: 60,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
    bold: true,
  })

  // 15. 结束页
  const endSlide = pres.addSlide()
  endSlide.background = getSlideBackground()
  addOverlay(endSlide)

  endSlide.addText("平安散会", {
    x: "10%",
    y: "40%",
    w: "80%",
    h: "20%",
    fontSize: 60,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
    bold: true,
  })

  // Save the presentation
  pres.writeFile({ fileName: `${data.title.replace(/\s+/g, "-")}-${data.date}.pptx` })
}

// Import these from data files for the generator to work
import { hymns } from "@/data/hymns"
import { bibleVerses } from "@/data/bible-verses"
