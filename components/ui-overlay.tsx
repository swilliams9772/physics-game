"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { MagicWand, Wind, Leaf, Droplets, Scale, Sparkles } from "lucide-react"

export default function UIOverlay({ level, onApplyForce, onAdjustParameters }) {
  const [forceX, setForceX] = useState(0)
  const [forceY, setForceY] = useState(0)
  const [forceZ, setForceZ] = useState(0)
  const [mass, setMass] = useState(1)
  const [friction, setFriction] = useState(0.5)
  const [restitution, setRestitution] = useState(0.7)
  const [gravity, setGravity] = useState(9.81)
  const [showVectors, setShowVectors] = useState(true)
  const [activeTab, setActiveTab] = useState("forces")

  // Reset forces when applying them
  const handleApplyForce = () => {
    onApplyForce([forceX, forceY, forceZ])

    // Reset forces after a short delay
    setTimeout(() => {
      setForceX(0)
      setForceY(0)
      setForceZ(0)
    }, 100)
  }

  const handleAdjustParameters = () => {
    onAdjustParameters({ mass, friction, restitution, gravity })
  }

  // Set appropriate default tab based on level type
  useEffect(() => {
    if (level) {
      if (level.id === "projectiles") {
        setActiveTab("parameters")
      } else if (level.id === "oscillations") {
        setActiveTab("oscillation")
      } else {
        setActiveTab("forces")
      }
    }
  }, [level])

  // Level-specific controls
  const renderLevelSpecificControls = () => {
    if (!level) return null

    switch (level.id) {
      case "projectiles":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Trajectory Magic</h4>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="angle">Arcane Angle</Label>
                  <span className="text-xs text-muted-foreground">{level.angle}°</span>
                </div>
                <Slider
                  id="angle"
                  min={0}
                  max={90}
                  step={1}
                  value={[level.angle || 45]}
                  onValueChange={(value) => level.onAngleChange(value[0])}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="velocity">Ethereal Velocity</Label>
                  <span className="text-xs text-muted-foreground">{level.velocity || 10} m/s</span>
                </div>
                <Slider
                  id="velocity"
                  min={1}
                  max={20}
                  step={0.5}
                  value={[level.velocity || 10]}
                  onValueChange={(value) => level.onVelocityChange(value[0])}
                  className="h-2"
                />
              </div>
              <Button variant="magical" onClick={level.onLaunch} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                Release the Magic
              </Button>
            </div>
          </div>
        )

      case "oscillations":
        return (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Harmony Spells</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="amplitude">Mystic Amplitude</Label>
                  <span className="text-xs text-muted-foreground">{level.amplitude}</span>
                </div>
                <Slider
                  id="amplitude"
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={[level.amplitude || 1]}
                  onValueChange={(value) => level.onAmplitudeChange(value[0])}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="frequency">Ethereal Frequency</Label>
                  <span className="text-xs text-muted-foreground">{level.frequency} Hz</span>
                </div>
                <Slider
                  id="frequency"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={[level.frequency || 1]}
                  onValueChange={(value) => level.onFrequencyChange(value[0])}
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="damping">Whisper Damping</Label>
                  <span className="text-xs text-muted-foreground">{level.damping}</span>
                </div>
                <Slider
                  id="damping"
                  min={0}
                  max={1}
                  step={0.05}
                  value={[level.damping || 0.2]}
                  onValueChange={(value) => level.onDampingChange(value[0])}
                  className="h-2"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!level) return null

  return (
    <div className="absolute bottom-4 left-4 w-72">
      <Card className="sway">
        <CardHeader className="py-3">
          <CardTitle className="text-lg">Spirit Controls</CardTitle>
          <CardDescription>{level.title} - {level.topic}</CardDescription>
        </CardHeader>
        <CardContent className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="forces" className="flex items-center space-x-1">
                <MagicWand className="h-4 w-4" />
                <span>Forces</span>
              </TabsTrigger>
              <TabsTrigger value="parameters" className="flex items-center space-x-1">
                <Scale className="h-4 w-4" />
                <span>Essence</span>
              </TabsTrigger>
              <TabsTrigger value="oscillation" className="flex items-center space-x-1">
                <Wind className="h-4 w-4" />
                <span>Waves</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forces" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="forceX">East-West Force</Label>
                    <span className="text-xs text-muted-foreground">{forceX.toFixed(1)} N</span>
                  </div>
                  <Slider
                    id="forceX"
                    min={-10}
                    max={10}
                    step={0.1}
                    value={[forceX]}
                    onValueChange={(value) => setForceX(value[0])}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="forceY">Sky-Earth Force</Label>
                    <span className="text-xs text-muted-foreground">{forceY.toFixed(1)} N</span>
                  </div>
                  <Slider
                    id="forceY"
                    min={-10}
                    max={10}
                    step={0.1}
                    value={[forceY]}
                    onValueChange={(value) => setForceY(value[0])}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="forceZ">North-South Force</Label>
                    <span className="text-xs text-muted-foreground">{forceZ.toFixed(1)} N</span>
                  </div>
                  <Slider
                    id="forceZ"
                    min={-10}
                    max={10}
                    step={0.1}
                    value={[forceZ]}
                    onValueChange={(value) => setForceZ(value[0])}
                    className="h-2"
                  />
                </div>
                <Button variant="magical" onClick={handleApplyForce} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Summon Forces
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="parameters" className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="mass">Spirit Weight</Label>
                    <span className="text-xs text-muted-foreground">{mass.toFixed(1)} kg</span>
                  </div>
                  <Slider
                    id="mass"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={[mass]}
                    onValueChange={(value) => setMass(value[0])}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="friction">Earth Resistance</Label>
                    <span className="text-xs text-muted-foreground">{friction.toFixed(2)}</span>
                  </div>
                  <Slider
                    id="friction"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[friction]}
                    onValueChange={(value) => setFriction(value[0])}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="restitution">Bounce Magic</Label>
                    <span className="text-xs text-muted-foreground">{restitution.toFixed(2)}</span>
                  </div>
                  <Slider
                    id="restitution"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[restitution]}
                    onValueChange={(value) => setRestitution(value[0])}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="gravity">Earth's Pull</Label>
                    <span className="text-xs text-muted-foreground">{gravity.toFixed(2)} m/s²</span>
                  </div>
                  <Slider
                    id="gravity"
                    min={0}
                    max={20}
                    step={0.1}
                    value={[gravity]}
                    onValueChange={(value) => setGravity(value[0])}
                    className="h-2"
                  />
                </div>
                <Button variant="magical" onClick={handleAdjustParameters} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Apply Essence
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="oscillation">
              {renderLevelSpecificControls()}
            </TabsContent>
          </Tabs>

          <div className="flex items-center pt-3 space-x-2">
            <Switch
              id="show-vectors"
              checked={showVectors}
              onCheckedChange={setShowVectors}
            />
            <Label htmlFor="show-vectors" className="text-sm">Show Force Whispers</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

