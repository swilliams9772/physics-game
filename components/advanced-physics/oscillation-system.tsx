"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpring, a } from "@react-spring/three"
import { Text, Line } from "@react-three/drei"

// Spring-mass system with damping and driving force
export function SpringMassSystem({
  position = [0, 0, 0],
  springConstant = 5,
  mass = 1,
  initialDisplacement = 1,
  damping = 0.1,
  drivingForce = 0,
  drivingFrequency = 0,
  color = "#1e88e5",
  interactive = true,
  onPositionUpdate = null,
}) {
  const massRef = useRef()
  const time = useRef(0)
  const displacement = useRef(initialDisplacement)
  const velocity = useRef(0)

  // Calculate natural frequency
  const naturalFrequency = Math.sqrt(springConstant / mass)

  // Spring animation
  const [spring, api] = useSpring(() => ({
    position: [position[0], position[1] - initialDisplacement, position[2]],
    config: { mass: 1, tension: 280, friction: 60 },
  }))

  // Physics simulation
  useFrame((state, delta) => {
    time.current += delta

    // Calculate forces
    const springForce = -springConstant * displacement.current
    const dampingForce = -damping * velocity.current
    const driving = drivingForce * Math.sin(drivingFrequency * time.current)

    // Calculate acceleration (F = ma)
    const acceleration = (springForce + dampingForce + driving) / mass

    // Update velocity and position using semi-implicit Euler integration
    velocity.current += acceleration * delta
    displacement.current += velocity.current * delta

    // Update spring position
    api.start({ position: [position[0], position[1] - displacement.current, position[2]] })

    // Call position update callback if provided
    if (onPositionUpdate) {
      onPositionUpdate(displacement.current, velocity.current)
    }
  })

  // Draw spring and mass using lines instead of cylinders
  return (
    <group position={position}>
      {/* Anchor point */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* Spring (simplified representation using zigzag line) */}
      <SpringLine start={[0, 0, 0]} end={[0, -displacement.current, 0]} segments={10} width={0.2} color="#999" />

      {/* Mass */}
      <a.mesh ref={massRef} {...spring}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} />
      </a.mesh>

      {/* Display natural frequency */}
      <Text position={[1, 0, 0]} fontSize={0.2} color="#000" anchorX="left">
        {`f₀ = ${naturalFrequency.toFixed(2)} Hz`}
      </Text>
    </group>
  )
}

// Helper component to draw a spring as a zigzag line
function SpringLine({ start, end, segments = 10, width = 0.2, color = "#999" }) {
  const points = []

  // Create zigzag pattern
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const x = start[0] + (i % 2 === 0 ? -width / 2 : width / 2)
    const y = start[1] + (end[1] - start[1]) * t
    const z = start[2]
    points.push([x, y, z])
  }

  return <Line points={points} color={color} lineWidth={2} />
}

// Pendulum system
export function Pendulum({
  position = [0, 0, 0],
  length = 3,
  bobMass = 1,
  initialAngle = Math.PI / 6,
  damping = 0.1,
  gravity = 9.81,
  color = "#e53935",
  interactive = true,
  onAngleUpdate = null,
}) {
  const pivotRef = useRef()
  const bobRef = useRef()
  const time = useRef(0)
  const angle = useRef(initialAngle)
  const angularVelocity = useRef(0)

  // Ensure positive length
  const safeLength = Math.max(0.001, length)

  // Calculate natural frequency
  const naturalFrequency = Math.sqrt(gravity / safeLength) / (2 * Math.PI)

  // Physics simulation
  useFrame((state, delta) => {
    time.current += delta

    // Calculate angular acceleration (simplified pendulum equation)
    // For small angles: d²θ/dt² = -(g/L)θ
    // For any angle: d²θ/dt² = -(g/L)sin(θ)
    const angularAcceleration = -(gravity / safeLength) * Math.sin(angle.current) - damping * angularVelocity.current

    // Update angular velocity and angle
    angularVelocity.current += angularAcceleration * delta
    angle.current += angularVelocity.current * delta

    // Calculate bob position
    const bobX = position[0] + Math.sin(angle.current) * safeLength
    const bobY = position[1] - Math.cos(angle.current) * safeLength

    // Update bob position
    if (bobRef.current) {
      bobRef.current.position.x = bobX
      bobRef.current.position.y = bobY
      bobRef.current.position.z = position[2]
    }

    // Call angle update callback if provided
    if (onAngleUpdate) {
      onAngleUpdate(angle.current, angularVelocity.current)
    }
  })

  // Draw pendulum using a line instead of a cylinder
  return (
    <group>
      {/* Pivot point */}
      <mesh ref={pivotRef} position={position}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* Rod as a line */}
      <Line
        points={[
          position,
          [
            position[0] + Math.sin(angle.current) * safeLength,
            position[1] - Math.cos(angle.current) * safeLength,
            position[2],
          ],
        ]}
        color="#999"
        lineWidth={3}
      />

      {/* Bob */}
      <mesh
        ref={bobRef}
        position={[
          position[0] + Math.sin(angle.current) * safeLength,
          position[1] - Math.cos(angle.current) * safeLength,
          position[2],
        ]}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Display natural frequency */}
      <Text position={[position[0] + 1, position[1], position[2]]} fontSize={0.2} color="#000" anchorX="left">
        {`f₀ = ${naturalFrequency.toFixed(2)} Hz`}
      </Text>
    </group>
  )
}

// Driven oscillator with resonance
export function DrivenOscillator({
  position = [0, 0, 0],
  springConstant = 5,
  mass = 1,
  damping = 0.1,
  drivingFrequency = 0.5,
  drivingAmplitude = 0.5,
  color = "#43a047",
  interactive = true,
  onAmplitudeUpdate = null,
}) {
  const oscillatorRef = useRef()
  const time = useRef(0)
  const displacement = useRef(0)
  const velocity = useRef(0)
  const maxAmplitude = useRef(0)

  // Calculate natural frequency
  const naturalFrequency = Math.sqrt(springConstant / mass) / (2 * Math.PI)

  // Spring animation
  const [spring, api] = useSpring(() => ({
    position: [position[0], position[1], position[2]],
    config: { mass: 1, tension: 280, friction: 60 },
  }))

  // Physics simulation
  useFrame((state, delta) => {
    time.current += delta

    // Calculate driving force
    const driving = drivingAmplitude * Math.sin(2 * Math.PI * drivingFrequency * time.current)

    // Calculate forces
    const springForce = -springConstant * displacement.current
    const dampingForce = -damping * velocity.current

    // Calculate acceleration (F = ma)
    const acceleration = (springForce + dampingForce + driving) / mass

    // Update velocity and position
    velocity.current += acceleration * delta
    displacement.current += velocity.current * delta

    // Track amplitude
    if (Math.abs(displacement.current) > maxAmplitude.current) {
      maxAmplitude.current = Math.abs(displacement.current)
    }

    // Decay max amplitude slowly to track changes
    maxAmplitude.current *= 0.999

    // Update oscillator position
    api.start({ position: [position[0], position[1] + displacement.current, position[2]] })

    // Call amplitude update callback if provided
    if (onAmplitudeUpdate) {
      onAmplitudeUpdate(maxAmplitude.current)
    }
  })

  // Draw oscillator using lines instead of cylinders
  return (
    <group position={position}>
      {/* Fixed base */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[1, 0.2, 1]} />
        <meshStandardMaterial color="#666" />
      </mesh>

      {/* Spring (simplified) */}
      <SpringLine start={[0, -0.9, 0]} end={[0, displacement.current, 0]} segments={10} width={0.2} color="#999" />

      {/* Mass */}
      <a.mesh ref={oscillatorRef} {...spring}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color={color} />
      </a.mesh>

      {/* Display frequencies */}
      <Text position={[1, 0, 0]} fontSize={0.15} color="#000" anchorX="left">
        {`f₀ = ${naturalFrequency.toFixed(2)} Hz\nf_drive = ${drivingFrequency.toFixed(2)} Hz\nAmplitude = ${maxAmplitude.current.toFixed(2)}`}
      </Text>
    </group>
  )
}

