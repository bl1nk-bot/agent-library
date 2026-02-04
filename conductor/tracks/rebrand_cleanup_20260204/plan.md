# Implementation Plan: Full Project Rebranding & Cleanup

**Track ID:** rebrand_cleanup_20260204

---

#### Phase 1: Logic & Core Configuration [checkpoint: 7d095c1]
Establish the foundational URL changes and logic updates.

- [x] Task: Update Star Count Logic & Service [264e28d]
    - [ ] Write Tests: Verify `getGithubStars` fetches from `bl1nk-bot/agent-library`.
    - [ ] Implement: Update `src/lib/github.ts` with the new repository path.
- [x] Task: Global Repository URL Replacement (Code & Manifests) [47cedde]
    - [ ] Write Tests: Create a script/check to verify no legacy URLs exist in `package.json` or `docker/Dockerfile`.
    - [ ] Implement: Replace `f/awesome-chatgpt-prompts` with `bl1nk-bot/agent-library` in configuration and manifest files.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Logic & Core Configuration' (Protocol in workflow.md) [7d095c1]

#### Phase 2: Content & Documentation Rewrite
Update all user-facing documentation and narrative content.

- [x] Task: Rewrite "Preface" and "History" MDX
    - [x] Write Tests: Verify MDX files render without legacy creator names.
    - [x] Implement: Rewrite `src/content/book/00a-preface.mdx` and `00b-history.mdx` for the new brand.
- [x] Task: Update README.md & SELF-HOSTING.md
    - [x] Write Tests: Verify all links in README/SELF-HOSTING point to `bl1nk-bot`.
    - [x] Implement: Update technical documentation with new repo links and installation instructions.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Content & Documentation Rewrite' (Protocol in workflow.md)

#### Phase 3: UI Cleanup & Legacy Removal [checkpoint: 70204cb]
Remove legacy social proof sections and update brand consistency.

- [x] Task: Remove Legacy Testimonials and Achievements [2901f10]
    - [x] Write Tests: Verify `src/app/page.tsx` no longer imports or renders `TestimonialsSection` or `AchievementsSection` (if they are being deleted).
    - [x] Implement: Remove legacy sections from the homepage and delete the corresponding components/data if no longer needed.
- [x] Task: Update SEO & Structured Data [7ff8843]
    - [x] Write Tests: Verify `StructuredData` component outputs the correct author and repo URL.
    - [x] Implement: Update `src/components/seo/structured-data.tsx` and other metadata components.
- [x] Task: Conductor - User Manual Verification 'Phase 3: UI Cleanup & Legacy Removal' (Protocol in workflow.md) [70204cb]

#### Phase 4: Final Verification sweep
Ensure no traces remain.

- [ ] Task: Global Legacy String Sweep
    - [ ] Write Tests: Run a project-wide `grep` for "awesome-chatgpt-prompts" and "Fatih Kadir Akın".
    - [ ] Implement: Fix any remaining stragglers found in the sweep.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Verification sweep' (Protocol in workflow.md)
