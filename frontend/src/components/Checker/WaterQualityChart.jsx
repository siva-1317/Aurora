import React from "react";
import { CheckCircle, AlertTriangle, XCircle, Shield, Droplets, Activity } from "lucide-react";

const WaterQualityChart = ({ waterQuality, advice }) => {
  const getQualityStyles = () => {
    switch (waterQuality) {
      case "Good":
        return {
          bg: "from-green-50 via-emerald-50 to-green-50",
          border: "border-green-300",
          text: "text-green-700",
          ring: "ring-green-200",
          accent: "bg-green-500",
          icon: <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />,
          statusColor: "text-green-800"
        };
      case "Fair":
        return {
          bg: "from-amber-50 via-yellow-50 to-orange-50",
          border: "border-amber-300",
          text: "text-amber-700",
          ring: "ring-amber-200",
          accent: "bg-amber-500",
          icon: <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600" />,
          statusColor: "text-amber-800"
        };
      default:
        return {
          bg: "from-red-50 via-pink-50 to-red-50",
          border: "border-red-300",
          text: "text-red-700",
          ring: "ring-red-200",
          accent: "bg-red-500",
          icon: <XCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600" />,
          statusColor: "text-red-800"
        };
    }
  };

  const styles = getQualityStyles();

  // Count positive vs negative findings
  const positiveCount = advice.filter(tip => tip.includes("✅")).length;
  const totalCount = advice.length;
  const qualityPercentage = totalCount > 0 ? (positiveCount / totalCount * 100) : 0;

  const getAdviceIcon = (tip) => {
    if (tip.includes("✅")) return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
    if (tip.includes("⚠️")) return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />;
    if (tip.includes("🔍")) return <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
    if (tip.includes("💧")) return <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />;
    return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
  };

  const getAdviceStyles = (tip) => {
    if (tip.includes("✅")) {
      return {
        bg: "from-green-50 to-emerald-50",
        border: "border-green-200",
        text: "text-green-800"
      };
    }
    if (tip.includes("⚠️")) {
      return {
        bg: "from-orange-50 to-amber-50",
        border: "border-orange-200",
        text: "text-orange-800"
      };
    }
    if (tip.includes("🔍")) {
      return {
        bg: "from-blue-50 to-cyan-50",
        border: "border-blue-200",
        text: "text-blue-800"
      };
    }
    if (tip.includes("💧")) {
      return {
        bg: "from-cyan-50 to-blue-50",
        border: "border-cyan-200",
        text: "text-cyan-800"
      };
    }
    return {
      bg: "from-red-50 to-pink-50",
      border: "border-red-200",
      text: "text-red-800"
    };
  };

  return (
    <div className={`w-full max-w-none mx-auto`}>
      <div className={`p-4 sm:p-5 md:p-6 lg:p-8 rounded-2xl bg-gradient-to-br ${styles.bg} border-2 ${styles.border} shadow-xl relative overflow-hidden`}>
        
        {/* Decorative elements - hidden on mobile for cleaner look */}
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/20 rounded-full -translate-y-10 sm:-translate-y-16 translate-x-10 sm:translate-x-16 hidden sm:block"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full translate-y-8 sm:translate-y-12 -translate-x-8 sm:-translate-x-12 hidden sm:block"></div>

        {/* Header Section */}
        <div className="relative z-10 mb-6">
          {/* Main Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Title and Icon */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`p-2 sm:p-3 bg-white/80 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0`}>
                {styles.icon}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 leading-tight">
                  Water Quality Assessment
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Comprehensive parameter analysis
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-white/90 ${styles.border} border-2 shadow-lg flex-shrink-0 self-start sm:self-center`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${styles.accent} animate-pulse`}></div>
                <span className={`text-lg sm:text-xl font-bold ${styles.statusColor}`}>
                  {waterQuality}
                </span>
              </div>
            </div>
          </div>

          {/* Quality Score Visualization */}
          <div className="bg-white/60 backdrop-blur-sm p-4 sm:p-5 rounded-xl border border-white/40">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-700 text-sm sm:text-base">
                Overall Quality Score
              </span>
              <span className={`text-lg sm:text-xl font-bold ${styles.statusColor}`}>
                {qualityPercentage.toFixed(0)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  qualityPercentage >= 75 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  qualityPercentage >= 50 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${qualityPercentage}%` }}
              ></div>
            </div>
            
            {/* Progress Labels */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>Critical</span>
              <span>Fair</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>

        {/* Advice Section */}
        <div className="relative z-10">
          {/* Section Header */}
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className={`w-1 h-5 sm:h-6 ${styles.accent} rounded`}></div>
            Parameter Analysis Results
          </h3>

          {/* Advice Cards Grid */}
          <div className="space-y-3">
            {advice.map((tip, index) => {
              const adviceStyle = getAdviceStyles(tip);
              const cleanTip = tip.replace(/[✅⚠️🔍💧🌡️]/g, "").trim();
              
              return (
                <div
                  key={index}
                  className={`group p-3 sm:p-4 rounded-xl border-2 bg-gradient-to-r ${adviceStyle.bg} ${adviceStyle.border} transition-all duration-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {getAdviceIcon(tip)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`${adviceStyle.text} font-medium leading-relaxed text-sm sm:text-base break-words`}>
                        {cleanTip}
                      </p>
                      
                      {/* Parameter-specific indicators */}
                      {tip.includes("pH") && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-gray-600">pH Level Analysis</span>
                        </div>
                      )}
                      {tip.includes("TDS") && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-gray-600">Dissolved Solids Check</span>
                        </div>
                      )}
                      {tip.includes("turbidity") && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-gray-600">Clarity Assessment</span>
                        </div>
                      )}
                      {tip.includes("temperature") && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                          <span className="text-xs text-gray-600">Temperature Check</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 p-4 sm:p-5 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {positiveCount}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  Optimal
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-orange-600">
                  {totalCount - positiveCount}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  Needs Attention
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {totalCount}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  Total Checked
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterQualityChart;