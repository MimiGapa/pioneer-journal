# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-04-14
### Added
- Initial project setup.
- Added research papers to the repository.
- Added a "Notable Research Papers" section to the UI.
- Implemented user-friendly messages for various actions.
- Added GitHub Actions workflow for deployment to GitHub Pages.
- Added error handling and keep-alive mechanism to the server.

### Changed
- Updated the user interface (UI).
- Required HTTP referrer header for API requests.
- Updated frontend components.

### Fixed
- Fixed resource loading issues.
- Fixed "Cannot find module" error on Render.com deployment.
- Fixed issues with GitHub Actions deployment (missing download info, file issues).
- Fixed 404 errors.

### Removed
- (Nothing removed in this version yet)

## [1.1.0] - 2025-04-18

### Added
- Custom CSS keyframe animations for the header on desktop to ensure a sequential reveal even when all content is visible.
  
### Changed
- Improved page transitions by refining the fade in/out effects between routes.
- Reduced AOS delay values and animation duration in StrandPage to improve responsiveness.
- Adjusted footer typography by preventing line breaks in "High School" (using non-breaking spaces or inline CSS).

### Fixed
- Fixed laggy transitions that previously caused a cut-off before new pages loaded.