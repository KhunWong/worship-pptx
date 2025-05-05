"use client"

import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function StepNavigator({ steps, currentStep, completedSteps, onStepClick }) {
  // 显示少量步骤的简化版导航器
  const renderMobileStepNavigator = () => {
    // 确定要显示哪些步骤：当前步骤、前一步骤、后一步骤和第一个/最后一个步骤
    const stepsToShow = []

    // 总是显示第一个步骤
    if (0 !== currentStep) {
      stepsToShow.push(0)
    }

    // 显示前一个步骤
    if (currentStep > 0) {
      stepsToShow.push(currentStep - 1)
    }

    // 显示当前步骤
    stepsToShow.push(currentStep)

    // 显示后一个步骤
    if (currentStep < steps.length - 1) {
      stepsToShow.push(currentStep + 1)
    }

    // 显示最后一个步骤
    if (steps.length - 1 !== currentStep) {
      stepsToShow.push(steps.length - 1)
    }

    // 去重
    const uniqueSteps = [...new Set(stepsToShow)].sort((a, b) => a - b)

    return (
      <div className="flex items-center justify-between">
        {uniqueSteps.map((index, i) => (
          <div key={index} className="flex flex-col items-center relative">
            {/* 连接线 */}
            {i < uniqueSteps.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-1/2 h-0.5",
                  completedSteps[steps[index].id] ? "bg-green-500" : "bg-gray-200",
                )}
                style={{
                  width: `${100 / (uniqueSteps.length - 1)}%`,
                  transform: "translateX(50%)",
                }}
              ></div>
            )}

            {/* 步骤圆点 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onStepClick(index)}
                    disabled={!completedSteps[steps[index].id] && index !== currentStep}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center z-10 mb-2 transition-colors",
                      currentStep === index
                        ? "bg-primary text-primary-foreground"
                        : completedSteps[steps[index].id]
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-200 text-gray-500",
                    )}
                  >
                    {completedSteps[steps[index].id] ? <CheckCircle className="h-5 w-5" /> : <span>{index + 1}</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{steps[index].title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* 步骤名称 - 在移动端不显示 */}
            <span className="hidden sm:block text-xs text-center max-w-[80px]">{steps[index].title}</span>
          </div>
        ))}
      </div>
    )
  }

  // 完整的导航器
  const renderDesktopStepNavigator = () => {
    return (
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative">
            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-1/2 w-full h-0.5",
                  completedSteps[step.id] ? "bg-green-500" : "bg-gray-200",
                )}
                style={{ transform: "translateX(50%)" }}
              ></div>
            )}

            {/* 步骤圆点 */}
            <button
              onClick={() => onStepClick(index)}
              disabled={!completedSteps[step.id] && index !== currentStep}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center z-10 mb-2 transition-colors",
                currentStep === index
                  ? "bg-primary text-primary-foreground"
                  : completedSteps[step.id]
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-200 text-gray-500",
              )}
            >
              {completedSteps[step.id] ? <CheckCircle className="h-5 w-5" /> : <span>{index + 1}</span>}
            </button>

            {/* 步骤名称 */}
            <span
              className={cn(
                "text-xs text-center max-w-[80px]",
                currentStep === index
                  ? "text-primary font-medium"
                  : completedSteps[step.id]
                    ? "text-green-600"
                    : "text-gray-500",
              )}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mb-4 sm:mb-8">
      <div className="block sm:hidden">{renderMobileStepNavigator()}</div>
      <div className="hidden sm:block">{renderDesktopStepNavigator()}</div>
    </div>
  )
}
