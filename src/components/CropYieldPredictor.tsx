import React, { useState } from 'react';
import { Brain, TrendingUp, DollarSign, Calendar, AlertCircle, CheckCircle, Lightbulb, MapPin } from 'lucide-react';
import { cropDatabase } from '../data/crops';
import { CropSelector } from './CropSelector';
import { FarmDetails, FarmDetails as FarmDetailsType } from './FarmDetails';
import { SoilAnalysis, SoilAnalysis as SoilAnalysisType } from './SoilAnalysis';
import WeatherMap from './WeatherMap';

interface CropYieldPredictorProps {
  selectedLocation?: { lat: number; lng: number; name: string } | null;
}

export const CropYieldPredictor: React.FC<CropYieldPredictorProps> = ({ selectedLocation: propSelectedLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; name: string } | null>(propSelectedLocation || null);
  const [selectedCrop, setSelectedCrop] = useState<{ category: string; name: string } | null>(null);
  const [farmDetails, setFarmDetails] = useState<FarmDetailsType | null>(null);
  const [soilAnalysis, setSoilAnalysis] = useState<SoilAnalysisType | null>(null);

  // Check if all required data is available
  const isDataComplete = selectedLocation && selectedCrop && farmDetails && soilAnalysis;

  // Get crop data for selected crop
  const selectedCropData = selectedCrop
    ? cropDatabase.find(crop => crop.name.toLowerCase() === selectedCrop.name.toLowerCase())
    : null;

  // Dynamically compute AI prediction results
  const predictionResults = isDataComplete && selectedCropData && farmDetails
    ? (() => {
        const area = parseFloat(String(farmDetails.area)) || 1;

        // Soil quality multiplier
        const soilQualityMap: Record<string, number> = {
          excellent: 1.2,
          good: 1.0,
          fair: 0.8,
          poor: 0.6,
        };
        const soilMultiplier = soilQualityMap[(soilAnalysis.overallQuality || 'good').toLowerCase()] ?? 1.0;

        // pH adjustment
        const phIdeal = soilAnalysis.phLevel >= 6.0 && soilAnalysis.phLevel <= 7.5;
        const phMultiplier = phIdeal ? 1.0 : 0.9;

        // Nitrogen adjustment
        const nitrogenMultiplier = soilAnalysis.nitrogen >= 50 ? 1.05 : soilAnalysis.nitrogen >= 30 ? 1.0 : 0.92;

        // Base yield per hectare (1 acre = 0.4047 ha)
        const baseYieldPerHa = selectedCropData.avgYield ?? (selectedCropData.marketPrice < 50 ? 20 : 8);
        const adjustedYieldPerHa = baseYieldPerHa * soilMultiplier * phMultiplier * nitrogenMultiplier;
        const totalYieldTonnes = parseFloat((adjustedYieldPerHa * area * 0.4047).toFixed(2));

        // Market value
        const pricePerKg = selectedCropData.marketPrice;
        const pricePerTonne = pricePerKg * 1000;
        const totalRevenue = Math.round(totalYieldTonnes * pricePerTonne);

        // Cost estimate (approx 40% of revenue)
        const estimatedCost = Math.round(totalRevenue * 0.4);
        const netProfit = totalRevenue - estimatedCost;
        const roi = estimatedCost > 0 ? Math.round((netProfit / estimatedCost) * 100) : 0;

        // Survival probability
        const baseProbability = 85;
        const phPenalty = phIdeal ? 0 : -8;
        const soilPenalty = soilMultiplier >= 1.0 ? 0 : soilMultiplier >= 0.8 ? -5 : -15;
        const survivalProbability = Math.max(40, Math.min(97, baseProbability + phPenalty + soilPenalty));

        // Harvest date
        const harvestDate = new Date();
        harvestDate.setDate(harvestDate.getDate() + (selectedCropData.growthDays || 90));
        const optimalMonth = harvestDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

        // Dynamic risk factors
        const riskFactors = [
          {
            factor: 'Weather Dependency',
            level: selectedCropData.waterRequirement === 'high' ? 'High' : 'Medium',
            description: selectedCropData.waterRequirement === 'high'
              ? 'High water requirement makes this crop vulnerable to monsoon variations'
              : 'Moderate sensitivity to weather; plan irrigation accordingly',
          },
          {
            factor: 'Soil pH Balance',
            level: phIdeal ? 'Low' : 'Medium',
            description: phIdeal
              ? `pH ${soilAnalysis.phLevel} is within optimal range for ${selectedCropData.name}`
              : `pH ${soilAnalysis.phLevel} is outside ideal 6.0–7.5 range; consider soil amendment`,
          },
          {
            factor: 'Market Volatility',
            level: selectedCropData.marketPrice < 30 ? 'High' : selectedCropData.marketPrice < 70 ? 'Medium' : 'Low',
            description: `${selectedCropData.name} market price (₹${selectedCropData.marketPrice}/kg) may fluctuate during harvest season`,
          },
          {
            factor: 'Nitrogen Availability',
            level: soilAnalysis.nitrogen >= 50 ? 'Low' : soilAnalysis.nitrogen >= 30 ? 'Medium' : 'High',
            description: soilAnalysis.nitrogen >= 50
              ? 'Good nitrogen levels support healthy crop growth'
              : soilAnalysis.nitrogen >= 30
              ? 'Moderate nitrogen; consider top dressing with fertiliser'
              : 'Low nitrogen detected — apply nitrogenous fertilisers before sowing',
          },
        ];

        // Dynamic recommendations
        const recommendations: string[] = [
          `Plant ${selectedCropData.name} in ${selectedCropData.seasons?.join(' or ')} season for best results`,
        ];
        if (!phIdeal) recommendations.push('Amend soil pH using lime (for acidic) or gypsum (for alkaline) before planting');
        if (soilAnalysis.nitrogen < 30) recommendations.push('Apply urea or compost to boost nitrogen levels before sowing');
        if (soilAnalysis.organicMatter < 2) recommendations.push('Add organic matter (FYM/vermicompost) to improve soil structure');
        if (selectedCropData.waterRequirement === 'high') recommendations.push('Install drip or sprinkler irrigation to manage high water needs efficiently');
        recommendations.push('Use integrated pest management (IPM) to reduce pesticide costs');
        recommendations.push('Consider crop insurance to protect against weather-related losses');
        if (soilAnalysis.phosphorus < 30) recommendations.push('Apply phosphatic fertiliser (DAP/SSP) to improve root development');
        recommendations.push(`Plan harvest for ${optimalMonth} and pre-book buyers to secure better prices`);

        return {
          survivalProbability,
          expectedYield: { quantity: totalYieldTonnes, unit: 'tonnes (total farm)' },
          marketValue: { pricePerUnit: pricePerTonne, totalValue: totalRevenue, currency: 'INR' },
          harvestTime: { duration: selectedCropData.growthDays || 90, optimalMonth },
          netProfit: { amount: netProfit, roi },
          riskFactors,
          recommendations: recommendations.slice(0, 6),
        };
      })()
    : null;

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600 bg-green-50';
    if (probability >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Crop Yield Predictor</h1>
        <p className="text-gray-600">
          Get AI-powered predictions for your crop yield based on comprehensive analysis
        </p>
      </div>

      <div className="space-y-8">
        {/* Weather Map */}
        <WeatherMap onLocationSelect={setSelectedLocation} selectedLocation={selectedLocation} />

        {/* Crop Selector */}
        <CropSelector onCropSelect={setSelectedCrop} selectedCrop={selectedCrop} />

        {/* Farm Details */}
        <FarmDetails onDetailsUpdate={setFarmDetails} farmDetails={farmDetails} />

        {/* Soil Analysis */}
        <SoilAnalysis onAnalysisUpdate={setSoilAnalysis} soilAnalysis={soilAnalysis} />

        {/* AI Prediction Results */}
        {!isDataComplete ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Brain className="w-6 h-6 text-purple-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">AI Crop Prediction Results</h2>
            </div>
            <div className="text-center text-gray-500 py-12">
              <Brain className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Complete all sections to get AI predictions</p>
              <p className="text-sm">Provide location, crop selection, farm details, and soil analysis.</p>

              {/* Progress Checklist */}
              <div className="mt-8 max-w-md mx-auto">
                <div className="space-y-3 text-left">
                  {[
                    { done: !!selectedLocation, label: 'Select location on map' },
                    { done: !!selectedCrop, label: 'Choose crop type' },
                    { done: !!(farmDetails?.state), label: 'Enter farm details' },
                    { done: !!(soilAnalysis?.overallQuality), label: 'Provide soil analysis' },
                  ].map(({ done, label }) => (
                    <div key={label} className={`flex items-center p-3 rounded-lg ${done ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                      {done ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center">
                <Brain className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">AI Crop Prediction Results</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedLocation && (
                  <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{selectedLocation.name}</span>
                  </div>
                )}
                {selectedCrop && (
                  <div className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-lg text-sm font-medium">
                    🌾 {selectedCrop.name}
                  </div>
                )}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`p-6 rounded-lg text-center ${getProbabilityColor(predictionResults!.survivalProbability)}`}>
                <TrendingUp className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Survival Probability</h3>
                <p className="text-3xl font-bold">{predictionResults!.survivalProbability}%</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-blue-700 mb-2">Expected Yield</h3>
                <p className="text-3xl font-bold text-blue-800">{predictionResults!.expectedYield.quantity}</p>
                <p className="text-sm text-blue-600">{predictionResults!.expectedYield.unit}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold text-green-700 mb-2">Market Value</h3>
                <p className="text-3xl font-bold text-green-800">₹{predictionResults!.marketValue.totalValue.toLocaleString()}</p>
                <p className="text-sm text-green-600">₹{predictionResults!.marketValue.pricePerUnit.toLocaleString()}/tonne</p>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg text-center">
                <Calendar className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                <h3 className="font-semibold text-orange-700 mb-2">Harvest Time</h3>
                <p className="text-3xl font-bold text-orange-800">{predictionResults!.harvestTime.duration}</p>
                <p className="text-sm text-orange-600">days · {predictionResults!.harvestTime.optimalMonth}</p>
              </div>
            </div>

            {/* Net Profit */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Profit Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estimated Net Profit</p>
                  <p className={`text-3xl font-bold ${predictionResults!.netProfit.amount >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    ₹{predictionResults!.netProfit.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Return on Investment</p>
                  <p className="text-3xl font-bold text-blue-700">{predictionResults!.netProfit.roi}%</p>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Risk Factors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {predictionResults!.riskFactors.map((risk, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getRiskColor(risk.level)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{risk.factor}</h4>
                      <span className="text-xs font-bold px-2 py-1 rounded-full">
                        {risk.level.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                AI Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {predictionResults!.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
