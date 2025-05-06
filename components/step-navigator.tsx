"use client"

import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function StepNavigator({ steps, currentStep, completedSteps, onStepClick, orientation = "horizontal" }) {
  // 垂直方向的步骤导航
  if (orientation === "vertical") {
    return (
      <div className="h-full flex flex-col items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative">
            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-[20px] left-1/2 w-0.5 h-12",
                  completedSteps[step.id] ? "bg-green-500" : "bg-gray-200",
                )}
                style={{ transform: "translateX(-50%)" }}
              ></div>
            )}

            {/* 步骤圆点 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onStepClick(index)}
                    disabled={!completedSteps[step.id] && index !== currentStep}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center z-10 mb-4 transition-colors",
                      currentStep === index
                        ? "bg-primary text-primary-foreground"
                        : completedSteps[step.id]
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-200 text-gray-500",
                    )}
                  >
                    {completedSteps[step.id] ? <CheckCircle className="h-5 w-5" /> : <span>{index + 1}</span>}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{step.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    )
  }

  // 水平方向的步骤导航
  return (
    <div className="mb-8">
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
    </div>
  )
}
