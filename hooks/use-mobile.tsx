"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 检查是否为移动设备
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // 初始检查
    checkMobile()

    // 监听窗口大小变化
    window.addEventListener("resize", checkMobile)

    // 清理监听器
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}
