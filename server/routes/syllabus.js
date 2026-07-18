const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const { callGemini } = require("../services/gemini");

const cache = new NodeCache({ stdTTL: 7200 }); // 2 hour cache

// ─── COMPLETE CBSE CLASS 11 SYLLABUS DATA ────────────────────────────────────

const SYLLABUS = {
  Physics: [
    {
      name: "Units and Measurements",
      jeeWeightage: 2,
      cbseWeightage: 3,
      difficulty: "easy",
      topics: [
        "SI Units",
        "Dimensional Analysis",
        "Significant Figures",
        "Errors in Measurement",
        "Dimensional Formulae and Equations",
      ],
    },
    {
      name: "Motion in a Straight Line",
      jeeWeightage: 3,
      cbseWeightage: 5,
      difficulty: "medium",
      topics: [
        "Position, Path Length and Displacement",
        "Average and Instantaneous Velocity",
        "Acceleration",
        "Equations of Motion",
        "Relative Velocity",
        "Motion under Gravity",
      ],
    },
    {
      name: "Motion in a Plane",
      jeeWeightage: 5,
      cbseWeightage: 5,
      difficulty: "medium",
      topics: [
        "Scalars and Vectors",
        "Vector Addition and Subtraction",
        "Resolution of Vectors",
        "Projectile Motion",
        "Uniform Circular Motion",
      ],
    },
    {
      name: "Laws of Motion",
      jeeWeightage: 6,
      cbseWeightage: 7,
      difficulty: "medium",
      topics: [
        "Newton's First Law and Inertia",
        "Newton's Second Law (F=ma)",
        "Newton's Third Law",
        "Free Body Diagrams",
        "Friction — Static and Kinetic",
        "Circular Motion and Banking",
        "Pulley and Constraint Relations",
      ],
    },
    {
      name: "Work, Energy and Power",
      jeeWeightage: 6,
      cbseWeightage: 7,
      difficulty: "medium",
      topics: [
        "Work Done by a Force",
        "Kinetic Energy and Work-Energy Theorem",
        "Potential Energy",
        "Conservation of Mechanical Energy",
        "Power",
        "Collisions — Elastic and Inelastic",
      ],
    },
    {
      name: "System of Particles and Rotational Motion",
      jeeWeightage: 8,
      cbseWeightage: 7,
      difficulty: "hard",
      topics: [
        "Centre of Mass",
        "Torque and Angular Momentum",
        "Moment of Inertia",
        "Theorems of Perpendicular and Parallel Axes",
        "Rolling Motion",
        "Equilibrium of Rigid Bodies",
      ],
    },
    {
      name: "Gravitation",
      jeeWeightage: 5,
      cbseWeightage: 5,
      difficulty: "medium",
      topics: [
        "Universal Law of Gravitation",
        "Acceleration due to Gravity",
        "Gravitational Potential Energy",
        "Escape and Orbital Velocity",
        "Kepler's Laws",
        "Satellites",
      ],
    },
    {
      name: "Mechanical Properties of Solids",
      jeeWeightage: 3,
      cbseWeightage: 5,
      difficulty: "easy",
      topics: [
        "Stress and Strain",
        "Hooke's Law",
        "Young's Modulus",
        "Bulk Modulus",
        "Shear Modulus",
        "Poisson's Ratio",
        "Elastic Potential Energy",
      ],
    },
    {
      name: "Mechanical Properties of Fluids",
      jeeWeightage: 5,
      cbseWeightage: 5,
      difficulty: "medium",
      topics: [
        "Pressure and Pascal's Law",
        "Bernoulli's Principle",
        "Viscosity and Stokes' Law",
        "Surface Tension",
        "Capillarity",
        "Streamline and Turbulent Flow",
      ],
    },
    {
      name: "Thermal Properties of Matter",
      jeeWeightage: 4,
      cbseWeightage: 5,
      difficulty: "easy",
      topics: [
        "Heat and Temperature",
        "Thermal Expansion",
        "Calorimetry",
        "Change of State",
        "Heat Transfer — Conduction, Convection, Radiation",
        "Newton's Law of Cooling",
      ],
    },
    {
      name: "Thermodynamics",
      jeeWeightage: 7,
      cbseWeightage: 6,
      difficulty: "hard",
      topics: [
        "Thermal Equilibrium and Zeroth Law",
        "First Law of Thermodynamics",
        "Specific Heat Capacities (Cp and Cv)",
        "Thermodynamic Processes (Isothermal, Adiabatic, Isobaric, Isochoric)",
        "Second Law of Thermodynamics",
        "Carnot Engine and Efficiency",
      ],
    },
    {
      name: "Kinetic Theory",
      jeeWeightage: 4,
      cbseWeightage: 4,
      difficulty: "medium",
      topics: [
        "Molecular Nature of Matter",
        "Ideal Gas Equation (PV=nRT)",
        "Kinetic Theory of an Ideal Gas",
        "RMS, Average, Most Probable Speed",
        "Degrees of Freedom",
        "Law of Equipartition of Energy",
        "Mean Free Path",
      ],
    },
    {
      name: "Oscillations",
      jeeWeightage: 6,
      cbseWeightage: 5,
      difficulty: "hard",
      topics: [
        "Simple Harmonic Motion (SHM)",
        "Displacement, Velocity, Acceleration in SHM",
        "Energy in SHM",
        "Simple Pendulum",
        "Spring-Mass System",
        "Damped and Forced Oscillations",
        "Resonance",
      ],
    },
    {
      name: "Waves",
      jeeWeightage: 6,
      cbseWeightage: 6,
      difficulty: "hard",
      topics: [
        "Transverse and Longitudinal Waves",
        "Wave Speed and Equation",
        "Superposition of Waves",
        "Standing Waves",
        "Harmonics and Overtones",
        "Beats",
        "Doppler Effect",
      ],
    },
  ],

  Chemistry: [
    {
      name: "Some Basic Concepts of Chemistry",
      jeeWeightage: 3,
      cbseWeightage: 5,
      difficulty: "easy",
      topics: [
        "Mole Concept",
        "Atomic and Molecular Mass",
        "Stoichiometry",
        "Percentage Composition",
        "Empirical and Molecular Formula",
        "Limiting Reagent",
        "Concentration Terms",
      ],
    },
    {
      name: "Structure of Atom",
      jeeWeightage: 5,
      cbseWeightage: 6,
      difficulty: "medium",
      topics: [
        "Bohr's Model",
        "Quantum Mechanical Model",
        "Quantum Numbers",
        "Shapes of Orbitals (s, p, d)",
        "Aufbau Principle",
        "Pauli Exclusion Principle",
        "Hund's Rule",
        "Electronic Configuration",
      ],
    },
    {
      name: "Classification of Elements and Periodicity",
      jeeWeightage: 3,
      cbseWeightage: 4,
      difficulty: "easy",
      topics: [
        "Modern Periodic Table",
        "Periodic Trends — Atomic Radius",
        "Ionization Enthalpy",
        "Electron Gain Enthalpy",
        "Electronegativity",
        "Metallic and Non-metallic Character",
      ],
    },
    {
      name: "Chemical Bonding and Molecular Structure",
      jeeWeightage: 7,
      cbseWeightage: 7,
      difficulty: "hard",
      topics: [
        "Ionic Bond",
        "Covalent Bond",
        "Lewis Structures",
        "VSEPR Theory",
        "Hybridization (sp, sp2, sp3)",
        "Molecular Orbital Theory",
        "Hydrogen Bonding",
        "Bond Parameters",
      ],
    },
    {
      name: "States of Matter",
      jeeWeightage: 3,
      cbseWeightage: 4,
      difficulty: "easy",
      topics: [
        "Intermolecular Forces",
        "Gas Laws (Boyle's, Charles's, Avogadro's)",
        "Ideal Gas Equation",
        "Dalton's Law of Partial Pressures",
        "Kinetic Molecular Theory",
        "Real Gases and Van der Waals Equation",
        "Liquefaction of Gases",
      ],
    },
    {
      name: "Thermodynamics",
      jeeWeightage: 8,
      cbseWeightage: 7,
      difficulty: "hard",
      topics: [
        "System, Surroundings, State Functions",
        "First Law of Thermodynamics",
        "Enthalpy (ΔH)",
        "Hess's Law",
        "Bond Enthalpy",
        "Entropy (ΔS)",
        "Gibbs Free Energy (ΔG)",
        "Spontaneity",
      ],
    },
    {
      name: "Equilibrium",
      jeeWeightage: 8,
      cbseWeightage: 7,
      difficulty: "hard",
      topics: [
        "Law of Chemical Equilibrium",
        "Equilibrium Constant (Kc, Kp)",
        "Le Chatelier's Principle",
        "Ionic Equilibrium",
        "Acids and Bases",
        "pH Scale",
        "Buffer Solutions",
        "Solubility Product (Ksp)",
        "Common Ion Effect",
      ],
    },
    {
      name: "Redox Reactions",
      jeeWeightage: 3,
      cbseWeightage: 4,
      difficulty: "medium",
      topics: [
        "Oxidation and Reduction",
        "Oxidation Number",
        "Balancing Redox Reactions",
        "Types of Redox Reactions",
        "Electrochemical Cells (Introduction)",
      ],
    },
    {
      name: "Hydrogen",
      jeeWeightage: 1,
      cbseWeightage: 3,
      difficulty: "easy",
      topics: [
        "Position of Hydrogen in Periodic Table",
        "Isotopes of Hydrogen",
        "Preparation of Dihydrogen",
        "Properties of Dihydrogen",
        "Hydrides",
        "Water and Hydrogen Peroxide",
      ],
    },
    {
      name: "s-Block Elements",
      jeeWeightage: 4,
      cbseWeightage: 5,
      difficulty: "easy",
      topics: [
        "Group 1 — Alkali Metals",
        "Group 2 — Alkaline Earth Metals",
        "General Characteristics",
        "Anomalous Properties of Li and Be",
        "Important Compounds (NaOH, Na2CO3, NaHCO3, CaO, Ca(OH)2, CaSO4, Plaster of Paris, Cement)",
        "Biological Importance",
      ],
    },
    {
      name: "p-Block Elements",
      jeeWeightage: 5,
      cbseWeightage: 5,
      difficulty: "medium",
      topics: [
        "Group 13 — Boron Family",
        "Group 14 — Carbon Family",
        "General Properties and Trends",
        "Important Compounds of Boron (Borax, Boric Acid, Boron Hydrides)",
        "Important Compounds of Carbon (CO, CO2)",
        "Allotropes of Carbon",
        "Important Compounds of Silicon (Silicones, Silicates, Zeolites)",
      ],
    },
    {
      name: "Organic Chemistry — Some Basic Principles and Techniques",
      jeeWeightage: 5,
      cbseWeightage: 6,
      difficulty: "medium",
      topics: [
        "IUPAC Nomenclature",
        "Isomerism",
        "Electronic Displacement Effects (Inductive, Resonance, Hyperconjugation)",
        "Homolytic and Heterolytic Fission",
        "Types of Reagents",
        "Types of Organic Reactions",
        "Purification Methods",
      ],
    },
    {
      name: "Hydrocarbons",
      jeeWeightage: 4,
      cbseWeightage: 5,
      difficulty: "medium",
      topics: [
        "Alkanes — Preparation and Properties",
        "Alkenes — Preparation and Properties",
        "Alkynes — Preparation and Properties",
        "Aromatic Hydrocarbons — Benzene",
        "Electrophilic Substitution Reactions",
        "Markovnikov's and Anti-Markovnikov's Rule",
        "Conformations",
      ],
    },
    {
      name: "Environmental Chemistry",
      jeeWeightage: 1,
      cbseWeightage: 3,
      difficulty: "easy",
      topics: [
        "Air Pollution",
        "Water Pollution",
        "Soil Pollution",
        "Ozone Layer Depletion",
        "Acid Rain",
        "Greenhouse Effect and Global Warming",
        "Green Chemistry",
      ],
    },
  ],

  Mathematics: [
    {
      name: "Sets",
      jeeWeightage: 2,
      cbseWeightage: 4,
      difficulty: "easy",
      topics: [
        "Types of Sets",
        "Subsets",
        "Venn Diagrams",
        "Operations on Sets (Union, Intersection, Difference, Complement)",
        "Practical Problems on Sets",
      ],
    },
    {
      name: "Relations and Functions",
      jeeWeightage: 5,
      cbseWeightage: 5,
      difficulty: "medium",
      topics: [
        "Cartesian Product of Sets",
        "Relations",
        "Functions",
        "Domain, Co-domain, Range",
        "Types of Functions (One-one, Onto, Many-one, Into)",
        "Algebra of Real Functions",
      ],
    },
    {
      name: "Trigonometric Functions",
      jeeWeightage: 8,
      cbseWeightage: 7,
      difficulty: "hard",
      topics: [
        "Angles and Their Measurement (Degree, Radian)",
        "Trigonometric Functions and Identities",
        "Trigonometric Equations",
        "Sum and Difference Formulas",
        "Multiple and Sub-multiple Angles",
        "Graphs of Trigonometric Functions",
        "Inverse Trigonometric Preview",
      ],
    },
    {
      name: "Principle of Mathematical Induction",
      jeeWeightage: 2,
      cbseWeightage: 4,
      difficulty: "medium",
      topics: [
        "Principle of Mathematical Induction",
        "Proving Statements using PMI",
        "Divisibility Problems",
        "Sum of Series using Induction",
      ],
    },
    {
      name: "Complex Numbers and Quadratic Equations",
      jeeWeightage: 7,
      cbseWeightage: 5,
      difficulty: "hard",
      topics: [
        "Complex Numbers (a + bi)",
        "Algebra of Complex Numbers",
        "Modulus and Argument",
        "Argand Plane",
        "Polar Representation",
        "Quadratic Equations in Complex Number System",
        "Square Root of Complex Numbers",
      ],
    },
    {
      name: "Linear Inequalities",
      jeeWeightage: 2,
      cbseWeightage: 4,
      difficulty: "easy",
      topics: [
        "Linear Inequalities in One Variable",
        "Linear Inequalities in Two Variables",
        "Graphical Representation",
        "System of Linear Inequalities",
      ],
    },
    {
      name: "Permutations and Combinations",
      jeeWeightage: 7,
      cbseWeightage: 5,
      difficulty: "hard",
      topics: [
        "Fundamental Principle of Counting",
        "Permutations (nPr)",
        "Combinations (nCr)",
        "Permutations with Repetition",
        "Permutations with Restrictions",
        "Circular Permutations",
        "Division and Distribution Problems",
      ],
    },
    {
      name: "Binomial Theorem",
      jeeWeightage: 5,
      cbseWeightage: 5,
      difficulty: "medium",
      topics: [
        "Binomial Theorem for Positive Integers",
        "General and Middle Terms",
        "Binomial Coefficients",
        "Pascal's Triangle",
        "Applications of Binomial Theorem",
      ],
    },
    {
      name: "Sequences and Series",
      jeeWeightage: 7,
      cbseWeightage: 6,
      difficulty: "hard",
      topics: [
        "Arithmetic Progression (AP)",
        "Geometric Progression (GP)",
        "Harmonic Progression (HP)",
        "Arithmetic-Geometric Progression (AGP)",
        "Sum to n Terms",
        "Sum to Infinity (GP)",
        "Arithmetico-Geometric Series",
        "Relationship between AM, GM, HM",
      ],
    },
    {
      name: "Straight Lines",
      jeeWeightage: 5,
      cbseWeightage: 5,
      difficulty: "medium",
      topics: [
        "Slope of a Line",
        "Various Forms of Equation of Line",
        "Distance of a Point from a Line",
        "Angle between Two Lines",
        "Family of Lines",
        "Shifting of Origin",
      ],
    },
    {
      name: "Conic Sections",
      jeeWeightage: 8,
      cbseWeightage: 6,
      difficulty: "hard",
      topics: [
        "Circle",
        "Parabola",
        "Ellipse",
        "Hyperbola",
        "Standard Equations",
        "Eccentricity",
        "Latus Rectum",
        "Tangents and Normals (Introduction)",
      ],
    },
    {
      name: "Introduction to Three Dimensional Geometry",
      jeeWeightage: 3,
      cbseWeightage: 4,
      difficulty: "easy",
      topics: [
        "Coordinate Axes in 3D",
        "Distance between Two Points",
        "Section Formula",
        "Coordinates of Centroid",
      ],
    },
    {
      name: "Limits and Derivatives",
      jeeWeightage: 8,
      cbseWeightage: 7,
      difficulty: "hard",
      topics: [
        "Intuitive Idea of Limits",
        "Limits of Polynomials and Rational Functions",
        "Trigonometric Limits",
        "Limits using L'Hôpital's Rule (Introduction)",
        "Definition of Derivative",
        "First Principle of Derivatives",
        "Algebra of Derivatives",
        "Derivative of Polynomial and Trigonometric Functions",
      ],
    },
    {
      name: "Mathematical Reasoning",
      jeeWeightage: 1,
      cbseWeightage: 3,
      difficulty: "easy",
      topics: [
        "Statements and Logical Connectives",
        "Negation",
        "Compound Statements (AND, OR)",
        "Conditional Statements (If-Then)",
        "Biconditional Statements",
        "Contrapositive and Converse",
        "Quantifiers",
      ],
    },
    {
      name: "Statistics",
      jeeWeightage: 2,
      cbseWeightage: 5,
      difficulty: "easy",
      topics: [
        "Measures of Dispersion",
        "Range",
        "Mean Deviation",
        "Variance and Standard Deviation",
        "Analysis of Frequency Distributions",
      ],
    },
    {
      name: "Probability",
      jeeWeightage: 5,
      cbseWeightage: 5,
      difficulty: "medium",
      topics: [
        "Random Experiments and Sample Space",
        "Events",
        "Axiomatic Approach to Probability",
        "Addition Theorem",
        "Mutually Exclusive Events",
        "Complementary Events",
        "Conditional Probability (Introduction)",
      ],
    },
  ],
};

function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, 200);
}

// GET /api/syllabus — full syllabus
router.get("/", (_req, res) => {
  res.json({
    syllabus: SYLLABUS,
    subjects: Object.keys(SYLLABUS),
    totalChapters: Object.values(SYLLABUS).reduce(
      (sum, chapters) => sum + chapters.length,
      0
    ),
  });
});

// GET /api/syllabus/:subject/:chapter/notes
router.get("/:subject/:chapter/notes", async (req, res) => {
  try {
    const subject = sanitize(req.params.subject);
    const chapter = sanitize(req.params.chapter);

    if (!subject || !chapter) {
      return res
        .status(400)
        .json({ error: "Subject and chapter are required." });
    }

    const cacheKey = `notes:${subject}:${chapter}`.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ notes: cached, cached: true });

    // Find chapter in syllabus for context
    const subjectData = SYLLABUS[subject];
    const chapterData = subjectData?.find(
      (ch) =>
        ch.name.toLowerCase().includes(chapter.toLowerCase()) ||
        chapter.toLowerCase().includes(ch.name.toLowerCase())
    );

    const systemPrompt = `You are an expert JEE + CBSE teacher creating concise revision notes for a Class 11 student.

Create well-structured notes that include:
1. Key Concepts — explained simply with examples
2. Important Definitions
3. Diagrams described in text (explain what diagram to draw)
4. Important Derivations (step by step)
5. Common Mistakes to avoid
6. JEE Main vs JEE Advanced vs CBSE — what to focus on

Use markdown formatting with LaTeX math ($$...$$ for block, $...$ for inline equations).
Keep it concise but comprehensive — like the perfect revision notes.`;

    const userMessage = `Create concise revision notes for:
Subject: ${subject}
Chapter: ${chapter}
${chapterData ? `Topics to cover: ${chapterData.topics.join(", ")}` : ""}
${chapterData ? `Difficulty: ${chapterData.difficulty}` : ""}`;

    const notes = await callGemini(systemPrompt, userMessage);

    cache.set(cacheKey, notes);
    res.json({ notes, subject, chapter, cached: false });
  } catch (error) {
    console.error("Syllabus notes error:", error.message);
    res.status(500).json({ error: "Failed to generate notes." });
  }
});

// GET /api/syllabus/:subject/:chapter/formulas
router.get("/:subject/:chapter/formulas", async (req, res) => {
  try {
    const subject = sanitize(req.params.subject);
    const chapter = sanitize(req.params.chapter);

    if (!subject || !chapter) {
      return res
        .status(400)
        .json({ error: "Subject and chapter are required." });
    }

    const cacheKey = `formulas:${subject}:${chapter}`.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ formulas: cached, cached: true });

    const subjectData = SYLLABUS[subject];
    const chapterData = subjectData?.find(
      (ch) =>
        ch.name.toLowerCase().includes(chapter.toLowerCase()) ||
        chapter.toLowerCase().includes(ch.name.toLowerCase())
    );

    const systemPrompt = `You are creating a formula sheet / cheat sheet for a JEE + CBSE student.

Create a clean, organized formula sheet that includes:
1. ALL important formulas for this chapter
2. Each formula with: the formula in LaTeX, what each symbol represents, when to use it
3. Organize by sub-topic
4. Mark formulas that are specifically important for JEE Advanced with ⭐
5. Include any useful shortcuts or quick-calculation tricks

Use proper LaTeX: $$...$$ for block equations, $...$ for inline.
Format it like a printable formula sheet — clean and scannable.`;

    const userMessage = `Create a complete formula sheet for:
Subject: ${subject}
Chapter: ${chapter}
${chapterData ? `Topics: ${chapterData.topics.join(", ")}` : ""}`;

    const formulas = await callGemini(systemPrompt, userMessage);

    cache.set(cacheKey, formulas);
    res.json({ formulas, subject, chapter, cached: false });
  } catch (error) {
    console.error("Syllabus formulas error:", error.message);
    res.status(500).json({ error: "Failed to generate formula sheet." });
  }
});

module.exports = router;
