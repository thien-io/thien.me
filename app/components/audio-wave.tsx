"use client"

import { useEffect, useState } from "react"

export function AudioWave() {
  const [barCount, setBarCount] = useState(20)

  useEffect(() => {
    const updateBarCount = () => {
      setBarCount(window.innerWidth < 640 ? 15 : 20)
    }

    updateBarCount()
    window.addEventListener("resize", updateBarCount)
    return () => window.removeEventListener("resize", updateBarCount)
  }, [])

  return (
    <>
      <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 h-8 sm:h-10 md:h-12">
        {Array.from({ length: barCount }).map((_, index) => (
          <div key={index} className={`w-0.5 sm:w-1 bg-green-500 rounded-full wave-bar-${index % 10}`} />
        ))}
      </div>
      <style jsx>{`
        @keyframes wave {
          0% {
            height: 8px;
          }
          100% {
            height: 40px;
          }
        }
        
        @media (min-width: 640px) {
          @keyframes wave {
            0% {
              height: 10px;
            }
            100% {
              height: 50px;
            }
          }
        }
        
        .wave-bar-0 {
          height: 20px;
          animation: wave 1.2s ease-in-out infinite alternate;
          animation-delay: 0s;
        }
        
        .wave-bar-1 {
          height: 35px;
          animation: wave 1.5s ease-in-out infinite alternate;
          animation-delay: 0.1s;
        }
        
        .wave-bar-2 {
          height: 15px;
          animation: wave 1.8s ease-in-out infinite alternate;
          animation-delay: 0.2s;
        }
        
        .wave-bar-3 {
          height: 30px;
          animation: wave 1.3s ease-in-out infinite alternate;
          animation-delay: 0.3s;
        }
        
        .wave-bar-4 {
          height: 25px;
          animation: wave 1.6s ease-in-out infinite alternate;
          animation-delay: 0.4s;
        }
        
        .wave-bar-5 {
          height: 18px;
          animation: wave 1.4s ease-in-out infinite alternate;
          animation-delay: 0.5s;
        }
        
        .wave-bar-6 {
          height: 32px;
          animation: wave 1.7s ease-in-out infinite alternate;
          animation-delay: 0.6s;
        }
        
        .wave-bar-7 {
          height: 22px;
          animation: wave 1.1s ease-in-out infinite alternate;
          animation-delay: 0.7s;
        }
        
        .wave-bar-8 {
          height: 28px;
          animation: wave 1.9s ease-in-out infinite alternate;
          animation-delay: 0.8s;
        }
        
        .wave-bar-9 {
          height: 16px;
          animation: wave 1.35s ease-in-out infinite alternate;
          animation-delay: 0.9s;
        }
      `}</style>
    </>
  )
}
