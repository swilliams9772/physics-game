"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Html } from "@react-three/drei"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

// Special relativity visualization
export function RelativityDemo({ position = [0, 0, 0] }) {
  const [velocity, setVelocity] = useState(0) // As fraction of c
  const [showEffects, setShowEffects] = useState(true)
  const clockRef = useRef()
  const objectRef = useRef()
  const time = useRef(0)

  // Calculate relativistic effects
  const gamma = 1 / Math.sqrt(1 - velocity * velocity) // Lorentz factor
  const timeDilation = gamma
  const lengthContraction = 1 / gamma

  // Animation
  useFrame((state, delta) => {
    time.current += delta

    // Animate clock
    if (clockRef.current) {
      // Stationary clock ticks normally
      const stationaryAngle = time.current % (2 * Math.PI)
      clockRef.current.rotation.z = stationaryAngle

      // Moving clock ticks slower (time dilation)
      const movingAngle = (time.current / timeDilation) % (2 * Math.PI)
      // This would be applied to a second clock if we had one
    }

    // Apply length contraction to object
    if (objectRef.current && showEffects) {
      objectRef.current.scale.x = lengthContraction
    } else if (objectRef.current) {
      objectRef.current.scale.x = 1
    }
  })

  return (
    <group position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.2, 0.2]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* Object that experiences length contraction */}
      <mesh ref={objectRef} position={[0, 1, 0]}>
        <boxGeometry args={[2, 0.5, 0.5]} />
        <meshStandardMaterial color="#e53935" />
      </mesh>

      {/* Clock for time dilation */}
      <group position={[0, -1, 0]}>
        <mesh>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh ref={clockRef} position={[0, 0.06, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.05]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>

      {/* Controls */}
      <Html position={[2, 0, 0]}>
        <div className="bg-white p-4 rounded-lg shadow-lg w-64">
          <h3 className="text-lg font-bold mb-2">Special Relativity</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Velocity (c): {velocity.toFixed(2)}</label>
              <Slider
                value={[velocity]}
                min={0}
                max={0.99}
                step={0.01}
                onValueChange={(value) => setVelocity(value[0])}
              />
            </div>
            <div>
              <p className="text-sm">Time Dilation: {timeDilation.toFixed(2)}x</p>
              <p className="text-sm">Length Contraction: {lengthContraction.toFixed(2)}x</p>
            </div>
            <Button size="sm" onClick={() => setShowEffects(!showEffects)}>
              {showEffects ? "Hide Effects" : "Show Effects"}
            </Button>
          </div>
        </div>
      </Html>

      {/* Explanatory text */}
      <Text position={[-2, 2, 0]} fontSize={0.2} color="#000" maxWidth={4} anchorX="left">
        {`As velocity approaches the speed of light (c):
        
1. Time dilates (slows down)
2. Length contracts (shortens)
3. Mass increases

These effects become significant only at very high velocities.`}
      </Text>
    </group>
  )
}

