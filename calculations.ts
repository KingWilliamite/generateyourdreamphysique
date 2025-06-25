export interface BodyCompositionData {
  currentWeight: number;
  currentBodyFat: number;
  heightFeet: number;
  heightInches: number;
  age: number;
  gender: 'male' | 'female';
  desiredLeanMassPercentage: number;
  desiredBodyFat: number;
  weeklyWeightLoss: number;
  dailyCalories?: number;
  activityLevel?: string;
  proteinPercent?: number;
  fatPercent?: number;
  carbPercent?: number;
}

export interface BodyCompositionResults {
  currentLeanBodyMass: number;
  currentFatMass: number;
  goalLeanBodyMass: number;
  goalFatMass: number;
  goalWeight: number;
  weightToLose: number;
  weeksToGoal: number;
}

export interface MacronutrientTargets {
  protein: number;
  fat: number;
  carbs: number;
  totalCalories: number;
  proteinCalories: number;
  fatCalories: number;
  carbCalories: number;
  proteinPercentage: number;
  fatPercentage: number;
  carbPercentage: number;
}

export const calculateBodyComposition = (data: BodyCompositionData): BodyCompositionResults => {
  const {
    currentWeight,
    currentBodyFat,
    desiredLeanMassPercentage,
    desiredBodyFat,
    weeklyWeightLoss
  } = data;

  // Calculate current body composition
  const currentLeanBodyMass = currentWeight * (1 - currentBodyFat / 100);
  const currentFatMass = currentWeight * (currentBodyFat / 100);

  // Calculate goal body composition
  const goalLeanBodyMass = currentLeanBodyMass * (desiredLeanMassPercentage / 100);
  const goalWeight = goalLeanBodyMass / (1 - desiredBodyFat / 100);
  const goalFatMass = goalWeight * (desiredBodyFat / 100);

  // Calculate timeline
  const weightToLose = currentWeight - goalWeight;
  const weeksToGoal = Math.max(0, Math.ceil(weightToLose / weeklyWeightLoss));

  return {
    currentLeanBodyMass,
    currentFatMass,
    goalLeanBodyMass,
    goalFatMass,
    goalWeight,
    weightToLose,
    weeksToGoal
  };
};

export const calculateMacronutrients = (
  currentWeight: number,
  goalWeight: number,
  totalCalories: number,
  proteinPercent: number = 30,
  fatPercent: number = 25,
  carbPercent: number = 45
): MacronutrientTargets => {
  // FIXED CALCULATION FOLLOWING YOUR GUIDELINES:
  
  // 1. PROTEIN: 1g per pound of goal body weight
  const protein = goalWeight;
  const proteinCalories = protein * 4;
  
  // 2. FAT: (Total Daily Calories * 0.25) / 9 = Daily Fat Intake (in grams)
  const fat = (totalCalories * 0.25) / 9;
  const fatCalories = fat * 9;
  
  // 3. CARBS: [Total Daily Calories - ((Protein Target in grams * 4) + (Fat Target in grams * 9))] / 4
  const remainingCalories = totalCalories - proteinCalories - fatCalories;
  const carbs = Math.max(0, remainingCalories / 4);
  const carbCalories = carbs * 4;

  // Calculate actual percentages based on realistic macros
  const actualTotalCalories = proteinCalories + fatCalories + carbCalories;
  const proteinPercentage = (proteinCalories / actualTotalCalories) * 100;
  const fatPercentage = (fatCalories / actualTotalCalories) * 100;
  const carbPercentage = (carbCalories / actualTotalCalories) * 100;

  return {
    protein: Math.round(protein),
    fat: Math.round(fat),
    carbs: Math.round(carbs),
    totalCalories: Math.round(actualTotalCalories),
    proteinCalories: Math.round(proteinCalories),
    fatCalories: Math.round(fatCalories),
    carbCalories: Math.round(carbCalories),
    proteinPercentage: Math.round(proteinPercentage),
    fatPercentage: Math.round(fatPercentage),
    carbPercentage: Math.round(carbPercentage)
  };
};

export const getMacroGuidelines = (proteinPercent: number, fatPercent: number, carbPercent: number): string[] => {
  const guidelines: string[] = [];

  // Protein guidelines
  if (proteinPercent >= 40) {
    guidelines.push("🥩 **High Protein Approach**: Excellent for muscle preservation during fat loss. Focus on lean sources like chicken, fish, and whey protein. May increase satiety and thermogenesis.");
  } else if (proteinPercent >= 30) {
    guidelines.push("💪 **Moderate-High Protein**: Good balance for body recomposition. Supports muscle maintenance while allowing flexibility with other macros.");
  } else if (proteinPercent >= 20) {
    guidelines.push("🍗 **Standard Protein**: Meeting basic requirements. Consider increasing if goal is muscle preservation or fat loss.");
  } else {
    guidelines.push("⚠️ **Low Protein Warning**: Below optimal for body composition goals. Consider increasing to at least 25-30% for better results.");
  }

  // Fat guidelines
  if (fatPercent >= 50) {
    guidelines.push("🥑 **Very High Fat (Ketogenic-style)**: Excellent for metabolic flexibility and appetite control. Ensure adequate electrolytes and consider MCT oil. May reduce carb cravings significantly.");
  } else if (fatPercent >= 35) {
    guidelines.push("🧈 **High Fat Approach**: Good for hormone production and satiety. Focus on quality sources: avocados, nuts, olive oil, fatty fish. Great for stable energy.");
  } else if (fatPercent >= 25) {
    guidelines.push("🥜 **Moderate Fat**: Balanced approach supporting hormone production. Include omega-3s from fish oil or fatty fish 2-3x per week.");
  } else if (fatPercent >= 15) {
    guidelines.push("🐟 **Lower Fat**: Ensure you're getting essential fatty acids. Don't go below 15% long-term as it may affect hormone production.");
  } else {
    guidelines.push("⚠️ **Very Low Fat Warning**: Below recommended minimums. May negatively impact hormone production, vitamin absorption, and satiety.");
  }

  // Carb guidelines
  if (carbPercent >= 50) {
    guidelines.push("🍠 **High Carb Approach**: Great for high-intensity training and glycogen replenishment. Time carbs around workouts for optimal performance. Focus on complex carbs and fiber.");
  } else if (carbPercent >= 35) {
    guidelines.push("🍚 **Moderate Carbs**: Balanced approach allowing for performance and flexibility. Prioritize nutrient-dense sources like sweet potatoes, oats, and fruits.");
  } else if (carbPercent >= 20) {
    guidelines.push("🥬 **Lower Carb**: Good for fat loss and blood sugar control. Focus on fibrous vegetables and strategic timing around workouts.");
  } else if (carbPercent >= 10) {
    guidelines.push("🥒 **Very Low Carb**: Ketogenic territory. Expect 1-2 week adaptation period. Excellent for appetite control and steady energy once adapted.");
  } else {
    guidelines.push("🥩 **Carnivore/Zero Carb**: Extreme approach. Ensure adequate fiber from other sources or consider digestive support. Monitor energy levels closely.");
  }

  // Combination insights
  if (proteinPercent >= 35 && fatPercent >= 35) {
    guidelines.push("⚡ **Protein + Fat Dominant**: Excellent for appetite control and muscle preservation. Perfect for fat loss phases. Consider nutrient timing around workouts.");
  }

  if (proteinPercent >= 30 && carbPercent >= 40) {
    guidelines.push("🏋️ **Protein + Carb Focus**: Great for active individuals and muscle building. Time carbs pre/post workout for optimal performance and recovery.");
  }

  if (fatPercent >= 40 && carbPercent <= 20) {
    guidelines.push("🧠 **Fat-Adapted Protocol**: Excellent for mental clarity and stable energy. Allow 2-4 weeks for full adaptation. Consider exogenous ketones initially.");
  }

  // Meal timing suggestions
  if (carbPercent >= 30) {
    guidelines.push("⏰ **Meal Timing**: Consider carb cycling or timing carbs around workouts for optimal body composition and performance.");
  }

  if (fatPercent >= 30) {
    guidelines.push("🍽️ **Nutrient Pairing**: Combine protein + fat OR protein + carbs in meals. Avoid high fat + high carb combinations for better body composition.");
  }

  // Practical tips based on split
  const isBalanced = Math.abs(proteinPercent - 30) <= 5 && Math.abs(fatPercent - 30) <= 5 && Math.abs(carbPercent - 40) <= 10;
  const isHighProtein = proteinPercent >= 35;
  const isLowCarb = carbPercent <= 25;
  const isHighFat = fatPercent >= 40;

  if (isBalanced) {
    guidelines.push("✅ **Balanced Approach**: This split offers flexibility and sustainability. Good starting point for most people. Easy to adjust based on results.");
  }

  if (isHighProtein && isLowCarb) {
    guidelines.push("🎯 **Cutting Protocol**: Excellent for fat loss while preserving muscle. Expect faster results but may need diet breaks every 8-12 weeks.");
  }

  if (isHighFat && isLowCarb) {
    guidelines.push("🔥 **Metabolic Flexibility**: This split promotes fat adaptation and ketosis. Great for appetite control and steady energy. Monitor electrolytes closely.");
  }

  return guidelines;
};

export const estimateCalorieNeeds = (
  weight: number,
  activityLevel: string,
  isDeficit: boolean = false
): number => {
  // Base metabolic rate estimation (simplified)
  const bmr = weight * 12; // Rough estimate: 12 calories per pound for BMR
  
  let activityMultiplier = 1.2; // Sedentary
  switch (activityLevel) {
    case 'lightly_active':
      activityMultiplier = 1.375;
      break;
    case 'moderately_active':
      activityMultiplier = 1.55;
      break;
    case 'very_active':
      activityMultiplier = 1.725;
      break;
    case 'extremely_active':
      activityMultiplier = 1.9;
      break;
  }

  const maintenanceCalories = bmr * activityMultiplier;
  
  // If in deficit for weight loss, reduce by 500 calories (1 lb/week loss)
  return isDeficit ? maintenanceCalories - 500 : maintenanceCalories;
};

export const getProteinSources = (proteinTarget: number) => {
  const sources = [
    {
      name: "Whey Protein",
      amount: `${Math.round(proteinTarget / 25)}x scoops`,
      protein: "25g per scoop"
    },
    {
      name: "Chicken Breast",
      amount: `${Math.round((proteinTarget / 50) * 6)}oz`,
      protein: "50g per 6oz"
    },
    {
      name: "Lean Steak",
      amount: `${Math.round((proteinTarget / 50) * 8)}oz`,
      protein: "50g per 8oz"
    },
    {
      name: "Tuna",
      amount: `${Math.round((proteinTarget / 50) * 10)}oz`,
      protein: "50g per 10oz"
    }
  ];

  return sources;
};

// Utility functions for validation and formatting
export const validateBodyFatPercentage = (value: number): boolean => {
  return value > 0 && value < 50;
};

export const validateWeight = (value: number): boolean => {
  return value > 0 && value < 1000;
};

export const formatNumber = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

export const calculateBMI = (weightLbs: number, heightInches: number): number => {
  return (weightLbs / (heightInches * heightInches)) * 703;
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const estimateBodyFatFromBMI = (bmi: number, age: number, gender: 'male' | 'female'): number => {
  // Simplified body fat estimation based on BMI, age, and gender
  // This is an approximation and not as accurate as DEXA or other methods
  
  let bodyFat = 0;
  
  if (gender === 'male') {
    // Male body fat estimation
    bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
  } else {
    // Female body fat estimation  
    bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
  }
  
  // Ensure reasonable bounds
  bodyFat = Math.max(5, Math.min(50, bodyFat));
  
  return bodyFat;
};