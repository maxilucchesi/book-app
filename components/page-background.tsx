"use client"

import { useEffect, useRef } from "react"

export function PageBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Ensure the background covers the entire viewport
    const updateHeight = () => {
      if (backgroundRef.current) {
        backgroundRef.current.style.minHeight = `${window.innerHeight}px`
      }
    }

    // Initial update
    updateHeight()

    // Update on resize
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  return (
    <div
      ref={backgroundRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#fffef5",
        backgroundImage: `url("/textures/argyle.png")`,
        backgroundRepeat: "repeat",
        zIndex: -1,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  )
}
