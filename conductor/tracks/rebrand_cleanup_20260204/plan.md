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

- [ ] Task: Rewrite "Preface" and "History" MDX
    - [ ] Write Tests: Verify MDX files render without legacy creator names.
    - [ ] Implement: Rewrite `src/content/book/00a-preface.mdx` and `00b-history.mdx` for the new brand.
- [ ] Task: Update README.md & SELF-HOSTING.md
    - [ ] Write Tests: Verify all links in README/SELF-HOSTING point to `bl1nk-bot`.
    - [ ] Implement: Update technical documentation with new repo links and installation instructions.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Content & Documentation Rewrite' (Protocol in workflow.md)

#### Phase 3: UI Cleanup & Legacy Removal
Remove legacy social proof sections and update brand consistency.

- [ ] Task: Remove Legacy Testimonials and Achievements
    - [ ] Write Tests: Verify `src/app/page.tsx` no longer imports or renders `TestimonialsSection` or `AchievementsSection` (if they are being deleted).
    - [ ] Implement: Remove legacy sections from the homepage and delete the corresponding components/data if no longer needed.
- [ ] Task: Update SEO & Structured Data
    - [ ] Write Tests: Verify `StructuredData` component outputs the correct author and repo URL.
    - [ ] Implement: Update `src/components/seo/structured-data.tsx` and other metadata components.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI Cleanup & Legacy Removal' (Protocol in workflow.md)

#### Phase 4: Final Verification sweep
Ensure no traces remain.

- [ ] Task: Global Legacy String Sweep
    - [ ] Write Tests: Run a project-wide `grep` for "awesome-chatgpt-prompts" and "Fatih Kadir Akın".
    - [ ] Implement: Fix any remaining stragglers found in the sweep.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Verification sweep' (Protocol in workflow.md)
