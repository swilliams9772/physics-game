// Enhanced level system with more detailed designs and progression mechanics
export const levels = [
  {
    id: "newton-laws",
    title: "Foundations of Mechanics",
    topic: "Newton's Laws of Motion",
    description: "Apply forces to objects and observe how they behave according to Newton's laws of motion.",
    unlocked: true,
    requiredScore: 0,
    objectives: [
      { id: "move-box", description: "Move the blue box to the target area", completed: false },
      { id: "balance-forces", description: "Balance forces to keep an object stationary", completed: false },
      {
        id: "inertia-demo",
        description: "Demonstrate inertia by moving objects of different masses",
        completed: false,
      },
    ],
    objects: [
      {
        id: "player-box",
        type: "box",
        position: [0, 1, 0],
        size: [1, 1, 1],
        mass: 1,
        color: "#1e88e5",
        interactive: true,
      },
      {
        id: "heavy-box",
        type: "box",
        position: [3, 1, 0],
        size: [1, 1, 1],
        mass: 5,
        color: "#e53935",
        interactive: true,
      },
      {
        id: "light-box",
        type: "box",
        position: [-3, 1, 0],
        size: [1, 1, 1],
        mass: 0.2,
        color: "#43a047",
        interactive: true,
      },
    ],
    obstacles: [
      { type: "wall", position: [0, 1, -5], size: [10, 2, 0.5], color: "#78909c" },
      { type: "wall", position: [5, 1, 0], size: [0.5, 2, 10], color: "#78909c" },
      { type: "wall", position: [-5, 1, 0], size: [0.5, 2, 10], color: "#78909c" },
      { type: "wall", position: [0, 1, 5], size: [10, 2, 0.5], color: "#78909c" },
    ],
    goal: {
      position: [4, 0.5, 4],
      size: [2, 0.1, 2],
      type: "reach",
      targetObjectId: "player-box",
    },
    hints: [
      "Remember: Force equals mass times acceleration (F=ma)",
      "Heavier objects require more force to move the same distance",
      "Objects at rest stay at rest unless acted upon by a force",
    ],
    theory: {
      title: "Newton's Laws of Motion",
      content: [
        {
          subtitle: "First Law (Law of Inertia)",
          text: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an external force.",
        },
        {
          subtitle: "Second Law (F=ma)",
          text: "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.",
        },
        {
          subtitle: "Third Law (Action-Reaction)",
          text: "For every action, there is an equal and opposite reaction.",
        },
      ],
      equations: [
        { name: "Newton's Second Law", equation: "F = ma" },
        { name: "Net Force", equation: "F_net = ∑F" },
        { name: "Weight", equation: "W = mg" },
      ],
    },
  },
  {
    id: "projectiles",
    title: "Forces & Trajectories",
    topic: "Projectile Motion",
    description: "Adjust launch angles and speeds to hit targets, accounting for gravity and air resistance.",
    unlocked: true,
    requiredScore: 80,
    objectives: [
      { id: "hit-target", description: "Hit the target with a projectile", completed: false },
      { id: "optimal-angle", description: "Find the optimal launch angle for maximum distance", completed: false },
      {
        id: "air-resistance",
        description: "Observe the effects of air resistance on projectile motion",
        completed: false,
      },
    ],
    objects: [
      {
        id: "projectile",
        type: "sphere",
        position: [0, 1, 0],
        size: [0.5, 0.5, 0.5],
        mass: 1,
        color: "#1e88e5",
        interactive: true,
        launchable: true,
      },
    ],
    obstacles: [
      { type: "wall", position: [0, 1, -5], size: [20, 2, 0.5], color: "#78909c" },
      { type: "wall", position: [-5, 1, 0], size: [0.5, 2, 10], color: "#78909c" },
    ],
    goal: {
      position: [8, 0.5, 0],
      size: [1, 0.1, 1],
      type: "hit",
      targetObjectId: "projectile",
    },
    environmentSettings: {
      gravity: 9.81,
      airResistance: 0.1,
      wind: [0, 0, 0],
    },
    hints: [
      "The trajectory of a projectile is a parabola",
      "Air resistance affects lighter objects more than heavier ones",
      "The optimal angle for maximum distance is 45 degrees (without air resistance)",
    ],
    theory: {
      title: "Projectile Motion",
      content: [
        {
          subtitle: "Kinematics in Two Dimensions",
          text: "Projectile motion can be analyzed by separating it into horizontal and vertical components. Horizontally, velocity is constant (without air resistance). Vertically, objects accelerate due to gravity.",
        },
        {
          subtitle: "Air Resistance",
          text: "Air resistance creates a force opposing motion that is proportional to velocity (linear) or velocity squared (quadratic), depending on the speed regime.",
        },
      ],
      equations: [
        { name: "Horizontal Position", equation: "x = x₀ + v₀ₓt" },
        { name: "Vertical Position", equation: "y = y₀ + v₀ᵧt - ½gt²" },
        { name: "Range (no air resistance)", equation: "R = (v₀² sin(2θ))/g" },
        { name: "Time of Flight", equation: "t = (2v₀ sin(θ))/g" },
      ],
    },
  },
  {
    id: "momentum",
    title: "Momentum & Collisions",
    topic: "Conservation of Momentum",
    description: "Use collisions and conservation of momentum to solve puzzles.",
    unlocked: false,
    requiredScore: 160,
    objectives: [
      { id: "elastic-collision", description: "Create an elastic collision between two objects", completed: false },
      { id: "inelastic-collision", description: "Create an inelastic collision between two objects", completed: false },
      { id: "momentum-transfer", description: "Transfer momentum to move a heavy object", completed: false },
    ],
    objects: [
      {
        id: "ball-1",
        type: "sphere",
        position: [-5, 1, 0],
        size: [1, 1, 1],
        mass: 2,
        color: "#1e88e5",
        interactive: true,
        velocity: [0, 0, 0],
      },
      {
        id: "ball-2",
        type: "sphere",
        position: [0, 1, 0],
        size: [1, 1, 1],
        mass: 1,
        color: "#e53935",
        interactive: true,
        velocity: [0, 0, 0],
      },
      {
        id: "heavy-block",
        type: "box",
        position: [3, 1, 0],
        size: [2, 1, 1],
        mass: 10,
        color: "#5e35b1",
        interactive: true,
        velocity: [0, 0, 0],
      },
    ],
    obstacles: [
      { type: "wall", position: [0, 1, -5], size: [20, 2, 0.5], color: "#78909c" },
      { type: "wall", position: [0, 1, 5], size: [20, 2, 0.5], color: "#78909c" },
      { type: "wall", position: [-10, 1, 0], size: [0.5, 2, 10], color: "#78909c" },
    ],
    goal: {
      position: [8, 0.5, 0],
      size: [1, 0.1, 1],
      type: "reach",
      targetObjectId: "heavy-block",
    },
    collisionSettings: {
      elasticity: 0.8, // Can be adjusted by player
      friction: 0.1,
    },
    hints: [
      "Momentum is conserved in collisions (p=mv)",
      "In elastic collisions, kinetic energy is also conserved",
      "The momentum transfer depends on the mass ratio of the colliding objects",
    ],
    theory: {
      title: "Momentum and Collisions",
      content: [
        {
          subtitle: "Linear Momentum",
          text: "Linear momentum is the product of an object's mass and velocity. In an isolated system, the total momentum is conserved.",
        },
        {
          subtitle: "Elastic Collisions",
          text: "In an elastic collision, both momentum and kinetic energy are conserved. The objects bounce off each other.",
        },
        {
          subtitle: "Inelastic Collisions",
          text: "In an inelastic collision, momentum is conserved but kinetic energy is not. Some energy is converted to heat, sound, or deformation.",
        },
      ],
      equations: [
        { name: "Momentum", equation: "p = mv" },
        { name: "Conservation of Momentum", equation: "m₁v₁ + m₂v₂ = m₁v₁' + m₂v₂'" },
        { name: "Kinetic Energy", equation: "K = ½mv²" },
        { name: "Coefficient of Restitution", equation: "e = |v₂' - v₁'|/|v₁ - v₂|" },
      ],
    },
  },
  {
    id: "energy",
    title: "Energy & Work",
    topic: "Work-Energy Principle",
    description: "Explore energy transformations and the work-energy theorem.",
    unlocked: false,
    requiredScore: 240,
    objectives: [
      { id: "energy-conversion", description: "Convert potential energy to kinetic energy", completed: false },
      { id: "work-calculation", description: "Calculate work done against gravity", completed: false },
      { id: "energy-conservation", description: "Demonstrate conservation of energy", completed: false },
    ],
    objects: [
      {
        id: "player-box",
        type: "box",
        position: [0, 5, 0],
        size: [1, 1, 1],
        mass: 1,
        color: "#1e88e5",
        interactive: true,
      },
      {
        id: "pendulum",
        type: "pendulum",
        position: [-3, 5, 0],
        length: 3,
        bobMass: 2,
        color: "#e53935",
        interactive: true,
      },
    ],
    obstacles: [
      { type: "ramp", position: [3, 0, 0], size: [6, 3, 2], rotation: [-Math.PI / 8, 0, 0], color: "#78909c" },
      { type: "wall", position: [0, 1, -5], size: [20, 2, 0.5], color: "#78909c" },
      { type: "wall", position: [0, 1, 5], size: [20, 2, 0.5], color: "#78909c" },
      { type: "wall", position: [-10, 1, 0], size: [0.5, 2, 10], color: "#78909c" },
      { type: "wall", position: [10, 1, 0], size: [0.5, 2, 10], color: "#78909c" },
    ],
    goal: {
      position: [8, 0.5, 0],
      size: [1, 0.1, 1],
      type: "reach",
      targetObjectId: "player-box",
      energyThreshold: 10, // Minimum energy required to complete the level
    },
    hints: [
      "Energy can transform between potential and kinetic forms",
      "Work is done when a force moves an object through a distance",
      "In the absence of friction, mechanical energy is conserved",
    ],
    theory: {
      title: "Work and Energy",
      content: [
        {
          subtitle: "Work",
          text: "Work is done when a force moves an object through a distance. It is calculated as the dot product of force and displacement.",
        },
        {
          subtitle: "Kinetic Energy",
          text: "Kinetic energy is the energy of motion, dependent on mass and velocity.",
        },
        {
          subtitle: "Potential Energy",
          text: "Potential energy is stored energy due to position or configuration. Gravitational potential energy depends on height and mass.",
        },
        {
          subtitle: "Work-Energy Theorem",
          text: "The work done on an object equals the change in its kinetic energy.",
        },
      ],
      equations: [
        { name: "Work", equation: "W = F·d·cos(θ)" },
        { name: "Kinetic Energy", equation: "K = ½mv²" },
        { name: "Gravitational Potential Energy", equation: "U = mgh" },
        { name: "Work-Energy Theorem", equation: "W = ΔK" },
        { name: "Conservation of Energy", equation: "K₁ + U₁ = K₂ + U₂" },
      ],
    },
  },
  {
    id: "oscillations",
    title: "Oscillations & Resonance",
    topic: "Simple Harmonic Motion",
    description: "Explore oscillatory motion, springs, pendulums, and resonance phenomena.",
    unlocked: false,
    requiredScore: 320,
    objectives: [
      { id: "simple-harmonic", description: "Create simple harmonic motion with a spring", completed: false },
      { id: "pendulum-period", description: "Measure the period of a pendulum", completed: false },
      { id: "resonance", description: "Achieve resonance by matching driving frequency", completed: false },
    ],
    objects: [
      {
        id: "spring-mass",
        type: "spring",
        position: [0, 3, 0],
        springConstant: 5,
        mass: 1,
        color: "#1e88e5",
        interactive: true,
      },
      {
        id: "pendulum",
        type: "pendulum",
        position: [-3, 5, 0],
        length: 3,
        bobMass: 2,
        color: "#e53935",
        interactive: true,
      },
      {
        id: "driven-oscillator",
        type: "driven-oscillator",
        position: [3, 3, 0],
        springConstant: 5,
        mass: 1,
        color: "#43a047",
        interactive: true,
        drivingFrequency: 0.5,
        drivingAmplitude: 0.5,
      },
    ],
    obstacles: [
      { type: "wall", position: [0, 1, -5], size: [20, 2, 0.5], color: "#78909c" },
      { type: "wall", position: [0, 1, 5], size: [20, 2, 0.5], color: "#78909c" },
      { type: "wall", position: [-10, 1, 0], size: [0.5, 2, 10], color: "#78909c" },
      { type: "wall", position: [10, 1, 0], size: [0.5, 2, 10], color: "#78909c" },
    ],
    goal: {
      position: [8, 3, 0],
      size: [1, 0.1, 1],
      type: "resonance",
      targetObjectId: "driven-oscillator",
      requiredAmplitude: 2.0,
    },
    oscillationSettings: {
      damping: 0.1,
      gravity: 9.81,
    },
    hints: [
      "The period of a simple pendulum depends on its length",
      "A spring follows Hooke's Law: F = -kx",
      "Resonance occurs when the driving frequency matches the natural frequency",
    ],
    theory: {
      title: "Oscillations and Resonance",
      content: [
        {
          subtitle: "Simple Harmonic Motion",
          text: "Simple harmonic motion occurs when a restoring force is proportional to displacement. Examples include springs and pendulums.",
        },
        {
          subtitle: "Hooke's Law",
          text: "For a spring, the restoring force is proportional to the displacement from equilibrium: F = -kx.",
        },
        {
          subtitle: "Pendulums",
          text: "For small angles, a pendulum exhibits simple harmonic motion with a period dependent on length and gravity.",
        },
        {
          subtitle: "Resonance",
          text: "Resonance occurs when a system is driven at its natural frequency, resulting in large amplitude oscillations.",
        },
      ],
      equations: [
        { name: "Spring Force", equation: "F = -kx" },
        { name: "Spring Period", equation: "T = 2π√(m/k)" },
        { name: "Pendulum Period", equation: "T = 2π√(L/g)" },
        { name: "Resonance Frequency", equation: "ω₀ = √(k/m)" },
        { name: "Damped Oscillation", equation: "x(t) = Ae⁻ᵝᵗcos(ω't + φ)" },
      ],
    },
  },
]

