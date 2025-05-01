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

  // 1. 标题页
  const titleSlide = pres.addSlide()
  titleSlide.background = { color: template.primaryColor }
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
  preludeSlide.background = { color: template.primaryColor }
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
  proclamationSlide.background = { color: template.primaryColor }
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

  // 修改宣告经文部分的处理逻辑

  // 4. 宣告经文
  if (data.proclamationScripture.sections && data.proclamationScripture.sections.length > 0) {
    const scriptureSlide = pres.addSlide()
    scriptureSlide.background = { color: template.primaryColor }

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

    data.proclamationScripture.sections.forEach((section, index) => {
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

      const scriptureText = getScriptureText(section.content)

      scriptureSlide.addText(scriptureText, {
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

  // 5. 第一首诗歌
  if (data.firstHymn) {
    const hymnContent = getHymnContent(data.firstHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        const hymnSlide = pres.addSlide()
        hymnSlide.background = { color: template.primaryColor }

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

  // 6. 衔接经文
  if (data.firstLinkingScripture) {
    const scriptureContent =
      typeof data.firstLinkingScripture === "string" &&
      data.firstLinkingScripture.length > 0 &&
      !data.firstLinkingScripture.includes("\n")
        ? bibleVerses.find((v) => v.id === data.firstLinkingScripture)
        : { reference: "经文", text: data.firstLinkingScripture }

    if (scriptureContent && scriptureContent.text) {
      const scriptureSlide = pres.addSlide()
      scriptureSlide.background = { color: template.primaryColor }

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
  }

  // 7. 第二首诗歌
  if (data.secondHymn) {
    const hymnContent = getHymnContent(data.secondHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        const hymnSlide = pres.addSlide()
        hymnSlide.background = { color: template.primaryColor }

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

  // 8. 衔接经文
  if (data.secondLinkingScripture) {
    const scriptureContent =
      typeof data.secondLinkingScripture === "string" &&
      data.secondLinkingScripture.length > 0 &&
      !data.secondLinkingScripture.includes("\n")
        ? bibleVerses.find((v) => v.id === data.secondLinkingScripture)
        : { reference: "经文", text: data.secondLinkingScripture }

    if (scriptureContent && scriptureContent.text) {
      const scriptureSlide = pres.addSlide()
      scriptureSlide.background = { color: template.primaryColor }

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
  }

  // 9. 第三首诗歌
  if (data.thirdHymn) {
    const hymnContent = getHymnContent(data.thirdHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        const hymnSlide = pres.addSlide()
        hymnSlide.background = { color: template.primaryColor }

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

  // 10. 使徒信经（固定内容，分两页显示）
  const creedText = data.fixedContent.apostlesCreed
  const creedParts = creedText.split("===PAGE_BREAK===")

  // First page of Apostles' Creed
  const creedSlide1 = pres.addSlide()
  creedSlide1.background = { color: template.primaryColor }

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
  creedSlide2.background = { color: template.primaryColor }

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

  // 11. 信息分享标题页
  const infoSlide = pres.addSlide()
  infoSlide.background = { color: template.primaryColor }

  infoSlide.addText(data.infoSharingTitle, {
    x: "10%",
    y: "40%",
    w: "80%",
    h: "15%",
    fontSize: 44,
    color: "FFFFFF",
    fontFace: template.fontFamily,
    align: "center",
    bold: true,
  })

  if (data.infoSharingChapter) {
    infoSlide.addText(data.infoSharingChapter, {
      x: "10%",
      y: "60%",
      w: "80%",
      h: "10%",
      fontSize: 32,
      color: "FFFFFF",
      fontFace: template.fontFamily,
      align: "center",
    })
  }

  // 12. 回应诗歌
  if (data.responseHymn) {
    const hymnContent = getHymnContent(data.responseHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        const hymnSlide = pres.addSlide()
        hymnSlide.background = { color: template.primaryColor }

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

  // 13. 家事报告
  if (data.familyReport) {
    const familySlide = pres.addSlide()
    familySlide.background = { color: template.primaryColor }

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

    familySlide.addText(data.familyReport, {
      x: "10%",
      y: "25%",
      w: "80%",
      h: "65%",
      fontSize: 24,
      color: "FFFFFF",
      fontFace: template.fontFamily,
      align: "center",
    })
  }

  // 14. 差遣诗歌/经文
  if (data.sendingHymn) {
    const hymnContent = getHymnContent(data.sendingHymn)

    if (hymnContent && hymnContent.lyrics) {
      // Split lyrics into verses and create a slide for each
      const verses = hymnContent.lyrics.split("\n\n")
      verses.forEach((verse, index) => {
        const hymnSlide = pres.addSlide()
        hymnSlide.background = { color: template.primaryColor }

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

  // 15. 主祷文标题页
  const prayerSlide = pres.addSlide()
  prayerSlide.background = { color: template.primaryColor }

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

  // 16. 结束页
  const endSlide = pres.addSlide()
  endSlide.background = { color: template.primaryColor }

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
