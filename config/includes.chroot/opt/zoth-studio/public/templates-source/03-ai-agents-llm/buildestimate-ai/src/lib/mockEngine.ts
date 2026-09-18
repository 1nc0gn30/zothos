import { EstimateRequest, EstimateResponse } from '../types';

export function generateMockEstimate(request: EstimateRequest): EstimateResponse {
  const sqFt = request.squareFootage || (request.projectType === 'commercial' ? 3500 : 1800);
  const tier = request.qualityTier || 'standard';
  const tierMultiplier = tier === 'luxury' ? 1.65 : tier === 'premium' ? 1.3 : 1.0;
  
  // Base cost per sq ft in 2026 market rates
  const baseRate = request.projectType === 'commercial' ? 225 : 165;
  let estimatedTotal = Math.round(sqFt * baseRate * tierMultiplier);

  // If user specified a budget, blend it with the calculated estimate
  if (request.budget && request.budget > 0) {
    estimatedTotal = Math.round(request.budget * 0.4 + estimatedTotal * 0.6);
  }

  // Adjust for contingency if set
  const contingency = request.contingencyPercent || 10;
  const contingencyAmount = Math.round(estimatedTotal * (contingency / 100));

  const isCommercial = request.projectType === 'commercial';

  // Cost categories breakdown
  const laborPct = isCommercial ? 38 : 42;
  const materialsPct = isCommercial ? 32 : 30;
  const permitsPct = isCommercial ? 8 : 5;
  const overheadPct = isCommercial ? 12 : 13;
  const profitPct = 100 - (laborPct + materialsPct + permitsPct + overheadPct);

  const breakdown = [
    { category: 'Trade Labor & Specialized Subcontractors', amount: Math.round(estimatedTotal * (laborPct / 100)), percentage: laborPct },
    { category: 'Structural & Finish Materials', amount: Math.round(estimatedTotal * (materialsPct / 100)), percentage: materialsPct },
    { category: 'Municipal Permits & Compliance', amount: Math.round(estimatedTotal * (permitsPct / 100)), percentage: permitsPct },
    { category: 'Site Overhead & Logistics', amount: Math.round(estimatedTotal * (overheadPct / 100)), percentage: overheadPct },
    { category: 'Contractor Margin & Risk Premium', amount: Math.round(estimatedTotal * (profitPct / 100)), percentage: profitPct }
  ];

  // Timeline calculation
  const timelineWeeks = Math.max(4, Math.round(sqFt / (isCommercial ? 220 : 140) * (tier === 'luxury' ? 1.4 : 1.0)));

  // ROI Projections over 5 Years
  const startVal = Math.round(estimatedTotal * 1.08);
  const annualAppreciation = isCommercial ? 0.065 : 0.055;
  const roiData = Array.from({ length: 5 }, (_, i) => {
    const yr = i + 1;
    const val = Math.round(startVal * Math.pow(1 + annualAppreciation, yr));
    return { year: yr, value: val };
  });

  const locationName = request.location || 'Local Regional District';

  const pros = [
    `High market demand in ${locationName} ensures strong equity capture upon project completion.`,
    `${request.projectType === 'commercial' ? 'Favorable tax depreciation schedules for commercial capital improvements.' : 'Increases overall residential appraisal value by an estimated 18-24%.'}`,
    'Modern energy-efficient envelope specifications reduce ongoing utility operational expenses by up to 30%.'
  ];

  const cons = [
    `Local sub-trade labor availability in ${locationName} may introduce potential 2-3 week scheduling variance.`,
    'Lead times on specialty finish materials require early procurement locks to avoid material escalation fees.',
    `Permit processing timelines with municipal authorities in ${locationName} require proactive submission.`
  ];

  const hacks = [
    'Lock in primary lumber, steel, and MEP material orders 45 days prior to ground-breaking to mitigate price inflation.',
    'Utilize value engineering on interior non-structural finishes to preserve 12% margin for unforeseen structural conditions.',
    'Structure contractor payment terms tied strictly to verified milestone sign-offs rather than calendar dates.'
  ];

  const detailedAnalysis = `### Executive Summary & Technical Scope Analysis
The proposed **${request.projectType.toUpperCase()}** development located in **${locationName}** has been analyzed using BuildEstimate AI's 2026 market calibration engine.

#### Scope Overview
- **Project Type**: ${request.projectType === 'commercial' ? 'Commercial Grade Construction' : 'Residential High-Specification Build'}
- **Estimated Area**: ${sqFt.toLocaleString()} sq ft
- **Quality Specification**: ${tier.toUpperCase()} Tier
- **Baseline Projected Investment**: $${estimatedTotal.toLocaleString()}
- **Contingency Buffer (${contingency}%)**: $${contingencyAmount.toLocaleString()}
- **Estimated Execution Timeline**: ~${timelineWeeks} calendar weeks

#### Cost Allocation Strategy
1. **Trade Labor & Supervision ($${breakdown[0].amount.toLocaleString()})**: Represents ${laborPct}% of total budget. Factors in localized trade rates for framing, electrical, plumbing, and HVAC installations.
2. **Materials & Assemblies ($${breakdown[1].amount.toLocaleString()})**: Covers foundation concrete, structural framing, exterior envelope cladding, and high-efficiency window packages.
3. **Regulatory & Permits ($${breakdown[2].amount.toLocaleString()})**: Allocates funds for zoning approvals, environmental impact compliance, and utility connection fees in ${locationName}.
4. **Site Overhead & Equipment ($${breakdown[3].amount.toLocaleString()})**: Includes temp power, scaffolding, waste management, dumpster rentals, and site security.

#### Financial ROI & Value Engineering
With an initial appraisal boost upon milestone completion, the project is projected to yield **$${roiData[4].value.toLocaleString()}** in cumulative asset value by Year 5, representing an attractive long-term capital allocation.`;

  return {
    totalEstimate: estimatedTotal,
    breakdown,
    roiData,
    timelineWeeks,
    pros,
    cons,
    hacks,
    detailedAnalysis,
    source: 'offline',
    sourceMessage: 'Calibrated Offline Estimation Engine'
  };
}
