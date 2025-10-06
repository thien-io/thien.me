"use client"

export function SoundBars() {
  return (
    <>
      <div className="flex items-end space-x-0.5 h-4">
        <div className="w-0.5 bg-green-600 dark:bg-green-500 rounded-full sound-bar-1" />
        <div className="w-0.5 bg-green-600 dark:bg-green-500 rounded-full sound-bar-2" />
        <div className="w-0.5 bg-green-600 dark:bg-green-500 rounded-full sound-bar-3" />
        <div className="w-0.5 bg-green-600 dark:bg-green-500 rounded-full sound-bar-4" />
      </div>
      <style jsx>{`
        .sound-bar-1 {
          height: 60%;
          animation: soundbar1 1.2s ease-in-out infinite;
        }
        
        .sound-bar-2 {
          height: 100%;
          animation: soundbar2 1.5s ease-in-out infinite;
        }
        
        .sound-bar-3 {
          height: 40%;
          animation: soundbar3 1.8s ease-in-out infinite;
        }
        
        .sound-bar-4 {
          height: 80%;
          animation: soundbar4 1.3s ease-in-out infinite;
        }
        
        @keyframes soundbar1 {
          0%, 100% { height: 20%; }
          50% { height: 60%; }
        }
        
        @keyframes soundbar2 {
          0%, 100% { height: 40%; }
          50% { height: 100%; }
        }
        
        @keyframes soundbar3 {
          0%, 100% { height: 15%; }
          50% { height: 40%; }
        }
        
        @keyframes soundbar4 {
          0%, 100% { height: 30%; }
          50% { height: 80%; }
        }
      `}</style>
    </>
  )
}
