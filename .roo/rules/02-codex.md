# Escalate to Codex after repeated failures
If three consecutive attempts fail with materially similar errors or no progress (same failing test, same stack trace, or near-identical plan):
  1) Create a new git branch: codex-fix/<short-problem-slug>.
  2) Summarize the problem in <= 25 lines:
     - failing command + exit code
     - last 60 lines of error logs
     - what changed since the first failure (diff summary)
     - your best hypothesis of root cause
  3) Call MCP server "codex" tool codex_execute with:
     - work_dir="."
     - prompt = the summary above + explicit request:
       "Propose and apply a minimal patch that fixes the failure. Prefer small, auditable changes."
  4) After tool returns:
     - Run tests/build again.
     - Show a concise git diffstat + the key hunks.
     - If still failing, call codex_review with review_type="root_cause" and target set to the primary failing file or test.
  5) Ask for approval before pushing any non-trivial refactors.