# Agent Orchestration

## Available Agents

Located in `.claude/agents/`:

| Agent | Model | Purpose | When to Use |
|-------|-------|---------|-------------|
| explorer | haiku | Read-only codebase analysis — traces execution paths, maps layers, documents dependencies | Before designing in an unfamiliar area |
| architect | sonnet | Implementation blueprint — files to create/modify, build sequence, constraints | When no plan exists yet; saves to `.claude/plans/<feature>.md` |
| implementer | sonnet | Blueprint execution — writes, edits, and wires up code step by step | When a plan exists in `.claude/plans/` or is provided in the prompt |

## Agent Routing

Decide which agent to spawn based on **current state** — not keywords:

| State | Agent |
|-------|-------|
| Area is unfamiliar — need to understand before designing | **explorer** |
| Area is understood, no blueprint exists yet | **architect** |
| `.claude/plans/<feature>.md` exists, or blueprint is in the prompt | **implementer** |
| Isolated bug, area is familiar, no design decision needed | **implementer** directly |

### Standard pipelines

```
New feature (unfamiliar area):  explorer → architect → implementer
New feature (familiar area):    architect → implementer
Bug fix (complex or unknown):   explorer → implementer
Bug fix (simple, known area):   implementer
```

## Immediate Agent Usage

Spawn proactively — no explicit user request needed:

1. Feature request in an unfamiliar area → **explorer** first, then **architect**
2. Feature request in a known area → **architect** directly
3. Blueprint exists (prompt or `.claude/plans/`) → **implementer**
4. "Implement this" with no plan → spawn **architect**, then **implementer**

## Escalation on Failure

Subagents cannot spawn other agents — they stop and return a structured signal. The main loop is the only orchestrator and routes on signal:

| Signal | From | Action |
|--------|------|--------|
| `PLAN_AMBIGUOUS: <step>` | implementer | Clarify that build-sequence step, re-spawn **implementer** |
| `PLAN_INCOMPLETE: <context>` | implementer | Spawn **architect** with the failure context; request a revised blueprint |
| `BUILD_FAILED: <error>` | implementer | Spawn **architect** with the full error and what was already tried |
| `NEEDS_EXPLORATION: <context>` | architect | Spawn **explorer** with the targeted question, then re-spawn **architect** with the report |

**Loop guard:** if the same signal is returned a second time without resolution, stop escalating and surface the blocker directly to the user.

## Parallel Task Execution

Use parallel agent execution for independent work:

```
# GOOD: parallel
- Agent 1: explorer on src/app/gallery
- Agent 2: explorer on src/sanity/schemas

# BAD: sequential when not needed
First explore gallery, then explore schemas
```
