import React, { useState, useEffect } from 'react';
import { Calculator, Target, TrendingDown, Clock, User, Activity, Utensils, Pill, Ruler, Calendar } from 'lucide-react';
import StepIndicator from './components/StepIndicator';
import InputCard from './components/InputCard';
import ResultCard from './components/ResultCard';
import MacroCard from './components/MacroCard';
import SupplementsCard from './components/SupplementsCard';
import { 
  BodyCompositionData, 
  calculateBodyComposition, 
  calculateMacronutrients,
  estimateCalorieNeeds,
  MacronutrientTargets,
  getMacroGuidelines,
  calculateBMI,
  getBMICategory,
  estimateBodyFatFromBMI
} from './utils/calculations';
import { exportBodyCompositionPDF } from './utils/exportPDF';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<BodyCompositionData>({
    currentWeight: 0,
    currentBodyFat: 0,
    heightFeet: 0,
    heightInches: 0,
    age: 0,
    gender: 'male',
    desiredLeanMassPercentage: 100,
    desiredBodyFat: 15,
    weeklyWeightLoss: 1,
    dailyCalories: 0,
    activityLevel: 'moderately_active',
    proteinPercent: 30,
    fatPercent: 25,
    carbPercent: 45
  });

  const [results, setResults] = useState<any>(null);
  const [macros, setMacros] = useState<MacronutrientTargets | null>(null);
  const [isValid, setIsValid] = useState(false);

  const steps = [
    { id: 1, title: 'Current Stats', icon: User },
    { id: 2, title: 'Goals', icon: Target },
    { id: 3, title: 'Timeline', icon: Clock },
    { id: 4, title: 'Nutrition', icon: Utensils },
    { id: 5, title: 'Supplements', icon: Pill },
    { id: 6, title: 'Results', icon: TrendingDown }
  ];

  useEffect(() => {
    const { currentWeight, currentBodyFat, desiredLeanMassPercentage, desiredBodyFat, weeklyWeightLoss, dailyCalories } = data;
    
    if (currentWeight > 0 && currentBodyFat > 0 && currentBodyFat < 100 && 
        desiredLeanMassPercentage > 0 && desiredBodyFat > 0 && desiredBodyFat < 100 && 
        weeklyWeightLoss > 0) {
      setIsValid(true);
      const bodyResults = calculateBodyComposition(data);
      setResults(bodyResults);

      // Calculate macros if calories are set - using REALISTIC calculations
      if (dailyCalories && dailyCalories > 0) {
        const macroResults = calculateMacronutrients(
          currentWeight, 
          bodyResults.goalWeight, 
          dailyCalories, 
          data.proteinPercent,
          data.fatPercent,
          data.carbPercent
        );
        setMacros(macroResults);
      }
    } else {
      setIsValid(false);
      setResults(null);
      setMacros(null);
    }
  }, [data]);

  const updateData = (field: keyof BodyCompositionData, value: number | string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleComplete = () => {
    if (isValid && results) {
      exportBodyCompositionPDF(data, results, macros);
      alert('Your complete body composition and nutrition analysis has been exported as a PDF!');
    }
  };

  const estimateCalories = () => {
    if (data.currentWeight > 0 && data.activityLevel) {
      const estimated = estimateCalorieNeeds(data.currentWeight, data.activityLevel, true);
      updateData('dailyCalories', Math.round(estimated));
    }
  };

  const estimateBodyFat = () => {
    if (data.currentWeight > 0 && data.heightFeet > 0 && data.age > 0) {
      const totalHeightInches = (data.heightFeet * 12) + data.heightInches;
      const bmi = calculateBMI(data.currentWeight, totalHeightInches);
      const estimatedBodyFat = estimateBodyFatFromBMI(bmi, data.age, data.gender);
      updateData('currentBodyFat', Math.round(estimatedBodyFat * 10) / 10);
    }
  };

  // Calculate derived metrics for display
  const totalHeightInches = (data.heightFeet * 12) + data.heightInches;
  const bmi = data.currentWeight > 0 && totalHeightInches > 0 ? calculateBMI(data.currentWeight, totalHeightInches) : 0;
  const bmiCategory = bmi > 0 ? getBMICategory(bmi) : '';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F2F7' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: '#007AFF' }}>
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#1C1C1E' }}>
            Body Composition & Macro Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Calculate your target bodyweight, timeline, and personalized macronutrient targets
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Main Content */}
        <div className="mt-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                  Complete Body Composition Analysis
                </h2>
                <p className="text-gray-600">Enter your complete stats for a comprehensive analysis</p>
              </div>
              
              {/* Basic Info Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: '#1C1C1E' }}>
                  <User className="w-5 h-5 mr-2" style={{ color: '#007AFF' }} />
                  Basic Information
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <InputCard
                    label="Age"
                    value={data.age}
                    onChange={(value) => updateData('age', value)}
                    unit="years"
                    icon={Calendar}
                    placeholder="Enter your age"
                    min={13}
                    max={100}
                  />
                  
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center mb-4">
                      <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: '#F2F2F7' }}>
                        <User className="w-5 h-5" style={{ color: '#007AFF' }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: '#1C1C1E' }}>
                          Gender
                        </h3>
                        <p className="text-sm text-gray-500">Biological sex</p>
                      </div>
                    </div>
                    
                    <select
                      value={data.gender}
                      onChange={(e) => updateData('gender', e.target.value)}
                      className="w-full px-4 py-3 text-lg font-semibold rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-all duration-200"
                      style={{ backgroundColor: '#FFFFFF' }}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <InputCard
                    label="Weight"
                    value={data.currentWeight}
                    onChange={(value) => updateData('currentWeight', value)}
                    unit="lbs"
                    icon={Activity}
                    placeholder="Enter your weight"
                    min={50}
                    max={500}
                  />
                </div>
              </div>

              {/* Height Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: '#1C1C1E' }}>
                  <Ruler className="w-5 h-5 mr-2" style={{ color: '#007AFF' }} />
                  Height
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <InputCard
                    label="Feet"
                    value={data.heightFeet}
                    onChange={(value) => updateData('heightFeet', value)}
                    unit="ft"
                    icon={Ruler}
                    placeholder="Enter feet"
                    min={3}
                    max={8}
                  />
                  
                  <InputCard
                    label="Inches"
                    value={data.heightInches}
                    onChange={(value) => updateData('heightInches', value)}
                    unit="in"
                    icon={Ruler}
                    placeholder="Enter inches"
                    min={0}
                    max={11}
                  />
                </div>

                {totalHeightInches > 0 && (
                  <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                    <p className="text-center text-gray-700">
                      <span className="font-semibold">Total Height:</span> {data.heightFeet}'{data.heightInches}" 
                      ({totalHeightInches} inches / {(totalHeightInches * 2.54).toFixed(1)} cm)
                    </p>
                  </div>
                )}
              </div>

              {/* Body Fat Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: '#1C1C1E' }}>
                  <Target className="w-5 h-5 mr-2" style={{ color: '#007AFF' }} />
                  Body Fat Percentage
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <InputCard
                    label="Current Body Fat %"
                    value={data.currentBodyFat}
                    onChange={(value) => updateData('currentBodyFat', value)}
                    unit="%"
                    icon={Target}
                    placeholder="Enter body fat percentage"
                    min={5}
                    max={50}
                    step={0.1}
                  />
                  
                  <div className="flex items-center justify-center">
                    <button
                      onClick={estimateBodyFat}
                      disabled={!data.currentWeight || !totalHeightInches || !data.age}
                      className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#007AFF' }}
                    >
                      Estimate Body Fat from BMI
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Don't know your body fat?</strong> Use the estimate button above for an approximation based on BMI, age, and gender. 
                    For accuracy, consider DEXA scan, BodPod, or professional body fat measurement.
                  </p>
                </div>
              </div>

              {/* Comprehensive Analysis */}
              {data.currentWeight > 0 && totalHeightInches > 0 && data.currentBodyFat > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-6" style={{ color: '#1C1C1E' }}>
                    Complete Body Composition Analysis
                  </h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* BMI Card */}
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                      <p className="text-sm text-gray-600 mb-1">BMI</p>
                      <p className="text-2xl font-bold" style={{ color: '#007AFF' }}>
                        {bmi.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">{bmiCategory}</p>
                    </div>

                    {/* Lean Body Mass */}
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                      <p className="text-sm text-gray-600 mb-1">Lean Mass</p>
                      <p className="text-2xl font-bold" style={{ color: '#34C759' }}>
                        {(data.currentWeight * (1 - data.currentBodyFat / 100)).toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">lbs</p>
                    </div>

                    {/* Fat Mass */}
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                      <p className="text-sm text-gray-600 mb-1">Fat Mass</p>
                      <p className="text-2xl font-bold" style={{ color: '#FF9500' }}>
                        {(data.currentWeight * (data.currentBodyFat / 100)).toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500">lbs</p>
                    </div>

                    {/* Body Fat % */}
                    <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                      <p className="text-sm text-gray-600 mb-1">Body Fat</p>
                      <p className="text-2xl font-bold" style={{ color: '#FF3B30' }}>
                        {data.currentBodyFat}%
                      </p>
                      <p className="text-xs text-gray-500">percentage</p>
                    </div>
                  </div>

                  {/* Health Insights */}
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                      📊 Health Insights
                    </h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p><strong>BMI Category:</strong> {bmiCategory} ({bmi.toFixed(1)})</p>
                      <p><strong>Body Composition:</strong> {((1 - data.currentBodyFat / 100) * 100).toFixed(1)}% lean mass, {data.currentBodyFat}% body fat</p>
                      <p><strong>Height-Weight Ratio:</strong> {data.currentWeight} lbs at {data.heightFeet}'{data.heightInches}"</p>
                      {data.gender === 'male' && (
                        <p><strong>Male Body Fat Ranges:</strong> Essential: 2-5%, Athletes: 6-13%, Fitness: 14-17%, Average: 18-24%</p>
                      )}
                      {data.gender === 'female' && (
                        <p><strong>Female Body Fat Ranges:</strong> Essential: 10-13%, Athletes: 14-20%, Fitness: 21-24%, Average: 25-31%</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                  Set Your Goals
                </h2>
                <p className="text-gray-600">Define your target lean body mass and body fat percentage</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <InputCard
                  label="Goal Lean Mass"
                  value={data.desiredLeanMassPercentage}
                  onChange={(value) => updateData('desiredLeanMassPercentage', value)}
                  unit="% of current"
                  icon={Target}
                  placeholder="Percentage of current lean mass"
                  min={80}
                  max={120}
                  step={1}
                />
                
                <InputCard
                  label="Target Body Fat %"
                  value={data.desiredBodyFat}
                  onChange={(value) => updateData('desiredBodyFat', value)}
                  unit="%"
                  icon={TrendingDown}
                  placeholder="Target body fat percentage"
                  min={5}
                  max={35}
                  step={0.1}
                />
              </div>

              {isValid && results && (
                <div className="mt-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#1C1C1E' }}>
                      Goal Analysis
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                        <p className="text-sm text-gray-600 mb-1">Goal Lean Mass</p>
                        <p className="text-2xl font-bold" style={{ color: '#34C759' }}>
                          {results.goalLeanBodyMass.toFixed(1)} lbs
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                        <p className="text-sm text-gray-600 mb-1">Goal Weight</p>
                        <p className="text-2xl font-bold" style={{ color: '#007AFF' }}>
                          {results.goalWeight.toFixed(1)} lbs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                  Timeline Planning
                </h2>
                <p className="text-gray-600">Set your weekly weight loss rate to estimate timeline</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <InputCard
                  label="Weekly Weight Loss"
                  value={data.weeklyWeightLoss}
                  onChange={(value) => updateData('weeklyWeightLoss', value)}
                  unit="lbs/week"
                  icon={Clock}
                  placeholder="Target weekly weight loss"
                  min={0.5}
                  max={3}
                  step={0.1}
                />
              </div>

              {isValid && results && (
                <div className="mt-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#1C1C1E' }}>
                      Timeline Estimate
                    </h3>
                    <div className="text-center">
                      <div className="p-6 rounded-lg" style={{ backgroundColor: '#F2F2F7' }}>
                        <p className="text-sm text-gray-600 mb-2">Estimated Time to Goal</p>
                        <p className="text-4xl font-bold mb-2" style={{ color: '#FF9500' }}>
                          {results.weeksToGoal}
                        </p>
                        <p className="text-lg text-gray-600">weeks</p>
                        <p className="text-sm text-gray-500 mt-2">
                          ({Math.ceil(results.weeksToGoal / 4.33)} months)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                  Realistic Macro Planning
                </h2>
                <p className="text-gray-600">Get practical, achievable macronutrient targets based on proven guidelines</p>
              </div>

              {/* 1. Custom Macro Planning */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#1C1C1E' }}>
                  1. Set Your Calorie Target
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4" style={{ color: '#1C1C1E' }}>
                      Activity Level & Calories
                    </h4>
                    <select
                      value={data.activityLevel}
                      onChange={(e) => updateData('activityLevel', e.target.value)}
                      className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 transition-all duration-200 mb-4"
                    >
                      <option value="sedentary">Sedentary (desk job, no exercise)</option>
                      <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                      <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                      <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                      <option value="extremely_active">Extremely Active (very hard exercise, physical job)</option>
                    </select>
                    
                    <button
                      onClick={estimateCalories}
                      className="w-full px-4 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 mb-4"
                      style={{ backgroundColor: '#007AFF' }}
                    >
                      Estimate My Calories
                    </button>
                  </div>

                  <InputCard
                    label="Daily Calories"
                    value={data.dailyCalories || 0}
                    onChange={(value) => updateData('dailyCalories', value)}
                    unit="calories"
                    icon={Utensils}
                    placeholder="Enter daily calorie target"
                    min={1200}
                    max={4000}
                    step={50}
                  />
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                    📊 Realistic Macro Formula
                  </h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Protein:</strong> 1g per pound of goal body weight ({results?.goalWeight.toFixed(0) || 0}g)</p>
                    <p><strong>Fat:</strong> 25% of total calories ÷ 9 = fat grams</p>
                    <p><strong>Carbs:</strong> Remaining calories ÷ 4 = carb grams</p>
                  </div>
                </div>
              </div>

              {/* 2. Personalized Macronutrient Targets */}
              {macros && data.dailyCalories > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: '#1C1C1E' }}>
                    2. Your Realistic Macronutrient Targets
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Based on {data.dailyCalories} daily calories using proven guidelines for sustainable results
                  </p>

                  <div className="grid md:grid-cols-3 gap-6">
                    <MacroCard
                      title="Protein"
                      amount={macros.protein}
                      unit="g"
                      calories={macros.proteinCalories}
                      percentage={macros.proteinPercentage}
                      color="#007AFF"
                      icon="protein"
                    />
                    <MacroCard
                      title="Fat"
                      amount={macros.fat}
                      unit="g"
                      calories={macros.fatCalories}
                      percentage={macros.fatPercentage}
                      color="#FF9500"
                      icon="fat"
                    />
                    <MacroCard
                      title="Carbs"
                      amount={macros.carbs}
                      unit="g"
                      calories={macros.carbCalories}
                      percentage={macros.carbPercentage}
                      color="#34C759"
                      icon="carbs"
                    />
                  </div>
                </div>
              )}

              {/* 3. Intelligent Guidelines */}
              {macros && data.dailyCalories > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: '#1C1C1E' }}>
                    3. 🧠 Why This Split Works
                  </h3>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 mt-2 flex-shrink-0" />
                      <p className="leading-relaxed">
                        <strong>Protein ({macros.proteinPercentage}%):</strong> 1g per pound of goal weight ensures muscle preservation during fat loss while maximizing satiety and thermogenesis.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mr-3 mt-2 flex-shrink-0" />
                      <p className="leading-relaxed">
                        <strong>Fat ({macros.fatPercentage}%):</strong> 25% of calories supports hormone production, vitamin absorption, and provides sustained energy without excess.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3 mt-2 flex-shrink-0" />
                      <p className="leading-relaxed">
                        <strong>Carbs ({macros.carbPercentage}%):</strong> Remaining calories fuel workouts and brain function while allowing flexibility for vegetables and fruits.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <SupplementsCard />
          )}

          {currentStep === 6 && isValid && results && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                  Complete Analysis
                </h2>
                <p className="text-gray-600">Your body composition, timeline, and nutrition plan</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ResultCard
                  title="Current Composition"
                  data={[
                    { label: 'Weight', value: `${data.currentWeight} lbs`, color: '#1C1C1E' },
                    { label: 'Body Fat', value: `${data.currentBodyFat}%`, color: '#FF9500' },
                    { label: 'Lean Mass', value: `${results.currentLeanBodyMass.toFixed(1)} lbs`, color: '#007AFF' },
                    { label: 'Fat Mass', value: `${results.currentFatMass.toFixed(1)} lbs`, color: '#FF9500' }
                  ]}
                />

                <ResultCard
                  title="Goal Composition"
                  data={[
                    { label: 'Goal Weight', value: `${results.goalWeight.toFixed(1)} lbs`, color: '#34C759' },
                    { label: 'Goal Body Fat', value: `${data.desiredBodyFat}%`, color: '#34C759' },
                    { label: 'Goal Lean Mass', value: `${results.goalLeanBodyMass.toFixed(1)} lbs`, color: '#007AFF' },
                    { label: 'Goal Fat Mass', value: `${results.goalFatMass.toFixed(1)} lbs`, color: '#34C759' }
                  ]}
                />
              </div>

              {macros && (
                <div className="grid md:grid-cols-3 gap-6">
                  <MacroCard
                    title="Protein"
                    amount={macros.protein}
                    unit="g"
                    calories={macros.proteinCalories}
                    percentage={macros.proteinPercentage}
                    color="#007AFF"
                    icon="protein"
                  />
                  <MacroCard
                    title="Carbs"
                    amount={macros.carbs}
                    unit="g"
                    calories={macros.carbCalories}
                    percentage={macros.carbPercentage}
                    color="#34C759"
                    icon="carbs"
                  />
                  <MacroCard
                    title="Fat"
                    amount={macros.fat}
                    unit="g"
                    calories={macros.fatCalories}
                    percentage={macros.fatPercentage}
                    color="#FF9500"
                    icon="fat"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                    Weight to Lose
                  </h3>
                  <p className="text-3xl font-bold" style={{ color: '#FF9500' }}>
                    {results.weightToLose.toFixed(1)} lbs
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                    Timeline
                  </h3>
                  <p className="text-3xl font-bold" style={{ color: '#007AFF' }}>
                    {results.weeksToGoal} weeks
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#1C1C1E' }}>
                    Daily Calories
                  </h3>
                  <p className="text-3xl font-bold" style={{ color: '#34C759' }}>
                    {data.dailyCalories || 0}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#1C1C1E' }}>
                  Complete Plan Summary
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>• <strong>Body Composition:</strong> Maintain {results.goalLeanBodyMass.toFixed(1)} lbs lean mass, reduce body fat from {data.currentBodyFat}% to {data.desiredBodyFat}%</p>
                  <p>• <strong>Timeline:</strong> {results.weeksToGoal} weeks ({Math.ceil(results.weeksToGoal / 4.33)} months) at {data.weeklyWeightLoss} lbs/week</p>
                  {macros && (
                    <p>• <strong>Realistic Macros:</strong> {data.dailyCalories} calories - {macros.protein}g protein ({macros.proteinPercentage}%), {macros.fat}g fat ({macros.fatPercentage}%), {macros.carbs}g carbs ({macros.carbPercentage}%)</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: currentStep === 1 ? '#E5E7EB' : '#F3F4F6',
              color: currentStep === 1 ? '#9CA3AF' : '#374151'
            }}
          >
            Previous
          </button>
          
          <button
            onClick={currentStep === 6 ? handleComplete : nextStep}
            disabled={
              (currentStep === 1 && (data.currentWeight === 0 || data.currentBodyFat === 0)) ||
              (currentStep === 4 && !data.dailyCalories)
            }
            className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#007AFF' }}
          >
            {currentStep === 6 ? 'Complete & Export PDF' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;