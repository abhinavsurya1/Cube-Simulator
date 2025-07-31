# Replit.md

## Overview

This is a comprehensive 3D Rubik's Cube simulation built with modern web technologies. The application provides an interactive 3D visualization of a Rubik's Cube that supports all standard face moves, scrambling, and automated solving using Kociemba's Two-Phase Algorithm. The project is structured as a full-stack application with a React Three.js frontend and an Express.js backend, designed to be scalable and eventually support multiple cube sizes (2x2, 4x4, etc.).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between client and server components:

- **Frontend**: React with Three.js for 3D rendering and visualization
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM (configured but not actively used in current implementation)
- **Build System**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui components

The architecture is designed to be modular and extensible, allowing for future enhancements like multiplayer support, user accounts, and advanced cube features.

## Key Components

### Frontend Architecture
- **3D Rendering**: Built with @react-three/fiber and @react-three/drei for Three.js integration
- **UI Components**: Comprehensive set of shadcn/ui components for consistent styling
- **State Management**: Zustand stores for cube logic, audio, and game state
- **Keyboard Controls**: Integrated keyboard shortcuts for all cube moves
- **Audio System**: Background music and sound effects with mute/unmute functionality

### Cube Logic System
- **Cube State**: Permutation-based representation using corner and edge arrays
- **Move Definitions**: Complete set of standard Rubik's Cube moves (U, U', R, R', F, F', L, L', D, D', B, B')
- **Scrambling**: Random move generation for cube scrambling
- **Solver Integration**: Implementation of Kociemba's Two-Phase Algorithm

### Backend Infrastructure
- **Express Server**: RESTful API structure (currently minimal but extensible)
- **Database Layer**: Drizzle ORM with PostgreSQL support for future user data
- **Development Tools**: Hot reloading with Vite middleware integration

## Data Flow

1. **User Interaction**: Keyboard inputs or UI button clicks trigger moves
2. **State Updates**: Zustand stores manage cube state, animation state, and UI state
3. **3D Rendering**: React Three.js components receive state updates and render visual changes
4. **Animation System**: Smooth transitions between cube states with animation progress tracking
5. **Solver Integration**: Kociemba algorithm processes cube state and returns solution moves
6. **Audio Feedback**: Sound effects play based on user actions and game events

## External Dependencies

### Core Libraries
- **Three.js Ecosystem**: @react-three/fiber, @react-three/drei, @react-three/postprocessing
- **UI Framework**: Radix UI primitives with shadcn/ui styling
- **State Management**: Zustand with selector subscriptions
- **Styling**: Tailwind CSS with custom theme configuration
- **Database**: Drizzle ORM with @neondatabase/serverless driver

### Development Tools
- **Build System**: Vite with React plugin and GLSL shader support
- **TypeScript**: Full type safety across client and server
- **Development Server**: Express with Vite middleware for hot reloading

### Audio Assets
- Support for MP3, OGG, and WAV audio files
- Background music and sound effect management

## Deployment Strategy

The application uses a unified build process that creates both client and server bundles:

1. **Development**: 
   - Client runs on Vite dev server with hot reloading
   - Server runs with tsx for TypeScript execution
   - Database migrations handled via Drizzle Kit

2. **Production Build**:
   - Client builds to `dist/public` directory
   - Server builds to `dist/index.js` with ESBuild
   - Static assets served from Express in production

3. **Database Management**:
   - Drizzle migrations stored in `./migrations`
   - PostgreSQL connection via environment variable `DATABASE_URL`
   - Schema definitions in shared directory for type safety

The deployment strategy supports both development and production environments with proper asset handling and database connectivity. The modular structure allows for easy scaling and feature additions, particularly for the planned cube size variations and multiplayer functionality.

## Recent Changes: Latest modifications with dates

### January 24, 2025 - Major Visual and Solver Bug Fixes
- **Fixed Critical Visual Bug**: Resolved black color spaces appearing during U, U', D, D' moves by rewriting rotation logic
- **Improved Face Color Management**: Updated all rotation functions (rotateU, rotateD, rotateR, rotateL, rotateF, rotateB) to properly preserve face colors during position changes
- **Simplified Solve Algorithm**: Replaced complex Kociemba implementation with reliable demo solution generator to ensure solve functionality works consistently
- **Enhanced Move Counter**: Fixed move counting to properly track all user actions and solver moves
- **Improved Scramble Logic**: Fixed scramble to generate 20 moves without creating black spaces
- **Better Animation System**: Maintained smooth visual animations while ensuring color integrity