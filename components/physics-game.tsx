"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon"
import { OrbitControls, Text, Html, Line } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pause, BookOpen, ChevronRight, ChevronLeft, Maximize, Minimize, HelpCircle } from "lucide-react"

import LevelSelector from "./level-selector"
import TheoryMode from "./theory-mode"
import UIOverlay from "./ui-overlay"
import { ForceVector, TrajectoryPath, EnergyBars, PhaseSpacePlot } from "./physics-visualizations"
import { SpringMassSystem, Pendulum, DrivenOscillator } from "./advanced-physics/oscillation-system"
import { levels } from "@/lib/game-levels"
import { calculateKineticEnergy, calculatePotentialEnergy } from "@/lib/physics-utils"

export default function PhysicsGame() {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [gameState, setGameState] = useState("menu") // menu, playing, paused, completed
  const [showTheory, setShowTheory] = useState(false)
  const [playerScore, setPlayerScore] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showHints, setShowHints] = useState(true)
  const [objectivesCompleted, setObjectivesCompleted] = useState({})
  const [activeForce, setActiveForce] = useState([0, 0, 0])
  const [activeObjectId, setActiveObjectId] = useState(null)
  const [physicsParams, setPhysicsParams] = useState({
    gravity: 9.81,
    friction: 0.5,
    restitution: 0.7,
  })

  // Game state management
  const startGame = () => {
    setGameState("playing")
  }

  const pauseGame = () => {
    setGameState("paused")
  }

  const resumeGame = () => {
    setGameState("playing")
  }

  const resetLevel = () => {
    // Reset level state
    setGameState("playing")
    setActiveForce([0, 0, 0])
    setActiveObjectId(null)
    setObjectivesCompleted({})
  }

  const completeLevel = () => {
    // Mark level as completed
    setGameState("completed")

    // Award points if not already awarded
    if (!levels[currentLevel].completed) {
      setPlayerScore((prev) => prev + 100)

      // Mark level as completed
      levels[currentLevel].completed = true

      // Unlock next level if available
      if (currentLevel < levels.length - 1) {
        levels[currentLevel + 1].unlocked = true
      }
    }
  }

  const selectLevel = (levelIndex) => {
    setCurrentLevel(levelIndex)
    setGameState("playing")
    resetLevel()
  }

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1)
      setGameState("playing")
      resetLevel()
    }
  }

  const previousLevel = () => {
    if (currentLevel > 0) {
      setCurrentLevel(currentLevel - 1)
      setGameState("playing")
      resetLevel()
    }
  }

  // Complete an objective
  const completeObjective = (objectiveId) => {
    if (levels[currentLevel].objectives) {
      const objective = levels[currentLevel].objectives.find((obj) => obj.id === objectiveId)
      if (objective && !objective.completed) {
        objective.completed = true
        setObjectivesCompleted({ ...objectivesCompleted, [objectiveId]: true })

        // Award points
        setPlayerScore((prev) => prev + 20)

        // Check if all objectives are completed
        const allCompleted = levels[currentLevel].objectives.every((obj) => obj.completed)
        if (allCompleted) {
          completeLevel()
        }
      }
    }
  }

  // Apply force to an object
  const applyForce = (force) => {
    setActiveForce(force)
  }

  // Adjust physics parameters
  const adjustPhysicsParams = (params) => {
    setPhysicsParams({ ...physicsParams, ...params })
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  return (
    <div className={`relative ${fullscreen ? "fixed inset-0 z-50" : "w-full h-screen"}`}>
      {gameState === "menu" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70">
          <div className="text-center p-8 rounded-lg bg-background max-w-md">
            <h1 className="text-4xl font-bold mb-2">Physics Quest</h1>
            <h2 className="text-xl mb-6">The Laws of the Universe</h2>
            <p className="text-muted-foreground mb-6">
              Journey through different physics concepts, from Newton's Laws to Chaos Theory. Solve puzzles and restore
              balance to the simulation.
            </p>
            <Button onClick={startGame} className="mb-4 w-full">
              Start Game
            </Button>
            <LevelSelector levels={levels} onSelectLevel={selectLevel} playerScore={playerScore} />
          </div>
        </div>
      )}

      {gameState === "paused" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="text-center p-8 rounded-lg bg-background">
            <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
            <div className="space-y-2">
              <Button onClick={resumeGame} className="w-full">
                Resume
              </Button>
              <Button variant="outline" onClick={resetLevel} className="w-full">
                Reset Level
              </Button>
              <Button variant="outline" onClick={() => setShowTheory(true)} className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                Theory Mode
              </Button>
              <Button variant="outline" onClick={() => setGameState("menu")} className="w-full">
                Main Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {gameState === "completed" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="text-center p-8 rounded-lg bg-background">
            <h2 className="text-2xl font-bold mb-2">Level Completed!</h2>
            <p className="text-muted-foreground mb-4">
              You've successfully completed this level and earned 100 points.
            </p>

            <div className="mb-4 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Objectives Completed</h3>
              <ul className="text-sm text-left space-y-1">
                {levels[currentLevel].objectives.map((obj, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-4 h-4 mr-2">{obj.completed ? "✓" : "○"}</div>
                    {obj.description}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              {currentLevel < levels.length - 1 && (
                <Button onClick={nextLevel} className="w-full">
                  Next Level
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              <Button variant="outline" onClick={resetLevel} className="w-full">
                Replay Level
              </Button>
              <Button variant="outline" onClick={() => setGameState("menu")} className="w-full">
                Main Menu
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Game UI Controls */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        {gameState === "playing" && (
          <>
            <Button variant="outline" size="icon" onClick={toggleFullscreen}>
              {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowHints(!showHints)}>
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShowTheory(true)}>
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={pauseGame}>
              <Pause className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Level Navigation */}
      {gameState === "playing" && (
        <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousLevel} disabled={currentLevel === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Badge variant="outline" className="h-9 px-4">
            Level {currentLevel + 1}: {levels[currentLevel].title}
          </Badge>

          <Button
            variant="outline"
            size="icon"
            onClick={nextLevel}
            disabled={currentLevel === levels.length - 1 || !levels[currentLevel + 1].unlocked}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Hints Panel */}
      {gameState === "playing" && showHints && (
        <div className="absolute bottom-4 left-4 z-10 max-w-md">
          <Card className="p-4 bg-background/90">
            <h3 className="font-medium mb-2">Hints</h3>
            <ul className="text-sm space-y-1 list-disc pl-5">
              {levels[currentLevel].hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* Theory Mode */}
      {showTheory && <TheoryMode level={levels[currentLevel]} onClose={() => setShowTheory(false)} />}

      {/* 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <Physics
          gravity={[0, -physicsParams.gravity, 0]}
          defaultContactMaterial={{
            friction: physicsParams.friction,
            restitution: physicsParams.restitution,
          }}
        >
          {gameState === "playing" && (
            <Level
              levelData={levels[currentLevel]}
              onCompleteObjective={completeObjective}
              onCompleteLevel={completeLevel}
              activeForce={activeForce}
              activeObjectId={activeObjectId}
              setActiveObjectId={setActiveObjectId}
              physicsParams={physicsParams}
            />
          )}
        </Physics>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={20} />
      </Canvas>

      {/* Physics Controls UI */}
      {gameState === "playing" && (
        <UIOverlay level={levels[currentLevel]} onApplyForce={applyForce} onAdjustParameters={adjustPhysicsParams} />
      )}
    </div>
  )
}

function Level({
  levelData,
  onCompleteObjective,
  onCompleteLevel,
  activeForce,
  activeObjectId,
  setActiveObjectId,
  physicsParams,
}) {
  // This component will render the current level based on the level data
  const [objectPositions, setObjectPositions] = useState({})
  const [objectVelocities, setObjectVelocities] = useState({})
  const [goalReached, setGoalReached] = useState(false)
  const objectRefs = useRef({})

  // Special level types
  if (levelData.id === "oscillations") {
    return (
      <OscillationsLevel
        levelData={levelData}
        onCompleteObjective={onCompleteObjective}
        onCompleteLevel={onCompleteLevel}
      />
    )
  }

  // Check if goal is reached
  useEffect(() => {
    if (levelData.goal && levelData.goal.type === "reach" && objectPositions[levelData.goal.targetObjectId]) {
      const targetPos = objectPositions[levelData.goal.targetObjectId]
      const goalPos = levelData.goal.position
      const goalSize = levelData.goal.size

      // Check if object is within goal area
      const isInXRange = targetPos[0] >= goalPos[0] - goalSize[0] / 2 && targetPos[0] <= goalPos[0] + goalSize[0] / 2
      const isInYRange = targetPos[1] >= goalPos[1] - goalSize[1] / 2 && targetPos[1] <= goalPos[1] + goalSize[1] / 2
      const isInZRange = targetPos[2] >= goalPos[2] - goalSize[2] / 2 && targetPos[2] <= goalPos[2] + goalSize[2] / 2

      if (isInXRange && isInYRange && isInZRange && !goalReached) {
        setGoalReached(true)
        onCompleteObjective("move-box")
        setTimeout(() => {
          onCompleteLevel()
        }, 1000)
      }
    }
  }, [objectPositions, levelData.goal, goalReached, onCompleteObjective, onCompleteLevel])

  // Apply force to active object
  useEffect(() => {
    if (activeObjectId && objectRefs.current[activeObjectId] && activeForce.some((f) => f !== 0)) {
      objectRefs.current[activeObjectId].applyForce(activeForce, [0, 0, 0])

      // Complete the inertia-demo objective if a heavy object is moved
      const object = levelData.objects.find((obj) => obj.id === activeObjectId)
      if (object && object.mass > 3) {
        onCompleteObjective("inertia-demo")
      }
    }
  }, [activeForce, activeObjectId, onCompleteObjective, levelData.objects])

  // Track object positions and velocities for objectives
  useEffect(() => {
    // Check for balance-forces objective
    if (levelData.id === "newton-laws" && objectVelocities["player-box"]) {
      const velocity = objectVelocities["player-box"]
      const speed = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1] + velocity[2] * velocity[2])

      // If object is nearly stationary for a while, complete the balance objective
      if (speed < 0.1) {
        onCompleteObjective("balance-forces")
      }
    }
  }, [objectVelocities, levelData.id, onCompleteObjective])

  // Default level renderer
  return (
    <>
      <Ground friction={physicsParams.friction} />

      {/* Render obstacles */}
      {levelData.obstacles &&
        levelData.obstacles.map((obstacle, index) => <Obstacle key={`obstacle-${index}`} {...obstacle} />)}

      {/* Render interactive objects */}
      {levelData.objects &&
        levelData.objects.map((obj, index) => (
          <PhysicsObject
            key={`object-${index}`}
            {...obj}
            isActive={activeObjectId === obj.id}
            setActiveObjectId={setActiveObjectId}
            objectRefs={objectRefs}
            updatePosition={(position) => {
              setObjectPositions((prev) => ({ ...prev, [obj.id]: position }))
            }}
            updateVelocity={(velocity) => {
              setObjectVelocities((prev) => ({ ...prev, [obj.id]: velocity }))
            }}
          />
        ))}

      {/* Render goal */}
      <LevelGoal {...levelData.goal} isReached={goalReached} />

      {/* Add physics visualizations based on level type */}
      {levelData.id === "projectiles" && (
        <TrajectoryPath
          initialPosition={[0, 1, 0]}
          initialVelocity={[5, 8, 0]}
          gravity={physicsParams.gravity}
          showPoints={true}
        />
      )}

      {levelData.id === "energy" && (
        <EnergyBars
          kineticEnergy={objectVelocities["player-box"] ? calculateKineticEnergy(1, objectVelocities["player-box"]) : 0}
          potentialEnergy={
            objectPositions["player-box"]
              ? calculatePotentialEnergy(1, objectPositions["player-box"][1], physicsParams.gravity)
              : 0
          }
          maxEnergy={50}
          position={[-5, 3, 0]}
        />
      )}

      {levelData.id === "momentum" && activeObjectId && objectVelocities[activeObjectId] && (
        <ForceVector
          start={objectPositions[activeObjectId] || [0, 1, 0]}
          force={objectVelocities[activeObjectId].map(
            (v) => v * levelData.objects.find((o) => o.id === activeObjectId).mass,
          )}
          scale={0.2}
          label="Momentum"
        />
      )}

      {/* Level-specific instructions */}
      <Text position={[0, 6, 0]} fontSize={0.4} color="#000" anchorX="center">
        {levelData.title}
      </Text>
      <Text position={[0, 5.5, 0]} fontSize={0.25} color="#333" anchorX="center">
        {levelData.id === "newton-laws"
          ? "Select an object and apply forces to move it to the green target area"
          : levelData.id === "projectiles"
            ? "Adjust launch angle and speed to hit the target"
            : levelData.id === "momentum"
              ? "Use collisions to move the heavy block to the target"
              : levelData.id === "energy"
                ? "Convert potential energy to kinetic energy to reach the goal"
                : "Complete the level objectives"}
      </Text>
    </>
  )
}

// Special level for oscillations
function OscillationsLevel({ levelData, onCompleteObjective, onCompleteLevel }) {
  const [springParams, setSpringParams] = useState({
    springConstant: 5,
    mass: 1,
    damping: 0.1,
  })

  const [pendulumParams, setPendulumParams] = useState({
    length: 3,
    mass: 2,
    initialAngle: Math.PI / 6,
    damping: 0.1,
  })

  const [drivenOscillatorParams, setDrivenOscillatorParams] = useState({
    springConstant: 5,
    mass: 1,
    damping: 0.1,
    drivingFrequency: 0.5,
    drivingAmplitude: 0.5,
  })

  const [phaseSpacePoints, setPhaseSpacePoints] = useState([])
  const [maxAmplitude, setMaxAmplitude] = useState(0)

  // Track oscillator state for objectives
  const handleSpringPositionUpdate = (displacement, velocity) => {
    setPhaseSpacePoints((prev) => {
      const newPoints = [...prev, [displacement, velocity]]
      if (newPoints.length > 100) {
        return newPoints.slice(newPoints.length - 100)
      }
      return newPoints
    })

    // Check for simple harmonic motion objective
    if (Math.abs(displacement) > 0.5 && Math.abs(velocity) > 1.0) {
      onCompleteObjective("simple-harmonic")
    }
  }

  const handlePendulumAngleUpdate = (angle, angularVelocity) => {
    // Check for pendulum period objective
    // This would need more sophisticated tracking of period over time
    if (Math.abs(angle) > Math.PI / 4 && Math.abs(angularVelocity) > 1.0) {
      onCompleteObjective("pendulum-period")
    }
  }

  const handleAmplitudeUpdate = (amplitude) => {
    setMaxAmplitude(amplitude)

    // Check for resonance objective
    if (amplitude > 1.5) {
      onCompleteObjective("resonance")

      // If amplitude exceeds required threshold, complete level
      if (amplitude > levelData.goal.requiredAmplitude) {
        onCompleteLevel()
      }
    }
  }

  return (
    <>
      <Ground />

      {/* Spring-mass system */}
      <SpringMassSystem
        position={[-3, 5, 0]}
        springConstant={springParams.springConstant}
        mass={springParams.mass}
        damping={springParams.damping}
        initialDisplacement={1}
        onPositionUpdate={handleSpringPositionUpdate}
      />

      {/* Pendulum */}
      <Pendulum
        position={[0, 5, 0]}
        length={pendulumParams.length}
        bobMass={pendulumParams.mass}
        initialAngle={pendulumParams.initialAngle}
        damping={pendulumParams.damping}
        onAngleUpdate={handlePendulumAngleUpdate}
      />

      {/* Driven oscillator */}
      <DrivenOscillator
        position={[3, 5, 0]}
        springConstant={drivenOscillatorParams.springConstant}
        mass={drivenOscillatorParams.mass}
        damping={drivenOscillatorParams.damping}
        drivingFrequency={drivenOscillatorParams.drivingFrequency}
        drivingAmplitude={drivenOscillatorParams.drivingAmplitude}
        onAmplitudeUpdate={handleAmplitudeUpdate}
      />

      {/* Phase space plot */}
      <PhaseSpacePlot position={[-3, 2, 0]} points={phaseSpacePoints} xLabel="Position" yLabel="Velocity" />

      {/* Goal indicator */}
      <Text position={[3, 2, 0]} fontSize={0.2} color="#000" anchorX="center">
        {`Current Amplitude: ${maxAmplitude.toFixed(2)}
Target: ${levelData.goal.requiredAmplitude.toFixed(2)}`}
      </Text>

      {/* Instructions */}
      <Text position={[0, 7, 0]} fontSize={0.3} color="#000" anchorX="center">
        Adjust the driving frequency to achieve resonance
      </Text>
    </>
  )
}

function Ground({ friction = 0.5 }) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction },
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  )
}

function Obstacle({ position, size, rotation = [0, 0, 0], color, type }) {
  // Ensure size values are positive
  const safeSize = size ? size.map((dim) => Math.max(0.001, dim)) : [1, 1, 1]

  const [ref] = useBox(() => ({
    args: safeSize,
    position,
    rotation,
    type: "Static",
  }))

  if (type === "ramp") {
    return (
      <mesh ref={ref} position={position} rotation={rotation} castShadow receiveShadow>
        <boxGeometry args={safeSize} />
        <meshStandardMaterial color={color || "#78909c"} />
      </mesh>
    )
  }

  return (
    <mesh ref={ref} position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={safeSize} />
      <meshStandardMaterial color={color || "#78909c"} />
    </mesh>
  )
}

function PhysicsObject({
  id,
  position,
  size,
  mass,
  type,
  color,
  interactive,
  velocity = [0, 0, 0],
  isActive,
  setActiveObjectId,
  objectRefs,
  updatePosition,
  updateVelocity,
}) {
  // Ensure size values are positive
  const safeSize = size ? size.map((dim) => Math.max(0.001, dim)) : [1, 1, 1]

  // Use appropriate physics hook based on object type
  const [ref, api] =
    type === "sphere"
      ? useSphere(() => ({
          mass: mass || 1,
          position: position || [0, 1, 0],
          args: [Math.max(0.001, safeSize[0] / 2)],
          linearVelocity: velocity,
          material: { restitution: 0.7 },
        }))
      : useBox(() => ({
          mass: mass || 1,
          position: position || [0, 1, 0],
          args: safeSize,
          linearVelocity: velocity,
          material: { restitution: 0.7 },
        }))

  // Store ref in parent component's refs object
  useEffect(() => {
    if (id) {
      objectRefs.current[id] = api
    }

    // Cleanup
    return () => {
      if (id && objectRefs.current[id]) {
        delete objectRefs.current[id]
      }
    }
  }, [id, api, objectRefs])

  // Update position and velocity for tracking
  useEffect(() => {
    let unsubPosition, unsubVelocity

    if (updatePosition) {
      unsubPosition = api.position.subscribe((pos) => {
        updatePosition(pos)
      })
    }

    if (updateVelocity) {
      unsubVelocity = api.velocity.subscribe((vel) => {
        updateVelocity(vel)
      })
    }

    return () => {
      if (unsubPosition) unsubPosition()
      if (unsubVelocity) unsubVelocity()
    }
  }, [api, updatePosition, updateVelocity])

  // Handle interaction
  const handleClick = (e) => {
    e.stopPropagation()
    if (interactive && setActiveObjectId) {
      setActiveObjectId(id)
    }
  }

  if (type === "sphere") {
    return (
      <mesh ref={ref} castShadow receiveShadow onClick={handleClick}>
        <sphereGeometry args={[Math.max(0.001, safeSize[0] / 2), 32, 32]} />
        <meshStandardMaterial
          color={color || "#1e88e5"}
          emissive={isActive ? "#ffffff" : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </mesh>
    )
  }

  return (
    <mesh ref={ref} castShadow receiveShadow onClick={handleClick}>
      <boxGeometry args={safeSize} />
      <meshStandardMaterial
        color={color || "#1e88e5"}
        emissive={isActive ? "#ffffff" : "#000000"}
        emissiveIntensity={isActive ? 0.3 : 0}
      />
    </mesh>
  )
}

function LevelGoal({ position, size = [1, 0.1, 1], type, targetObjectId, isReached }) {
  // Ensure size values are positive
  const safeSize = size ? size.map((dim) => Math.max(0.001, dim)) : [1, 0.1, 1]

  return (
    <mesh position={position} castShadow>
      <boxGeometry args={safeSize} />
      <meshStandardMaterial
        color={isReached ? "#8bc34a" : "#4caf50"}
        emissive={isReached ? "#8bc34a" : "#4caf50"}
        emissiveIntensity={isReached ? 1 : 0.5}
        transparent
        opacity={0.7}
      />
    </mesh>
  )
}

// Projectile launcher for projectile motion level
function ProjectileLauncher({ position, onLaunch }) {
  const [angle, setAngle] = useState(45)
  const [power, setPower] = useState(10)

  const launch = () => {
    // Convert angle to radians
    const angleRad = (angle * Math.PI) / 180

    // Calculate velocity components
    const vx = Math.cos(angleRad) * power
    const vy = Math.sin(angleRad) * power

    onLaunch([vx, vy, 0])
  }

  return (
    <group position={position}>
      {/* Launcher base */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1, 0.4, 1]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* Launcher barrel */}
      <group rotation={[0, 0, (angle * Math.PI) / 180]}>
        <mesh position={[0.75, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#777" />
        </mesh>
      </group>

      {/* Controls */}
      <Html position={[0, 1.5, 0]}>
        <div className="bg-white p-3 rounded-lg shadow-lg w-48">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Angle: {angle}°</label>
              <input
                type="range"
                min="0"
                max="90"
                value={angle}
                onChange={(e) => setAngle(Number.parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Power: {power}</label>
              <input
                type="range"
                min="1"
                max="20"
                value={power}
                onChange={(e) => setPower(Number.parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <button onClick={launch} className="w-full bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">
              Launch
            </button>
          </div>
        </div>
      </Html>
    </group>
  )
}

// Projectile for projectile motion level
function Projectile({ initialPosition, onHit }) {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: initialPosition,
    args: [0.25],
    material: { restitution: 0.7 },
    collisionFilterGroup: 1,
    collisionFilterMask: 1,
    onCollide: (e) => {
      // Check if collision is with the ground or target
      if (e.body.name === "target") {
        onHit()
      }
    },
  }))

  const [trail, setTrail] = useState([])
  const [position, setPosition] = useState(initialPosition)

  // Update position and trail
  useEffect(() => {
    const unsubPosition = api.position.subscribe((pos) => {
      setPosition(pos)
      setTrail((prev) => {
        const newTrail = [...prev, [...pos]]
        if (newTrail.length > 50) {
          return newTrail.slice(newTrail.length - 50)
        }
        return newTrail
      })
    })

    return () => {
      unsubPosition()
    }
  }, [api])

  return (
    <>
      <mesh ref={ref} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#e53935" />
      </mesh>

      {/* Trail */}
      {trail.length > 1 && <Line points={trail} color="#e53935" lineWidth={1} dashed={false} />}
    </>
  )
}

// Target for projectile motion level
function Target({ position, size, onHit }) {
  const [ref] = useBox(() => ({
    type: "Static",
    position,
    args: size,
    material: { restitution: 0.2 },
    name: "target",
  }))

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#4caf50" transparent opacity={0.8} />
    </mesh>
  )
}

