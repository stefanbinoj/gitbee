"use client"

import { useEffect, useState } from "react"

export function FloatingShapes() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary green blob - most prominent */}
      <div
        className="absolute top-20 right-[10%] w-[500px] h-[500px] rounded-full opacity-15 blur-[120px] transition-transform duration-500 ease-out"
        style={{
          background: "radial-gradient(circle, #22c55e 0%, #10b981 50%, transparent 70%)",
          transform: `translate(${mousePosition.x * 1.2}px, ${mousePosition.y * 1.2}px)`,
        }}
      />
      {/* Secondary green blob - faded */}
      <div
        className="absolute top-[40%] left-[5%] w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] transition-transform duration-700 ease-out"
        style={{
          background: "radial-gradient(circle, #10b981 0%, #059669 50%, transparent 70%)",
          transform: `translate(${mousePosition.x * -0.8}px, ${mousePosition.y * -0.8}px)`,
        }}
      />
      {/* Tertiary green accent - subtle */}
      <div
        className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] rounded-full opacity-8 blur-[80px] transition-transform duration-600 ease-out"
        style={{
          background: "radial-gradient(circle, #34d399 0%, transparent 60%)",
          transform: `translate(${mousePosition.x * 0.6}px, ${mousePosition.y * 0.6}px)`,
        }}
      />
    </div>
  )
}
