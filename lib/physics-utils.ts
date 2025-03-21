// Utility functions for physics calculations

// Calculate force vector given mass and acceleration
export function calculateForce(mass: number, acceleration: [number, number, number]): [number, number, number] {
  return [mass * acceleration[0], mass * acceleration[1], mass * acceleration[2]]
}

// Calculate projectile trajectory points
export function calculateTrajectory(
  initialPosition: [number, number, number],
  initialVelocity: [number, number, number],
  gravity = 9.81,
  timeStep = 0.1,
  steps = 100,
): Array<[number, number, number]> {
  const trajectory: Array<[number, number, number]> = [initialPosition]
  let position: [number, number, number] = [...initialPosition] as [number, number, number]
  const velocity: [number, number, number] = [...initialVelocity] as [number, number, number]

  for (let i = 0; i < steps; i++) {
    // Update velocity (only y-component affected by gravity)
    velocity[1] -= gravity * timeStep

    // Update position
    position = [
      position[0] + velocity[0] * timeStep,
      position[1] + velocity[1] * timeStep,
      position[2] + velocity[2] * timeStep,
    ]

    // Add to trajectory
    trajectory.push([...position])

    // Stop if we hit the ground
    if (position[1] <= 0) break
  }

  return trajectory
}

// Calculate kinetic energy
export function calculateKineticEnergy(mass: number, velocity: [number, number, number]): number {
  const speed = Math.sqrt(velocity[0] * velocity[0] + velocity[1] * velocity[1] + velocity[2] * velocity[2])
  return 0.5 * mass * speed * speed
}

// Calculate potential energy (gravitational)
export function calculatePotentialEnergy(mass: number, height: number, gravity = 9.81): number {
  return mass * gravity * Math.max(0, height) // Ensure height is not negative
}

// Calculate momentum
export function calculateMomentum(mass: number, velocity: [number, number, number]): [number, number, number] {
  return [mass * velocity[0], mass * velocity[1], mass * velocity[2]]
}

// Calculate distance between two points
export function calculateDistance(point1: [number, number, number], point2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2) + Math.pow(point2[2] - point1[2], 2),
  )
}

// Calculate optimal launch angle for maximum distance (without air resistance)
export function calculateOptimalLaunchAngle(initialHeight: number, targetHeight: number, gravity = 9.81): number {
  if (initialHeight === targetHeight) {
    return 45 // 45 degrees is optimal for flat ground
  }

  // For different heights, the calculation is more complex
  const heightDifference = targetHeight - initialHeight
  return Math.atan(1 / Math.sqrt(1 + (2 * gravity * heightDifference) / (initialHeight * gravity))) * (180 / Math.PI)
}

// Calculate work done by a force
export function calculateWork(force: [number, number, number], displacement: [number, number, number]): number {
  return force[0] * displacement[0] + force[1] * displacement[1] + force[2] * displacement[2]
}

// Calculate impulse (change in momentum)
export function calculateImpulse(force: [number, number, number], timeInterval: number): [number, number, number] {
  return [force[0] * timeInterval, force[1] * timeInterval, force[2] * timeInterval]
}

