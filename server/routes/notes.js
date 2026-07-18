const express = require('express');
const syllabus = require('../data/syllabus');
const router = express.Router();

// GET /api/notes/syllabus — full syllabus tree
router.get('/syllabus', (req, res) => {
  const { class: cls, subject } = req.query;
  let result = { ...syllabus };

  if (subject && result[subject]) {
    result = { [subject]: result[subject] };
  }

  if (cls) {
    const classNum = parseInt(cls);
    for (const subj of Object.keys(result)) {
      result[subj] = {
        ...result[subj],
        chapters: result[subj].chapters.filter((ch) => ch.class === classNum),
      };
    }
  }

  res.json(result);
});

// GET /api/notes/chapter/:id — get chapter details with formulas
router.get('/chapter/:id', (req, res) => {
  const { id } = req.params;

  for (const subj of Object.values(syllabus)) {
    const chapter = subj.chapters.find((ch) => ch.id === id);
    if (chapter) {
      return res.json({
        ...chapter,
        subject: subj.name,
        formulas: getFormulas(id),
        keyPoints: getKeyPoints(id),
        mnemonics: getMnemonics(id),
      });
    }
  }

  res.status(404).json({ error: 'Chapter not found' });
});

function getFormulas(chapterId) {
  const formulaBank = {
    p2: [
      { name: 'First equation of motion', formula: 'v = u + at', description: 'Final velocity = Initial velocity + acceleration × time' },
      { name: 'Second equation of motion', formula: 's = ut + ½at²', description: 'Displacement = initial velocity × time + ½ × acceleration × time²' },
      { name: 'Third equation of motion', formula: 'v² = u² + 2as', description: 'Relates velocity with displacement (no time needed)' },
      { name: 'Average velocity', formula: 'v_avg = (u + v)/2', description: 'Only for uniform acceleration' },
      { name: 'Distance in nth second', formula: 'Sₙ = u + a(2n-1)/2', description: 'Distance covered in the nth second of motion' },
    ],
    p4: [
      { name: "Newton's Second Law", formula: 'F = ma', description: 'Force = mass × acceleration' },
      { name: 'Weight', formula: 'W = mg', description: 'Weight force due to gravity' },
      { name: 'Friction force', formula: 'f = μN', description: 'Friction = coefficient of friction × Normal force' },
      { name: 'Centripetal force', formula: 'F = mv²/r', description: 'Force for circular motion' },
      { name: 'Apparent weight (lift going up)', formula: 'W_app = m(g + a)', description: 'When lift accelerates upward' },
      { name: 'Apparent weight (lift going down)', formula: 'W_app = m(g - a)', description: 'When lift accelerates downward' },
    ],
    p5: [
      { name: 'Work done', formula: 'W = F·d·cosθ', description: 'Work = Force × displacement × cos(angle)' },
      { name: 'Kinetic Energy', formula: 'KE = ½mv²', description: 'Energy due to motion' },
      { name: 'Potential Energy (gravity)', formula: 'PE = mgh', description: 'Energy due to height' },
      { name: 'Spring PE', formula: 'PE = ½kx²', description: 'Energy stored in spring' },
      { name: 'Work-Energy Theorem', formula: 'W_net = ΔKE', description: 'Net work = change in kinetic energy' },
      { name: 'Power', formula: 'P = W/t = F·v', description: 'Rate of doing work' },
    ],
    p15: [
      { name: "Coulomb's Law", formula: 'F = kq₁q₂/r²', description: 'k = 9 × 10⁹ N·m²/C²' },
      { name: 'Electric Field', formula: 'E = kq/r²', description: 'Field due to point charge' },
      { name: 'Electric Field (dipole axial)', formula: 'E = 2kp/r³', description: 'Along the axis of dipole' },
      { name: 'Electric Flux', formula: 'Φ = E·A·cosθ', description: 'Flux through a surface' },
      { name: "Gauss's Law", formula: 'Φ = q/ε₀', description: 'Total flux = enclosed charge / ε₀' },
    ],
    c1: [
      { name: 'Moles', formula: 'n = mass/molar mass', description: 'Number of moles from given mass' },
      { name: 'Avogadro', formula: 'N = n × Nₐ', description: 'Nₐ = 6.022 × 10²³' },
      { name: 'Molarity', formula: 'M = moles of solute / volume(L)', description: 'Concentration in mol/L' },
      { name: 'Ideal Gas', formula: 'PV = nRT', description: 'R = 0.0821 L·atm/mol·K' },
      { name: '% Composition', formula: '% = (mass of element/molar mass) × 100', description: 'Mass percentage' },
    ],
    m3: [
      { name: 'Pythagorean Identity', formula: 'sin²θ + cos²θ = 1', description: 'Fundamental identity' },
      { name: 'sin(A+B)', formula: 'sin(A+B) = sinA·cosB + cosA·sinB', description: 'Compound angle formula' },
      { name: 'cos(A+B)', formula: 'cos(A+B) = cosA·cosB - sinA·sinB', description: 'Compound angle formula' },
      { name: 'tan(A+B)', formula: 'tan(A+B) = (tanA + tanB)/(1 - tanA·tanB)', description: 'Very useful in JEE!' },
      { name: 'sin2A', formula: 'sin2A = 2sinA·cosA', description: 'Double angle' },
      { name: 'cos2A', formula: 'cos2A = cos²A - sin²A = 2cos²A - 1 = 1 - 2sin²A', description: '3 forms!' },
    ],
    m6: [
      { name: 'Quadratic Formula', formula: 'x = (-b ± √(b²-4ac)) / 2a', description: 'Roots of ax² + bx + c = 0' },
      { name: 'Discriminant', formula: 'D = b² - 4ac', description: 'D>0: real roots, D=0: equal, D<0: complex' },
      { name: 'Sum of roots', formula: 'α + β = -b/a', description: "Vieta's formula" },
      { name: 'Product of roots', formula: 'αβ = c/a', description: "Vieta's formula" },
    ],
    m9: [
      { name: 'AP nth term', formula: 'aₙ = a + (n-1)d', description: 'Arithmetic Progression' },
      { name: 'AP Sum', formula: 'Sₙ = n/2[2a + (n-1)d]', description: 'Sum of n terms of AP' },
      { name: 'GP nth term', formula: 'aₙ = ar^(n-1)', description: 'Geometric Progression' },
      { name: 'GP Sum (finite)', formula: 'Sₙ = a(r^n - 1)/(r - 1)', description: 'When r ≠ 1' },
      { name: 'GP Sum (infinite)', formula: 'S∞ = a/(1-r)', description: 'When |r| < 1' },
    ],
  };

  return formulaBank[chapterId] || [
    { name: 'Formulas coming soon', formula: '—', description: 'Check back for detailed formulas for this chapter' },
  ];
}

function getKeyPoints(chapterId) {
  const keyPointsBank = {
    p4: [
      'Always draw Free Body Diagram (FBD) before solving',
      'Friction acts opposite to relative motion or tendency of motion',
      'Normal force is NOT always equal to mg (depends on angle & other forces)',
      'In JEE, pseudo forces appear in non-inertial frames only',
      'For connected bodies, use constraint equations',
    ],
    p5: [
      'Work done by friction is always negative (or zero)',
      'Work done by normal force is zero (perpendicular to displacement)',
      'In elastic collision, both KE and momentum are conserved',
      'In inelastic collision, only momentum is conserved',
      'Power = F·v is very useful for variable force problems',
    ],
    c1: [
      'Always convert to moles first before any calculation',
      'STP: 1 mol gas = 22.4 L (at 0°C, 1 atm)',
      'Limiting reagent determines the amount of product formed',
      'Molality is temperature independent, molarity is not',
      'Equivalent weight = Molar mass / n-factor',
    ],
    m3: [
      'Remember: All Silver Tea Cups (signs in quadrants: All, Sin, Tan, Cos)',
      'Convert all angles to standard form before solving',
      'For JEE, memorize values of sin/cos for 0°, 30°, 45°, 60°, 90°',
      'Use auxiliary angle method for a·sinθ + b·cosθ type',
      'General solution: sinθ = sinα ⟹ θ = nπ + (-1)ⁿα',
    ],
  };

  return keyPointsBank[chapterId] || ['Key points will be added soon for this chapter'];
}

function getMnemonics(chapterId) {
  const mnemonicsBank = {
    p2: ['SUVAT equations: s, u, v, a, t — learn which variable is missing in each equation'],
    p4: ['FBD = Free Body Diagram. Draw it EVERY time. It saves you in JEE!'],
    c4: ['Hybridization trick: Count (bond pairs + lone pairs on central atom) → 2=sp, 3=sp², 4=sp³, 5=sp³d, 6=sp³d²'],
    m3: ['ASTC rule for signs: Add Sugar To Coffee (All +, Sin +, Tan +, Cos +) for Q1-Q4'],
    m9: ['AP: same difference, GP: same ratio. If confused, check: is the difference constant or the ratio?'],
  };

  return mnemonicsBank[chapterId] || [];
}

module.exports = router;
