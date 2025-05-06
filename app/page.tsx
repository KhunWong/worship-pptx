"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generatePPT } from "@/lib/ppt-generator"
import { hymns } from "@/data/hymns"
import { bibleVerses } from "@/data/bible-verses"
import { templates } from "@/data/templates"
import { fixedContent } from "@/data/fixed-content"
import PptPreview from "@/components/ppt-preview"
import StepNavigator from "@/components/step-navigator"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import BasicInfoForm from "@/components/form-steps/basic-info-form"
import ProclamationScriptureForm from "@/components/form-steps/proclamation-scripture-form"
import FirstHymnForm from "@/components/form-steps/first-hymn-form"
import FirstLinkingScriptureForm from "@/components/form-steps/first-linking-scripture-form"
import SecondHymnForm from "@/components/form-steps/second-hymn-form"
import SecondLinkingScriptureForm from "@/components/form-steps/second-linking-scripture-form"
import ThirdHymnForm from "@/components/form-steps/third-hymn-form"
import InfoSharingForm from "@/components/form-steps/info-sharing-form"
import ResponseHymnForm from "@/components/form-steps/response-hymn-form"
import FamilyReportForm from "@/components/form-steps/family-report-form"
import SendingHymnForm from "@/components/form-steps/sending-hymn-form"
import FinalStep from "@/components/form-steps/final-step"
import { useMobile } from "@/hooks/use-mobile"

export default function Home() {
  const [worshipData, setWorshipData] = useState({
    title: "主日崇拜",
    date: new Date().toISOString().split("T")[0],
    template: "sunday-worship", // 默认使用主日崇拜模板
    proclamationScripture: {
      sections: [
        { type: "leader", content: "" },
        { type: "congregation", content: "" },
      ],
    },
    linkingScriptures: [{ content: "" }], // 修改衔接经文为数组结构
    firstHymn: "",
    secondHymn: "",
    thirdHymn: "",
    infoSharingTitle: "", // 修改为空字符串，默认未完成状态
    infoSharingSubtitle: "", // 添加副标题字段
    infoSharingChapter: "",
    responseHymn: "",
    familyReport: [{ content: "" }], // 修改为数组结构，支持多条目
    sendingHymn: "",
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState({})
  const [completedSteps, setCompletedSteps] = useState({})
  const [previewSlide, setPreviewSlide] = useState(0) // 添加预览幻灯片状态
  const formRef = useRef(null)
  const isMobile = useMobile()

  // 定义所有步骤
  const steps = [
    { id: "basicInfo", title: "基本信息", previewSlideIndex: 0 }, // 添加对应的预览幻灯片索引
    { id: "proclamationScripture", title: "宣告经文", previewSlideIndex: 3 },
    { id: "firstHymn", title: "第一首诗歌", previewSlideIndex: 4 },
    { id: "firstLinkingScripture", title: "衔接经文一", previewSlideIndex: 5 },
    { id: "secondHymn", title: "第二首诗歌", previewSlideIndex: 6 },
    { id: "secondLinkingScripture", title: "衔接经文二", previewSlideIndex: 7 },
    { id: "thirdHymn", title: "第三首诗歌", previewSlideIndex: 8 },
    { id: "infoSharing", title: "信息分享", previewSlideIndex: 10 },
    { id: "responseHymn", title: "回应诗歌", previewSlideIndex: 11 },
    { id: "familyReport", title: "家事报告", previewSlideIndex: 12 },
    { id: "sendingHymn", title: "差遣诗歌", previewSlideIndex: 13 },
    { id: "final", title: "完成", previewSlideIndex: 0 },
  ]

  const handleDataChange = (newData) => {
    const updatedData = {
      ...worshipData,
      ...newData,
    }
    setWorshipData(updatedData)

    // 如果模板发生变化，自动更新标题
    if (newData.template && newData.template !== worshipData.template) {
      const selectedTemplate = templates.find((t) => t.id === newData.template)
      if (selectedTemplate) {
        // 如果是默认的标题或之前的模板对应的标题，则更新
        if (worshipData.title === "主日崇拜" || worshipData.title === "圣餐主日") {
          updatedData.title = selectedTemplate.name
          setWorshipData(updatedData)
        }
      }
    }

    // 立即重新验证表单，清除已解决的错误
    const currentErrors = { ...validationErrors }
    let hasChanges = false

    // 检查基本信息
    if (newData.title && currentErrors.title) {
      delete currentErrors.title
      hasChanges = true
    }
    if (newData.date && currentErrors.date) {
      delete currentErrors.date
      hasChanges = true
    }
    if (newData.template && currentErrors.template) {
      delete currentErrors.template
      hasChanges = true
    }

    // 检查宣告经文
    if (newData.proclamationScripture && currentErrors.proclamationScripture) {
      const sections = newData.proclamationScripture.sections || updatedData.proclamationScripture.sections
      if (sections.some((section) => section.content)) {
        delete currentErrors.proclamationScripture
        hasChanges = true
      }
    }

    // 检查其他字段
    const simpleFields = [
      "firstHymn",
      "linkingScriptures",
      "secondHymn",
      "thirdHymn",
      "infoSharingTitle",
      "responseHymn",
      "familyReport",
      "sendingHymn",
    ]

    simpleFields.forEach((field) => {
      if (newData[field] && currentErrors[field]) {
        delete currentErrors[field]
        hasChanges = true
      }
    })

    // 只有在错误状态有变化时才更新状态
    if (hasChanges) {
      setValidationErrors(currentErrors)
    }

    // 更新已完成步骤
    updateCompletedSteps(updatedData)
  }

  // 更新已完成步骤
  const updateCompletedSteps = (data = worshipData) => {
    const completed = {
      basicInfo: data.title && data.date && data.template,
      proclamationScripture: data.proclamationScripture.sections.some((section) => section.content),
      firstHymn: !!data.firstHymn,
      firstLinkingScripture:
        data.linkingScriptures && data.linkingScriptures.length > 0 && !!data.linkingScriptures[0].content,
      secondHymn: !!data.secondHymn,
      secondLinkingScripture:
        data.linkingScriptures && data.linkingScriptures.length > 1 && !!data.linkingScriptures[1].content,
      thirdHymn: !!data.thirdHymn,
      infoSharing: !!data.infoSharingTitle, // 现在默认为false
      responseHymn: !!data.responseHymn,
      familyReport: data.familyReport && data.familyReport.length > 0 && !!data.familyReport[0].content,
      sendingHymn: !!data.sendingHymn,
      final: true, // 最后一步总是可以访问的
    }
    setCompletedSteps(completed)
  }

  // 初始化时检查已完成步骤
  useEffect(() => {
    updateCompletedSteps()
  }, [])

  // 步骤切换时更新预览的幻灯片
  useEffect(() => {
    // 获取当前步骤对应的预览幻灯片索引
    const currentStepPreviewIndex = steps[currentStep].previewSlideIndex
    setPreviewSlide(currentStepPreviewIndex)
  }, [currentStep])

  const validateCurrentStep = () => {
    const currentStepId = steps[currentStep].id
    const errors = {}

    switch (currentStepId) {
      case "basicInfo":
        if (!worshipData.title) errors.title = "请输入崇拜标题"
        if (!worshipData.date) errors.date = "请选择崇拜日期"
        if (!worshipData.template) errors.template = "请选择模板"
        break
      case "proclamationScripture":
        if (!worshipData.proclamationScripture.sections.some((section) => section.content)) {
          errors.proclamationScripture = "请添加至少一段宣告经文"
        }
        break
      case "firstHymn":
        if (!worshipData.firstHymn) errors.firstHymn = "请选择第一首诗歌"
        break
      case "firstLinkingScripture":
        if (!worshipData.linkingScriptures[0].content) errors.firstLinkingScripture = "请选择第一段衔接经文"
        break
      case "secondHymn":
        if (!worshipData.secondHymn) errors.secondHymn = "请选择第二首诗歌"
        break
      case "secondLinkingScripture":
        if (worshipData.linkingScriptures.length < 2 || !worshipData.linkingScriptures[1].content) {
          errors.secondLinkingScripture = "请选择第二段衔接经文"
        }
        break
      case "thirdHymn":
        if (!worshipData.thirdHymn) errors.thirdHymn = "请选择第三首诗歌"
        break
      case "infoSharing":
        if (!worshipData.infoSharingTitle) errors.infoSharingTitle = "请输入信息分享标题"
        break
      case "responseHymn":
        if (!worshipData.responseHymn) errors.responseHymn = "请选择回应诗歌"
        break
      case "familyReport":
        if (!worshipData.familyReport.some((item) => item.content)) {
          errors.familyReport = "请输入至少一条家事报告内容"
        }
        break
      case "sendingHymn":
        if (!worshipData.sendingHymn) errors.sendingHymn = "请选择差遣诗歌/经文"
        break
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const goToNextStep = () => {
    if (validateCurrentStep()) {
      // 更新当前步骤为已完成
      const updatedCompletedSteps = { ...completedSteps }
      updatedCompletedSteps[steps[currentStep].id] = true
      setCompletedSteps(updatedCompletedSteps)

      // 前进到下一步
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
        // 在移动设备上切换到下一步时自动滚动到顶部
        window.scrollTo(0, 0)
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      // 在移动设备上切换到上一步时自动滚动到顶部
      window.scrollTo(0, 0)
    }
  }

  const goToStep = (stepIndex) => {
    // 只允许跳转到已完成的步骤或当前步骤
    if (stepIndex === currentStep || completedSteps[steps[stepIndex].id]) {
      setCurrentStep(stepIndex)
      // 自动滚动到顶部
      window.scrollTo(0, 0)
    }
  }

  const handleGenerate = () => {
    const data = {
      ...worshipData,
      template: templates.find((t) => t.id === worshipData.template),
      fixedContent: fixedContent,
    }
    generatePPT(data)
  }

  // 渲染当前步骤的表单
  const renderCurrentStepForm = () => {
    const stepId = steps[currentStep].id
    const props = {
      data: worshipData,
      onChange: handleDataChange,
      validationErrors,
      hymns,
      bibleVerses,
      templates,
    }

    switch (stepId) {
      case "basicInfo":
        return <BasicInfoForm {...props} />
      case "proclamationScripture":
        return <ProclamationScriptureForm {...props} />
      case "firstHymn":
        return <FirstHymnForm {...props} />
      case "firstLinkingScripture":
        return <FirstLinkingScriptureForm {...props} linkingIndex={0} />
      case "secondHymn":
        return <SecondHymnForm {...props} />
      case "secondLinkingScripture":
        return <SecondLinkingScriptureForm {...props} linkingIndex={1} />
      case "thirdHymn":
        return <ThirdHymnForm {...props} />
      case "infoSharing":
        return <InfoSharingForm {...props} />
      case "responseHymn":
        return <ResponseHymnForm {...props} />
      case "familyReport":
        return <FamilyReportForm {...props} />
      case "sendingHymn":
        return <SendingHymnForm {...props} />
      case "final":
        return <FinalStep {...props} onGenerate={handleGenerate} />
      default:
        return null
    }
  }

  // 预览数据
  const previewData = {
    ...worshipData,
    template: templates.find((t) => t.id === worshipData.template),
    fixedContent: fixedContent,
  }

  // 移动端布局
  if (isMobile) {
    return (
      <main className="container mx-auto py-4 px-2">
        <h1 className="text-2xl font-bold text-center mb-4">崇拜PPT生成器</h1>

        <div className="flex flex-row">
          {/* 左侧垂直步骤导航 */}
          <div className="w-12 mr-2">
            <StepNavigator
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              onStepClick={goToStep}
              orientation="vertical"
            />
          </div>

          {/* 右侧内容区域 */}
          <div className="flex-1 flex flex-col">
            {/* 上方预览区域 */}
            <div className="mb-4">
              <Card className="w-full">
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-sm">实时预览</CardTitle>
                </CardHeader>
                <CardContent className="p-2 aspect-video">
                  <PptPreview data={previewData} initialSlide={previewSlide} />
                </CardContent>
              </Card>
            </div>

            {/* 下方表单区域 */}
            <div className="flex-1" ref={formRef}>
              <Card>
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-sm">{steps[currentStep].title}</CardTitle>
                  <CardDescription className="text-xs">
                    步骤 {currentStep + 1} / {steps.length}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3">
                  {renderCurrentStepForm()}

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" onClick={goToPreviousStep} disabled={currentStep === 0}>
                      <ChevronLeft className="mr-1 h-4 w-4" /> 上一步
                    </Button>

                    {currentStep < steps.length - 1 ? (
                      <Button size="sm" onClick={goToNextStep}>
                        下一步 <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button size="sm" onClick={handleGenerate}>
                        生成PPT <Download className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // 桌面端布局
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">崇拜PPT生成器</h1>

      <StepNavigator steps={steps} currentStep={currentStep} completedSteps={completedSteps} onStepClick={goToStep} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左侧预览区域 */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>实时预览</CardTitle>
              <CardDescription>您的崇拜演示文稿预览</CardDescription>
            </CardHeader>
            <CardContent className="aspect-video">
              <PptPreview data={previewData} initialSlide={previewSlide} />
            </CardContent>
          </Card>
        </div>

        {/* 右侧表单区域 */}
        <div className="space-y-6" ref={formRef}>
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                步骤 {currentStep + 1} / {steps.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCurrentStepForm()}

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={goToPreviousStep} disabled={currentStep === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> 上一步
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button onClick={goToNextStep}>
                    下一步 <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleGenerate}>
                    生成PPT <Download className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
