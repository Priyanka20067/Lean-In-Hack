const KEYWORDS = {
    Paranormal: {
        high: ['monster', 'demogorgon', 'gate', 'upside down', 'fleece', 'shadow', 'tentacle', 'portal'],
        medium: ['lights', 'flickering', 'noise', 'static', 'electrical', 'magnetic'],
        low: ['weird', 'strange', 'cold', 'missing']
    },
    Health: {
        high: ['blood', 'unconscious', 'breathing', 'seizure', 'collapsed', 'poison', 'bite', 'death', 'hospital', 'doctor', 'ambulance', 'clinic'],
        medium: ['sick', 'fever', 'vomit', 'pain', 'infection', 'slime', 'rash', 'medicine', 'patient'],
        low: ['cough', 'dizzy', 'tired', 'headache', 'pharmacy', 'checkup']
    },
    Governance: {
        high: ['illegal', 'weapon', 'spy', 'russian', 'lab', 'hawkins power', 'military', 'conspiracy', 'government', 'cia', 'fbi', 'department of energy'],
        medium: ['theft', 'break-in', 'vandalism', 'shutdown', 'curfew', 'police', 'sheriff', 'mayor'],
        low: ['noise', 'litter', 'graffiti', 'protest', 'town hall', 'meeting']
    },
    Employment: {
        high: ['fired', 'layoff', 'closed', 'bankrupt', 'starcourt', 'unemployed', 'termination', 'unemployment'],
        medium: ['job', 'work', 'salary', 'hiring', 'interview', 'career', 'office', 'factory', 'store'],
        low: ['resume', 'training', 'skill', 'degree', 'application', 'commute']
    }
};

export const analyzeAnomaly = (text) => {
    const lowerText = text.toLowerCase();
    let maxScore = 0;
    let detectedType = 'Unknown';
    let detectedUrgency = 'Low';

    const categories = Object.keys(KEYWORDS);

    categories.forEach(category => {
        let score = 0;

        // Check High Urgency Keywords (Weight: 5)
        KEYWORDS[category].high.forEach(word => {
            if (lowerText.includes(word)) {
                score += 5;
                detectedUrgency = 'High';
            }
        });

        // Check Medium Urgency Keywords (Weight: 3)
        KEYWORDS[category].medium.forEach(word => {
            if (lowerText.includes(word)) {
                score += 3;
                if (detectedUrgency === 'Low') detectedUrgency = 'Medium';
            }
        });

        // Check Low Urgency Keywords (Weight: 1)
        KEYWORDS[category].low.forEach(word => {
            if (lowerText.includes(word)) {
                score += 1;
            }
        });

        if (score > maxScore) {
            maxScore = score;
            detectedType = category;
        }
    });

    if (maxScore === 0) {
        return {
            type: 'Unidentified',
            urgency: 'Low',
            confidence: 10
        };
    }

    // Calculate confidence based on score density
    const confidence = Math.min((maxScore / 10) * 100, 100);

    return {
        type: detectedType,
        urgency: detectedUrgency,
        confidence: Math.round(confidence)
    };
};
