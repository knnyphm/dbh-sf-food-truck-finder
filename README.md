# SF Food Truck Finder

A modern web application built with Next.js that helps users discover nearby food trucks in San Francisco. The app uses geolocation and interactive maps to provide real-time food truck locations with customizable search radius.

## Features

- 📍 **Location-based Search**: Find food trucks near your current location
- 🗺️ **Interactive Map**: View food truck locations on an integrated Google Maps interface  
- 📏 **Adjustable Radius**: Customize search distance with an intuitive slider
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 📊 **Fresh Data**: Up-to-date food truck locations (refreshed hourly)
- 🚀 **Optimized Performance**: Server-side caching with 1-hour cache duration to minimize external API calls

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Maps**: Google Maps API via `@vis.gl/react-google-maps` (requires API key)
- **Geolocation**: Browser Geolocation API with Geolib for distance calculations
- **Testing**: Jest, React Testing Library
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- Google Maps API key and Map ID

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   # Copy the sample environment file
   cp .env.sample .env
   
   # Edit .env and add your Google Maps credentials
   # Get your API key from: https://console.cloud.google.com/
   # Get your Map ID from: https://console.cloud.google.com/google/maps-apis/configuremaps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_map_id_here
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

### Environment Variables

The application requires the following environment variables to function properly:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key for map functionality | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | Google Maps Map ID for custom styling | Yes |

**Note**: These variables are prefixed with `NEXT_PUBLIC_` because they need to be accessible in the browser for the Google Maps integration to work.

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests
- `pnpm type-check` - Run TypeScript type checking

## CI/CD

This project uses GitHub Actions for continuous integration. The CI pipeline runs on every pull request and push to the main branch, ensuring code quality and preventing broken code from being merged.

### Required Status Checks

To enable branch protection and block merges when tests fail:

1. Go to your GitHub repository settings
2. Navigate to **Settings > Branches**
3. Add a rule for the `main` branch
4. Enable the following protections:
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Restrict pushes that create files**
   - ✅ **Restrict deletions**
   - ✅ **Require linear history** (recommended)

5. Search for and select the **"test"** status check (from the CI workflow)
6. Save the rule

### CI Workflow

The CI workflow (`/.github/workflows/ci.yml`) runs the following checks:
- **Type checking** - Ensures TypeScript compilation passes
- **Linting** - Runs ESLint to check code style and quality
- **Testing** - Executes Jest test suite
- **Build** - Verifies the application builds successfully

All checks must pass before a pull request can be merged.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── food-trucks/   # Food truck data endpoints (1-hour server cache)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx          # Home page
│
├── components/            # React components
│   ├── FoodTruckFinder/  # Main application component
│   ├── FoodTruckList/    # Food truck listing component
│   ├── FoodTruckMap/     # Google Maps integration
│   ├── LocationError/     # Location error display component
│   ├── LocationLoading/   # Location loading state component
│   ├── PageLayout/        # Page layout wrapper
│   └── ui/               # Reusable UI components
│
├── hooks/                # Custom React hooks
│   └── useFoodTruckFinder/  # Food truck data management hook
│
├── utils/                # Utility functions
│   └── foodTruckLocator/  # Food truck location utilities
│
└── config/              # Configuration files
    └── maps.ts          # Google Maps configuration
```

## How to Contribute

We welcome contributions! Here's how to get started:

### 1. Development Workflow

1. **Fork and Clone**: Fork the repository and clone your fork locally
2. **Create a Branch**: Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes**: Implement your changes following our coding standards
4. **Test**: Ensure all tests pass and add new tests for your changes
   ```bash
   pnpm test
   pnpm lint
   ```
5. **Commit**: Use clear, descriptive commit messages
6. **Push and PR**: Push to your fork and create a pull request

### 2. Code Standards

- **TypeScript**: All code must be properly typed
- **Testing**: Write unit tests for new components and functions
- **Linting**: Code must pass ESLint checks
- **Components**: Follow the existing component structure and naming conventions
- **Hooks**: Custom hooks should be thoroughly tested and documented

### 3. Areas for Contribution

- **Features**: New functionality like filters, favorites, or food truck details
- **UI/UX**: Improve design, accessibility, or user experience
- **Performance**: Optimize loading times, bundle size, or rendering
- **Testing**: Increase test coverage or improve test quality
- **Documentation**: Improve code comments, README, or add guides
- **Bug Fixes**: Address issues in the GitHub issue tracker

### 4. Component Guidelines

- Place components in their own directories with an `index.tsx` export
- Use descriptive, purpose-specific names (e.g., `FoodTruckMap` instead of generic `Map`)
- Include corresponding test files (`.spec.tsx`)
- Use TypeScript interfaces for all props
- Follow the existing patterns for state management and data fetching

### 5. Getting Help

- Check existing issues and pull requests before starting work
- Ask questions in issue comments or discussions
- Follow the existing code patterns and architecture

## License

This project is open source and available under the MIT License.
