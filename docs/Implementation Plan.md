# Implementation Plan - Layer 1 Core Systems

## Goal
Establish the foundational systems for the Game Level (Layer 1), including the main game loop, Elder generation (Spawner), and basic Elder behavior.

## Proposed Changes

### 1. Core Architecture (`src/core/`)
#### [NEW] `src/core/GameLoop.js`
- **Responsibility**: Handle the `requestAnimationFrame` loop and `deltaTime` calculation.
- **Exports**: `start()`, `stop()`, `addSystem(system)`, `removeSystem(system)`.

#### [NEW] `src/core/EntityManager.js` (Optional/Simple array)
- For now, we might just keep a list of entities in `LevelManager`.

### 2. Systems Implementation (`src/systems/`)
#### [NEW] `src/systems/SpawnerSystem.js`
- **Logic**:
    - `update(dt)`: Check if it's time to spawn a new Elder.
    - `spawn()`: Create a new Elder Mesh (Cube for MVP) at a random edge position.
    - **Properties assigned**: `state` (WAITING), `targetPosition`, `demandType` (E-01...E-05).

#### [NEW] `src/systems/LevelManager.js`
- **Responsibility**: Track Global Game State.
- **State**:
    - `servedCount`: Integer (starts at 0).
    - `countdown`: Number (starts at fixed value).
- **Methods**:
    - `incrementServedCount()`: +1 to count.
    - `checkWinCondition()`: Check if count >= target.

#### [NEW] `src/systems/ElderSystem.js` (or integrate into Elder entity)
- **Logic**:
    - `update(dt)`: Iterate all active Elders.
    - **State Machine**:
        - **WAITING**: Move towards random point. Update bubble timer.
        - **BEING_SERVED**: Stop moving. Show progress bar.
        - **RESOLVED**: Move to exit. **Call `LevelManager.incrementServedCount()`**.
        - **FAILED**: Move to exit.

### 3. Scene Integration (`src/Main.js` -> `src/ui/GameLevel.js`)
#### [MODIFY] `src/Main.js`
- Clean up the rotary cube demo code.
- Initialize `GameLoop` and register `SpawnerSystem`.
- Ensure Camera is set to the correct 2.5D angle defined in docs.

## Verification Plan
### Automated Tests
- None for this phase.

### Manual Verification
1.  **Start Game**: Open browser (`npm run dev`).
2.  **Observation**:
    - "Elders" (Cubes) should appear at loop intervals.
    - They should move around the floor (not fly).
    - They should eventually disappear or change color (mocking state change).
3.  **Performance**: Check console for errors.
