# Hawkins Anomaly Nexus (HANex)

## Overview
An offline-first web application for detecting and reporting anomalies in Hawkins with a Stranger Things theme.

## Theme Inspiration
Dark, mysterious aesthetic inspired by the Upside Down. Neural patterns, glitch effects, and retro 80s design elements.

## Folder Structure

```
hawkins-anomaly-nexus/
├── app/                          # App entry point & initialization
├── assets/                        # Images, icons, audio
│   ├── images/
│   ├── icons/
│   └── sounds/
├── components/                    # Reusable UI components
│   ├── common/
│   ├── cards/
│   └── modals/
├── screens/                       # App screens & pages
│   ├── ReportAnomaly/
│   ├── UpsideDownMap/
│   └── Profile/
├── services/                      # External integrations & APIs
│   ├── firebase/
│   ├── ai/
│   └── offline/
├── sponsor-integrations/          # Hackathon sponsor features
│   ├── codecrafters/
│   ├── upsynk-interviewcake/
│   └── geekroom/
├── store/                         # Global state management
│   ├── slices/
│   └── index.ts
├── hooks/                         # Custom React hooks
├── utils/                         # Helper functions & utilities
├── constants/                     # App constants & enums
├── theme/                         # Hawkins UI theme (colors, fonts)
├── types/                         # TypeScript types & interfaces
├── navigation/                    # Navigation configuration
├── functions/                     # Firebase Cloud Functions
├── public/                        # Static assets
├── .env.example                   # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Sponsor Integrations
- **CodeCrafters**: Challenge integrations
- **Upsynk InterviewCake**: Interview prep features
- **GeekRoom**: Community features

## Offline-First Strategy
App functionality maintained without internet connection using local storage and sync mechanisms.

## Demo Flow
Report anomalies → View on Upside Down map → AI analysis → Community insights
