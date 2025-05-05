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
import { ChevronLeft, ChevronRight, Download, ChevronUp, ChevronDown } from "lucide-react"
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

export default function Home() {
  const [worshipData, setWorshipData] = useState({
    title: "主日崇拜",
    date: new Date().toISOString().split("T")[0],
    template: "default",
    proclamationScripture: {
      sections: [
        { type: "leader", content: "" },
        { type: "congregation", content: "" },
      ],
    },
    firstHymn: "",
    firstLinkingScripture: "",
    secondHymn: "",
    secondLinkingScripture: "",
    thirdHymn: "",
    infoSharingTitle: "信息分享",
    infoSharingChapter: "",
    responseHymn: "",
    familyReport: "",
    sendingHymn: "",
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [validationErrors, setValidationErrors] = useState({})
  const [completedSteps, setCompletedSteps] = useState({})
  const [showPreview, setShowPreview] = useState(true)
  const formRef = useRef(null)

  // 定义所有步骤
  const steps = [
    { id: "basicInfo", title: "基本信息" },
    { id: "proclamationScripture", title: "宣告经文" },
    { id: "firstHymn", title: "第一首诗歌" },
    { id: "firstLinkingScripture", title: "衔接经文一" },
    { id: "secondHymn", title: "第二首诗歌" },
    { id: "secondLinkingScripture", title: "衔接经文二" },
    { id: "thirdHymn", title: "第三首诗歌" },
    { id: "infoSharing", title: "信息分享" },
    { id: "responseHymn", title: "回应诗歌" },
    { id: "familyReport", title: "家事报告" },
    { id: "sendingHymn", title: "差遣诗歌" },
    { id: "final", title: "完成" },
  ]

  const handleDataChange = (newData) => {
    const updatedData = {
      ...worshipData,
      ...newData,
    }
    setWorshipData(updatedData)

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
      "firstLinkingScripture",
      "secondHymn",
      "secondLinkingScripture",
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
      firstLinkingScripture: !!data.firstLinkingScripture,
      secondHymn: !!data.secondHymn,
      secondLinkingScripture: !!data.secondLinkingScripture,
      thirdHymn: !!data.thirdHymn,
      infoSharing: !!data.infoSharingTitle,
      responseHymn: !!data.responseHymn,
      familyReport: !!data.familyReport,
      sendingHymn: !!data.sendingHymn,
      final: true, // 最后一步总是可以访问的
    }
    setCompletedSteps(completed)
  }

  // 初始化时检查已完成步骤
  useEffect(() => {
    updateCompletedSteps()
  }, [])

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
        if (!worshipData.firstLinkingScripture) errors.firstLinkingScripture = "请选择第一段衔接经文"
        break
      case "secondHymn":
        if (!worshipData.secondHymn) errors.secondHymn = "请选择第二首诗歌"
        break
      case "secondLinkingScripture":
        if (!worshipData.secondLinkingScripture) errors.secondLinkingScripture = "请选择第二段衔接经文"
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
        if (!worshipData.familyReport) errors.familyReport = "请输入家事报告内容"
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

  // 切换预览的显示/隐藏
  const togglePreview = () => {
    setShowPreview(!showPreview)
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
        return <FirstLinkingScriptureForm {...props} />
      case "secondHymn":
        return <SecondHymnForm {...props} />
      case "secondLinkingScripture":
        return <SecondLinkingScriptureForm {...props} />
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

  return (
    <main className="container mx-auto py-4 px-2 sm:py-8 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">崇拜PPT生成器</h1>

      <StepNavigator steps={steps} currentStep={currentStep} completedSteps={completedSteps} onStepClick={goToStep} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <div className="space-y-4 sm:space-y-6" ref={formRef}>
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>
                步骤 {currentStep + 1} / {steps.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderCurrentStepForm()}

              <div className="flex justify-between mt-6 sm:mt-8">
                <Button variant="outline" onClick={goToPreviousStep} disabled={currentStep === 0}>
                  <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" /> 上一步
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button onClick={goToNextStep}>
                    下一步 <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleGenerate}>
                    生成PPT <Download className="ml-1 sm:ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 移动端预览切换按钮 */}
        <div className="lg:hidden mt-2 mb-0">
          <Button variant="outline" onClick={togglePreview} className="w-full flex items-center justify-center">
            {showPreview ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" /> 隐藏预览
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" /> 显示预览
              </>
            )}
          </Button>
        </div>

        {/* 预览区域 */}
        <div className={showPreview ? "block" : "hidden lg:block"}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>实时预览</CardTitle>
              <CardDescription>您的崇拜演示文稿预览</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] sm:h-[500px] md:h-[600px] overflow-auto">
              <PptPreview data={previewData} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
