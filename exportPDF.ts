import jsPDF from 'jspdf';
import { BodyCompositionData, BodyCompositionResults, MacronutrientTargets, getMacroGuidelines } from './calculations';

export const exportBodyCompositionPDF = (
  data: BodyCompositionData,
  results: BodyCompositionResults,
  macros?: MacronutrientTargets | null
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 30;

  // Helper function to add text with proper positioning
  const addText = (text: string, x: number, y: number, options?: any) => {
    doc.text(text, x, y, options);
  };

  // Helper function to add centered text
  const addCenteredText = (text: string, y: number, options?: any) => {
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y, options);
  };

  // Set colors
  const primaryColor = [0, 122, 255]; // #007AFF
  const successColor = [52, 199, 89]; // #34C759
  const textColor = [28, 28, 30]; // #1C1C1E
  const grayColor = [142, 142, 147]; // #8E8E93

  // Title
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  addCenteredText('Complete Body Composition & Nutrition Analysis', yPosition);
  yPosition += 20;

  // Date
  doc.setFontSize(12);
  doc.setTextColor(...grayColor);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  addCenteredText(`Generated on ${currentDate}`, yPosition);
  yPosition += 30;

  // Current Stats Section
  doc.setFontSize(16);
  doc.setTextColor(...textColor);
  addText('Current Body Composition', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  const currentStats = [
    `Weight: ${data.currentWeight} lbs`,
    `Body Fat: ${data.currentBodyFat}%`,
    `Lean Body Mass: ${results.currentLeanBodyMass.toFixed(1)} lbs`,
    `Fat Mass: ${results.currentFatMass.toFixed(1)} lbs`
  ];

  currentStats.forEach(stat => {
    addText(`• ${stat}`, margin + 10, yPosition);
    yPosition += 8;
  });
  yPosition += 15;

  // Goals Section
  doc.setFontSize(16);
  doc.setTextColor(...textColor);
  addText('Target Goals', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  const goalStats = [
    `Goal Weight: ${results.goalWeight.toFixed(1)} lbs`,
    `Target Body Fat: ${data.desiredBodyFat}%`,
    `Goal Lean Mass: ${results.goalLeanBodyMass.toFixed(1)} lbs (${data.desiredLeanMassPercentage}% of current)`,
    `Goal Fat Mass: ${results.goalFatMass.toFixed(1)} lbs`
  ];

  goalStats.forEach(stat => {
    addText(`• ${stat}`, margin + 10, yPosition);
    yPosition += 8;
  });
  yPosition += 15;

  // Timeline Section
  doc.setFontSize(16);
  doc.setTextColor(...textColor);
  addText('Timeline & Progress', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  const timelineStats = [
    `Weight to Lose: ${results.weightToLose.toFixed(1)} lbs`,
    `Weekly Weight Loss Rate: ${data.weeklyWeightLoss} lbs/week`,
    `Estimated Timeline: ${results.weeksToGoal} weeks (${Math.ceil(results.weeksToGoal / 4.33)} months)`,
    `Fat Loss: ${(results.currentFatMass - results.goalFatMass).toFixed(1)} lbs`
  ];

  timelineStats.forEach(stat => {
    addText(`• ${stat}`, margin + 10, yPosition);
    yPosition += 8;
  });
  yPosition += 20;

  // Macronutrient Section (if available)
  if (macros && data.dailyCalories) {
    doc.setFontSize(16);
    doc.setTextColor(...successColor);
    addText('Custom Nutrition Plan', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setTextColor(...textColor);
    const macroStats = [
      `Daily Calories: ${data.dailyCalories}`,
      `Custom Macro Split: ${data.proteinPercent}% Protein / ${data.fatPercent}% Fat / ${data.carbPercent}% Carbs`,
      `Protein: ${macros.protein}g (${macros.proteinPercentage}% - ${macros.proteinCalories} calories)`,
      `Carbohydrates: ${macros.carbs}g (${macros.carbPercentage}% - ${macros.carbCalories} calories)`,
      `Fat: ${macros.fat}g (${macros.fatPercentage}% - ${macros.fatCalories} calories)`
    ];

    macroStats.forEach(stat => {
      addText(`• ${stat}`, margin + 10, yPosition);
      yPosition += 8;
    });
    yPosition += 15;

    // Protein Sources
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    addText('Protein Source Guide (2-6-8-10 Hack)', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    const proteinSources = [
      '2x Whey Protein Scoops = 50g protein',
      '6oz Chicken Breast = 50g protein',
      '8oz Lean Steak = 50g protein',
      '10oz Tuna = 50g protein'
    ];

    proteinSources.forEach(source => {
      addText(`• ${source}`, margin + 10, yPosition);
      yPosition += 7;
    });
    yPosition += 15;
  }

  // Intelligent Guidelines Section
  if (data.proteinPercent && data.fatPercent && data.carbPercent) {
    doc.setFontSize(16);
    doc.setTextColor(...successColor);
    addText('Intelligent Guidelines for Your Macro Split', margin, yPosition);
    yPosition += 15;

    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    const guidelines = getMacroGuidelines(data.proteinPercent, data.fatPercent, data.carbPercent);

    guidelines.forEach(guideline => {
      const cleanGuideline = guideline.replace(/[🥩💪🍗⚠️🥑🧈🥜🐟🍠🍚🥬🥒⚡🏋️🧠⏰🍽️✅🎯🔥]/g, '').trim();
      const lines = doc.splitTextToSize(`• ${cleanGuideline}`, pageWidth - 2 * margin - 10);
      lines.forEach((line: string) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        addText(line, margin + 10, yPosition);
        yPosition += 6;
      });
      yPosition += 2;
    });
    yPosition += 15;
  }

  // Key Insights Section
  doc.setFontSize(16);
  doc.setTextColor(...successColor);
  addText('Key Insights & Recommendations', margin, yPosition);
  yPosition += 15;

  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  const insights = [
    `You will maintain ${results.goalLeanBodyMass.toFixed(1)} lbs of lean body mass while losing fat`,
    `Your body fat percentage will decrease from ${data.currentBodyFat}% to ${data.desiredBodyFat}%`,
    `Total fat loss of ${(results.currentFatMass - results.goalFatMass).toFixed(1)} lbs while preserving muscle`,
    `At ${data.weeklyWeightLoss} lbs/week, you'll reach your goal in approximately ${Math.ceil(results.weeksToGoal / 4.33)} months`,
    'Focus on strength training to maintain lean body mass during weight loss',
    'Monitor progress weekly and adjust caloric intake as needed',
    'Use the 2-6-8-10 protein hack for easy meal planning',
    'Consider periodic diet breaks if timeline extends beyond 12-16 weeks'
  ];

  insights.forEach(insight => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
    const lines = doc.splitTextToSize(`• ${insight}`, pageWidth - 2 * margin - 10);
    lines.forEach((line: string) => {
      addText(line, margin + 10, yPosition);
      yPosition += 6;
    });
    yPosition += 2;
  });

  // Footer
  yPosition = doc.internal.pageSize.height - 30;
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  addCenteredText('This analysis is for informational purposes only. Consult a healthcare professional for personalized advice.', yPosition);

  // Save the PDF
  const fileName = `custom-macro-body-composition-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};