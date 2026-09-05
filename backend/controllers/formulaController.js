class FormulaController {
  constructor() {
    this.curriculum = {
      'class-9': {
        grade: 'Class 9',
        subjects: {
          physics: {
            name: 'Physics',
            chapters: [
              {
                id: 'c9_p1',
                title: 'Motion & Kinematics',
                formulas: [
                  { name: 'Average Velocity', formula: 'v_{avg} = \\frac{u + v}{2}', description: 'Mean of initial and final velocities under uniform acceleration' },
                  { name: 'First Equation of Motion', formula: 'v = u + at', description: 'Velocity-time relationship' },
                  { name: 'Second Equation of Motion', formula: 's = ut + \\frac{1}{2}at^2', description: 'Position-time relationship' },
                  { name: 'Third Equation of Motion', formula: 'v^2 = u^2 + 2as', description: 'Position-velocity relationship' }
                ],
                keyConcepts: ['Scalar vs Vector', 'Uniform Circular Motion', 'Distance-Time Slope'],
                lessonTopic: 'Class 9: Motion and Kinematic Equations'
              },
              {
                id: 'c9_p2',
                title: 'Force and Laws of Motion',
                formulas: [
                  { name: 'Momentum', formula: 'p = m \\times v', description: 'Product of mass and velocity (kg m/s)' },
                  { name: "Newton's Second Law", formula: 'F = m \\times a = \\frac{\\Delta p}{\\Delta t}', description: 'Force equals rate of change of momentum' },
                  { name: 'Conservation of Momentum', formula: 'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2', description: 'Total momentum before collision equals after' }
                ],
                keyConcepts: ['Inertia and Mass', 'Action-Reaction Pairs', 'Impulse'],
                lessonTopic: 'Class 9: Force and Newtons Laws of Motion'
              },
              {
                id: 'c9_p3',
                title: 'Gravitation & Floatation',
                formulas: [
                  { name: 'Universal Law of Gravitation', formula: 'F = G \\frac{M \\cdot m}{r^2}', description: 'G = 6.673 \\times 10^{-11} \\text{ N m}^2/\\text{kg}^2' },
                  { name: 'Acceleration due to Gravity', formula: 'g = \\frac{G M}{R^2} \\approx 9.8 \\text{ m/s}^2', description: 'Surface gravitational acceleration' },
                  { name: 'Pressure & Thrust', formula: 'P = \\frac{\\text{Thrust}}{\\text{Area}} = \\frac{F}{A}', description: 'Pressure in Pascals (N/m²)' }
                ],
                keyConcepts: ['Free Fall', 'Archimedes Principle', 'Relative Density'],
                lessonTopic: 'Class 9: Gravitation and Universal Gravitational Constant'
              }
            ]
          },
          chemistry: {
            name: 'Chemistry',
            chapters: [
              {
                id: 'c9_c1',
                title: 'Matter in Our Surroundings & Atomic Structure',
                formulas: [
                  { name: 'Temperature Conversion', formula: 'K = ^\\circ C + 273.15', description: 'Kelvin to Celsius conversion' },
                  { name: 'Density Formula', formula: '\\rho = \\frac{\\text{Mass}}{\\text{Volume}} = \\frac{m}{V}', description: 'Density in kg/m³ or g/cm³' },
                  { name: 'Number of Moles', formula: 'n = \\frac{m}{M} = \\frac{N}{N_A}', description: 'Avogadro number N_A = 6.022 \\times 10^{23}' }
                ],
                keyConcepts: ['Latent Heat of Vaporization', 'Rutherford Nuclear Model', 'Valency and Isotopes'],
                lessonTopic: 'Class 9: Atoms, Molecules and Mole Concept'
              }
            ]
          },
          mathematics: {
            name: 'Mathematics',
            chapters: [
              {
                id: 'c9_m1',
                title: 'Number Systems & Polynomials',
                formulas: [
                  { name: 'Algebraic Identity 1', formula: '(a + b)^2 = a^2 + 2ab + b^2', description: 'Square of sum' },
                  { name: 'Algebraic Identity 2', formula: '(a + b + c)^2 = a^2 + b^2 + c^2 + 2ab + 2bc + 2ca', description: 'Trinomial square' },
                  { name: 'Cubic Identity', formula: 'a^3 + b^3 + c^3 - 3abc = (a+b+c)(a^2+b^2+c^2-ab-bc-ca)', description: 'Sum of cubes identity' }
                ],
                keyConcepts: ['Rationalization of Surds', 'Factor Theorem', 'Remainder Theorem'],
                lessonTopic: 'Class 9: Polynomials and Algebraic Factorization'
              },
              {
                id: 'c9_m2',
                title: 'Heron\'s Formula & Surface Areas',
                formulas: [
                  { name: "Heron's Area Formula", formula: 'A = \\sqrt{s(s-a)(s-b)(s-c)}, \\quad s = \\frac{a+b+c}{2}', description: 'Area of triangle from 3 sides' },
                  { name: 'Total Surface Area of Cylinder', formula: 'TSA = 2\\pi r (r + h)', description: 'Cylinder total area' },
                  { name: 'Volume of Cone', formula: 'V = \\frac{1}{3}\\pi r^2 h', description: 'Right circular cone volume' }
                ],
                keyConcepts: ['Semi-perimeter', 'Curved Surface Area', 'Spherical Volumes'],
                lessonTopic: 'Class 9: Mensuration and Herons Formula'
              }
            ]
          },
          biology: {
            name: 'Biology',
            chapters: [
              {
                id: 'c9_b1',
                title: 'Fundamental Unit of Life & Tissues',
                formulas: [
                  { name: 'Osmotic Water Potential', formula: '\\Psi_w = \\Psi_s + \\Psi_p', description: 'Total water potential equation' }
                ],
                keyConcepts: ['Prokaryotic vs Eukaryotic Cells', 'Mitochondria & ATP', 'Meristematic vs Permanent Tissues'],
                lessonTopic: 'Class 9: Cell Structure and Organelles'
              }
            ]
          }
        }
      },
      'class-10': {
        grade: 'Class 10',
        subjects: {
          physics: {
            name: 'Physics',
            chapters: [
              {
                id: 'c10_p1',
                title: 'Light - Reflection and Refraction',
                formulas: [
                  { name: 'Mirror Formula', formula: '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}', description: 'Relationship between focal length f, image distance v, and object distance u' },
                  { name: 'Lens Formula', formula: '\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}', description: 'Lens equation with Cartesian sign convention' },
                  { name: 'Linear Magnification', formula: 'm = \\frac{h_i}{h_o} = -\\frac{v}{u} \\text{ (Mirror)} = \\frac{v}{u} \\text{ (Lens)}', description: 'Ratio of image height to object height' },
                  { name: "Snell's Law of Refraction", formula: 'n = \\frac{\\sin i}{\\sin r} = \\frac{v_1}{v_2} = \\frac{c}{v}', description: 'Refractive index formula' }
                ],
                keyConcepts: ['Ray Diagrams', 'Power of a Lens (P = 1/f)', 'Sign Conventions'],
                lessonTopic: 'Class 10: Light Reflection, Refraction and Ray Optics'
              },
              {
                id: 'c10_p2',
                title: 'Electricity & Magnetic Effects',
                formulas: [
                  { name: "Ohm's Law", formula: 'V = I \\times R', description: 'Potential difference across conductor equals current times resistance' },
                  { name: 'Equivalent Resistance (Series)', formula: 'R_s = R_1 + R_2 + R_3', description: 'Series circuit total resistance' },
                  { name: 'Equivalent Resistance (Parallel)', formula: '\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}', description: 'Parallel circuit total resistance' },
                  { name: "Joule's Law of Heating", formula: 'H = I^2 R t = V I t = \\frac{V^2}{R} t', description: 'Heat generated in a resistor in Joules' }
                ],
                keyConcepts: ['Resistivity (R = ρL/A)', 'Fleming Left Hand Rule', 'Electric Power (P = VI)'],
                lessonTopic: 'Class 10: Electricity and Circuit Laws'
              }
            ]
          },
          chemistry: {
            name: 'Chemistry',
            chapters: [
              {
                id: 'c10_c1',
                title: 'Chemical Reactions, Acids, Bases & Metals',
                formulas: [
                  { name: 'pH Definition', formula: '\\text{pH} = -\\log_{10}[\\text{H}^+]', description: 'pH scale calculation' },
                  { name: 'Neutralization Reaction', formula: '\\text{Acid} + \\text{Base} \\rightarrow \\text{Salt} + \\text{Water}', description: 'HCl + NaOH -> NaCl + H2O' },
                  { name: 'Bleaching Powder & Plaster of Paris', formula: '\\text{CaSO}_4 \\cdot \\frac{1}{2}\\text{H}_2\\text{O} + 1\\frac{1}{2}\\text{H}_2\\text{O} \\rightarrow \\text{CaSO}_4 \\cdot 2\\text{H}_2\\text{O}', description: 'POP hydration to Gypsum' }
                ],
                keyConcepts: ['Redox Reactions', 'Reactivity Series', 'Homologous Series in Hydrocarbons'],
                lessonTopic: 'Class 10: Chemical Equations and Reaction Types'
              }
            ]
          },
          mathematics: {
            name: 'Mathematics',
            chapters: [
              {
                id: 'c10_m1',
                title: 'Quadratic Equations & Arithmetic Progressions',
                formulas: [
                  { name: 'Quadratic Formula (Sridharacharya)', formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', description: 'Roots of ax² + bx + c = 0' },
                  { name: 'Discriminant & Roots Nature', formula: 'D = b^2 - 4ac \\quad (D > 0: \\text{ Real \\& Distinct}, D = 0: \\text{ Equal})', description: 'Discriminant test' },
                  { name: 'nth Term of AP', formula: 'a_n = a + (n - 1)d', description: 'nth term of arithmetic progression' },
                  { name: 'Sum of n Terms of AP', formula: 'S_n = \\frac{n}{2}[2a + (n - 1)d] = \\frac{n}{2}(a + l)', description: 'AP series summation' }
                ],
                keyConcepts: ['Completing the Square', 'Sum and Product of Roots (α+β = -b/a, αβ = c/a)', 'Common Difference d'],
                lessonTopic: 'Class 10: Quadratic Equations and AP Series'
              },
              {
                id: 'c10_m2',
                title: 'Trigonometry & Applications',
                formulas: [
                  { name: 'Fundamental Trig Identity 1', formula: '\\sin^2 \\theta + \\cos^2 \\theta = 1', description: 'Pythagorean trigonometric identity' },
                  { name: 'Fundamental Trig Identity 2', formula: '1 + \\tan^2 \\theta = \\sec^2 \\theta', description: 'Secant tangent identity' },
                  { name: 'Fundamental Trig Identity 3', formula: '1 + \\cot^2 \\theta = \\text{cosec}^2 \\theta', description: 'Cosecant cotangent identity' },
                  { name: 'Distance Formula', formula: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}', description: 'Coordinate geometry 2D distance' }
                ],
                keyConcepts: ['Standard Angles (0, 30, 45, 60, 90)', 'Heights and Distances', 'Section Formula'],
                lessonTopic: 'Class 10: Introduction to Trigonometry and Heights'
              }
            ]
          },
          biology: {
            name: 'Biology',
            chapters: [
              {
                id: 'c10_b1',
                title: 'Life Processes & Heredity',
                formulas: [
                  { name: 'Photosynthesis Master Equation', formula: '6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2', description: 'Light reaction energy conversion' },
                  { name: 'Aerobic Cellular Respiration', formula: '\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 38\\text{ ATP}', description: 'Complete glucose oxidation' }
                ],
                keyConcepts: ['Nephron Filtration & Dialysis', 'Double Circulation in Heart', 'Mendel Monohybrid 3:1 & Dihybrid 9:3:3:1'],
                lessonTopic: 'Class 10: Life Processes and Human Physiology'
              }
            ]
          }
        }
      },
      'class-11': {
        grade: 'Class 11',
        subjects: {
          physics: {
            name: 'Physics',
            chapters: [
              {
                id: 'c11_p1',
                title: 'Vectors, Projectile Motion & Laws of Motion',
                formulas: [
                  { name: 'Dot Product (Scalar)', formula: '\\vec{A} \\cdot \\vec{B} = |A||B| \\cos \\theta', description: 'Work W = F · s' },
                  { name: 'Cross Product (Vector)', formula: '\\vec{A} \\times \\vec{B} = |A||B| \\sin \\theta \\, \\hat{n}', description: 'Torque τ = r × F' },
                  { name: 'Time of Flight (Projectile)', formula: 'T = \\frac{2u \\sin \\theta}{g}', description: 'Total projectile flight time' },
                  { name: 'Maximum Height', formula: 'H_{max} = \\frac{u^2 \\sin^2 \\theta}{2g}', description: 'Peak trajectory altitude' },
                  { name: 'Horizontal Range', formula: 'R = \\frac{u^2 \\sin 2\\theta}{g}', description: 'Max range at θ = 45°' }
                ],
                keyConcepts: ['Centripetal Acceleration (a = v²/r)', 'Work-Energy Theorem (W = ΔK)', 'Conservative Forces'],
                lessonTopic: 'Class 11: 2D Kinematics and Projectile Motion'
              },
              {
                id: 'c11_p2',
                title: 'Rotational Mechanics & Gravitation',
                formulas: [
                  { name: 'Moment of Inertia', formula: 'I = \\sum m_i r_i^2 = \\int r^2 dm', description: 'Rotational inertia analog to mass' },
                  { name: 'Parallel Axis Theorem', formula: 'I = I_{cm} + M d^2', description: 'Inertia about parallel offset axis' },
                  { name: 'Rotational Kinetic Energy', formula: 'K_{rot} = \\frac{1}{2} I \\omega^2', description: 'Energy of spinning body' },
                  { name: 'Orbital Velocity of Satellite', formula: 'v_o = \\sqrt{\\frac{GM}{R + h}}', description: 'Circular orbital speed' },
                  { name: 'Escape Velocity', formula: 'v_e = \\sqrt{\\frac{2GM}{R}} = \\sqrt{2gR} \\approx 11.2 \\text{ km/s}', description: 'Minimum velocity to escape Earth gravity' }
                ],
                keyConcepts: ['Torque (τ = Iα)', 'Angular Momentum (L = Iω)', 'Kepler 3 Laws'],
                lessonTopic: 'Class 11: System of Particles and Rotational Motion'
              },
              {
                id: 'c11_p3',
                title: 'Thermodynamics & Oscillations (SHM)',
                formulas: [
                  { name: 'First Law of Thermodynamics', formula: '\\Delta Q = \\Delta U + \\Delta W = n C_v \\Delta T + P \\Delta V', description: 'Conservation of thermal energy' },
                  { name: "Carnot Engine Efficiency", formula: '\\eta = 1 - \\frac{T_2}{T_1} = \\frac{W}{Q_1}', description: 'Max theoretical thermal efficiency' },
                  { name: 'Time Period of Simple Pendulum', formula: 'T = 2\\pi \\sqrt{\\frac{L}{g}}', description: 'SHM pendulum period' },
                  { name: 'Spring-Mass Oscillator', formula: 'T = 2\\pi \\sqrt{\\frac{m}{k}}', description: 'Hooke law oscillation frequency' }
                ],
                keyConcepts: ['Adiabatic Process (PV^γ = const)', 'Equation of Continuity', 'Bernoulli Theorem'],
                lessonTopic: 'Class 11: Thermodynamics and Simple Harmonic Motion'
              }
            ]
          },
          chemistry: {
            name: 'Chemistry',
            chapters: [
              {
                id: 'c11_c1',
                title: 'Thermodynamics, Equilibrium & Chemical Bonding',
                formulas: [
                  { name: 'Gibbs Free Energy', formula: '\\Delta G = \\Delta H - T \\Delta S', description: 'Spontaneity condition: ΔG < 0' },
                  { name: 'Equilibrium Constant (Kp vs Kc)', formula: 'K_p = K_c (R T)^{\\Delta n_g}', description: 'Gas phase chemical equilibrium' },
                  { name: 'Ideal Gas Equation', formula: 'P V = n R T = \\frac{m}{M} R T', description: 'R = 8.314 J/(mol K)' },
                  { name: 'Bond Order Formula', formula: '\\text{Bond Order} = \\frac{N_b - N_a}{2}', description: 'Molecular orbital theory' }
                ],
                keyConcepts: ['Hess Law of Constant Heat', 'Le Chatelier Principle', 'Hybridization (sp, sp², sp³)'],
                lessonTopic: 'Class 11: Chemical Thermodynamics and Equilibrium'
              }
            ]
          },
          mathematics: {
            name: 'Mathematics',
            chapters: [
              {
                id: 'c11_m1',
                title: 'Trigonometric Functions, Identities & Complex Numbers',
                formulas: [
                  { name: 'Compound Angle Addition', formula: '\\sin(A \\pm B) = \\sin A \\cos B \\pm \\cos A \\sin B', description: 'Trig angle addition formula' },
                  { name: 'Cosine Compound Angle', formula: '\\cos(A \\pm B) = \\cos A \\cos B \\mp \\sin A \\sin B', description: 'Trig cosine addition formula' },
                  { name: 'Tangent Compound Angle', formula: '\\tan(A \\pm B) = \\frac{\\tan A \\pm \\tan B}{1 \\mp \\tan A \\tan B}', description: 'Tangent addition formula' },
                  { name: 'Double Angle Sine', formula: '\\sin 2\\theta = 2 \\sin \\theta \\cos \\theta = \\frac{2\\tan \\theta}{1 + \\tan^2 \\theta}', description: 'Sine double angle expansion' },
                  { name: 'Double Angle Cosine', formula: '\\cos 2\\theta = \\cos^2 \\theta - \\sin^2 \\theta = 2\\cos^2 \\theta - 1 = 1 - 2\\sin^2 \\theta = \\frac{1 - \\tan^2 \\theta}{1 + \\tan^2 \\theta}', description: 'Cosine double angle identities' },
                  { name: 'Triple Angle Formulas', formula: '\\sin 3\\theta = 3\\sin \\theta - 4\\sin^3 \\theta, \\quad \\cos 3\\theta = 4\\cos^3 \\theta - 3\\cos \\theta', description: 'Triple angle identities' },
                  { name: 'Product to Sum Transformation', formula: '2\\sin A \\cos B = \\sin(A + B) + \\sin(A - B), \\quad 2\\cos A \\sin B = \\sin(A + B) - \\sin(A - B)', description: 'Product to sum formulas' },
                  { name: 'Sum to Product Transformation', formula: '\\sin C + \\sin D = 2\\sin\\left(\\frac{C+D}{2}\\right)\\cos\\left(\\frac{C-D}{2}\\right)', description: 'Sum to product formula' },
                  { name: 'Law of Sines & Cosines', formula: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R, \\quad \\cos A = \\frac{b^2 + c^2 - a^2}{2bc}', description: 'Triangle trigonometry laws' },
                  { name: "Euler's Formula & Polar Form", formula: 'e^{i\\theta} = \\cos \\theta + i \\sin \\theta, \\quad z = r e^{i\\theta}', description: 'Complex exponential form' },
                  { name: "De Moivre's Theorem", formula: '(\\cos \\theta + i \\sin \\theta)^n = \\cos(n\\theta) + i \\sin(n\\theta)', description: 'Complex powers theorem' }
                ],
                keyConcepts: ['General Solutions of Trig Equations', 'Modulus and Argument of Complex Numbers', 'Triangle Inradius & Circumradius'],
                lessonTopic: 'Class 11: Advanced Trigonometric Identities and Functions'
              },
              {
                id: 'c11_m2',
                title: 'Permutations, Combinations & Limits',
                formulas: [
                  { name: 'Permutation (Arrangement)', formula: '^n P_r = \\frac{n!}{(n - r)!}', description: 'Ordered selection' },
                  { name: 'Combination (Selection)', formula: '^n C_r = \\frac{n!}{r!(n - r)!}', description: 'Unordered group selection' },
                  { name: 'Binomial Theorem', formula: '(a + b)^n = \\sum_{k=0}^n {^n C_k} \\, a^{n-k} b^k', description: 'Binomial expansion series' },
                  { name: 'Standard Trigonometric Limit', formula: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1', description: 'Calculus fundamental limit' }
                ],
                keyConcepts: ['First Principle of Derivatives', 'Conic Sections (Parabola, Ellipse, Hyperbola)', 'Linear Inequalities'],
                lessonTopic: 'Class 11: Limits, Derivatives and Combinatorics'
              }
            ]
          },
          biology: {
            name: 'Biology',
            chapters: [
              {
                id: 'c11_b1',
                title: 'Plant Physiology & Human Physiology',
                formulas: [
                  { name: 'Respiratory Quotient (RQ)', formula: '\\text{RQ} = \\frac{\\text{Volume of CO}_2 \\text{ evolved}}{\\text{Volume of O}_2 \\text{ consumed}}', description: 'RQ of Carbohydrates = 1.0, Fats = 0.7' },
                  { name: 'Cardiac Output', formula: '\\text{Cardiac Output} = \\text{Stroke Volume} \\times \\text{Heart Rate} \\approx 5000 \\text{ mL/min}', description: 'Circulation volume' }
                ],
                keyConcepts: ['Calvin Cycle (C3) & Hatch-Slack (C4)', 'Krebs Cycle in Mitochondria', 'Action Potential in Axon'],
                lessonTopic: 'Class 11: Plant Physiology and Photosynthesis Pathways'
              }
            ]
          }
        }
      },
      'class-12': {
        grade: 'Class 12',
        subjects: {
          physics: {
            name: 'Physics',
            chapters: [
              {
                id: 'c12_p1',
                title: 'Electrostatics, Capacitance & Current Electricity',
                formulas: [
                  { name: "Coulomb's Law in Vector Form", formula: '\\vec{F} = \\frac{1}{4\\pi \\epsilon_0} \\frac{q_1 q_2}{r^2} \\hat{r}', description: '1/(4πε0) = 8.99 \\times 10^9 \\text{ N m}^2/\\text{C}^2' },
                  { name: 'Electric Potential of Point Charge', formula: 'V = \\frac{1}{4\\pi \\epsilon_0} \\frac{q}{r}', description: 'Electrostatic scalar potential' },
                  { name: 'Parallel Plate Capacitor', formula: 'C = \\frac{\\epsilon_0 A}{d} \\quad (C = K C_0 \\text{ with dielectric})', description: 'Capacitance in Farads' },
                  { name: 'Energy Stored in Capacitor', formula: 'U = \\frac{1}{2} C V^2 = \\frac{1}{2} Q V = \\frac{Q^2}{2C}', description: 'Electrostatic field energy' },
                  { name: "Drift Velocity & Current", formula: 'I = n e A v_d, \\quad v_d = \\frac{e E \\tau}{m}', description: 'Microscopic current relation' }
                ],
                keyConcepts: ['Gauss Law (∮E·dA = q/ε0)', 'Kirchhoff Current and Voltage Laws', 'Wheatstone Bridge Principle'],
                lessonTopic: 'Class 12: Electrostatics and Capacitance'
              },
              {
                id: 'c12_p2',
                title: 'Magnetism, EMI & Alternating Current (AC)',
                formulas: [
                  { name: 'Biot-Savart Law', formula: 'd\\vec{B} = \\frac{\\mu_0}{4\\pi} \\frac{I (d\\vec{l} \\times \\hat{r})}{r^2}', description: 'μ0/(4π) = 10^-7 T m/A' },
                  { name: 'Magnetic Force on Wire', formula: '\\vec{F} = I (\\vec{L} \\times \\vec{B})', description: 'Lorentz force on current conductor' },
                  { name: "Faraday's Law of Induction", formula: '\\mathcal{E} = -\\frac{d\\Phi_B}{dt} = -N \\frac{d(B A \\cos \\theta)}{dt}', description: 'Lenz law induced EMF' },
                  { name: 'LCR Series Resonance', formula: 'Z = \\sqrt{R^2 + (X_L - X_C)^2}, \\quad f_r = \\frac{1}{2\\pi \\sqrt{LC}}', description: 'AC circuit impedance & resonance' }
                ],
                keyConcepts: ['Transformer Equation (Vs/Vp = Ns/Np)', 'Self and Mutual Inductance', 'RMS Voltage (Vrms = V0/√2)'],
                lessonTopic: 'Class 12: Electromagnetic Induction and AC Circuits'
              },
              {
                id: 'c12_p3',
                title: 'Wave Optics & Modern Physics (Semiconductors)',
                formulas: [
                  { name: "Young's Double Slit Fringe Width", formula: '\\beta = \\frac{\\lambda D}{d}', description: 'Interference fringe spacing' },
                  { name: "Einstein's Photoelectric Equation", formula: 'h \\nu = \\phi_0 + K_{max} = h \\nu_0 + e V_0', description: 'Photon energy conservation' },
                  { name: 'de Broglie Wavelength', formula: '\\lambda = \\frac{h}{p} = \\frac{h}{m v} = \\frac{h}{\\sqrt{2 m e V}}', description: 'Matter wave relationship' },
                  { name: "Bohr's Energy Levels (Hydrogen)", formula: 'E_n = -\\frac{13.6 \\text{ eV}}{n^2}', description: 'Quantized electron orbit energy' }
                ],
                keyConcepts: ['Diffraction Single Slit (a sin θ = λ)', 'PN Junction Diode Rectifier', 'Mass Defect & Binding Energy'],
                lessonTopic: 'Class 12: Wave Optics, Dual Nature and Nuclear Physics'
              }
            ]
          },
          chemistry: {
            name: 'Chemistry',
            chapters: [
              {
                id: 'c12_c1',
                title: 'Electrochemistry, Solutions & Chemical Kinetics',
                formulas: [
                  { name: 'Nernst Equation (298 K)', formula: 'E_{cell} = E^\\circ_{cell} - \\frac{0.0591}{n} \\log_{10} Q', description: 'Cell potential at 298 K under non-standard concentrations' },
                  { name: 'Gibbs Free Energy & EMF', formula: '\\Delta G^\\circ = -n F E^\\circ_{cell} = -2.303 R T \\log_{10} K_{eq}', description: 'Equilibrium constant from cell potential' },
                  { name: "Faraday's Law of Electrolysis", formula: 'm = Z I t = \\frac{M}{n F} I t', description: 'Mass of substance deposited at electrode (F = 96500 C/mol)' },
                  { name: "Raoult's Law for Volatile Liquids", formula: 'P_{total} = P_A^\\circ x_A + P_B^\\circ x_B = P_A^\\circ + (P_B^\\circ - P_A^\\circ) x_B', description: 'Total vapor pressure of ideal solution' },
                  { name: 'Elevation in Boiling Point', formula: '\\Delta T_b = i \\cdot K_b \\cdot m, \\quad m = \\frac{w_B \\times 1000}{M_B \\times w_A}', description: 'Molal elevation constant formula' },
                  { name: 'Depression in Freezing Point', formula: '\\Delta T_f = i \\cdot K_f \\cdot m', description: 'Cryoscopic depression formula' },
                  { name: 'Osmotic Pressure', formula: '\\pi = i \\cdot C R T = i \\cdot \\left(\\frac{n_B}{V}\\right) R T', description: 'Van t Hoff osmotic pressure formula' },
                  { name: 'First Order Rate Constant', formula: 'k = \\frac{2.303}{t} \\log_{10}\\left(\\frac{[A]_0}{[A]_t}\\right), \\quad t_{1/2} = \\frac{0.693}{k}', description: 'First order kinetics' },
                  { name: 'Arrhenius Equation', formula: 'k = A e^{-E_a / (R T)}, \\quad \\log_{10}\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{2.303 R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)', description: 'Activation energy relation' },
                  { name: 'Kohlrausch Law', formula: '\\Lambda^\\circ_m = \\nu_+ \\lambda^\\circ_+ + \\nu_- \\lambda^\\circ_-', description: 'Molar conductivity at infinite dilution' }
                ],
                keyConcepts: ['Van t Hoff Factor (i = 1 + (n-1)α)', 'SN1 vs SN2 Mechanisms', 'Markovnikov & Anti-Markovnikov Rule', 'Aldol Condensation & Cannizzaro'],
                lessonTopic: 'Class 12: Electrochemistry, Solutions and Reaction Kinetics'
              }
            ]
          },
          mathematics: {
            name: 'Mathematics',
            chapters: [
              {
                id: 'c12_m1',
                title: 'Calculus: Differentiation & Integration',
                formulas: [
                  { name: 'Chain Rule', formula: '\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)', description: 'Composite function derivative' },
                  { name: 'Integration by Parts', formula: '\\int u \\, v \\, dx = u \\int v \\, dx - \\int \\left( u\' \\int v \\, dx \\right) dx', description: 'ILATE rule integration' },
                  { name: 'Standard Integral: Rational Fraction', formula: '\\int \\frac{dx}{x^2 + a^2} = \\frac{1}{a} \\tan^{-1}\\left(\\frac{x}{a}\\right) + C', description: 'Inverse trig integral' },
                  { name: 'Standard Integral: Square Root', formula: '\\int \\frac{dx}{\\sqrt{a^2 - x^2}} = \\sin^{-1}\\left(\\frac{x}{a}\\right) + C', description: 'Arcsine integral' }
                ],
                keyConcepts: ['Maxima and Minima (f\'(x)=0, f\'\'(x)<0)', 'Definite Integral Properties (King Property)', 'Differential Equations Separable Form'],
                lessonTopic: 'Class 12: Differential and Integral Calculus'
              },
              {
                id: 'c12_m2',
                title: 'Vectors, 3D Geometry & Matrices',
                formulas: [
                  { name: 'Matrix Inverse', formula: 'A^{-1} = \\frac{1}{|A|} \\text{adj}(A)', description: 'Multiplicative matrix inverse (|A| ≠ 0)' },
                  { name: 'Shortest Distance between Skew Lines', formula: 'd = \\left| \\frac{(\\vec{a}_2 - \\vec{a}_1) \\cdot (\\vec{b}_1 \\times \\vec{b}_2)}{|\\vec{b}_1 \\times \\vec{b}_2|} \\right|', description: '3D Geometry shortest distance' },
                  { name: 'Bayes Theorem for Conditional Probability', formula: 'P(E_i | A) = \\frac{P(E_i) P(A | E_i)}{\\sum_{j=1}^k P(E_j) P(A | E_j)}', description: 'Inverse probability formula' }
                ],
                keyConcepts: ['Vector Triple Product', 'Direction Cosines (l² + m² + n² = 1)', 'Linear Programming Optimization'],
                lessonTopic: 'Class 12: 3D Geometry, Vectors and Probability'
              }
            ]
          },
          biology: {
            name: 'Biology',
            chapters: [
              {
                id: 'c12_b1',
                title: 'Genetics, Molecular Biology & Biotechnology',
                formulas: [
                  { name: 'Hardy-Weinberg Equilibrium', formula: 'p^2 + 2pq + q^2 = 1, \\quad p + q = 1', description: 'Allele frequency in stable population' },
                  { name: 'PCR DNA Amplification', formula: 'N_n = N_0 \\times 2^n', description: 'Polymerase Chain Reaction exponential doubling' }
                ],
                keyConcepts: ['DNA Replication (Meselson-Stahl)', 'Lac Operon Regulation', 'Recombinant DNA & Restriction Enzymes (EcoRI)'],
                lessonTopic: 'Class 12: Molecular Basis of Inheritance and Biotechnology'
              }
            ]
          }
        }
      }
    };
  }

  async getCurriculum(req, res) {
    try {
      const { grade, subject } = req.query;

      if (grade && this.curriculum[grade]) {
        const gradeData = this.curriculum[grade];
        if (subject && gradeData.subjects[subject]) {
          return res.json({
            success: true,
            grade: gradeData.grade,
            subject: gradeData.subjects[subject]
          });
        }
        return res.json({
          success: true,
          grade: gradeData.grade,
          subjects: gradeData.subjects
        });
      }

      return res.json({
        success: true,
        grades: Object.keys(this.curriculum).map(k => ({
          key: k,
          label: this.curriculum[k].grade,
          subjectCount: Object.keys(this.curriculum[k].subjects).length
        })),
        curriculum: this.curriculum
      });
    } catch (error) {
      console.error('[FormulaController] getCurriculum error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async searchFormulas(req, res) {
    try {
      const query = (req.query.query || req.query.q || '').toLowerCase().trim();
      const results = [];

      for (const [gradeKey, gradeData] of Object.entries(this.curriculum)) {
        for (const [subKey, subData] of Object.entries(gradeData.subjects)) {
          for (const ch of subData.chapters) {
            for (const f of ch.formulas) {
              if (
                !query ||
                f.name.toLowerCase().includes(query) ||
                f.formula.toLowerCase().includes(query) ||
                f.description.toLowerCase().includes(query) ||
                ch.title.toLowerCase().includes(query) ||
                subData.name.toLowerCase().includes(query)
              ) {
                results.push({
                  grade: gradeData.grade,
                  gradeKey,
                  subject: subData.name,
                  subjectKey: subKey,
                  chapter: ch.title,
                  lessonTopic: ch.lessonTopic,
                  ...f
                });
              }
            }
          }
        }
      }

      return res.json({
        success: true,
        query,
        count: results.length,
        results
      });
    } catch (error) {
      console.error('[FormulaController] searchFormulas error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getRandomFormulas(req, res) {
    try {
      const count = parseInt(req.query.count) || 6;
      const subjectFilter = (req.query.subject || '').toLowerCase().trim();
      const allFormulas = [];

      for (const [gradeKey, gradeData] of Object.entries(this.curriculum)) {
        for (const [subKey, subData] of Object.entries(gradeData.subjects)) {
          if (subjectFilter && subjectFilter !== 'all' && subKey !== subjectFilter && !subData.name.toLowerCase().includes(subjectFilter)) {
            continue;
          }
          for (const ch of subData.chapters) {
            for (const f of ch.formulas) {
              allFormulas.push({
                grade: gradeData.grade,
                gradeKey,
                subject: subData.name,
                subjectKey: subKey,
                chapter: ch.title,
                lessonTopic: ch.lessonTopic,
                ...f
              });
            }
          }
        }
      }

      // Shuffle using Fisher-Yates
      for (let i = allFormulas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allFormulas[i], allFormulas[j]] = [allFormulas[j], allFormulas[i]];
      }

      const randomSelection = allFormulas.slice(0, count);

      return res.json({
        success: true,
        count: randomSelection.length,
        totalAvailable: allFormulas.length,
        formulas: randomSelection
      });
    } catch (error) {
      console.error('[FormulaController] getRandomFormulas error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FormulaController();
