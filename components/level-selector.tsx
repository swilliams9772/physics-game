"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Lock, CheckCircle, Circle, Star, Sparkles, Leaf } from "lucide-react"

export default function LevelSelector({ levels, onSelectLevel, playerScore = 0 }) {
  const [expandedLevel, setExpandedLevel] = useState(null)

  const toggleExpand = (index) => {
    if (expandedLevel === index) {
      setExpandedLevel(null)
    } else {
      setExpandedLevel(index)
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-2 relative inline-block">
        Magical Journey
        <span className="absolute -top-2 -right-6">
          <Leaf className="h-4 w-4 text-primary/70 floating" />
        </span>
      </h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-0 relative">
          {/* Journey Path */}
          <div className="absolute left-8 top-6 bottom-0 w-1 bg-gradient-to-b from-primary to-accent z-0"></div>
          
          {levels.map((level, index) => {
            const isUnlocked = level.unlocked || playerScore >= level.requiredScore
            const objectivesCompleted = level.objectives ? level.objectives.filter((obj) => obj.completed).length : 0
            const totalObjectives = level.objectives ? level.objectives.length : 0
            const completionPercentage = totalObjectives > 0 ? (objectivesCompleted / totalObjectives) * 100 : 0
            const isCompleted = completionPercentage === 100

            return (
              <div key={index} className="space-y-2 pb-6 relative z-10">
                <Button
                  variant={isUnlocked ? (expandedLevel === index ? "magical" : "outline") : "ghost"}
                  disabled={!isUnlocked}
                  className={`w-full justify-between rounded-xl ${!isUnlocked ? "opacity-60" : ""} transition-all duration-300`}
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-all duration-300 ${
                        isCompleted 
                          ? "bg-primary/20 magic-glow" 
                          : isUnlocked 
                            ? "bg-secondary/70" 
                            : "bg-muted"
                      }`}
                    >
                      {isCompleted ? (
                        <Sparkles className="h-5 w-5 text-primary" />
                      ) : isUnlocked ? (
                        <div className="font-medium text-lg">{index + 1}</div>
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{level.title}</div>
                      <div className="text-xs text-muted-foreground">{level.topic}</div>
                    </div>
                  </div>

                  {isUnlocked && totalObjectives > 0 && (
                    <div className="flex items-center">
                      <div className="text-sm font-medium mr-2">
                        {objectivesCompleted}/{totalObjectives}
                      </div>
                      <div className="relative w-12 h-1">
                        <Progress value={completionPercentage} className="h-1 rounded-full" />
                      </div>
                    </div>
                  )}
                </Button>

                {expandedLevel === index && (
                  <div className="pl-12 pr-2 space-y-3 sway">
                    <div className="ghibli-card">
                      <p className="text-sm mb-3">{level.description}</p>

                      {level.objectives && level.objectives.length > 0 && (
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-medium">Quests:</h4>
                          <ul className="space-y-1">
                            {level.objectives.map((objective, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-sm">
                                <div className="mt-0.5">
                                  {objective.completed ? (
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <span className={objective.completed ? "text-primary" : ""}>{objective.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {level.reward && (
                        <div className="flex items-center space-x-2 mt-3 bg-accent/30 p-2 rounded-lg">
                          <Star className="h-4 w-4 text-amber-500" />
                          <span className="text-sm">{level.reward}</span>
                        </div>
                      )}

                      <div className="flex justify-end mt-4">
                        <Button onClick={() => onSelectLevel(index)} className="mt-2" variant="magical">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Begin Adventure
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Your Progress</span>
          <Badge variant="outline">{playerScore} points</Badge>
        </div>
        <Progress
          value={Math.min((playerScore / levels[levels.length - 1].requiredScore) * 100, 100)}
          className="h-2"
        />
      </div>
    </div>
  )
}

