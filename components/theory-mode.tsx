"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, X, BookOpen, Lightbulb, Calculator, Sparkles, Scroll, Star, Wind } from "lucide-react"

export default function TheoryMode({ level, onClose }) {
  const [activeTab, setActiveTab] = useState("concepts")

  if (!level || !level.theory) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col relative sway">
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-accent/30 rounded-full blur-xl z-0"></div>
        <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-primary/20 rounded-full blur-xl z-0"></div>
        
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <div>
            <CardTitle className="text-2xl relative">
              {level.theory.title}
              <span className="absolute top-0 right-0 transform translate-x-full -translate-y-1/2">
                <Sparkles className="h-5 w-5 text-accent-foreground/70" />
              </span>
            </CardTitle>
            <CardDescription>{level.topic}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 mb-4 p-1 bg-muted/40 backdrop-blur-sm rounded-xl">
            <TabsTrigger value="concepts" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-background/80">
              <Scroll className="h-4 w-4" />
              <span>Ancient Knowledge</span>
            </TabsTrigger>
            <TabsTrigger value="equations" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-background/80">
              <Star className="h-4 w-4" />
              <span>Magical Formulas</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center space-x-2 rounded-lg data-[state=active]:bg-background/80">
              <Wind className="h-4 w-4" />
              <span>World Magic</span>
            </TabsTrigger>
          </TabsList>

          <CardContent className="flex-1 overflow-y-auto pb-6">
            <TabsContent value="concepts" className="mt-0 space-y-6">
              <div className="space-y-6">
                {level.theory.content.map((section, index) => (
                  <div key={index} className="space-y-2 ghibli-card">
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 text-xs">
                        {index + 1}
                      </span>
                      {section.subtitle}
                    </h3>
                    <p className="text-muted-foreground">{section.text}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="equations" className="mt-0">
              <div className="space-y-6">
                {level.theory.equations?.map((equation, index) => (
                  <div key={index} className="p-4 border rounded-xl bg-card/50 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-full -mr-6 -mt-6 z-0"></div>
                    <h3 className="text-lg font-medium mb-2 relative z-10">{equation.name}</h3>
                    <div className="p-3 bg-background/60 rounded-lg flex items-center justify-center text-xl font-medium my-4 shadow-inner">
                      {equation.formula}
                    </div>
                    <p className="text-sm text-muted-foreground">{equation.description}</p>
                    {equation.variables && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {Object.entries(equation.variables).map(([symbol, meaning]) => (
                          <div key={symbol} className="flex items-center space-x-2">
                            <span className="font-medium">{symbol}:</span>
                            <span className="text-sm">{meaning}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applications" className="mt-0">
              <div className="space-y-6">
                {level.theory.applications?.map((application, index) => (
                  <div key={index} className="ghibli-card">
                    <h3 className="text-lg font-medium mb-2">{application.title}</h3>
                    <p className="text-muted-foreground mb-4">{application.description}</p>
                    
                    {application.examples && (
                      <ul className="space-y-3">
                        {application.examples.map((example, exIndex) => (
                          <li key={exIndex} className="p-3 bg-background/60 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <div className="w-6 h-6 rounded-full bg-accent/30 flex-shrink-0 flex items-center justify-center text-xs">
                                {exIndex + 1}
                              </div>
                              <div>
                                <p className="font-medium">{example.title}</p>
                                <p className="text-sm text-muted-foreground">{example.description}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={() => setActiveTab(activeTab === "concepts" ? "applications" : activeTab === "equations" ? "concepts" : "equations")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Topic
          </Button>
          <Button variant="magical" size="sm" onClick={onClose}>
            <Sparkles className="h-4 w-4 mr-2" />
            Return to Adventure
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveTab(activeTab === "concepts" ? "equations" : activeTab === "equations" ? "applications" : "concepts")}>
            Next Topic
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

