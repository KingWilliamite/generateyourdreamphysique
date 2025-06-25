import React, { useState } from 'react';
import { AlertTriangle, BookOpen, Target, Clock, TrendingUp, Zap, Search, ChevronDown, ChevronUp, Plus, Minus, Coffee, Moon, Dumbbell, X, Lock, CheckCircle, Brain, Heart, Flame, Shield, Battery, Send } from 'lucide-react';

interface Supplement {
  name: string;
  category: string;
  description: string;
  benefits: string[];
  dosage: string;
  timing: string;
  warnings: string[];
  stacksWith: string[];
  color: string;
  bestTiming: 'morning' | 'pre-workout' | 'evening' | 'anytime';
}

interface StackItem {
  supplement: Supplement;
  dosage: string;
}

interface Stack {
  morning: StackItem[];
  preWorkout: StackItem[];
  evening: StackItem[];
}

interface ScenarioRecommendation {
  title: string;
  description: string;
  supplements: string[];
  reasoning: string;
  icon: React.ComponentType<any>;
  color: string;
}

const supplements: Supplement[] = [
  {
    name: "ALPHA GPC",
    category: "Cognitive Enhancement",
    description: "A highly bioavailable form of choline that crosses the blood-brain barrier effectively, supporting acetylcholine production for enhanced cognitive function.",
    benefits: ["Enhanced focus and mental clarity", "Improved memory formation", "Increased power output in training", "Neuroprotective effects"],
    dosage: "300-600mg daily",
    timing: "Morning or pre-workout",
    warnings: ["May cause headaches in sensitive individuals", "Start with lower dose"],
    stacksWith: ["Caffeine", "L-Theanine", "Cordyceps"],
    color: "#007AFF",
    bestTiming: "morning"
  },
  {
    name: "Beetroot Extract",
    category: "Performance",
    description: "Rich in nitrates that convert to nitric oxide, improving blood flow and oxygen delivery to muscles.",
    benefits: ["Enhanced endurance performance", "Improved blood flow", "Lower blood pressure", "Increased exercise capacity"],
    dosage: "500mg daily",
    timing: "2-3 hours before exercise",
    warnings: ["May cause beeturia (pink/red urine)", "Can lower blood pressure significantly"],
    stacksWith: ["L-Citrulline", "L-Arginine", "Cordyceps"],
    color: "#FF3B30",
    bestTiming: "pre-workout"
  },
  {
    name: "Beet Root Powder",
    category: "Performance",
    description: "Whole food source of nitrates, betalains, and antioxidants for cardiovascular and performance benefits.",
    benefits: ["Natural nitric oxide boost", "Antioxidant support", "Liver detoxification", "Improved stamina"],
    dosage: "5-10g daily",
    timing: "Morning or pre-workout",
    warnings: ["May cause digestive upset in large doses", "Can stain teeth temporarily"],
    stacksWith: ["Beetroot Extract", "Electrolytes", "Vitamin C"],
    color: "#FF3B30",
    bestTiming: "pre-workout"
  },
  {
    name: "Butea Superba",
    category: "Hormonal Support",
    description: "Traditional Thai herb known for supporting male hormonal health and vitality.",
    benefits: ["Supports testosterone levels", "Enhanced libido", "Improved energy", "Mood support"],
    dosage: "500mg daily",
    timing: "Morning with food",
    warnings: ["Not for women", "May interact with blood thinners", "Consult healthcare provider"],
    stacksWith: ["MACA ROOT", "TONGKAT ALI", "Zinc"],
    color: "#FF9500",
    bestTiming: "morning"
  },
  {
    name: "Black Ginger",
    category: "Performance",
    description: "Kaempferia parviflora extract that supports circulation, energy metabolism, and physical performance.",
    benefits: ["Enhanced blood flow", "Improved exercise performance", "Metabolic support", "Anti-inflammatory effects"],
    dosage: "100mg daily",
    timing: "With meals",
    warnings: ["May interact with blood thinners", "Start with lower dose"],
    stacksWith: ["Beetroot Extract", "L-Citrulline", "CoQ10"],
    color: "#8E8E93",
    bestTiming: "anytime"
  },
  {
    name: "CAFFEINE",
    category: "Stimulant",
    description: "The world's most studied nootropic and performance enhancer, blocking adenosine receptors to increase alertness.",
    benefits: ["Increased alertness and focus", "Enhanced physical performance", "Improved fat oxidation", "Mood elevation"],
    dosage: "100-200mg daily",
    timing: "Morning or pre-workout (avoid 6+ hours before bed)",
    warnings: ["Can cause jitters, anxiety, insomnia", "Highly addictive", "Tolerance builds quickly"],
    stacksWith: ["L-Theanine", "ALPHA GPC", "Taurine"],
    color: "#8B4513",
    bestTiming: "morning"
  },
  {
    name: "Choline",
    category: "Cognitive Enhancement",
    description: "Essential nutrient for brain health, neurotransmitter production, and cellular membrane integrity.",
    benefits: ["Supports memory and cognition", "Liver health", "Cellular membrane function", "Neurotransmitter production"],
    dosage: "500mg daily",
    timing: "With meals",
    warnings: ["High doses may cause fishy body odor", "Can cause nausea on empty stomach"],
    stacksWith: ["ALPHA GPC", "Methylated B-Vitamins", "Omega-3s"],
    color: "#007AFF",
    bestTiming: "anytime"
  },
  {
    name: "CoQ10",
    category: "Mitochondrial Support",
    description: "Coenzyme Q10 - Essential for cellular energy production and powerful antioxidant that supports mitochondrial health.",
    benefits: ["Enhanced cellular energy", "Cardiovascular support", "Antioxidant protection", "Anti-aging effects"],
    dosage: "100-200mg daily",
    timing: "With fats for better absorption",
    warnings: ["May interact with blood thinners", "Expensive supplement"],
    stacksWith: ["PQQ", "Vitamin E", "Fish Oil", "Magnesium"],
    color: "#FF9500",
    bestTiming: "anytime"
  },
  {
    name: "PQQ",
    category: "Mitochondrial Support",
    description: "Pyrroloquinoline quinone - Supports mitochondrial biogenesis and protects against oxidative stress.",
    benefits: ["Mitochondrial biogenesis", "Neuroprotective effects", "Enhanced cognitive function", "Energy metabolism support"],
    dosage: "10-20mg daily",
    timing: "With meals for better absorption",
    warnings: ["Limited long-term studies", "Expensive supplement"],
    stacksWith: ["CoQ10", "Alpha-lipoic acid", "Magnesium"],
    color: "#5856D6",
    bestTiming: "anytime"
  },
  {
    name: "Cordyceps",
    category: "Adaptogen",
    description: "Medicinal mushroom that supports energy, endurance, and respiratory function.",
    benefits: ["Enhanced oxygen utilization", "Improved endurance", "Immune support", "Stress adaptation"],
    dosage: "1g daily",
    timing: "Morning or pre-workout",
    warnings: ["May interact with immunosuppressants", "Quality varies significantly between brands"],
    stacksWith: ["ALPHA GPC", "Beetroot Extract", "Rhodiola"],
    color: "#8B4513",
    bestTiming: "morning"
  },
  {
    name: "Cyanidin 3 Glucoside",
    category: "Antioxidant",
    description: "Powerful anthocyanin antioxidant found in dark berries, supporting cardiovascular and metabolic health.",
    benefits: ["Potent antioxidant effects", "Improved insulin sensitivity", "Cardiovascular protection", "Anti-inflammatory"],
    dosage: "50mg daily",
    timing: "With meals",
    warnings: ["May interact with diabetes medications", "Limited human studies"],
    stacksWith: ["Vitamin C", "Quercetin", "Resveratrol"],
    color: "#5856D6",
    bestTiming: "anytime"
  },
  {
    name: "Electrolytes",
    category: "Hydration",
    description: "Essential minerals (sodium, potassium, magnesium) for proper hydration, muscle function, and nerve signaling.",
    benefits: ["Optimal hydration", "Muscle function", "Prevents cramping", "Maintains blood pressure"],
    dosage: "1 serving per workout or hot day",
    timing: "During/after exercise, hot weather",
    warnings: ["Excess sodium can raise blood pressure", "Balance is key"],
    stacksWith: ["Water", "Magnesium", "Vitamin D"],
    color: "#00C7BE",
    bestTiming: "pre-workout"
  },
  {
    name: "Goat Weed",
    category: "Hormonal Support",
    description: "Traditional herb (Epimedium) known for supporting circulation and male vitality.",
    benefits: ["Supports circulation", "May enhance libido", "Bone health support", "Energy boost"],
    dosage: "500mg daily",
    timing: "With meals",
    warnings: ["May interact with heart medications", "Not for those with heart conditions"],
    stacksWith: ["MACA ROOT", "Zinc", "L-Arginine"],
    color: "#34C759",
    bestTiming: "anytime"
  },
  {
    name: "Methylated B-Vitamins",
    category: "Essential Vitamins",
    description: "Pre-activated forms of B vitamins that bypass genetic methylation issues for optimal absorption.",
    benefits: ["Enhanced energy metabolism", "Nervous system support", "DNA synthesis", "Mood regulation"],
    dosage: "1 B-complex capsule daily",
    timing: "Morning with food",
    warnings: ["High doses may cause nausea", "Can turn urine bright yellow"],
    stacksWith: ["Magnesium", "Vitamin D", "Choline"],
    color: "#FF9500",
    bestTiming: "morning"
  },
  {
    name: "MACA ROOT",
    category: "Adaptogen",
    description: "Peruvian root vegetable that supports hormonal balance, energy, and stress adaptation.",
    benefits: ["Hormonal balance", "Enhanced energy", "Improved mood", "Stress adaptation"],
    dosage: "1.5g daily",
    timing: "Morning with food",
    warnings: ["May affect hormone-sensitive conditions", "Start with lower doses"],
    stacksWith: ["Ashwagandha", "TONGKAT ALI", "Zinc"],
    color: "#8B4513",
    bestTiming: "morning"
  },
  {
    name: "Shilajit",
    category: "Adaptogen",
    description: "Mineral-rich substance from the Himalayas containing fulvic acid and trace minerals for energy and vitality.",
    benefits: ["Enhanced energy and stamina", "Mineral replenishment", "Cognitive support", "Anti-aging properties"],
    dosage: "300mg daily",
    timing: "Morning on empty stomach",
    warnings: ["Quality varies dramatically", "May contain heavy metals if not purified"],
    stacksWith: ["CoQ10", "Magnesium", "Trace minerals"],
    color: "#8B4513",
    bestTiming: "morning"
  },
  {
    name: "Sodium Bicarbonate",
    category: "Performance",
    description: "Alkalizing agent that buffers lactic acid during high-intensity exercise.",
    benefits: ["Improved high-intensity performance", "Reduced muscle fatigue", "Enhanced power output", "Alkalizing effects"],
    dosage: "0.3g per kg body weight",
    timing: "2-3 hours before intense exercise only",
    warnings: ["Can cause severe GI distress", "Practice timing and dosage", "Not for daily use"],
    stacksWith: ["Electrolytes", "Beta-alanine", "Creatine"],
    color: "#00C7BE",
    bestTiming: "pre-workout"
  },
  {
    name: "TAURINE",
    category: "Performance",
    description: "Amino acid that supports cardiovascular function, muscle contraction, and cellular hydration.",
    benefits: ["Improved exercise performance", "Cardiovascular support", "Enhanced hydration", "Antioxidant effects"],
    dosage: "1g daily",
    timing: "Pre-workout or with meals",
    warnings: ["Generally very safe", "May interact with lithium"],
    stacksWith: ["Caffeine", "Magnesium", "Electrolytes"],
    color: "#007AFF",
    bestTiming: "pre-workout"
  },
  {
    name: "Theacrine",
    category: "Stimulant",
    description: "Caffeine-like compound that provides sustained energy without tolerance buildup or crash.",
    benefits: ["Sustained energy", "No tolerance buildup", "Enhanced mood", "Improved focus"],
    dosage: "100mg daily",
    timing: "Morning or pre-workout",
    warnings: ["Limited long-term studies", "May interact with stimulants"],
    stacksWith: ["Caffeine", "L-Theanine", "ALPHA GPC"],
    color: "#5856D6",
    bestTiming: "morning"
  },
  {
    name: "TONGKAT ALI",
    category: "Hormonal Support",
    description: "Southeast Asian herb known for supporting natural testosterone production and stress management.",
    benefits: ["Supports testosterone levels", "Stress reduction", "Enhanced libido", "Improved body composition"],
    dosage: "200mg daily",
    timing: "Morning with food",
    warnings: ["May interact with diabetes medications", "Quality varies between sources"],
    stacksWith: ["MACA ROOT", "Zinc", "Vitamin D"],
    color: "#FF9500",
    bestTiming: "morning"
  },
  {
    name: "ZINC",
    category: "Essential Mineral",
    description: "Essential mineral crucial for immune function, hormone production, and protein synthesis.",
    benefits: ["Immune system support", "Hormone production", "Wound healing", "Protein synthesis"],
    dosage: "15mg daily",
    timing: "On empty stomach or with food if GI upset",
    warnings: ["Can cause nausea on empty stomach", "Interferes with copper absorption"],
    stacksWith: ["Magnesium", "Vitamin D", "Copper (separate timing)"],
    color: "#8E8E93",
    bestTiming: "evening"
  },
  {
    name: "VITAMIN D3 (with K2)",
    category: "Essential Vitamins",
    description: "Vitamin D3 with K2 for optimal calcium metabolism and immune function.",
    benefits: ["Immune system support", "Bone health", "Mood regulation", "Hormone optimization"],
    dosage: "2,000–5,000 IU D3 + 100–200mcg K2 daily",
    timing: "With fats for absorption",
    warnings: ["Monitor blood levels", "Can cause hypercalcemia", "Requires K2 for safety"],
    stacksWith: ["Magnesium", "Omega-3s", "Zinc"],
    color: "#FF9500",
    bestTiming: "anytime"
  },
  {
    name: "Vitamin K2",
    category: "Essential Vitamins",
    description: "Fat-soluble vitamin essential for proper calcium metabolism and cardiovascular health.",
    benefits: ["Proper calcium utilization", "Cardiovascular protection", "Bone health", "Dental health"],
    dosage: "100mcg daily",
    timing: "With fats and Vitamin D",
    warnings: ["May interact with blood thinners", "Essential when taking high-dose D3"],
    stacksWith: ["Vitamin D3", "Magnesium", "Calcium"],
    color: "#34C759",
    bestTiming: "anytime"
  },
  {
    name: "Vitamin D",
    category: "Essential Vitamins",
    description: "Essential vitamin for bone health, immune function, and overall wellness.",
    benefits: ["Bone health", "Immune system support", "Mood regulation", "Calcium absorption"],
    dosage: "Adults (19–70): 600 IU daily, Adults (>70): 800 IU daily",
    timing: "With fats for better absorption",
    warnings: ["Monitor blood levels with higher doses", "Can cause toxicity in excess"],
    stacksWith: ["Vitamin K2", "Magnesium", "Calcium"],
    color: "#FF9500",
    bestTiming: "anytime"
  },
  {
    name: "Vitamin B1",
    category: "Essential Vitamins",
    description: "Thiamine, essential for energy metabolism and nervous system function.",
    benefits: ["Energy metabolism", "Nervous system health", "Cognitive function", "Heart health"],
    dosage: "100mg daily",
    timing: "Morning with food",
    warnings: ["Generally very safe", "High doses may cause imbalance"],
    stacksWith: ["B-Complex", "Magnesium", "Other B vitamins"],
    color: "#FF9500",
    bestTiming: "morning"
  },
  {
    name: "L-THEANINE",
    category: "Nootropic",
    description: "Amino acid from tea that promotes relaxation without sedation, perfect caffeine companion.",
    benefits: ["Calm focus", "Reduces caffeine jitters", "Stress reduction", "Improved sleep quality"],
    dosage: "200mg daily",
    timing: "With caffeine or evening",
    warnings: ["May lower blood pressure", "Very safe overall"],
    stacksWith: ["Caffeine", "Magnesium", "GABA"],
    color: "#34C759",
    bestTiming: "evening"
  },
  {
    name: "L-Arginine",
    category: "Performance",
    description: "Semi-essential amino acid that supports nitric oxide production and blood flow.",
    benefits: ["Enhanced blood flow", "Improved exercise performance", "Wound healing", "Immune support"],
    dosage: "3g daily",
    timing: "On empty stomach or pre-workout",
    warnings: ["May interact with blood pressure medications", "Can cause GI upset"],
    stacksWith: ["L-Citrulline", "Beetroot Extract", "Vitamin C"],
    color: "#007AFF",
    bestTiming: "pre-workout"
  },
  {
    name: "L-Citrulline",
    category: "Performance",
    description: "Amino acid that converts to arginine, providing superior and sustained nitric oxide support.",
    benefits: ["Superior to L-Arginine", "Enhanced muscle pumps", "Reduced muscle soreness", "Improved endurance"],
    dosage: "6g daily",
    timing: "Pre-workout on empty stomach",
    warnings: ["Generally very safe", "May lower blood pressure"],
    stacksWith: ["L-Arginine", "Beetroot Extract", "Caffeine"],
    color: "#007AFF",
    bestTiming: "pre-workout"
  },
  {
    name: "L-Carnitine",
    category: "Fat Metabolism",
    description: "Amino acid derivative that transports fatty acids into mitochondria for energy production.",
    benefits: ["Enhanced fat oxidation", "Improved exercise recovery", "Cognitive support", "Heart health"],
    dosage: "2g daily",
    timing: "Pre-workout or with meals",
    warnings: ["May cause fishy body odor in some", "Can interact with thyroid medications"],
    stacksWith: ["CoQ10", "Alpha-lipoic acid", "Omega-3s"],
    color: "#FF9500",
    bestTiming: "pre-workout"
  }
];

const SupplementsCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guide' | 'database' | 'stack' | 'scenarios'>('guide');
  const [hasReadGuidelines, setHasReadGuidelines] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedSupplement, setExpandedSupplement] = useState<string | null>(null);
  const [stack, setStack] = useState<Stack>({
    morning: [],
    preWorkout: [],
    evening: []
  });
  const [scenarioInput, setScenarioInput] = useState('');
  const [scenarioRecommendation, setScenarioRecommendation] = useState<ScenarioRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const commandments = [
    "Taking anything for too long increases the risk of imbalances or unexpected side effects",
    "Combining multiple supplements can create unexpected outcomes",
    "Everybody responds differently, sometimes oppositely. Just because it works for your friend doesn't mean it works for you",
    "Trust your intuition above all else, if you get bad vibes from a supplement, discontinue",
    "ALWAYS cycle. Take a few days off every week. Take a week off every month",
    "Implement supplements one at a time, gather data, then slowly add more",
    "Always start with the minimum effective dose"
  ];

  const trackerSteps = [
    {
      title: "Gather a Strong Baseline",
      description: "How do you feel normally? What is your mood & energy like? Take a snapshot. Record videos of yourself to get more cues than just writing things down",
      icon: Target
    },
    {
      title: "Document Everything",
      description: "Keep a page open in your notes app. Lay out every supplement, dose, and time for each of them",
      icon: BookOpen
    },
    {
      title: "Track Changes",
      description: "Any time you feel above or below baseline, jot it down: +1 energy, +3 mood, -2 focus, +5 anxiety",
      icon: TrendingUp
    },
    {
      title: "Review Weekly",
      description: "Avoid making assumptions until you gather at least a week's worth of data. Review every Sunday",
      icon: Clock
    }
  ];

  const categories = ['All', ...Array.from(new Set(supplements.map(s => s.category)))];

  const filteredSupplements = supplements.filter(supplement => {
    const matchesSearch = supplement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || supplement.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (supplementName: string) => {
    setExpandedSupplement(expandedSupplement === supplementName ? null : supplementName);
  };

  const addToStack = (supplement: Supplement, timing: 'morning' | 'preWorkout' | 'evening') => {
    setStack(prev => ({
      ...prev,
      [timing]: [...(prev[timing] || []), { supplement, dosage: supplement.dosage }]
    }));
  };

  const removeFromStack = (supplementName: string, timing: 'morning' | 'preWorkout' | 'evening') => {
    setStack(prev => ({
      ...prev,
      [timing]: (prev[timing] || []).filter(item => item.supplement.name !== supplementName)
    }));
  };

  const clearStack = () => {
    setStack({
      morning: [],
      preWorkout: [],
      evening: []
    });
  };

  const totalStackItems = stack.morning.length + stack.preWorkout.length + stack.evening.length;

  const handleUnlockAccess = () => {
    setHasReadGuidelines(true);
  };

  const analyzeScenario = (scenario: string): ScenarioRecommendation => {
    const lowerScenario = scenario.toLowerCase();
    
    // Cognitive Enhancement Scenarios
    if (lowerScenario.includes('focus') || lowerScenario.includes('concentration') || 
        lowerScenario.includes('memory') || lowerScenario.includes('brain') ||
        lowerScenario.includes('study') || lowerScenario.includes('mental clarity')) {
      return {
        title: "Cognitive Enhancement Stack",
        description: "Optimized for focus, memory, and mental clarity",
        supplements: ["ALPHA GPC", "CAFFEINE", "L-THEANINE", "Choline"],
        reasoning: "Alpha GPC provides choline for acetylcholine production (memory & focus). Caffeine + L-Theanine creates calm alertness without jitters. Additional choline supports overall brain health.",
        icon: Brain,
        color: "#007AFF"
      };
    }

    // Performance & Energy Scenarios
    if (lowerScenario.includes('workout') || lowerScenario.includes('exercise') || 
        lowerScenario.includes('performance') || lowerScenario.includes('energy') ||
        lowerScenario.includes('endurance') || lowerScenario.includes('strength')) {
      return {
        title: "Performance & Energy Stack",
        description: "Designed for enhanced workout performance and sustained energy",
        supplements: ["L-Citrulline", "Beetroot Extract", "CAFFEINE", "TAURINE", "Electrolytes"],
        reasoning: "L-Citrulline and Beetroot Extract boost nitric oxide for better blood flow and pumps. Caffeine provides energy and focus. Taurine supports muscle function. Electrolytes prevent cramping.",
        icon: Flame,
        color: "#FF3B30"
      };
    }

    // Hormonal Support Scenarios
    if (lowerScenario.includes('testosterone') || lowerScenario.includes('hormone') || 
        lowerScenario.includes('libido') || lowerScenario.includes('vitality') ||
        lowerScenario.includes('male health') || lowerScenario.includes('energy levels')) {
      return {
        title: "Hormonal Optimization Stack",
        description: "Supports natural hormone production and male vitality",
        supplements: ["TONGKAT ALI", "MACA ROOT", "ZINC", "VITAMIN D3 (with K2)"],
        reasoning: "Tongkat Ali and Maca Root are adaptogens that support natural testosterone production. Zinc is crucial for hormone synthesis. Vitamin D3 with K2 optimizes hormone levels and bone health.",
        icon: Battery,
        color: "#FF9500"
      };
    }

    // Stress & Recovery Scenarios
    if (lowerScenario.includes('stress') || lowerScenario.includes('anxiety') || 
        lowerScenario.includes('sleep') || lowerScenario.includes('recovery') ||
        lowerScenario.includes('calm') || lowerScenario.includes('relaxation')) {
      return {
        title: "Stress & Recovery Stack",
        description: "Promotes relaxation, stress management, and recovery",
        supplements: ["L-THEANINE", "MACA ROOT", "Methylated B-Vitamins", "ZINC"],
        reasoning: "L-Theanine promotes calm focus and better sleep. Maca Root is an adaptogen for stress management. B-Vitamins support nervous system health. Zinc aids in recovery and immune function.",
        icon: Shield,
        color: "#34C759"
      };
    }

    // Cardiovascular & Longevity Scenarios
    if (lowerScenario.includes('heart') || lowerScenario.includes('cardiovascular') || 
        lowerScenario.includes('longevity') || lowerScenario.includes('anti-aging') ||
        lowerScenario.includes('circulation') || lowerScenario.includes('blood pressure')) {
      return {
        title: "Cardiovascular & Longevity Stack",
        description: "Supports heart health, circulation, and cellular longevity",
        supplements: ["CoQ10", "PQQ", "Beetroot Extract", "VITAMIN D3 (with K2)"],
        reasoning: "CoQ10 and PQQ support mitochondrial health and cellular energy. Beetroot Extract improves circulation and blood pressure. Vitamin D3 with K2 supports cardiovascular health and prevents arterial calcification.",
        icon: Heart,
        color: "#FF9500"
      };
    }

    // Fat Loss Scenarios
    if (lowerScenario.includes('fat loss') || lowerScenario.includes('weight loss') || 
        lowerScenario.includes('metabolism') || lowerScenario.includes('cutting') ||
        lowerScenario.includes('lean') || lowerScenario.includes('burn fat')) {
      return {
        title: "Fat Loss & Metabolism Stack",
        description: "Supports fat oxidation and metabolic enhancement",
        supplements: ["L-Carnitine", "CAFFEINE", "L-THEANINE", "Methylated B-Vitamins"],
        reasoning: "L-Carnitine transports fatty acids for energy production. Caffeine boosts metabolism and fat oxidation. L-Theanine prevents caffeine jitters. B-Vitamins support energy metabolism.",
        icon: Flame,
        color: "#FF9500"
      };
    }

    // Default/General Health Scenario
    return {
      title: "General Health & Wellness Stack",
      description: "Foundational supplements for overall health optimization",
      supplements: ["VITAMIN D3 (with K2)", "Methylated B-Vitamins", "ZINC", "CoQ10"],
      reasoning: "Vitamin D3 with K2 for immune and bone health. B-Vitamins for energy metabolism. Zinc for immune function and hormone production. CoQ10 for cellular energy and antioxidant protection.",
      icon: Shield,
      color: "#34C759"
    };
  };

  const handleScenarioSubmit = () => {
    if (!scenarioInput.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis time
    setTimeout(() => {
      const recommendation = analyzeScenario(scenarioInput);
      setScenarioRecommendation(recommendation);
      setIsAnalyzing(false);
    }, 1500);
  };

  const addRecommendationToStack = () => {
    if (!scenarioRecommendation) return;
    
    scenarioRecommendation.supplements.forEach(supplementName => {
      const supplement = supplements.find(s => s.name === supplementName);
      if (supplement) {
        addToStack(supplement, supplement.bestTiming);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2" style={{ color: '#1C1C1E' }}>
          Supplements 101
        </h2>
        <p className="text-gray-600 text-lg">
          The metabolic upregulation commandments for safe, effective supplementation
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
              activeTab === 'guide'
                ? 'text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            style={{ backgroundColor: activeTab === 'guide' ? '#007AFF' : 'transparent' }}
          >
            Guidelines
          </button>
          <button
            onClick={() => hasReadGuidelines ? setActiveTab('scenarios') : null}
            disabled={!hasReadGuidelines}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
              activeTab === 'scenarios'
                ? 'text-white shadow-md'
                : hasReadGuidelines 
                ? 'text-gray-600 hover:text-gray-800'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            style={{ backgroundColor: activeTab === 'scenarios' ? '#007AFF' : 'transparent' }}
          >
            {!hasReadGuidelines && <Lock className="w-3 h-3 inline mr-1" />}
            Scenarios
          </button>
          <button
            onClick={() => hasReadGuidelines ? setActiveTab('database') : null}
            disabled={!hasReadGuidelines}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm ${
              activeTab === 'database'
                ? 'text-white shadow-md'
                : hasReadGuidelines 
                ? 'text-gray-600 hover:text-gray-800'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            style={{ backgroundColor: activeTab === 'database' ? '#007AFF' : 'transparent' }}
          >
            {!hasReadGuidelines && <Lock className="w-3 h-3 inline mr-1" />}
            Database
          </button>
          <button
            onClick={() => hasReadGuidelines ? setActiveTab('stack') : null}
            disabled={!hasReadGuidelines}
            className={`px-3 py-2 rounded-lg font-semibold transition-all duration-200 text-sm relative ${
              activeTab === 'stack'
                ? 'text-white shadow-md'
                : hasReadGuidelines
                ? 'text-gray-600 hover:text-gray-800'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            style={{ backgroundColor: activeTab === 'stack' ? '#007AFF' : 'transparent' }}
          >
            {!hasReadGuidelines && <Lock className="w-3 h-3 inline mr-1" />}
            My Stack
            {totalStackItems > 0 && hasReadGuidelines && (
              <span 
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                style={{ backgroundColor: '#FF3B30' }}
              >
                {totalStackItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'guide' && (
        <>
          {/* Warning Banner */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-l-4 border-orange-400">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-orange-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  Pro-Supplements, Anti-Spam Approach
                </h3>
                <p className="text-orange-700 text-sm leading-relaxed">
                  I am pro-supplements. But I am extremely anti "spam supplements without knowing what I'm taking or what they're doing to me". 
                  If you're going to play the supplement game, play it right. Employ the <strong>Scientific Method</strong> and take rigorous notes.
                </p>
              </div>
            </div>
          </div>

          {/* The 7 Commandments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1C1C1E' }}>
              <Zap className="w-6 h-6 mr-2" style={{ color: '#007AFF' }} />
              The 7 Metabolic Upregulation Commandments
            </h3>
            <div className="space-y-4">
              {commandments.map((commandment, index) => (
                <div key={index} className="flex items-start p-4 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                  <div 
                    className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm mr-4 flex-shrink-0"
                    style={{ backgroundColor: '#007AFF' }}
                  >
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{commandment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Biohacker Tracker Playbook */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-4 flex items-center" style={{ color: '#1C1C1E' }}>
              <BookOpen className="w-6 h-6 mr-2" style={{ color: '#34C759' }} />
              The Biohacker Tracker Playbook
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              This isn't just about writing things down. It's about learning how to be in tune with your biology. 
              Becoming an observer. It's a mindfulness & meditation practice with actual utility.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {trackerSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="p-4 rounded-lg border-2 border-gray-100 hover:border-gray-200 transition-all duration-200">
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#34C75915' }}>
                        <Icon className="w-5 h-5" style={{ color: '#34C759' }} />
                      </div>
                      <h4 className="font-semibold" style={{ color: '#1C1C1E' }}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reality Check */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#1C1C1E' }}>
              The Reality of Modern Biology
            </h3>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>Supplementing isn't natural.</strong> But nothing about our biology is truly natural anymore. 
                We've been compromised since before we were born. We carry the metabolic & toxic burdens of our mother, 
                our mother's mother, and our mother's mother's mother.
              </p>
              <p>
                We've been poisoned since we were in the womb. The first thing they do to us when we're born is jab us 
                with questionable substances. We've been popping antibiotics like TicTacs. Inhaling formaldehyde & asbestos 
                in every room we've ever been in. Non-native EMF is slowly radiating our DNA as we speak.
              </p>
              <p className="font-medium text-blue-700">
                In this context, strategic supplementation becomes a tool for metabolic restoration, not enhancement.
              </p>
            </div>
          </div>

          {/* Unlock Button */}
          {!hasReadGuidelines && (
            <div className="text-center">
              <button
                onClick={handleUnlockAccess}
                className="px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 shadow-lg"
                style={{ backgroundColor: '#34C759' }}
              >
                <CheckCircle className="w-5 h-5 inline mr-2" />
                I've Read & Understand the Guidelines
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Click to unlock the supplement database and stack builder
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === 'scenarios' && hasReadGuidelines && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#1C1C1E' }}>
              Scenario-Based Recommendations
            </h3>
            <p className="text-gray-600">
              Describe your goals and get personalized supplement stack recommendations
            </p>
          </div>

          {/* Scenario Input */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold mb-4" style={{ color: '#1C1C1E' }}>
              What are your goals?
            </h4>
            <div className="space-y-4">
              <textarea
                value={scenarioInput}
                onChange={(e) => setScenarioInput(e.target.value)}
                placeholder="Describe your goals, challenges, or what you want to optimize. For example: 'I want to improve my focus for studying', 'I need more energy for workouts', 'I want to reduce stress and sleep better', etc."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-all duration-200 resize-none"
                rows={4}
              />
              <button
                onClick={handleScenarioSubmit}
                disabled={!scenarioInput.trim() || isAnalyzing}
                className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ backgroundColor: '#007AFF' }}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Your Scenario...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Get Recommendations
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Example Scenarios */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-100">
            <h4 className="text-lg font-semibold mb-4" style={{ color: '#1C1C1E' }}>
              💡 Example Scenarios
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <button
                  onClick={() => setScenarioInput("I want to improve my focus and concentration for studying and work")}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <p className="font-medium text-sm">🧠 Cognitive Enhancement</p>
                  <p className="text-xs text-gray-600">Focus, memory, mental clarity</p>
                </button>
                <button
                  onClick={() => setScenarioInput("I need more energy and better performance for my workouts")}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
                >
                  <p className="font-medium text-sm">🔥 Workout Performance</p>
                  <p className="text-xs text-gray-600">Energy, endurance, strength</p>
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setScenarioInput("I want to reduce stress and improve my sleep quality")}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                >
                  <p className="font-medium text-sm">🛡️ Stress & Recovery</p>
                  <p className="text-xs text-gray-600">Relaxation, sleep, recovery</p>
                </button>
                <button
                  onClick={() => setScenarioInput("I want to support my testosterone levels and overall male vitality")}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                >
                  <p className="font-medium text-sm">⚡ Hormonal Support</p>
                  <p className="text-xs text-gray-600">Testosterone, vitality, energy</p>
                </button>
              </div>
            </div>
          </div>

          {/* Recommendation Results */}
          {scenarioRecommendation && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg mr-4" style={{ backgroundColor: `${scenarioRecommendation.color}15` }}>
                  <scenarioRecommendation.icon className="w-6 h-6" style={{ color: scenarioRecommendation.color }} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold" style={{ color: '#1C1C1E' }}>
                    {scenarioRecommendation.title}
                  </h4>
                  <p className="text-gray-600">{scenarioRecommendation.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold mb-3" style={{ color: '#1C1C1E' }}>
                    Recommended Supplements:
                  </h5>
                  <div className="grid md:grid-cols-2 gap-3">
                    {scenarioRecommendation.supplements.map((supplementName, index) => {
                      const supplement = supplements.find(s => s.name === supplementName);
                      return supplement ? (
                        <div key={index} className="flex items-center p-3 rounded-lg border border-gray-200">
                          <div 
                            className="w-3 h-3 rounded-full mr-3"
                            style={{ backgroundColor: supplement.color }}
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{supplement.name}</p>
                            <p className="text-xs text-gray-600">{supplement.dosage}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                  <h5 className="font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                    Why This Stack Works:
                  </h5>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {scenarioRecommendation.reasoning}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={addRecommendationToStack}
                    className="flex-1 px-4 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: scenarioRecommendation.color }}
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add to My Stack
                  </button>
                  <button
                    onClick={() => setActiveTab('stack')}
                    className="px-4 py-3 rounded-lg font-semibold border-2 transition-all duration-200 hover:bg-gray-50"
                    style={{ borderColor: scenarioRecommendation.color, color: scenarioRecommendation.color }}
                  >
                    View Stack
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'database' && hasReadGuidelines && (
        <>
          {/* Search and Filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search supplements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-all duration-200"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Supplements List */}
          <div className="space-y-3">
            {filteredSupplements.map((supplement) => (
              <div key={supplement.name} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200"
                  onClick={() => toggleExpanded(supplement.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: supplement.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold" style={{ color: '#1C1C1E' }}>
                              {supplement.name}
                            </h3>
                            <p className="text-sm text-gray-500">{supplement.category}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {/* Add to Stack Buttons */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToStack(supplement, 'morning');
                              }}
                              className="p-1 rounded-lg hover:bg-orange-100 transition-all duration-200"
                              title="Add to Morning Stack"
                            >
                              <Coffee className="w-4 h-4" style={{ color: '#FF9500' }} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToStack(supplement, 'preWorkout');
                              }}
                              className="p-1 rounded-lg hover:bg-blue-100 transition-all duration-200"
                              title="Add to Pre-Workout Stack"
                            >
                              <Dumbbell className="w-4 h-4" style={{ color: '#007AFF' }} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToStack(supplement, 'evening');
                              }}
                              className="p-1 rounded-lg hover:bg-purple-100 transition-all duration-200"
                              title="Add to Evening Stack"
                            >
                              <Moon className="w-4 h-4" style={{ color: '#5856D6' }} />
                            </button>
                            {expandedSupplement === supplement.name ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    {supplement.description}
                  </p>
                </div>

                {expandedSupplement === supplement.name && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {/* Benefits */}
                      <div>
                        <h4 className="font-semibold mb-2 text-green-700 text-sm">Benefits</h4>
                        <ul className="space-y-1">
                          {supplement.benefits.slice(0, 3).map((benefit, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 mt-1.5 flex-shrink-0" />
                              <span className="text-xs text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dosage & Timing */}
                      <div>
                        <h4 className="font-semibold mb-2 text-blue-700 text-sm">Dosage & Timing</h4>
                        <div className="space-y-2">
                          <div className="p-2 rounded-lg text-xs" style={{ backgroundColor: '#F2F2F7' }}>
                            <p className="font-medium text-gray-800">Dosage: {supplement.dosage}</p>
                            <p className="text-gray-600">Timing: {supplement.timing}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Warnings */}
                    {supplement.warnings.length > 0 && (
                      <div className="mt-3">
                        <h4 className="font-semibold mb-2 text-red-700 text-sm flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Key Warnings
                        </h4>
                        <div className="text-xs text-gray-700">
                          {supplement.warnings.slice(0, 2).map((warning, index) => (
                            <p key={index} className="mb-1">• {warning}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredSupplements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No supplements found matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'stack' && hasReadGuidelines && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold" style={{ color: '#1C1C1E' }}>
                My Supplement Stack
              </h3>
              <p className="text-gray-600 text-sm">
                Build your personalized supplement timing protocol
              </p>
            </div>
            {totalStackItems > 0 && (
              <button
                onClick={clearStack}
                className="px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: '#FF3B30' }}
              >
                Clear All
              </button>
            )}
          </div>

          {totalStackItems === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 rounded-full mx-auto mb-4" style={{ backgroundColor: '#F2F2F7', width: 'fit-content' }}>
                <Target className="w-8 h-8" style={{ color: '#8E8E93' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                No Supplements in Stack
              </h3>
              <p className="text-gray-600 mb-4">
                Use the Scenarios tab for recommendations or browse the Database to add supplements manually.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setActiveTab('scenarios')}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: '#007AFF' }}
                >
                  Get Recommendations
                </button>
                <button
                  onClick={() => setActiveTab('database')}
                  className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 transition-all duration-200 hover:bg-gray-50"
                >
                  Browse Database
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Morning Stack */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#FF950015' }}>
                      <Coffee className="w-5 h-5" style={{ color: '#FF9500' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: '#1C1C1E' }}>
                        Morning Stack
                      </h4>
                      <p className="text-xs text-gray-500">
                        {stack.morning.length} supplement{stack.morning.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {stack.morning.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                        <div className="flex-1">
                          <p className="font-medium text-sm" style={{ color: '#1C1C1E' }}>
                            {item.supplement.name}
                          </p>
                          <p className="text-xs text-gray-600">{item.dosage}</p>
                        </div>
                        <button
                          onClick={() => removeFromStack(item.supplement.name, 'morning')}
                          className="p-1 rounded-lg hover:bg-red-100 transition-all duration-200"
                        >
                          <X className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pre-Workout Stack */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#007AFF15' }}>
                      <Dumbbell className="w-5 h-5" style={{ color: '#007AFF' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: '#1C1C1E' }}>
                        Pre-Workout Stack
                      </h4>
                      <p className="text-xs text-gray-500">
                        {stack.preWorkout.length} supplement{stack.preWorkout.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {stack.preWorkout.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                        <div className="flex-1">
                          <p className="font-medium text-sm" style={{ color: '#1C1C1E' }}>
                            {item.supplement.name}
                          </p>
                          <p className="text-xs text-gray-600">{item.dosage}</p>
                        </div>
                        <button
                          onClick={() => removeFromStack(item.supplement.name, 'preWorkout')}
                          className="p-1 rounded-lg hover:bg-red-100 transition-all duration-200"
                        >
                          <X className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evening Stack */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#5856D615' }}>
                      <Moon className="w-5 h-5" style={{ color: '#5856D6' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold" style={{ color: '#1C1C1E' }}>
                        Evening Stack
                      </h4>
                      <p className="text-xs text-gray-500">
                        {stack.evening.length} supplement{stack.evening.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {stack.evening.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                        <div className="flex-1">
                          <p className="font-medium text-sm" style={{ color: '#1C1C1E' }}>
                            {item.supplement.name}
                          </p>
                          <p className="text-xs text-gray-600">{item.dosage}</p>
                        </div>
                        <button
                          onClick={() => removeFromStack(item.supplement.name, 'evening')}
                          className="p-1 rounded-lg hover:bg-red-100 transition-all duration-200"
                        >
                          <X className="w-3 h-3 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Steps - Only show when stack has items */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4" style={{ color: '#1C1C1E' }}>
                  Your Next Steps
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: '#007AFF' }}></div>
                    <p className="text-gray-700 text-sm">Start a supplement tracking journal or notes app page</p>
                  </div>
                  <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: '#34C759' }}></div>
                    <p className="text-gray-700 text-sm">Record baseline mood, energy, and focus levels for 3-7 days</p>
                  </div>
                  <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: '#FF9500' }}></div>
                    <p className="text-gray-700 text-sm">Start with ONE supplement from your stack, use minimum effective dose</p>
                  </div>
                  <div className="flex items-center p-3 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: '#FF3B30' }}></div>
                    <p className="text-gray-700 text-sm">Plan your cycling schedule: days off weekly, week off monthly</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Locked State Message */}
      {(activeTab === 'database' || activeTab === 'stack' || activeTab === 'scenarios') && !hasReadGuidelines && (
        <div className="text-center py-12">
          <div className="p-4 rounded-full mx-auto mb-4" style={{ backgroundColor: '#F2F2F7', width: 'fit-content' }}>
            <Lock className="w-8 h-8" style={{ color: '#8E8E93' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: '#1C1C1E' }}>
            Read Guidelines First
          </h3>
          <p className="text-gray-600 mb-4">
            Please read and understand the supplement guidelines before accessing the database and stack builder.
          </p>
          <button
            onClick={() => setActiveTab('guide')}
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: '#007AFF' }}
          >
            Go to Guidelines
          </button>
        </div>
      )}
    </div>
  );
};

export default SupplementsCard;