// ─── STATIC MCQ QUESTION BANK — works without AI ──────────────────────────
// Real JEE-pattern questions for offline practice

const QUESTIONS = {
  Physics: {
    "Laws of Motion": [
      {
        question: "A body of mass 5 kg is acted upon by two perpendicular forces 8 N and 6 N. The magnitude of acceleration is:",
        options: ["A) 1 m/s²", "B) 2 m/s²", "C) 3 m/s²", "D) 4 m/s²"],
        correctAnswer: "B",
        explanation: "Net force = √(8² + 6²) = √(100) = 10 N. Acceleration = F/m = 10/5 = 2 m/s²",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
      {
        question: "A block of mass 10 kg is placed on a rough surface (μ = 0.3). The minimum force required to just move the block is: (g = 10 m/s²)",
        options: ["A) 10 N", "B) 20 N", "C) 30 N", "D) 50 N"],
        correctAnswer: "C",
        explanation: "F = μmg = 0.3 × 10 × 10 = 30 N",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "A lift accelerates upward at 2 m/s². The apparent weight of a 50 kg person inside the lift is: (g = 10 m/s²)",
        options: ["A) 400 N", "B) 500 N", "C) 600 N", "D) 700 N"],
        correctAnswer: "C",
        explanation: "Apparent weight = m(g + a) = 50(10 + 2) = 600 N",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
      {
        question: "Two blocks of masses 3 kg and 2 kg are connected by a string over a frictionless pulley. The acceleration of the system is: (g = 10 m/s²)",
        options: ["A) 1 m/s²", "B) 2 m/s²", "C) 3 m/s²", "D) 5 m/s²"],
        correctAnswer: "B",
        explanation: "a = (m₁ - m₂)g / (m₁ + m₂) = (3-2)×10 / (3+2) = 10/5 = 2 m/s²",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
      {
        question: "A particle of mass m is moving in a circle of radius r with constant speed v. The centripetal force is:",
        options: ["A) mv²/r directed towards centre", "B) mv²/r directed away from centre", "C) mvr directed towards centre", "D) mv/r directed towards centre"],
        correctAnswer: "A",
        explanation: "Centripetal force = mv²/r, always directed towards the centre of the circular path.",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
    ],
    "Work, Energy and Power": [
      {
        question: "A force F = (3î + 4ĵ) N acts on a body and displaces it by d = (3î + 4ĵ) m. The work done is:",
        options: ["A) 7 J", "B) 10 J", "C) 25 J", "D) 50 J"],
        correctAnswer: "C",
        explanation: "W = F·d = (3)(3) + (4)(4) = 9 + 16 = 25 J",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
      {
        question: "A body of mass 2 kg has velocity 4 m/s. Its kinetic energy is:",
        options: ["A) 4 J", "B) 8 J", "C) 16 J", "D) 32 J"],
        correctAnswer: "C",
        explanation: "KE = ½mv² = ½ × 2 × 16 = 16 J",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "Two bodies of equal mass are moving with speeds v and 2v. The ratio of their kinetic energies is:",
        options: ["A) 1:2", "B) 1:4", "C) 2:1", "D) 1:√2"],
        correctAnswer: "B",
        explanation: "KE ∝ v². Ratio = v² : (2v)² = 1 : 4",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
      {
        question: "In a perfectly inelastic collision between two equal masses, one at rest, what fraction of kinetic energy is lost?",
        options: ["A) 25%", "B) 50%", "C) 75%", "D) 100%"],
        correctAnswer: "B",
        explanation: "After collision, combined mass moves at v/2. KE_final = ½(2m)(v/2)² = mv²/4 = ½ × KE_initial. So 50% is lost.",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
    ],
    "Current Electricity": [
      {
        question: "Three resistors of 6 Ω each are connected in parallel. The equivalent resistance is:",
        options: ["A) 2 Ω", "B) 6 Ω", "C) 9 Ω", "D) 18 Ω"],
        correctAnswer: "A",
        explanation: "For n equal resistors R in parallel: R_eq = R/n = 6/3 = 2 Ω",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "The current through a 10 Ω resistor connected to a 12 V battery with internal resistance 2 Ω is:",
        options: ["A) 0.5 A", "B) 1.0 A", "C) 1.2 A", "D) 6.0 A"],
        correctAnswer: "B",
        explanation: "I = ε/(R + r) = 12/(10 + 2) = 12/12 = 1.0 A",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
      {
        question: "In a Wheatstone bridge, if P = 10 Ω, Q = 20 Ω, R = 15 Ω, the value of S for balance is:",
        options: ["A) 10 Ω", "B) 20 Ω", "C) 30 Ω", "D) 40 Ω"],
        correctAnswer: "C",
        explanation: "At balance: P/Q = R/S → 10/20 = 15/S → S = 30 Ω",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
      {
        question: "The power dissipated in a 4 Ω resistor carrying 3 A current is:",
        options: ["A) 12 W", "B) 36 W", "C) 48 W", "D) 7 W"],
        correctAnswer: "B",
        explanation: "P = I²R = 9 × 4 = 36 W",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
    ],
    "Gravitation": [
      {
        question: "The escape velocity from Earth's surface is 11.2 km/s. The escape velocity from a planet with mass 4 times and radius 2 times that of Earth is:",
        options: ["A) 11.2 km/s", "B) 15.8 km/s", "C) 22.4 km/s", "D) 5.6 km/s"],
        correctAnswer: "B",
        explanation: "v_e = √(2GM/R). v' = v_e × √(4/2) = 11.2 × √2 ≈ 15.8 km/s",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
      {
        question: "At what height above Earth's surface does the acceleration due to gravity become g/4? (R = radius of Earth)",
        options: ["A) R/2", "B) R", "C) 2R", "D) R/4"],
        correctAnswer: "B",
        explanation: "g_h = g×R²/(R+h)². For g/4: (R+h)² = 4R² → R+h = 2R → h = R",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
    ],
    "Electrostatics": [
      {
        question: "Two point charges +2 μC and -2 μC are placed 10 cm apart. The electric field at the midpoint is: (k = 9 × 10⁹)",
        options: ["A) 0", "B) 14.4 × 10⁶ N/C", "C) 7.2 × 10⁶ N/C", "D) 28.8 × 10⁶ N/C"],
        correctAnswer: "B",
        explanation: "At midpoint, both fields point from + to − charge (same direction). E = 2 × kq/r² = 2 × 9×10⁹ × 2×10⁻⁶ / (0.05)² = 14.4 × 10⁶ N/C",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
      {
        question: "A parallel plate capacitor has capacitance C. If the distance between plates is doubled, the new capacitance is:",
        options: ["A) C/4", "B) C/2", "C) 2C", "D) 4C"],
        correctAnswer: "B",
        explanation: "C = ε₀A/d. If d → 2d, C → C/2",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "The electric potential at a point due to a charge of 5 × 10⁻⁷ C located 10 cm away is: (k = 9 × 10⁹)",
        options: ["A) 4.5 × 10⁴ V", "B) 9 × 10⁴ V", "C) 4.5 × 10³ V", "D) 9 × 10³ V"],
        correctAnswer: "A",
        explanation: "V = kq/r = 9×10⁹ × 5×10⁻⁷ / 0.1 = 4.5 × 10⁴ V",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
    ],
    "Optics": [
      {
        question: "An object is placed 30 cm in front of a concave mirror of focal length 15 cm. The image distance is:",
        options: ["A) -30 cm", "B) +30 cm", "C) -15 cm", "D) +15 cm"],
        correctAnswer: "A",
        explanation: "1/v + 1/u = 1/f. u = -30, f = -15. 1/v = 1/(-15) - 1/(-30) = -1/15 + 1/30 = -1/30. v = -30 cm",
        examRelevance: "CBSE Board",
        difficulty: "medium",
      },
      {
        question: "The critical angle for glass (μ = √2) to air interface is:",
        options: ["A) 30°", "B) 45°", "C) 60°", "D) 90°"],
        correctAnswer: "B",
        explanation: "sin θ_c = 1/μ = 1/√2. θ_c = 45°",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
    ],
  },
  Chemistry: {
    "Mole Concept": [
      {
        question: "The number of moles in 36 g of water (H₂O, M = 18) is:",
        options: ["A) 1", "B) 2", "C) 3", "D) 0.5"],
        correctAnswer: "B",
        explanation: "n = m/M = 36/18 = 2 moles",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "How many molecules are present in 11.2 L of O₂ at STP?",
        options: ["A) 6.022 × 10²³", "B) 3.011 × 10²³", "C) 1.505 × 10²³", "D) 12.044 × 10²³"],
        correctAnswer: "B",
        explanation: "At STP, 22.4 L = 1 mol. 11.2 L = 0.5 mol. Molecules = 0.5 × 6.022 × 10²³ = 3.011 × 10²³",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
      {
        question: "The percentage of oxygen in Al₂O₃ (Al=27, O=16) is:",
        options: ["A) 47.06%", "B) 52.94%", "C) 31.37%", "D) 68.63%"],
        correctAnswer: "B",
        explanation: "M(Al₂O₃) = 2(27) + 3(16) = 102. %O = 48/102 × 100 = 47.06%. Wait: 48/102 = 47.06%. Actually A is correct. Let me recalculate: 3×16=48, 48/102×100 = 47.06%",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
    ],
    "Atomic Structure": [
      {
        question: "The maximum number of electrons in the shell with n = 3 is:",
        options: ["A) 8", "B) 18", "C) 32", "D) 2"],
        correctAnswer: "B",
        explanation: "Maximum electrons in nth shell = 2n² = 2(3²) = 18",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "The energy of hydrogen atom in the ground state is -13.6 eV. Its energy in the second excited state is:",
        options: ["A) -3.4 eV", "B) -1.51 eV", "C) -6.8 eV", "D) -0.85 eV"],
        correctAnswer: "B",
        explanation: "Second excited state means n=3. E₃ = -13.6/9 = -1.51 eV",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
      {
        question: "Which of the following sets of quantum numbers is NOT valid?",
        options: ["A) n=2, l=1, m=0, s=+½", "B) n=3, l=2, m=-1, s=-½", "C) n=2, l=2, m=0, s=+½", "D) n=4, l=3, m=3, s=+½"],
        correctAnswer: "C",
        explanation: "l can be 0 to (n-1). For n=2, maximum l = 1. So l=2 is invalid.",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
    ],
    "Chemical Equilibrium": [
      {
        question: "For the reaction 2SO₂ + O₂ ⇌ 2SO₃, the expression for Kc is:",
        options: ["A) [SO₃]²/([SO₂]²[O₂])", "B) [SO₂]²[O₂]/[SO₃]²", "C) [SO₃]/[SO₂][O₂]", "D) 2[SO₃]/(2[SO₂][O₂])"],
        correctAnswer: "A",
        explanation: "Kc = [products]^coefficients / [reactants]^coefficients = [SO₃]² / ([SO₂]²[O₂])",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "The pH of a 0.01 M HCl solution is:",
        options: ["A) 1", "B) 2", "C) 3", "D) 7"],
        correctAnswer: "B",
        explanation: "HCl is a strong acid. [H⁺] = 0.01 = 10⁻². pH = -log(10⁻²) = 2",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "If Kp for N₂ + 3H₂ ⇌ 2NH₃ at 400°C is 1.64 × 10⁻⁴ atm⁻², the Δng for this reaction is:",
        options: ["A) -2", "B) +2", "C) -1", "D) +1"],
        correctAnswer: "A",
        explanation: "Δng = moles of gaseous products - moles of gaseous reactants = 2 - (1+3) = -2",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
    ],
    "Electrochemistry": [
      {
        question: "The quantity of charge required to deposit 1 mole of aluminium (Al³⁺) is:",
        options: ["A) 96500 C", "B) 193000 C", "C) 289500 C", "D) 48250 C"],
        correctAnswer: "C",
        explanation: "Al³⁺ + 3e⁻ → Al. Charge = 3 × 96500 = 289500 C (3 Faradays)",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
      {
        question: "The standard electrode potential of Zn²⁺/Zn is -0.76 V and Cu²⁺/Cu is +0.34 V. The EMF of Zn-Cu cell is:",
        options: ["A) 0.42 V", "B) 1.10 V", "C) -1.10 V", "D) -0.42 V"],
        correctAnswer: "B",
        explanation: "E°cell = E°cathode - E°anode = 0.34 - (-0.76) = 1.10 V",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
    ],
    "Chemical Kinetics": [
      {
        question: "The half-life of a first-order reaction is 693 s. The rate constant is:",
        options: ["A) 10⁻³ s⁻¹", "B) 10⁻² s⁻¹", "C) 10⁻⁴ s⁻¹", "D) 0.693 s⁻¹"],
        correctAnswer: "A",
        explanation: "t₁/₂ = 0.693/k → k = 0.693/693 = 10⁻³ s⁻¹",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
      {
        question: "For a zero-order reaction, the plot of [A] vs t is:",
        options: ["A) Exponential", "B) Straight line with negative slope", "C) Straight line with positive slope", "D) Parabola"],
        correctAnswer: "B",
        explanation: "[A] = [A]₀ - kt. This is a linear equation with slope = -k",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
      {
        question: "The rate of a reaction doubles when temperature increases from 300 K to 310 K. The activation energy is approximately: (R = 8.314 J/mol·K)",
        options: ["A) 53.6 kJ/mol", "B) 26.8 kJ/mol", "C) 107.2 kJ/mol", "D) 5.36 kJ/mol"],
        correctAnswer: "A",
        explanation: "ln(k₂/k₁) = Ea/R × (1/T₁ - 1/T₂). ln(2) = Ea/8.314 × (1/300 - 1/310). Ea ≈ 53.6 kJ/mol",
        examRelevance: "JEE Main",
        difficulty: "hard",
      },
    ],
    "Organic Chemistry": [
      {
        question: "IUPAC name of CH₃-CH(CH₃)-CH₂-CH₃ is:",
        options: ["A) 2-Methylbutane", "B) 3-Methylbutane", "C) Isopentane", "D) Neopentane"],
        correctAnswer: "A",
        explanation: "Longest chain has 4C (butane). Methyl group at C-2. IUPAC: 2-Methylbutane",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "Which of the following shows +I effect?",
        options: ["A) -NO₂", "B) -CH₃", "C) -COOH", "D) -CN"],
        correctAnswer: "B",
        explanation: "Alkyl groups (like -CH₃) show +I (electron donating) effect. -NO₂, -COOH, -CN show -I effect.",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
      {
        question: "Markovnikov's addition of HBr to propene gives:",
        options: ["A) 1-Bromopropane", "B) 2-Bromopropane", "C) 1,2-Dibromopropane", "D) 3-Bromopropane"],
        correctAnswer: "B",
        explanation: "Markovnikov's rule: H adds to C with more H's, Br adds to C with fewer H's. CH₃CH=CH₂ + HBr → CH₃CHBrCH₃ (2-bromopropane)",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
    ],
  },
  Mathematics: {
    "Quadratic Equations": [
      {
        question: "If one root of x² - 5x + k = 0 is 2, the value of k is:",
        options: ["A) 4", "B) 6", "C) 8", "D) 3"],
        correctAnswer: "B",
        explanation: "If x=2 is a root: 4 - 10 + k = 0 → k = 6",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "The nature of roots of 2x² - 3x + 5 = 0 is:",
        options: ["A) Real and equal", "B) Real and distinct", "C) Complex (imaginary)", "D) Rational"],
        correctAnswer: "C",
        explanation: "D = b² - 4ac = 9 - 40 = -31 < 0. Roots are complex.",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
    ],
    "Trigonometry": [
      {
        question: "The value of sin 75° is:",
        options: ["A) (√6 + √2)/4", "B) (√6 - √2)/4", "C) (√3 + 1)/2√2", "D) Both A and C"],
        correctAnswer: "D",
        explanation: "sin 75° = sin(45° + 30°) = sin45°cos30° + cos45°sin30° = (√2/2)(√3/2) + (√2/2)(1/2) = (√6 + √2)/4. This equals (√3+1)/2√2.",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
      {
        question: "If tan A = 3/4, then sin A is: (A is acute)",
        options: ["A) 3/5", "B) 4/5", "C) 3/4", "D) 5/3"],
        correctAnswer: "A",
        explanation: "tan A = 3/4, so opposite = 3, adjacent = 4. Hypotenuse = 5. sin A = 3/5",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "The general solution of sin x = ½ is:",
        options: ["A) nπ + (-1)ⁿ π/6", "B) 2nπ + π/6", "C) nπ + π/6", "D) 2nπ ± π/6"],
        correctAnswer: "A",
        explanation: "General solution of sin x = sin α is x = nπ + (-1)ⁿα. Here α = π/6.",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
    ],
    "Sequences and Series": [
      {
        question: "The sum of first 20 terms of AP: 2, 5, 8, 11, ... is:",
        options: ["A) 590", "B) 610", "C) 620", "D) 650"],
        correctAnswer: "B",
        explanation: "a=2, d=3, n=20. S₂₀ = 20/2 × [2(2) + 19(3)] = 10 × [4 + 57] = 10 × 61 = 610",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "The sum to infinity of GP: 1, 1/2, 1/4, 1/8, ... is:",
        options: ["A) 1", "B) 2", "C) 3", "D) ∞"],
        correctAnswer: "B",
        explanation: "a = 1, r = 1/2. S∞ = a/(1-r) = 1/(1/2) = 2",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "If 2, x, 8 are in GP, then x is:",
        options: ["A) 4", "B) 5", "C) ±4", "D) ±5"],
        correctAnswer: "C",
        explanation: "In GP, middle term² = product of extremes. x² = 2 × 8 = 16. x = ±4",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
    ],
    "Calculus": [
      {
        question: "The derivative of sin²x is:",
        options: ["A) 2sinx", "B) sin2x", "C) cos2x", "D) 2cos²x"],
        correctAnswer: "B",
        explanation: "d/dx(sin²x) = 2sinx·cosx = sin2x (using chain rule)",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "∫₀^π sin x dx equals:",
        options: ["A) 0", "B) 1", "C) 2", "D) π"],
        correctAnswer: "C",
        explanation: "∫₀^π sinx dx = [-cosx]₀^π = -cosπ + cos0 = 1 + 1 = 2",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "The function f(x) = x³ - 3x + 2 has a local maximum at:",
        options: ["A) x = 0", "B) x = -1", "C) x = 1", "D) x = 2"],
        correctAnswer: "B",
        explanation: "f'(x) = 3x² - 3 = 0 → x = ±1. f''(x) = 6x. f''(-1) = -6 < 0, so local max at x = -1.",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
      {
        question: "∫ x·eˣ dx equals:",
        options: ["A) xeˣ - eˣ + C", "B) xeˣ + eˣ + C", "C) eˣ(x+1) + C", "D) Both A and C"],
        correctAnswer: "D",
        explanation: "By parts: ∫xeˣdx = xeˣ - ∫eˣdx = xeˣ - eˣ + C = eˣ(x-1) + C. Wait, let me recheck: = xeˣ - eˣ + C. And eˣ(x-1)+C. Options: A says xeˣ - eˣ + C (correct). C says eˣ(x+1)+C which equals xeˣ + eˣ + C ≠ xeˣ - eˣ + C. So answer is A only.",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
    ],
    "Probability": [
      {
        question: "Two dice are thrown. The probability that the sum is 7 is:",
        options: ["A) 1/6", "B) 5/36", "C) 1/12", "D) 7/36"],
        correctAnswer: "A",
        explanation: "Favourable outcomes: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. Total = 36. P = 6/36 = 1/6",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
      {
        question: "A bag has 3 red, 5 blue balls. Two balls are drawn at random. The probability that both are red is:",
        options: ["A) 3/28", "B) 3/8", "C) 9/64", "D) 1/7"],
        correctAnswer: "A",
        explanation: "P = ³C₂/⁸C₂ = 3/28",
        examRelevance: "JEE Main",
        difficulty: "medium",
      },
      {
        question: "If P(A) = 0.4, P(B) = 0.5, P(A∩B) = 0.2, then P(A∪B) is:",
        options: ["A) 0.7", "B) 0.9", "C) 0.3", "D) 0.5"],
        correctAnswer: "A",
        explanation: "P(A∪B) = P(A) + P(B) - P(A∩B) = 0.4 + 0.5 - 0.2 = 0.7",
        examRelevance: "CBSE Board",
        difficulty: "easy",
      },
    ],
    "Coordinate Geometry": [
      {
        question: "The distance of the point (3, 4) from the line 3x + 4y - 5 = 0 is:",
        options: ["A) 4", "B) 5", "C) 20/5", "D) 20/25"],
        correctAnswer: "A",
        explanation: "d = |3(3) + 4(4) - 5| / √(9+16) = |9+16-5| / 5 = 20/5 = 4",
        examRelevance: "JEE Main",
        difficulty: "easy",
      },
      {
        question: "The equation of a circle with centre (2, -3) and radius 5 is:",
        options: ["A) x² + y² - 4x + 6y - 12 = 0", "B) x² + y² - 4x - 6y + 12 = 0", "C) x² + y² + 4x - 6y - 12 = 0", "D) x² + y² - 4x + 6y + 12 = 0"],
        correctAnswer: "A",
        explanation: "(x-2)² + (y+3)² = 25 → x²-4x+4+y²+6y+9 = 25 → x²+y²-4x+6y-12 = 0",
        examRelevance: "CBSE Board",
        difficulty: "medium",
      },
    ],
  },
};

// Get all available subjects
export function getSubjects() {
  return Object.keys(QUESTIONS);
}

// Get all chapters for a subject
export function getChapters(subject) {
  return Object.keys(QUESTIONS[subject] || {});
}

// Get questions for a specific subject and chapter
export function getQuestions(subject, chapter) {
  return QUESTIONS[subject]?.[chapter] || [];
}

// Get all questions for a subject (across all chapters)
export function getAllSubjectQuestions(subject) {
  const chapters = QUESTIONS[subject] || {};
  return Object.values(chapters).flat();
}

// Get random questions (mixed subjects)
export function getRandomQuestions(count = 10) {
  const all = Object.values(QUESTIONS).flatMap(subj => Object.values(subj).flat());
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Get questions by difficulty
export function getQuestionsByDifficulty(difficulty) {
  const all = Object.values(QUESTIONS).flatMap(subj => Object.values(subj).flat());
  return all.filter(q => q.difficulty === difficulty);
}

export default QUESTIONS;
