# Legacy invitation (pre–hunbei A17073ae6c057)

Snapshot of the previous multi-screen invitation (video hero → transition/envelope → date/info/RSVP/dress code).

Restored main site now uses `src/components/story/StoryInvitation` on `/`.

RSVP API/admin/backend were **not** moved here — they remain in the live app.

## Restore notes
- Entry: `src/app/page.tsx`
- Shell: `VintageShell`, `VideoHero`, `TransitionScreen`, etc.
- This folder is reference-only; paths assume the old `@/` imports.
