"use client"

import { useState } from "react"
import PhysicsGame from "@/components/physics-game"
import { Button } from "@/components/ui/button"
import { Sparkles, Wind, Leaf } from "lucide-react"

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Floating leaves decoration */}
        <div className="absolute top-10 left-10 transform -rotate-12">
          <Leaf className="h-6 w-6 text-primary/40 floating" style={{ animationDelay: "0.5s" }} />
        </div>
        <div className="absolute top-20 right-20 transform rotate-12">
          <Leaf className="h-8 w-8 text-primary/30 floating" style={{ animationDelay: "1.2s" }} />
        </div>
        <div className="absolute bottom-20 left-1/4 transform rotate-45">
          <Leaf className="h-5 w-5 text-primary/40 floating" style={{ animationDelay: "0.8s" }} />
        </div>
        <div className="absolute bottom-40 right-1/3 transform -rotate-15">
          <Leaf className="h-7 w-7 text-primary/30 floating" style={{ animationDelay: "1.5s" }} />
        </div>
        
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-accent/20 rounded-full blur-3xl z-0"></div>
        
        {/* Title and start button */}
        <div className="z-10 text-center">
          <h1 className="text-6xl font-bold mb-6 relative">
            <span className="relative inline-block">
              Physics Journey
              <span className="absolute -top-10 -right-10">
                <Sparkles className="h-8 w-8 text-amber-400/80 floating" />
              </span>
            </span>
          </h1>
          <p className="text-xl mb-12 max-w-md mx-auto text-muted-foreground">
            Explore the magical world of forces and motion through a whimsical adventure
          </p>
          <Button 
            size="lg" 
            variant="magical" 
            onClick={() => setGameStarted(true)}
            className="px-8 py-6 text-lg group"
          >
            <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin" />
            Begin Your Adventure
          </Button>
        </div>
        
        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary/10 to-transparent"></div>
      </div>
    )
  }
  
  return <PhysicsGame />
}

