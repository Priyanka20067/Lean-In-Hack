const KEYWORDS = {
    Paranormal: {
        high: ['monster', 'demogorgon', 'gate', 'upside down', 'fleece', 'shadow', 'tentacle', 'portal', 'rifts', 'creature'],
        medium: ['lights', 'flickering', 'noise', 'static', 'electrical', 'magnetic', 'compass', 'batteries'],
        low: ['weird', 'strange', 'cold', 'missing'],
        color: '#f472b6' // Pink/Magenta
    },
    'Health Tech': {
        high: ['blood', 'unconscious', 'breathing', 'seizure', 'collapsed', 'poison', 'bite', 'death', 'hospital', 'doctor', 'ambulance', 'clinic', 'virus', 'infection'],
        medium: ['sick', 'fever', 'vomit', 'pain', 'infection', 'slime', 'rash', 'medicine', 'patient'],
        low: ['cough', 'dizzy', 'tired', 'headache', 'pharmacy', 'checkup'],
        color: '#10b981' // Green (per user request)
    },
    'Government': {
        high: ['illegal', 'weapon', 'spy', 'russian', 'lab', 'hawkins power', 'military', 'conspiracy', 'government', 'cia', 'fbi', 'department of energy'],
        medium: ['theft', 'break-in', 'vandalism', 'shutdown', 'curfew', 'police', 'sheriff', 'mayor'],
        low: ['noise', 'litter', 'graffiti', 'protest', 'town hall', 'meeting'],
        color: '#3b82f6' // Blue (per user request)
    },
    'Job': {
        high: ['hiring', 'vacancy', 'recruitment', 'application', 'resume', 'cv', 'interview', 'salary', 'contract', 'developer', 'software', 'engineer', 'frontend', 'backend', 'fullstack'],
        medium: ['position', 'role', 'job', 'work', 'employment', 'career', 'opportunity', 'react', 'node', 'css', 'javascript', 'python', 'code', 'coding', 'programming', 'bug', 'glitch'],
        low: ['boss', 'manager', 'office', 'staff', 'computer', 'screen', 'terminal', 'interface'],
        color: '#a855f7' // Purple (per user request)
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
// 🟦 AI INTERVIEW GENERATOR
export const generateInterviewQuestions = (role, anomalyDescription) => {
    const desc = anomalyDescription.toLowerCase();
    const questions = [];

    // Base knowledge questions (always included)
    const baseQuestions = {
        'Frontend Developer': [
            { q: "Explain the Virtual DOM in React.", keywords: ['diff', 'tree', 'reconciliation'] },
            { q: "What is the difference between state and props?", keywords: ['mutable', 'immutable', 'parent'] }
        ],
        'Backend Developer': [
            { q: "Explain the event loop in Node.js.", keywords: ['single', 'thread', 'queue'] },
            { q: "Difference between SQL and NoSQL?", keywords: ['relational', 'schema', 'document'] }
        ],
        'Data Analyst': [
            { q: "Explain p-value in statistics.", keywords: ['hypothesis', 'null', 'significance'] },
            { q: "What is data cleaning?", keywords: ['missing', 'duplicate', 'error'] }
        ]
    };

    // Context-aware dynamic questions
    if (desc.includes('glitch') || desc.includes('visual') || desc.includes('css')) {
        questions.push({
            q: "The anomaly report mentions visual glitches. How would you debug CSS z-index issues?",
            keywords: ['stacking', 'context', 'position', 'layer']
        });
    }

    if (desc.includes('slow') || desc.includes('latency') || desc.includes('performance')) {
        questions.push({
            q: "The system is experiencing latency as noted in the report. How do you optimize React performance?",
            keywords: ['memo', 'lazy', 'render', 'optimization']
        });
    }

    if (desc.includes('database') || desc.includes('data') || desc.includes('corrupt')) {
        questions.push({
            q: "Data corruption was detected. How do you ensure data integrity in a database transaction?",
            keywords: ['acid', 'atomicity', 'consistency', 'rollback']
        });
    }

    if (desc.includes('api') || desc.includes('connection') || desc.includes('network')) {
        questions.push({
            q: "Network instability is affecting the API. How do you handle retry logic in REST calls?",
            keywords: ['exponential', 'backoff', 'status', 'timeout']
        });
    }

    if (desc.includes('security') || desc.includes('breach') || desc.includes('hack')) {
        questions.push({
            q: "Security breach detected. explain XSS and how to prevent it.",
            keywords: ['sanitize', 'input', 'script', 'injection']
        });
    }

    // Combine base questions with dynamic ones (max 3 total)
    const roleBase = baseQuestions[role] || baseQuestions['Frontend Developer'];
    const failures = [...roleBase, ...questions].slice(0, 3);

    return failures;
};
