# Changelog

All notable changes to the Agent Library project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- API configuration management system for skills
- API testing interface for skill configurations
- Skill import system with dialog UI
- Security policy and guidelines (SECURITY.md)
- GitHub Actions workflows for project automation and security
- Icon generation script for favicons
- Liquid metal shader effects for Button component
- Variable detection utility for prompt templates
- Structured data for SEO enhancement
- App banner component for mobile app promotion
- Cookie consent banner for GDPR compliance
- Vercel Analytics integration

### Changed
- **Breaking:** Migrated from standard Button to enhanced LiquidMetalButton with shader effects
- **Breaking:** Updated NextAuth imports to v5 patterns
- Replaced `culori` dependency with pure-JS hex→OKLCH conversion for better performance
- Improved Button component accessibility and reverse tabnapping protection
- Enhanced mobile code editor experience
- Updated favicon assets with multiple sizes and formats
- Migrated to Bun package manager for improved performance
- Improved error handling in Sentry configurations

### Fixed
- TypeScript type errors in Monaco editor integration
- NextAuth JWT type augmentation issues
- Database connection errors in Prisma configuration
- Hydration errors in Button component
- Linting errors across the codebase
- Security vulnerabilities in API endpoints

### Removed
- Deprecated Gemini skill creator files
- Unused culori dependency
- Old favicon formats
- Legacy sponsor images

### Security
- Added comprehensive security policies
- Implemented rate limiting for API endpoints
- Enhanced input validation with Zod schemas
- Added CSRF protection measures
- Improved authentication flow security

## [0.2.0] - 2026-02-17

### Added
- API integration system for skills
- Skill editor enhancements
- Multi-language support (11 locales)
- Private prompts feature
- Change request system
- Categories and tags for organization
- AI-powered semantic search

### Changed
- Updated Prisma schema for API configurations
- Enhanced prompt management interface
- Improved authentication provider system

### Fixed
- Various bug fixes and performance improvements

## [0.1.0] - 2026-01-01

### Added
- Initial release of Agent Library platform
- Prompt sharing and discovery features
- User authentication and profiles
- Collection and voting system
- Admin dashboard
- Self-hosting capabilities

---

## Merge History

### PR #7 - Merged 2026-03-21
**Title:** Fix Button Accessibility, Shader Usage, and API Manager Security
- Fixed accessibility issues in Button component
- Improved shader performance and reliability
- Enhanced API manager security measures
- Addressed code review feedback

### PR #5 - Merged 2026-03-21
**Title:** Address security, stability, and UI issues across the codebase
- Security improvements across the platform
- Stability enhancements
- UI/UX improvements

### PR #4 - Merged 2026-03-21
**Title:** Enhance mobile code editor and implement skill API integration
- Mobile code editor improvements
- Skill API integration system
- Editor contrast enhancements

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Reporting Issues
- Use GitHub Issues for bug reports
- Include steps to reproduce
- Provide environment details

### Submitting PRs
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

---

## Version Support

| Version | Supported | End of Life |
|---------|-----------|-------------|
| 0.2.x   | ✅ Yes    | -           |
| 0.1.x   | ❌ No     | 2026-03-01  |

---

## Breaking Changes

### v0.2.0 → v0.3.0 (Unreleased)
- Button component now requires explicit accessibility props
- API configuration endpoints have new authentication requirements
- Favicon paths have changed

---

*For more detailed information, see the [AGENTS.md](AGENTS.md) file.*
