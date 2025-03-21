"use client"

import { useEffect, useState } from "react"
import { Line, Html } from "@react-three/drei"
import { calculateTrajectory } from "@/lib/physics-utils"

// Component to visualize force vectors
export function ForceVector({ start, force, scale = 0.1, color = "#ff0000", label = null }) {
  const end = [start[0] + force[0] * scale, start[1] + force[1] * scale, start[2] + force[2] * scale]

  const magnitude = Math.sqrt(force[0] * force[0] + force[1] * force[1] + force[2] * force[2])

  return (
    <>
      <Line points={[start, end]} color={color} lineWidth={3} />
      {/* Arrow head */}
      <mesh position={end} rotation={[0, 0, Math.atan2(force[1], force[0])]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {label && (
        <Html position={end}>
          <div className="bg-white px-2 py-1 rounded text-xs">
            {label}: {magnitude.toFixed(1)} N
          </div>
        </Html>
      )}
    </>
  )
}

// Component to visualize trajectories
export function TrajectoryPath({
  initialPosition,
  initialVelocity,
  gravity = 9.81,
  color = "#4caf50",
  showPoints = false,
  timeStep = 0.1,
  steps = 100,
}) {
  const [trajectoryPoints, setTrajectoryPoints] = useState([])

  useEffect(() => {
    const points = calculateTrajectory(initialPosition, initialVelocity, gravity, timeStep, steps)
    setTrajectoryPoints(points)
  }, [initialPosition, initialVelocity, gravity, timeStep, steps])

  return (
    <>
      <Line points={trajectoryPoints} color={color} lineWidth={1} dashed={true} />
      {showPoints &&
        trajectoryPoints.map(
          (point, index) =>
            index % 5 === 0 && (
              <mesh key={index} position={point}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color={color} />
              </mesh>
            ),
        )}
    </>
  )
}

// Component to visualize energy bars
export function EnergyBars({ kineticEnergy, potentialEnergy, maxEnergy, position, showLabels = true }) {
  const kePercent = Math.min((kineticEnergy / maxEnergy) * 100, 100)
  const pePercent = Math.min((potentialEnergy / maxEnergy) * 100, 100)
  const totalEnergy = kineticEnergy + potentialEnergy
  const totalPercent = Math.min((totalEnergy / maxEnergy) * 100, 100)

  return (
    <group position={position}>
      {/* Background bars */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 2, 0.1]} />
        <meshBasicMaterial color="#333333" opacity={0.3} transparent />
      </mesh>

      {/* Total energy bar */}
      <mesh position={[0, -1 + totalPercent / 100 / 2, 0]}>
        <boxGeometry args={[0.55, Math.max(0.01, totalPercent / 50), 0.12]} />
        <meshBasicMaterial color="#9c27b0" />
      </mesh>

      {/* Kinetic energy bar */}
      <mesh position={[-0.15, -1 + kePercent / 100 / 2, 0]}>
        <boxGeometry args={[0.15, Math.max(0.01, kePercent / 50), 0.15]} />
        <meshBasicMaterial color="#e53935" />
      </mesh>

      {/* Potential energy bar */}
      <mesh position={[0.15, -1 + pePercent / 100 / 2, 0]}>
        <boxGeometry args={[0.15, Math.max(0.01, pePercent / 50), 0.15]} />
        <meshBasicMaterial color="#1e88e5" />
      </mesh>

      {/* Labels */}
      {showLabels && (
        <Html position={[0.7, 0, 0]}>
          <div className="space-y-1 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 mr-1"></div>
              <span>Total: {totalEnergy.toFixed(1)} J</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 mr-1"></div>
              <span>Kinetic: {kineticEnergy.toFixed(1)} J</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 mr-1"></div>
              <span>Potential: {potentialEnergy.toFixed(1)} J</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Component to visualize vector fields (e.g., electric, magnetic, gravitational)
export function VectorField({
  position = [0, 0, 0],
  size = [10, 10, 10],
  resolution = [5, 5, 5],
  fieldFunction,
  scale = 1,
  color = "#1e88e5",
}) {
  const vectors = []

  // Generate vector field points
  for (let i = 0; i < resolution[0]; i++) {
    for (let j = 0; j < resolution[1]; j++) {
      for (let k = 0; k < resolution[2]; k++) {
        const x = position[0] - size[0] / 2 + (i * size[0]) / (resolution[0] - 1)
        const y = position[1] - size[1] / 2 + (j * size[1]) / (resolution[1] - 1)
        const z = position[2] - size[2] / 2 + (k * size[2]) / (resolution[2] - 1)

        const fieldVector = fieldFunction(x, y, z)
        const magnitude = Math.sqrt(
          fieldVector[0] * fieldVector[0] + fieldVector[1] * fieldVector[1] + fieldVector[2] * fieldVector[2],
        )

        // Skip very small vectors
        if (magnitude < 0.01) continue

        vectors.push({
          position: [x, y, z],
          direction: fieldVector,
          magnitude,
        })
      }
    }
  }

  return (
    <group>
      {vectors.map((vector, index) => (
        <ForceVector key={index} start={vector.position} force={vector.direction} scale={scale} color={color} />
      ))}
    </group>
  )
}

// Component to visualize phase space for oscillatory systems
export function PhaseSpacePlot({
  position = [0, 0, 0],
  size = [2, 2, 0.1],
  xRange = [-2, 2],
  yRange = [-2, 2],
  points = [],
  maxPoints = 500,
  xLabel = "Position",
  yLabel = "Velocity",
  color = "#1e88e5",
}) {
  const [plotPoints, setPlotPoints] = useState([])

  // Update plot points
  useEffect(() => {
    setPlotPoints((prev) => {
      const newPoints = [...prev, ...points]
      if (newPoints.length > maxPoints) {
        return newPoints.slice(newPoints.length - maxPoints)
      }
      return newPoints
    })
  }, [points, maxPoints])

  // Map data coordinates to plot coordinates
  const mapToPlot = (x, y) => {
    const mappedX = position[0] - size[0] / 2 + ((x - xRange[0]) / (xRange[1] - xRange[0])) * size[0]
    const mappedY = position[1] - size[1] / 2 + ((y - yRange[0]) / (yRange[1] - yRange[0])) * size[1]
    return [mappedX, mappedY, position[2] + 0.01]
  }

  // Convert data points to plot points
  const mappedPoints = plotPoints.map((point) => mapToPlot(point[0], point[1]))

  return (
    <group position={position}>
      {/* Background */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[Math.max(0.001, size[0]), Math.max(0.001, size[1]), Math.max(0.001, size[2])]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Axes */}
      <Line
        points={[
          [position[0] - size[0] / 2, position[1], position[2] + 0.01],
          [position[0] + size[0] / 2, position[1], position[2] + 0.01],
        ]}
        color="#000000"
        lineWidth={1}
      />
      <Line
        points={[
          [position[0], position[1] - size[1] / 2, position[2] + 0.01],
          [position[0], position[1] + size[1] / 2, position[2] + 0.01],
        ]}
        color="#000000"
        lineWidth={1}
      />

      {/* Plot points */}
      {mappedPoints.length > 1 && <Line points={mappedPoints} color={color} lineWidth={1} />}

      {/* Current point */}
      {mappedPoints.length > 0 && (
        <mesh position={mappedPoints[mappedPoints.length - 1]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#e53935" />
        </mesh>
      )}

      {/* Labels */}
      <Html position={[0, -size[1] / 2 - 0.3, 0]}>
        <div className="text-xs font-medium">{xLabel}</div>
      </Html>
      <Html position={[-size[0] / 2 - 0.3, 0, 0]}>
        <div className="text-xs font-medium" style={{ transform: "rotate(-90deg)" }}>
          {yLabel}
        </div>
      </Html>
    </group>
  )
}

// Component to visualize bifurcation diagrams
export function BifurcationDiagram({
  position = [0, 0, 0],
  size = [4, 2, 0.1],
  paramRange = [2.8, 4.0],
  iterations = 1000,
  burnIn = 500,
  color = "#1e88e5",
}) {
  const [points, setPoints] = useState([])

  // Generate logistic map bifurcation diagram
  useEffect(() => {
    const newPoints = []
    const paramSteps = 200
    const paramStep = (paramRange[1] - paramRange[0]) / paramSteps

    for (let i = 0; i <= paramSteps; i++) {
      const r = paramRange[0] + i * paramStep
      let x = 0.5 // Initial value

      // Burn-in period
      for (let j = 0; j < burnIn; j++) {
        x = r * x * (1 - x)
      }

      // Record points
      for (let j = 0; j < iterations; j++) {
        x = r * x * (1 - x)
        if (j % 5 === 0) {
          // Only plot every 5th point to reduce density
          newPoints.push([r, x])
        }
      }
    }

    setPoints(newPoints)
  }, [paramRange, iterations, burnIn])

  // Map data coordinates to plot coordinates
  const mapToPlot = (r, x) => {
    const mappedX = position[0] - size[0] / 2 + ((r - paramRange[0]) / (paramRange[1] - paramRange[0])) * size[0]
    const mappedY = position[1] - size[1] / 2 + x * size[1]
    return [mappedX, mappedY, position[2] + 0.01]
  }

  return (
    <group position={position}>
      {/* Background */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[Math.max(0.001, size[0]), Math.max(0.001, size[1]), Math.max(0.001, size[2])]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Axes */}
      <Line
        points={[
          [position[0] - size[0] / 2, position[1] - size[1] / 2, position[2] + 0.01],
          [position[0] + size[0] / 2, position[1] - size[1] / 2, position[2] + 0.01],
        ]}
        color="#000000"
        lineWidth={1}
      />
      <Line
        points={[
          [position[0] - size[0] / 2, position[1] - size[1] / 2, position[2] + 0.01],
          [position[0] - size[0] / 2, position[1] + size[1] / 2, position[2] + 0.01],
        ]}
        color="#000000"
        lineWidth={1}
      />

      {/* Plot points */}
      {points.map((point, index) => (
        <mesh key={index} position={mapToPlot(point[0], point[1])}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}

      {/* Labels */}
      <Html position={[0, -size[1] / 2 - 0.3, 0]}>
        <div className="text-xs font-medium">Parameter (r)</div>
      </Html>
      <Html position={[-size[0] / 2 - 0.3, 0, 0]}>
        <div className="text-xs font-medium" style={{ transform: "rotate(-90deg)" }}>
          Value (x)
        </div>
      </Html>

      {/* Title */}
      <Html position={[0, size[1] / 2 + 0.3, 0]}>
        <div className="text-sm font-bold">Bifurcation Diagram: Logistic Map x_{n + 1} = r·x_n(1-x_n)</div>
      </Html>
    </group>
  )
}

