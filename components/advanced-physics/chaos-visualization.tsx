"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { Line, Text, Html } from "@react-three/drei"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

// Double pendulum system (chaotic)
export function DoublePendulum({
  position = [0, 0, 0],
  length1 = 2,
  length2 = 2,
  mass1 = 1,
  mass2 = 1,
  initialAngle1 = Math.PI / 4,
  initialAngle2 = Math.PI / 8,
  gravity = 9.81,
  traceLength = 100,
  showTrace = true,
}) {
  // Ensure positive lengths
  const safeLength1 = Math.max(0.001, length1)
  const safeLength2 = Math.max(0.001, length2)

  const pivot1Ref = useRef()
  const bob1Ref = useRef()
  const bob2Ref = useRef()
  const rod1Ref = useRef()
  const rod2Ref = useRef()

  const angle1 = useRef(initialAngle1)
  const angle2 = useRef(initialAngle2)
  const velocity1 = useRef(0)
  const velocity2 = useRef(0)

  const [tracePoints, setTracePoints] = useState([])
  const [sensitivity, setSensitivity] = useState(0.001)
  const [resetTrigger, setResetTrigger] = useState(0)

  // Reset the pendulum
  const resetPendulum = () => {
    angle1.current = initialAngle1
    angle2.current = initialAngle2
    velocity1.current = 0
    velocity2.current = 0
    setTracePoints([])
    setResetTrigger((prev) => prev + 1)
  }

  // Create a slightly perturbed pendulum for sensitivity demonstration
  const [perturbedPoints, setPerturbedPoints] = useState([])
  const perturbedAngle1 = useRef(initialAngle1 + sensitivity)
  const perturbedAngle2 = useRef(initialAngle2)
  const perturbedVelocity1 = useRef(0)
  const perturbedVelocity2 = useRef(0)

  // Reset when sensitivity changes
  useEffect(() => {
    resetPendulum()
    perturbedAngle1.current = initialAngle1 + sensitivity
    perturbedAngle2.current = initialAngle2
    perturbedVelocity1.current = 0
    perturbedVelocity2.current = 0
    setPerturbedPoints([])
  }, [sensitivity, resetTrigger, initialAngle1, initialAngle2])

  // Physics simulation
  useFrame((state, delta) => {
    // Limit delta to prevent instability
    const dt = Math.min(delta, 0.016)

    // Double pendulum equations of motion
    // These are the full non-linear equations for a double pendulum

    // Main pendulum
    {
      // Calculate derivatives
      const denom = 2 * mass1 + mass2 - mass2 * Math.cos(2 * angle1.current - 2 * angle2.current)

      const dv1 =
        (-gravity * (2 * mass1 + mass2) * Math.sin(angle1.current) -
          mass2 * gravity * Math.sin(angle1.current - 2 * angle2.current) -
          2 *
            Math.sin(angle1.current - angle2.current) *
            mass2 *
            (velocity2.current * velocity2.current * safeLength2 +
              velocity1.current * velocity1.current * safeLength1 * Math.cos(angle1.current - angle2.current))) /
        (safeLength1 * denom)

      const dv2 =
        (2 *
          Math.sin(angle1.current - angle2.current) *
          (velocity1.current * velocity1.current * safeLength1 * (mass1 + mass2) +
            gravity * (mass1 + mass2) * Math.cos(angle1.current) +
            velocity2.current * velocity2.current * safeLength2 * mass2 * Math.cos(angle1.current - angle2.current))) /
        (safeLength2 * denom)

      // Update velocities and angles
      velocity1.current += dv1 * dt
      velocity2.current += dv2 * dt
      angle1.current += velocity1.current * dt
      angle2.current += velocity2.current * dt

      // Calculate positions
      const x1 = position[0] + safeLength1 * Math.sin(angle1.current)
      const y1 = position[1] - safeLength1 * Math.cos(angle1.current)
      const x2 = x1 + safeLength2 * Math.sin(angle2.current)
      const y2 = y1 - safeLength2 * Math.cos(angle2.current)

      // Update pendulum positions
      if (bob1Ref.current) {
        bob1Ref.current.position.x = x1
        bob1Ref.current.position.y = y1
        bob1Ref.current.position.z = position[2]
      }

      if (bob2Ref.current) {
        bob2Ref.current.position.x = x2
        bob2Ref.current.position.y = y2
        bob2Ref.current.position.z = position[2]
      }

      // Update trace
      if (showTrace) {
        setTracePoints((prev) => {
          const newPoints = [...prev, [x2, y2, position[2]]]
          if (newPoints.length > traceLength) {
            return newPoints.slice(newPoints.length - traceLength)
          }
          return newPoints
        })
      }
    }

    // Perturbed pendulum (for sensitivity demonstration)
    {
      // Calculate derivatives
      const denom = 2 * mass1 + mass2 - mass2 * Math.cos(2 * perturbedAngle1.current - 2 * perturbedAngle2.current)

      const dv1 =
        (-gravity * (2 * mass1 + mass2) * Math.sin(perturbedAngle1.current) -
          mass2 * gravity * Math.sin(perturbedAngle1.current - 2 * perturbedAngle2.current) -
          2 *
            Math.sin(perturbedAngle1.current - perturbedAngle2.current) *
            mass2 *
            (perturbedVelocity2.current * perturbedVelocity2.current * safeLength2 +
              perturbedVelocity1.current *
                perturbedVelocity1.current *
                safeLength1 *
                Math.cos(perturbedAngle1.current - perturbedAngle2.current))) /
        (safeLength1 * denom)

      const dv2 =
        (2 *
          Math.sin(perturbedAngle1.current - perturbedAngle2.current) *
          (perturbedVelocity1.current * perturbedVelocity1.current * safeLength1 * (mass1 + mass2) +
            gravity * (mass1 + mass2) * Math.cos(perturbedAngle1.current) +
            perturbedVelocity2.current *
              perturbedVelocity2.current *
              safeLength2 *
              mass2 *
              Math.cos(perturbedAngle1.current - perturbedAngle2.current))) /
        (safeLength2 * denom)

      // Update velocities and angles
      perturbedVelocity1.current += dv1 * dt
      perturbedVelocity2.current += dv2 * dt
      perturbedAngle1.current += perturbedVelocity1.current * dt
      perturbedAngle2.current += perturbedVelocity2.current * dt

      // Calculate positions
      const x1 = position[0] + safeLength1 * Math.sin(perturbedAngle1.current)
      const y1 = position[1] - safeLength1 * Math.cos(perturbedAngle1.current)
      const x2 = x1 + safeLength2 * Math.sin(perturbedAngle2.current)
      const y2 = y1 - safeLength2 * Math.cos(perturbedAngle2.current)

      // Update trace
      if (showTrace) {
        setPerturbedPoints((prev) => {
          const newPoints = [...prev, [x2, y2, position[2]]]
          if (newPoints.length > traceLength) {
            return newPoints.slice(newPoints.length - traceLength)
          }
          return newPoints
        })
      }
    }
  })

  return (
    <group position={position}>
      {/* Pivot point */}
      <mesh ref={pivot1Ref} position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* First rod - rendered as a line instead of a cylinder */}
      <Line
        points={[
          [0, 0, 0],
          [safeLength1 * Math.sin(angle1.current), -safeLength1 * Math.cos(angle1.current), 0],
        ]}
        color="#999"
        lineWidth={3}
      />

      {/* First bob */}
      <mesh
        ref={bob1Ref}
        position={[safeLength1 * Math.sin(angle1.current), -safeLength1 * Math.cos(angle1.current), 0]}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#1e88e5" />
      </mesh>

      {/* Second rod - rendered as a line instead of a cylinder */}
      <Line
        points={[
          [safeLength1 * Math.sin(angle1.current), -safeLength1 * Math.cos(angle1.current), 0],
          [
            safeLength1 * Math.sin(angle1.current) + safeLength2 * Math.sin(angle2.current),
            -safeLength1 * Math.cos(angle1.current) - safeLength2 * Math.cos(angle2.current),
            0,
          ],
        ]}
        color="#999"
        lineWidth={3}
      />

      {/* Second bob */}
      <mesh
        ref={bob2Ref}
        position={[
          safeLength1 * Math.sin(angle1.current) + safeLength2 * Math.sin(angle2.current),
          -safeLength1 * Math.cos(angle1.current) - safeLength2 * Math.cos(angle2.current),
          0,
        ]}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#e53935" />
      </mesh>

      {/* Trace for main pendulum */}
      {showTrace && tracePoints.length > 1 && <Line points={tracePoints} color="#e53935" lineWidth={1} />}

      {/* Trace for perturbed pendulum */}
      {showTrace && perturbedPoints.length > 1 && (
        <Line points={perturbedPoints} color="#43a047" lineWidth={1} opacity={0.5} />
      )}

      {/* Controls */}
      <Html position={[3, 0, 0]}>
        <div className="bg-white p-4 rounded-lg shadow-lg w-64">
          <h3 className="text-lg font-bold mb-2">Chaos Demonstration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Initial Angle Difference: {sensitivity.toFixed(5)}</label>
              <Slider
                value={[sensitivity]}
                min={0.00001}
                max={0.01}
                step={0.00001}
                onValueChange={(value) => setSensitivity(value[0])}
              />
            </div>
            <Button size="sm" onClick={resetPendulum}>
              Reset
            </Button>
          </div>
        </div>
      </Html>

      {/* Explanatory text */}
      <Text position={[-3, 2, 0]} fontSize={0.2} color="#000" maxWidth={4} anchorX="left">
        {`Double Pendulum: A Chaotic System
        
The red trace shows the original pendulum.
The green trace shows a pendulum with a tiny difference in initial angle (${sensitivity.toFixed(5)} radians).

Notice how the paths diverge dramatically over time, demonstrating the butterfly effect and sensitivity to initial conditions.`}
      </Text>
    </group>
  )
}

// Lorenz attractor visualization
export function LorenzAttractor({
  position = [0, 0, 0],
  sigma = 10,
  rho = 28,
  beta = 8 / 3,
  scale = 0.1,
  traceLength = 1000,
  showTrace = true,
}) {
  const [tracePoints, setTracePoints] = useState([])
  const [parameters, setParameters] = useState({ sigma, rho, beta })

  const x = useRef(0.1)
  const y = useRef(0)
  const z = useRef(0)

  // Reset the system
  const resetSystem = () => {
    x.current = 0.1
    y.current = 0
    z.current = 0
    setTracePoints([])
  }

  // Physics simulation
  useFrame((state, delta) => {
    // Limit delta to prevent instability
    const dt = Math.min(delta, 0.005)

    // Lorenz system equations
    const dx = parameters.sigma * (y.current - x.current)
    const dy = x.current * (parameters.rho - z.current) - y.current
    const dz = x.current * y.current - parameters.beta * z.current

    // Update using RK4 integration for stability
    x.current += dx * dt
    y.current += dy * dt
    z.current += dz * dt

    // Scale for visualization
    const scaledX = x.current * scale
    const scaledY = y.current * scale
    const scaledZ = z.current * scale

    // Update trace
    if (showTrace) {
      setTracePoints((prev) => {
        const newPoints = [...prev, [position[0] + scaledX, position[1] + scaledY, position[2] + scaledZ]]
        if (newPoints.length > traceLength) {
          return newPoints.slice(newPoints.length - traceLength)
        }
        return newPoints
      })
    }
  })

  return (
    <group position={position}>
      {/* Current point */}
      <mesh position={[x.current * scale, y.current * scale, z.current * scale]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#e53935" />
      </mesh>

      {/* Trace */}
      {showTrace && tracePoints.length > 1 && <Line points={tracePoints} color="#1e88e5" lineWidth={1} />}

      {/* Controls */}
      <Html position={[3, 0, 0]}>
        <div className="bg-white p-4 rounded-lg shadow-lg w-64">
          <h3 className="text-lg font-bold mb-2">Lorenz Attractor</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">σ (sigma): {parameters.sigma.toFixed(1)}</label>
              <Slider
                value={[parameters.sigma]}
                min={1}
                max={20}
                step={0.1}
                onValueChange={(value) => setParameters((prev) => ({ ...prev, sigma: value[0] }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">ρ (rho): {parameters.rho.toFixed(1)}</label>
              <Slider
                value={[parameters.rho]}
                min={0.1}
                max={50}
                step={0.1}
                onValueChange={(value) => setParameters((prev) => ({ ...prev, rho: value[0] }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">β (beta): {parameters.beta.toFixed(2)}</label>
              <Slider
                value={[parameters.beta]}
                min={0.1}
                max={5}
                step={0.01}
                onValueChange={(value) => setParameters((prev) => ({ ...prev, beta: value[0] }))}
              />
            </div>
            <Button size="sm" onClick={resetSystem}>
              Reset
            </Button>
          </div>
        </div>
      </Html>

      {/* Explanatory text */}
      <Text position={[-3, 2, 0]} fontSize={0.2} color="#000" maxWidth={4} anchorX="left">
        {`Lorenz Attractor
        
A simple system of three differential equations that exhibits chaotic behavior.

The butterfly-shaped trajectory never repeats exactly, yet always stays within a bounded region of space (a strange attractor).

This demonstrates how deterministic systems can produce seemingly random behavior.`}
      </Text>
    </group>
  )
}

