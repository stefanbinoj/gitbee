"use client"

import { useEffect, useRef, useState } from "react"

interface TrailPoint {
  x: number
  y: number
  opacity: number
  id: number
}

export function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const idRef = useRef(0)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        id: idRef.current++,
      }

      setTrail((prev) => [...prev.slice(-20), newPoint])
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Fade out trail points
    const fadeTrail = () => {
      setTrail((prev) =>
        prev.map((point) => ({ ...point, opacity: point.opacity - 0.03 })).filter((point) => point.opacity > 0),
      )
      animationFrameRef.current = requestAnimationFrame(fadeTrail)
    }

    animationFrameRef.current = requestAnimationFrame(fadeTrail)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <svg className="w-full h-full">
        <defs>
          <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(16, 185, 129)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="rgb(52, 211, 153)" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {trail.length > 1 && (
          <path
            d={`M ${trail.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
            fill="none"
            stroke="url(#trailGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            style={{
              opacity: trail[trail.length - 1]?.opacity || 0,
            }}
          />
        )}
        {trail.map((point, index) => (
          <circle
            key={point.id}
            cx={point.x}
            cy={point.y}
            r={Math.max(1, 4 - index * 0.15)}
            fill="rgb(16, 185, 129)"
            opacity={point.opacity * 0.5}
            filter="url(#glow)"
          />
        ))}
      </svg>
    </div>
  )
}
