export const analyzeAnomaly = (text) => {
    const lowerText = text.toLowerCase();

    let type = "General";
    let urgency = "Low";

    // Categorization Rules
    if (lowerText.match(/road|pothole|street|bridge|traffic/)) {
        type = "Governance (Infrastructure)";
    } else if (lowerText.match(/water|leak|drain|flood|sewage/)) {
        type = "Governance (Water/Sanitation)";
    } else if (lowerText.match(/trash|garbage|dirt|clean/)) {
        type = "Environment";
    } else if (lowerText.match(/sick|doctor|hospital|medicine|flu|virus/)) {
        type = "Health";
        urgency = "High";
    } else if (lowerText.match(/job|work|skill|salary|employ/)) {
        type = "Employment";
    } else if (lowerText.match(/fire|accident|danger|help|emergency/)) {
        type = "Emergency";
        urgency = "Critical";
    } else if (lowerText.match(/demogorgon|upside down|gate|mind flayer|vecna/)) {
        type = "Paranormal";
        urgency = "Code Red";
    }

    return { type, urgency, timestamp: Date.now() };
};
