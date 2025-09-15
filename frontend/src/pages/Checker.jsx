'use client'
import { useState } from "react";
import { ThemeProvider, Box } from "@mui/material";
import WeatherContaminationButton from "../components/Checker/WeatherContaminationButton";
import { lightTheme, darkTheme } from "../themeContext";
import WaterCharts from "../components/Checker/WaterCharts";
import AiButtons from "../components/Checker/AiButton";
import WaterQualityChart from "../components/Checker/WaterQualityChart";
import DiseaseScreen from "../components/Checker/DiseaseScreen";
import { CheckCircle, Droplet } from "lucide-react";

const COLORS = ['#0088FE', '#e1128fff', '#FFBB28', '#FF8042'];

export default function WaterAdvisorApp({ isDark, toggleTheme }) {
  const [ph, setPh] = useState(7);
  const [tds, setTds] = useState(100);
  const [turbidity, setTurbidity] = useState(1);
  const [temperature, setTemperature] = useState(25);
  const [advice, setAdvice] = useState([]);
  const [waterQuality, setWaterQuality] = useState("Good");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeAiButton, setActiveAiButton] = useState("");

  function getPurificationAdvice(ph, tds, turbidity, temperature) {
    let tips = [];
    let qualityScore = 0;
    
    if (ph < 6.5) {
      tips.push("⚠️ pH is too low (acidic). Add alkaline substances or use a neutralizer.");
      qualityScore += 2;
    } else if (ph > 8.5) {
      tips.push("⚠️ pH is too high (alkaline). Add acidic substances or use a neutralizer.");
      qualityScore += 2;
    } else {
      tips.push("✅ pH level is optimal.");
    }

    if (tds < 50) {
      tips.push("💧 TDS is very low. Water may lack beneficial minerals.");
      qualityScore += 1;
    } else if (tds > 500) {
      tips.push("💧 TDS is too high. Use RO filter to reduce dissolved salts.");
      qualityScore += 3;
    } else if (tds > 300) {
      tips.push("💧 TDS is moderately high. Consider using a water filter.");
      qualityScore += 2;
    } else {
      tips.push("✅ TDS level is optimal.");
    }

    if (turbidity > 5) {
      tips.push("🔍 High turbidity detected. Filter with ceramic/cloth filter before boiling.");
      qualityScore += 3;
    } else if (turbidity > 1) {
      tips.push("🔍 Moderate turbidity. Let water settle before filtration.");
      qualityScore += 1;
    } else {
      tips.push("✅ Turbidity level is optimal.");
    }

    if (temperature > 30) {
      tips.push("🌡️ Water temperature is high. This may promote bacterial growth.");
      qualityScore += 1;
    } else if (temperature < 10) {
      tips.push("🌡️ Water temperature is very cold. This may affect taste.");
    } else {
      tips.push("✅ Temperature is within acceptable range.");
    }

    let qualityStatus;
    if (qualityScore >= 6) {
      qualityStatus = "Poor";
    } else if (qualityScore >= 3) {
      qualityStatus = "Fair";
    } else {
      qualityStatus = "Good";
    }

    setWaterQuality(qualityStatus);
    return tips;
  }

  const handleCheck = () => {
    const result = getPurificationAdvice(ph, tds, turbidity, temperature);
    setAdvice(result);
    setAiResponse("");
  };

  const handleAiRequest = async (type) => {
    setIsLoading(true);
    setActiveAiButton(type);
    setAiResponse("");

    try {
      const response = await getAiResponse({
        type,
        ph: ph,
        tds: tds,
        turbidity: turbidity,
        temperature: temperature
      });
      setAiResponse(response);
    } catch (err) {
      setAiResponse("Sorry, we couldn't generate AI advice at this time.");
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = [
    { name: "pH", value: ph, min: 6.5, max: 8.5 },
    { name: "TDS", value: tds, max: 500 },
    { name: "Turbidity", value: turbidity, max: 5 },
    { name: "Temperature", value: temperature, min: 10, max: 30 }
  ];

  const qualityData = advice.length > 0 ? [
    { name: 'Optimal', value: 4 - advice.filter(a => a.includes("⚠️") || a.includes("🔍") || a.includes("💧") || a.includes("🌡️")).length },
    { name: 'Needs Attention', value: advice.filter(a => a.includes("⚠️") || a.includes("🔍") || a.includes("💧") || a.includes("🌡️")).length }
  ] : [];

  const currentTheme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <Box sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        
        {/* Main Container */}
        <Box sx={{ 
          width: "100%", 
          maxWidth: { xs: "100%", sm: "600px", md: "900px", lg: "1000px" }, 
          mx: "auto" 
        }}>
          
          {/* Header Section */}
          <Box sx={{ 
            textAlign: "center", 
            mb: { xs: 3, md: 4 },
            px: { xs: 1, sm: 0 }
          }}>
            <Box sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 1, sm: 1.5 },
              mb: 1,
              flexWrap: "wrap"
            }}>
              <Droplet size={28} style={{ 
                color: currentTheme.palette.primary.main,
                flexShrink: 0
              }} />
              <Box component="h1" sx={{ 
                fontWeight: 700, 
                fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" }, 
                color: "text.primary",
                margin: 0,
                lineHeight: 1.2
              }}>
                Smart Water Quality Advisor
              </Box>
            </Box>
          </Box>

          {/* Main Content Card */}
          <Box sx={{
            bgcolor: "background.paper",
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            boxShadow: 3,
            width: "100%"
          }}>
            
            {/* Input Controls Section */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{
                display: "grid",
                gridTemplateColumns: { 
                  xs: "1fr", 
                  sm: "1fr 1fr", 
                  md: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)" 
                },
                gap: { xs: 3, sm: 2.5, md: 3 },
                alignItems: "start"
              }}>
                
                {/* pH Control */}
                <Box sx={{ width: "100%" }}>
                  <Box component="label" sx={{ 
                    fontWeight: 600, 
                    color: "primary.main",
                    display: "block",
                    mb: 1.5,
                    fontSize: { xs: "0.9rem", sm: "1rem" }
                  }}>
                    pH Value (6.5-8.5)
                  </Box>
                  <input 
                    type="range" 
                    min="0" 
                    max="14" 
                    step="0.1" 
                    value={ph} 
                    onChange={(e) => setPh(Number(e.target.value))} 
                    style={{ 
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      outline: "none",
                      cursor: "pointer"
                    }} 
                  />
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    color: "text.primary",
                    mt: 1,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" }
                  }}>
                    <span>0</span>
                    <Box component="span" sx={{ 
                      fontWeight: "bold",
                      color: "primary.main",
                      fontSize: { xs: "0.9rem", sm: "1rem" }
                    }}>
                      {ph}
                    </Box>
                    <span>14</span>
                  </Box>
                </Box>

                {/* TDS Control */}
                <Box sx={{ width: "100%" }}>
                  <Box component="label" sx={{ 
                    fontWeight: 600, 
                    color: "primary.main",
                    display: "block",
                    mb: 1.5,
                    fontSize: { xs: "0.9rem", sm: "1rem" }
                  }}>
                    TDS (ppm) &lt;500
                  </Box>
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={tds} 
                    onChange={(e) => setTds(Number(e.target.value))} 
                    style={{ 
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      outline: "none",
                      cursor: "pointer"
                    }} 
                  />
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    color: "text.primary",
                    mt: 1,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" }
                  }}>
                    <span>0</span>
                    <Box component="span" sx={{ 
                      fontWeight: "bold",
                      color: "primary.main",
                      fontSize: { xs: "0.9rem", sm: "1rem" }
                    }}>
                      {tds} ppm
                    </Box>
                    <span>1000</span>
                  </Box>
                </Box>

                {/* Turbidity Control */}
                <Box sx={{ width: "100%" }}>
                  <Box component="label" sx={{ 
                    fontWeight: 600, 
                    color: "primary.main",
                    display: "block",
                    mb: 1.5,
                    fontSize: { xs: "0.9rem", sm: "1rem" }
                  }}>
                    Turbidity (NTU) &lt;5
                  </Box>
                  <input 
                    type="range" 
                    min="0" 
                    max="10" 
                    step="0.1" 
                    value={turbidity} 
                    onChange={(e) => setTurbidity(Number(e.target.value))} 
                    style={{ 
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      outline: "none",
                      cursor: "pointer"
                    }} 
                  />
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    color: "text.primary",
                    mt: 1,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" }
                  }}>
                    <span>0</span>
                    <Box component="span" sx={{ 
                      fontWeight: "bold",
                      color: "primary.main",
                      fontSize: { xs: "0.9rem", sm: "1rem" }
                    }}>
                      {turbidity} NTU
                    </Box>
                    <span>10</span>
                  </Box>
                </Box>

                {/* Temperature Control */}
                <Box sx={{ width: "100%" }}>
                  <Box component="label" sx={{ 
                    fontWeight: 600, 
                    color: "primary.main",
                    display: "block",
                    mb: 1.5,
                    fontSize: { xs: "0.9rem", sm: "1rem" }
                  }}>
                    Temperature (°C) 10-30
                  </Box>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    value={temperature} 
                    onChange={(e) => setTemperature(Number(e.target.value))} 
                    style={{ 
                      width: "100%",
                      height: "6px",
                      borderRadius: "3px",
                      outline: "none",
                      cursor: "pointer"
                    }} 
                  />
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    color: "text.primary",
                    mt: 1,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" }
                  }}>
                    <span>0</span>
                    <Box component="span" sx={{ 
                      fontWeight: "bold",
                      color: "primary.main",
                      fontSize: { xs: "0.9rem", sm: "1rem" }
                    }}>
                      {temperature}°C
                    </Box>
                    <span>50</span>
                  </Box>
                </Box>
                
              </Box>
            </Box>

            {/* Analyze Button */}
            <Box sx={{ mb: 4 }}>
              <button
                onClick={handleCheck}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  backgroundColor: currentTheme.palette.primary.main,
                  color: currentTheme.palette.primary.contrastText,
                  fontWeight: "600",
                  fontSize: "1rem",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.2s ease-in-out"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDark ? '#2191d9' : '#0f2bb5';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = currentTheme.palette.primary.main;
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <CheckCircle size={18} />
                Analyze Water Quality
              </button>
            </Box>

            {/* Results Section */}
            {advice.length > 0 && (
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column", 
                gap: { xs: 3, md: 4 } 
              }}>
                
                {/* Quality Status Chart */}
                <Box sx={{ width: "100%" }}>
                  <WaterQualityChart waterQuality={waterQuality} advice={advice} />
                </Box>

                {/* Water Charts */}
                <Box sx={{ width: "100%" }}>
                  <WaterCharts chartData={chartData} qualityData={qualityData} COLORS={COLORS} />
                </Box>

                {/* AI Buttons Section */}
                <Box sx={{ width: "100%" }}>
                  <AiButtons
                    handleAiRequest={handleAiRequest}
                    isLoading={isLoading}
                    activeAiButton={activeAiButton}
                  />
                </Box>

                {/* Disease Analysis and Weather Section */}
                <Box sx={{ 
                  display: "flex", 
                  gap: { xs: 2, md: 3 },
                  flexDirection: { xs: "column", sm: "row" },
                  width: "100%"
                }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <DiseaseScreen ph={ph} tds={tds} turbidity={turbidity} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <WeatherContaminationButton turbidity={turbidity} />
                  </Box>
                </Box>
                
              </Box>
            )}

            {/* AI Response Section */}
            {aiResponse && (
              <Box sx={{
                mt: 5,
                mb: 4,
                width: "100%"
              }}>
                {/* AI Response Card */}
                <Box sx={{
                  p: { xs: 3, sm: 4 },
                  bgcolor: isDark ? "rgba(55, 182, 246, 0.08)" : "rgba(21, 58, 234, 0.04)",
                  borderRadius: 3,
                  border: `2px solid ${currentTheme.palette.primary.main}`,
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  {/* Decorative Background */}
                  <Box sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    background: `linear-gradient(135deg, ${currentTheme.palette.primary.main}20, transparent)`,
                    borderRadius: "0 0 0 100px"
                  }} />
                  
                  {/* Header */}
                  <Box sx={{ 
                    fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.7rem" }, 
                    fontWeight: "bold", 
                    mb: 3, 
                    color: "primary.main",
                    display: "flex", 
                    alignItems: "center",
                    gap: 1.5,
                    flexWrap: "wrap",
                    position: "relative",
                    zIndex: 1
                  }}>
                    {activeAiButton === "prevention" ? "🛡️ AI Prevention Advice" : 
                     activeAiButton === "filtration" ? "💧 AI Filtration Solutions" : 
                     "💰 AI Cost Analysis"}
                  </Box>

                  {/* Response Content */}
                  <Box sx={{
                    p: { xs: 3, sm: 4 },
                    bgcolor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.7)",
                    borderRadius: 2,
                    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.8,
                    color: "text.primary",
                    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
                    fontSize: { xs: "14px", sm: "15px", md: "16px" },
                    boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                    minHeight: "120px",
                    position: "relative",
                    zIndex: 1,
                    backdropFilter: "blur(10px)"
                  }}>
                    {aiResponse}
                  </Box>

                  {/* Footer Note */}
                  <Box sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}`,
                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                    color: "text.secondary",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1
                  }}>
                    💡 AI-generated recommendations based on your water parameters
                  </Box>
                </Box>
              </Box>
            )}
            
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}