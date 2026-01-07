# Implementation Plans Archive

## 2025-01-06: Codebase Organization & Documentation

### Goal
Organize the codebase into logical subdirectories and document coding standards.

### Changes
1.  **File Organization**:
    -   Moved components to `layout`, `features`, `visuals`, `system`, `ui`, `games`, `unused`.
    -   Updated imports in `page.tsx` and `layout.tsx`.

2.  **Documentation**:
    -   Created `docs/` directory.
    -   Added `CODING_STANDARDS.md`, `ARCHITECTURE.md`, `IDEAS.md`.

3.  **Cleanup**:
    -   Removed `ThemeManager.tsx` (replaced by `ThemeContext`).
    -   Removed `WarpTunnel.tsx` (unused).
    -   Removed `KonamiCode` (feature parked).
