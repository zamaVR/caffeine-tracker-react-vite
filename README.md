# Caffeine Tracker

The Caffeine Tracker app serves as a tool to understand how long caffeine stays in your system with a specific emphasis on its potential to impact sleep. Personally, I have always felt like caffiene affected my sleep on days I either consumed too much or consumed too late in the day. After reading about the variance in the half-life of caffiene in the human body, I thought it would be interesting to make an application that can do some estimation of caffeienation levels based on consumption and other key factors.  

## Features

- Track caffeine consumption throughout the day
- Visualize caffeine levels in your system over time
- Calculate optimal caffeine cutoff times for better sleep
- User-friendly interface for logging drinks
- Data visualization using Recharts

## Tech Stack

After modeling out v1 of the app, I ended up with a pretty simple feature set. Knowing an SPA would be sufficient, I decided to use React + TypeScript + Vite because:

1. I didn't need features like file-based routing or static HTML generation, so I saw no reason to do a full framework like Next.js or Astro
2. I had heard about Vite's speed to build, HMR, and generally simple configuration.
3. I had experience with and generally enjoyed the availability of UI libraries for React.

### Key Dependencies

- React 19
- TypeScript
- Vite
- Radix UI (for components)
- Recharts (for data visualization)
- Day.js (for date manipulation)

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/caffeine-tracker-react-vite.git
cd caffeine-tracker-react-vite
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
caffeine-tracker-react-vite/
├── src/              # Source files
├── index.html        # Entry HTML file
├── vite.config.ts    # Vite configuration
├── tsconfig.json     # Base TypeScript configuration
├── tsconfig.app.json # TypeScript config for app code
├── tsconfig.node.json # TypeScript config for Node.js
└── package.json      # Project dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
