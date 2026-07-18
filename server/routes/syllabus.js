const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const { callGemini } = require("../services/gemini");

const cache = new NodeCache({ stdTTL: 7200 }); // 2 hour cache

// ─── COMPLETE CBSE CLASS 11 SYLLABUS DATA ────────────────────────────────────

const SYLLABUS_11 = {
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

// ─── COMPLETE CBSE CLASS 12 SYLLABUS DATA ────────────────────────────────────

const SYLLABUS_12 = {
  Physics: [
    { name: "Electric Charges and Fields", jeeWeightage: 8, cbseWeightage: 8, difficulty: "medium", topics: ["Electric charge and its properties", "Coulomb's law", "Electric field and field lines", "Electric dipole", "Electric flux", "Gauss's theorem and applications"] },
    { name: "Electrostatic Potential and Capacitance", jeeWeightage: 8, cbseWeightage: 8, difficulty: "medium", topics: ["Electric potential and potential difference", "Equipotential surfaces", "Potential due to point charge and dipole", "Capacitors and capacitance", "Parallel plate capacitor", "Combination of capacitors", "Energy stored in capacitor"] },
    { name: "Current Electricity", jeeWeightage: 9, cbseWeightage: 9, difficulty: "medium", topics: ["Electric current and drift velocity", "Ohm's law and resistance", "Resistivity and conductivity", "Combination of resistors", "Kirchhoff's laws", "Wheatstone bridge", "Metre bridge and potentiometer", "Cells, EMF and internal resistance"] },
    { name: "Moving Charges and Magnetism", jeeWeightage: 8, cbseWeightage: 8, difficulty: "hard", topics: ["Magnetic force on a moving charge", "Motion of charged particle in magnetic field", "Biot-Savart law", "Ampere's circuital law", "Force on current-carrying conductor", "Force between parallel conductors", "Torque on current loop", "Moving coil galvanometer"] },
    { name: "Magnetism and Matter", jeeWeightage: 4, cbseWeightage: 5, difficulty: "easy", topics: ["Bar magnet as solenoid", "Magnetic field lines", "Earth's magnetism", "Para-, dia- and ferromagnetic substances", "Hysteresis curve"] },
    { name: "Electromagnetic Induction", jeeWeightage: 9, cbseWeightage: 8, difficulty: "hard", topics: ["Faraday's laws", "Lenz's law", "Motional EMF", "Eddy currents", "Self and mutual inductance", "AC generator"] },
    { name: "Alternating Current", jeeWeightage: 7, cbseWeightage: 7, difficulty: "hard", topics: ["AC voltage applied to R, L, C", "Phasor diagrams", "LCR series circuit and resonance", "Power in AC circuits", "Wattless current", "LC oscillations", "Transformers"] },
    { name: "Electromagnetic Waves", jeeWeightage: 3, cbseWeightage: 4, difficulty: "easy", topics: ["Displacement current", "Electromagnetic spectrum", "Properties of EM waves", "Uses of EM waves"] },
    { name: "Ray Optics and Optical Instruments", jeeWeightage: 9, cbseWeightage: 9, difficulty: "medium", topics: ["Reflection and refraction", "Total internal reflection", "Lens maker's formula", "Prism and dispersion", "Combination of lenses", "Microscope", "Telescope", "Power and magnification"] },
    { name: "Wave Optics", jeeWeightage: 8, cbseWeightage: 7, difficulty: "hard", topics: ["Huygens' principle", "Interference and Young's double slit", "Diffraction at single slit", "Resolving power", "Polarisation and Brewster's law"] },
    { name: "Dual Nature of Radiation and Matter", jeeWeightage: 6, cbseWeightage: 6, difficulty: "medium", topics: ["Photoelectric effect", "Einstein's equation", "Photon characteristics", "de Broglie relation", "Davisson-Germer experiment"] },
    { name: "Atoms", jeeWeightage: 6, cbseWeightage: 5, difficulty: "medium", topics: ["Rutherford's model", "Bohr model", "Energy levels", "Hydrogen spectrum", "de Broglie's explanation of quantisation"] },
    { name: "Nuclei", jeeWeightage: 6, cbseWeightage: 6, difficulty: "medium", topics: ["Nuclear composition", "Mass-energy equivalence", "Binding energy", "Nuclear fission and fusion", "Radioactivity", "Half-life and mean life"] },
    { name: "Semiconductor Electronics", jeeWeightage: 5, cbseWeightage: 7, difficulty: "medium", topics: ["Energy bands", "Intrinsic and extrinsic semiconductors", "p-n junction diode", "Rectifier", "Zener diode", "Photodiode, LED, solar cell", "Logic gates"] },
  ],
  Chemistry: [
    { name: "The Solid State", jeeWeightage: 5, cbseWeightage: 5, difficulty: "medium", topics: ["Classification of solids", "Crystal lattice and unit cells", "Atoms in unit cell", "Close-packed structures", "Voids", "Density calculations", "Imperfections in solids"] },
    { name: "Solutions", jeeWeightage: 7, cbseWeightage: 7, difficulty: "medium", topics: ["Types of solutions", "Henry's law", "Raoult's law", "Colligative properties", "Vapour pressure lowering", "Boiling point elevation", "Freezing point depression", "Osmotic pressure", "Van't Hoff factor"] },
    { name: "Electrochemistry", jeeWeightage: 8, cbseWeightage: 8, difficulty: "hard", topics: ["Electrochemical cells", "Nernst equation", "Standard electrode potential", "Gibbs energy and EMF", "Conductance and molar conductivity", "Kohlrausch's law", "Electrolysis and Faraday's laws", "Batteries and corrosion"] },
    { name: "Chemical Kinetics", jeeWeightage: 8, cbseWeightage: 8, difficulty: "hard", topics: ["Rate of reaction", "Order and molecularity", "Integrated rate equations", "Half-life", "Collision theory", "Arrhenius equation", "Temperature dependence of rate"] },
    { name: "Surface Chemistry", jeeWeightage: 4, cbseWeightage: 4, difficulty: "easy", topics: ["Adsorption", "Freundlich isotherm", "Catalysis", "Colloids — classification and properties", "Emulsions", "Tyndall effect, Brownian movement"] },
    { name: "General Principles of Isolation of Elements", jeeWeightage: 3, cbseWeightage: 4, difficulty: "easy", topics: ["Concentration, reduction, refining", "Ellingham diagram", "Electrolytic refining", "Extraction of Al, Cu, Zn, Fe"] },
    { name: "The p-Block Elements (Class 12)", jeeWeightage: 7, cbseWeightage: 8, difficulty: "medium", topics: ["Group 15 — nitrogen compounds", "Group 16 — oxygen, ozone, sulphur", "Group 17 — halogens, interhalogen compounds", "Group 18 — noble gases", "Oxoacids structures"] },
    { name: "The d- and f-Block Elements", jeeWeightage: 6, cbseWeightage: 7, difficulty: "medium", topics: ["Transition element properties", "Electronic configuration", "Colour and magnetic properties", "KMnO₄ and K₂Cr₂O₇", "Lanthanoids and actinoids", "Lanthanoid contraction"] },
    { name: "Coordination Compounds", jeeWeightage: 8, cbseWeightage: 7, difficulty: "hard", topics: ["Werner's theory", "IUPAC nomenclature", "Isomerism", "Valence bond theory", "Crystal field theory", "Colour and magnetic properties", "Applications"] },
    { name: "Haloalkanes and Haloarenes", jeeWeightage: 7, cbseWeightage: 7, difficulty: "medium", topics: ["Classification and preparation", "SN1 and SN2 mechanisms", "Elimination reactions", "Wurtz reaction", "Electrophilic substitution", "Polyhalogen compounds"] },
    { name: "Alcohols, Phenols and Ethers", jeeWeightage: 7, cbseWeightage: 7, difficulty: "medium", topics: ["Preparation of alcohols", "Properties of alcohols", "Phenols — acidity and reactions", "Ethers — Williamson synthesis", "Distinction tests"] },
    { name: "Aldehydes, Ketones and Carboxylic Acids", jeeWeightage: 9, cbseWeightage: 8, difficulty: "hard", topics: ["Nucleophilic addition", "Aldol condensation", "Cannizzaro reaction", "Oxidation and reduction", "Carboxylic acid acidity", "Hell-Volhard-Zelinsky reaction"] },
    { name: "Amines", jeeWeightage: 7, cbseWeightage: 6, difficulty: "medium", topics: ["Classification and preparation", "Basicity of amines", "Gabriel phthalimide synthesis", "Hoffmann bromamide reaction", "Diazonium salts", "Coupling reaction"] },
    { name: "Biomolecules", jeeWeightage: 3, cbseWeightage: 5, difficulty: "easy", topics: ["Carbohydrates", "Proteins and amino acids", "Enzymes", "Vitamins", "Nucleic acids — DNA and RNA"] },
    { name: "Polymers", jeeWeightage: 2, cbseWeightage: 4, difficulty: "easy", topics: ["Classification", "Addition and condensation polymerisation", "Natural and synthetic rubber", "Important polymers", "Biodegradable polymers"] },
    { name: "Chemistry in Everyday Life", jeeWeightage: 1, cbseWeightage: 3, difficulty: "easy", topics: ["Drug classification", "Antacids, analgesics, antibiotics", "Food preservatives", "Soaps and detergents"] },
  ],
  Mathematics: [
    { name: "Relations and Functions (Class 12)", jeeWeightage: 5, cbseWeightage: 6, difficulty: "medium", topics: ["Types of relations", "Types of functions", "Composition of functions", "Invertible functions", "Binary operations"] },
    { name: "Inverse Trigonometric Functions", jeeWeightage: 6, cbseWeightage: 5, difficulty: "medium", topics: ["Domain, range and principal value", "Graphs", "Properties and identities", "Simplification", "Equations involving inverse trig functions"] },
    { name: "Matrices", jeeWeightage: 6, cbseWeightage: 7, difficulty: "medium", topics: ["Types of matrices", "Operations on matrices", "Transpose", "Symmetric and skew-symmetric", "Elementary operations", "Invertible matrices"] },
    { name: "Determinants", jeeWeightage: 7, cbseWeightage: 8, difficulty: "medium", topics: ["Determinant of square matrix", "Properties", "Minors and cofactors", "Adjoint and inverse", "Cramer's rule", "Area of triangle", "Consistency of equations"] },
    { name: "Continuity and Differentiability", jeeWeightage: 9, cbseWeightage: 8, difficulty: "hard", topics: ["Continuity at a point", "Differentiability", "Chain rule", "Implicit differentiation", "Inverse trig derivatives", "Logarithmic differentiation", "Rolle's and Mean Value Theorem", "Second order derivatives"] },
    { name: "Application of Derivatives", jeeWeightage: 9, cbseWeightage: 8, difficulty: "hard", topics: ["Rate of change", "Increasing/decreasing functions", "Tangents and normals", "Maxima and minima", "Approximations", "Word problems"] },
    { name: "Integrals", jeeWeightage: 10, cbseWeightage: 9, difficulty: "hard", topics: ["Integration by substitution", "Partial fractions", "Integration by parts", "Definite integrals", "Properties of definite integrals", "Fundamental theorem of calculus", "Special integrals"] },
    { name: "Application of Integrals", jeeWeightage: 7, cbseWeightage: 7, difficulty: "hard", topics: ["Area under curves", "Area between two curves", "Area bounded by curve and axes"] },
    { name: "Differential Equations", jeeWeightage: 8, cbseWeightage: 7, difficulty: "hard", topics: ["Order and degree", "Formation of DE", "Variable separable", "Homogeneous DE", "Linear DE of first order"] },
    { name: "Vector Algebra", jeeWeightage: 7, cbseWeightage: 6, difficulty: "medium", topics: ["Vectors and scalars", "Types of vectors", "Position vector", "Dot product", "Cross product", "Scalar triple product"] },
    { name: "Three Dimensional Geometry", jeeWeightage: 8, cbseWeightage: 7, difficulty: "hard", topics: ["Direction cosines", "Equation of a line", "Angle between lines", "Shortest distance between skew lines", "Equation of a plane", "Distance from a plane"] },
    { name: "Linear Programming", jeeWeightage: 2, cbseWeightage: 6, difficulty: "easy", topics: ["Mathematical formulation", "Graphical method", "Feasible region", "Corner point method"] },
    { name: "Probability (Class 12)", jeeWeightage: 8, cbseWeightage: 8, difficulty: "medium", topics: ["Conditional probability", "Multiplication theorem", "Independent events", "Bayes' theorem", "Random variables", "Binomial distribution"] },
  ],
};

// Combined lookup
const SYLLABUS = { 11: SYLLABUS_11, 12: SYLLABUS_12 };

function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, 200);
}

// GET /api/syllabus — full syllabus (both classes)
router.get("/", (req, res) => {
  const classNum = req.query.class; // optional: ?class=11 or ?class=12
  if (classNum && SYLLABUS[classNum]) {
    const data = SYLLABUS[classNum];
    return res.json({
      class: parseInt(classNum),
      syllabus: data,
      subjects: Object.keys(data),
      totalChapters: Object.values(data).reduce((s, c) => s + c.length, 0),
    });
  }
  // Return both classes
  res.json({
    classes: [11, 12],
    syllabus: { 11: SYLLABUS_11, 12: SYLLABUS_12 },
    subjects: Object.keys(SYLLABUS_11),
    totalChapters: {
      11: Object.values(SYLLABUS_11).reduce((s, c) => s + c.length, 0),
      12: Object.values(SYLLABUS_12).reduce((s, c) => s + c.length, 0),
    },
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

    // Find chapter in both class syllabuses
    let chapterData = null;
    for (const cls of [SYLLABUS_11, SYLLABUS_12]) {
      const subjectData = cls[subject];
      const found = subjectData?.find(
        (ch) => ch.name.toLowerCase().includes(chapter.toLowerCase()) || chapter.toLowerCase().includes(ch.name.toLowerCase())
      );
      if (found) { chapterData = found; break; }
    }

    const systemPrompt = `You are an expert JEE + CBSE teacher creating concise revision notes for a Class 11/12 student.

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

    if (notes && typeof notes === "object" && notes.error) {
      return res.status(429).json({ error: notes.message, retryAfterSec: notes.retryAfterSec });
    }

    cache.set(cacheKey, notes);
    res.json({ notes, subject, chapter, cached: false });
  } catch (error) {
    console.error("Syllabus notes error:", error.message);
    res.status(500).json({ error: "AI service temporarily unavailable. Please try again shortly." });
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

    let chapterData = null;
    for (const cls of [SYLLABUS_11, SYLLABUS_12]) {
      const subjectData = cls[subject];
      const found = subjectData?.find(
        (ch) => ch.name.toLowerCase().includes(chapter.toLowerCase()) || chapter.toLowerCase().includes(ch.name.toLowerCase())
      );
      if (found) { chapterData = found; break; }
    }

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

    if (formulas && typeof formulas === "object" && formulas.error) {
      return res.status(429).json({ error: formulas.message, retryAfterSec: formulas.retryAfterSec });
    }

    cache.set(cacheKey, formulas);
    res.json({ formulas, subject, chapter, cached: false });
  } catch (error) {
    console.error("Syllabus formulas error:", error.message);
    res.status(500).json({ error: "AI service temporarily unavailable." });
  }
});

module.exports = router;
