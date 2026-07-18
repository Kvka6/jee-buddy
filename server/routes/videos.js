const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 86400 });

const CHANNELS = {
  physicswallah: {
    name: "Physics Wallah",
    channelUrl: "https://www.youtube.com/@PhysicsWallah",
    description: "Alakh Pandey's free lectures — excellent for building concepts from scratch. Great for both JEE and CBSE.",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  unacademy: {
    name: "Unacademy JEE",
    channelUrl: "https://www.youtube.com/@UnacademyJEE",
    description: "Top educators covering JEE Main & Advanced topics with problem-solving sessions.",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  khanacademy: {
    name: "Khan Academy",
    channelUrl: "https://www.youtube.com/@khanacademy",
    description: "World-class conceptual explanations with animations. Great for building strong fundamentals.",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  vedantu: {
    name: "Vedantu JEE",
    channelUrl: "https://www.youtube.com/@VedantuJEE",
    description: "Live and recorded classes by experienced JEE faculty with doubt-clearing sessions.",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  mohittyagi: {
    name: "Mohit Tyagi",
    channelUrl: "https://www.youtube.com/@MohitTyagi",
    description: "In-depth JEE Advanced level mathematics and physics lectures. Best for serious aspirants.",
    subjects: ["Physics", "Mathematics"],
  },
  ncert: {
    name: "NCERT Official",
    channelUrl: "https://www.youtube.com/@ncaborad",
    description: "Official NCERT content aligned with CBSE syllabus. Essential for board exam preparation.",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
};

const SUBJECT_SEARCH_QUERIES = {
  Physics: {
    "Units and Measurements": ["Units and Measurements class 11 Physics", "Dimensional Analysis JEE", "Significant Figures explained"],
    "Motion in a Straight Line": ["Kinematics class 11 one shot", "Motion in a Straight Line JEE", "Equations of motion derivation"],
    "Motion in a Plane": ["Projectile Motion JEE", "Motion in a Plane class 11", "Relative Motion problems"],
    "Laws of Motion": ["Newton's Laws of Motion JEE", "Laws of Motion class 11", "Free Body Diagram problems"],
    "Work Energy and Power": ["Work Energy Theorem JEE", "Work Energy Power class 11", "Conservation of Energy problems"],
    "System of Particles and Rotational Motion": ["Rotational Motion JEE Advanced", "Centre of Mass problems", "Moment of Inertia class 11"],
    Gravitation: ["Gravitation JEE", "Gravitational Potential Energy", "Kepler's Laws class 11"],
    "Mechanical Properties of Solids": ["Elasticity class 11", "Stress Strain JEE", "Young's Modulus explained"],
    "Mechanical Properties of Fluids": ["Fluid Mechanics JEE", "Bernoulli's Theorem", "Viscosity Surface Tension class 11"],
    "Thermal Properties of Matter": ["Heat Transfer class 11", "Thermal Expansion JEE", "Calorimetry problems"],
    Thermodynamics: ["Thermodynamics class 11 Physics", "Laws of Thermodynamics JEE", "Carnot Engine explained"],
    "Kinetic Theory": ["Kinetic Theory of Gases JEE", "KTG class 11", "RMS speed derivation"],
    Oscillations: ["SHM JEE", "Simple Harmonic Motion class 11", "Oscillations problems JEE Advanced"],
    Waves: ["Waves class 11", "Standing Waves JEE", "Doppler Effect explained"],
  },
  Chemistry: {
    "Some Basic Concepts of Chemistry": ["Mole Concept JEE", "Basic Concepts of Chemistry class 11", "Stoichiometry problems"],
    "Structure of Atom": ["Atomic Structure JEE", "Structure of Atom class 11", "Quantum Numbers explained"],
    "Classification of Elements": ["Periodic Table JEE", "Periodic Properties class 11", "Classification of Elements trends"],
    "Chemical Bonding": ["Chemical Bonding JEE", "VSEPR Theory class 11", "Molecular Orbital Theory"],
    "States of Matter": ["States of Matter class 11", "Ideal Gas Equation JEE", "Van der Waals equation"],
    Thermodynamics: ["Chemical Thermodynamics JEE", "Enthalpy Entropy class 11", "Hess Law problems"],
    Equilibrium: ["Chemical Equilibrium JEE", "Ionic Equilibrium class 11", "pH and Buffer solutions"],
    "Redox Reactions": ["Redox Reactions JEE", "Oxidation Reduction class 11", "Balancing Redox equations"],
    Hydrogen: ["Hydrogen chapter class 11", "Hydrogen preparation properties", "Water of crystallization"],
    "s-Block Elements": ["s-Block Elements JEE", "Alkali Metals class 11", "Alkaline Earth Metals properties"],
    "p-Block Elements": ["p-Block Elements class 11", "Boron Carbon family JEE", "Group 13 14 elements"],
    "Organic Chemistry Basic Principles": ["GOC JEE", "Organic Chemistry Basics class 11", "IUPAC Nomenclature"],
    Hydrocarbons: ["Hydrocarbons class 11", "Alkanes Alkenes Alkynes JEE", "Hydrocarbon reactions"],
    "Environmental Chemistry": ["Environmental Chemistry class 11", "Pollution types CBSE", "Green Chemistry basics"],
  },
  Mathematics: {
    Sets: ["Sets class 11 Maths", "Set Theory JEE", "Venn Diagrams problems"],
    "Relations and Functions": ["Relations and Functions class 11", "Domain Range JEE", "Types of Functions"],
    "Trigonometric Functions": ["Trigonometry class 11", "Trigonometric Functions JEE", "Trigonometric Identities problems"],
    "Principle of Mathematical Induction": ["Mathematical Induction class 11", "PMI JEE problems", "Induction proof techniques"],
    "Complex Numbers": ["Complex Numbers JEE", "Complex Numbers class 11", "Argand Plane problems"],
    "Linear Inequalities": ["Linear Inequalities class 11", "Inequalities JEE", "Graphical solution inequalities"],
    "Permutations and Combinations": ["PnC JEE", "Permutations Combinations class 11", "Counting problems JEE Advanced"],
    "Binomial Theorem": ["Binomial Theorem JEE", "Binomial Expansion class 11", "General term Binomial"],
    "Sequences and Series": ["Sequences Series JEE", "AP GP HP class 11", "Sum to n terms problems"],
    "Straight Lines": ["Straight Lines class 11", "Coordinate Geometry JEE", "Straight Lines all formulas"],
    "Conic Sections": ["Conic Sections JEE", "Parabola Ellipse Hyperbola class 11", "Conic Sections problems"],
    "Introduction to 3D Geometry": ["3D Geometry class 11", "3D Coordinate Geometry basics", "Distance formula 3D"],
    "Limits and Derivatives": ["Limits and Derivatives class 11", "Limits JEE", "First Principle of Derivatives"],
    "Mathematical Reasoning": ["Mathematical Reasoning class 11", "Logical Statements CBSE", "Mathematical Reasoning problems"],
    Statistics: ["Statistics class 11", "Mean Variance Standard Deviation", "Statistics formulas JEE"],
    Probability: ["Probability class 11", "Probability JEE", "Probability problems CBSE"],
  },
};

function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, 200);
}

router.get("/", (req, res) => {
  try {
    const subject = sanitize(req.query.subject);
    const chapter = sanitize(req.query.chapter);

    const cacheKey = `videos:${subject}:${chapter}`.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const relevantChannels = subject
      ? Object.values(CHANNELS).filter((ch) =>
          ch.subjects.some((s) => s.toLowerCase() === subject.toLowerCase())
        )
      : Object.values(CHANNELS);

    let searchQueries = [];
    if (subject && chapter) {
      const subjectData = SUBJECT_SEARCH_QUERIES[subject];
      if (subjectData) {
        const chapterKey = Object.keys(subjectData).find(
          (k) =>
            k.toLowerCase().includes(chapter.toLowerCase()) ||
            chapter.toLowerCase().includes(k.toLowerCase())
        );
        if (chapterKey) {
          searchQueries = subjectData[chapterKey];
        }
      }
    }

    if (searchQueries.length === 0 && subject && chapter) {
      searchQueries = [
        `${chapter} ${subject} class 11`,
        `${chapter} JEE`,
        `${chapter} CBSE class 11`,
      ];
    }

    const result = {
      channels: relevantChannels,
      searchQueries,
      tip: "Search these queries on YouTube for the best video lectures!",
    };

    cache.set(cacheKey, result);
    res.json({ ...result, cached: false });
  } catch (error) {
    console.error("Videos route error:", error.message);
    res.status(500).json({ error: "Failed to fetch video recommendations." });
  }
});

module.exports = router;
