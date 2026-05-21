# Rollback

If v2 is broken in production and can't be fixed in <1 hour, roll back.

## Rollback target

The **last successful Docusaurus deploy** on `main` before the cutover
PR was merged. Specifically: the commit immediately preceding the
cutover PR's merge commit.

## Procedure

### Option A — Revert the cutover PR (preferred)

1. On `main`, `git revert -m 1 <cutover-PR-merge-commit>`.
2. Push to `main`.
3. The reverted `main` again contains Docusaurus + the old
   `test-deploy.yml`.
4. Manually dispatch the old `test-deploy.yml` workflow from the
   Actions tab.
5. Verify <https://microsoftlearning.github.io/trainer-demo-deploy/>
   shows the Docusaurus site again.

This is **destructive of v2 work** in the sense that follow-up will need
to re-apply on top of a rolled-back `main`. Acceptable trade-off for
production stability.

### Option B — Re-deploy the last Docusaurus tag

If reverting the PR is infeasible (e.g. it's an immense diff):

1. Identify the last green Docusaurus deploy's commit SHA. The
   Actions tab → "Manual Push to GitHub Pages" → last successful run
   → "Set up job" log shows the SHA.
2. `git checkout <sha>` in a clean tree.
3. From that checkout, run the deploy locally? **No** — Pages requires
   a workflow. Instead:
4. Create a `rollback/<date>` branch from the cutover commit's
   parent.
5. Manually dispatch the OLD `test-deploy.yml` workflow targeting that
   branch.
6. Verify URL.

Then plan a proper revert PR.

## What we lose on rollback

- Any v2 OPX scripts authored after cutover that aren't yet
  back-ported. Capture them in an issue before rolling back.
- Any catalog entries added to `templates.json` only after cutover
  must be re-applied to the rolled-back tree.

## Communication

- Post in the trainer channels: "we hit an issue with the new site
  and rolled back to the previous version. We'll publish a postmortem".
- Update the cutover discussion/issue.

## Postmortem

After any rollback:

1. Open a postmortem doc capturing:
   - What broke.
   - How we detected it.
   - Why pre-launch tests didn't catch it.
   - What to add to the test suite to catch it next time.
2. Add the new test before the next cutover attempt.

## Reasons we *don't* roll back

- A trainer reports a visual bug. Fix forward.
- A single OPX script is broken. Remove the file, redeploy.
- Lighthouse score dropped 5 points. Iterate, don't roll back.

Reasons we *do* roll back:

- Catalog is completely unusable (search broken, filters broken,
  panel won't open, copy button broken).
- More than 25% of inbound links 404.
- Analytics events have stopped firing (would break trainer reporting).
- Visible page errors / exceptions / blank page for users.
