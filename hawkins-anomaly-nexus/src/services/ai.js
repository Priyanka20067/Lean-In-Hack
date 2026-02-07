const KEYWORDS = {
    Paranormal: {
        high: ['monster', 'demogorgon', 'gate', 'upside down', 'fleece', 'shadow', 'tentacle', 'portal', 'rifts', 'creature'],
        medium: ['lights', 'flickering', 'noise', 'static', 'electrical', 'magnetic', 'compass', 'batteries'],
        low: ['weird', 'strange', 'cold', 'missing'],
        color: '#a855f7' // Purple/Accent
    },
    'Health Tech': {
        high: ['blood', 'unconscious', 'breathing', 'seizure', 'collapsed', 'poison', 'bite', 'death', 'hospital', 'doctor', 'ambulance', 'clinic', 'virus', 'infection'],
        medium: ['sick', 'fever', 'vomit', 'pain', 'infection', 'slime', 'rash', 'medicine', 'patient'],
        low: ['cough', 'dizzy', 'tired', 'headache', 'pharmacy', 'checkup'],
        color: '#ef4444' // Red/Danger
    },
    'Government': {
        high: ['illegal', 'weapon', 'spy', 'russian', 'lab', 'hawkins power', 'military', 'conspiracy', 'government', 'cia', 'fbi', 'department of energy'],
        medium: ['theft', 'break-in', 'vandalism', 'shutdown', 'curfew', 'police', 'sheriff', 'mayor'],
        low: ['noise', 'litter', 'graffiti', 'protest', 'town hall', 'meeting'],
        color: '#3b82f6' // Blue/Primary
    },
    'Job': {
        high: ['hiring', 'vacancy', 'recruitment', 'application', 'resume', 'cv', 'interview', 'salary', 'contract'],
        medium: ['position', 'role', 'job', 'work', 'employment', 'career', 'opportunity'],
        low: ['boss', 'manager', 'office', 'staff'],
        color: '#10b981' // Green/Emerald
    }
};

export const analyzeAnomaly = (text) => {
    const lowerText = text.toLowerCase();
    let maxScore = 0;
    let detectedType = 'Unidentified';
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

    const result = {
        type: detectedType,
        urgency: detectedUrgency,
        confidence: maxScore === 0 ? 10 : Math.round(Math.min((maxScore / 10) * 100, 100)),
        color: KEYWORDS[detectedType]?.color || '#ffffff'
    };

    return result;
};
