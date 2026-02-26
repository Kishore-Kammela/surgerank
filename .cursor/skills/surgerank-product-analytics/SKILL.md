---
name: surgerank-product-analytics
description: Defines and instruments SurgeRank product analytics for activation, retention, and launch-gate decisions. Use when planning events, KPI dashboards, cohort analysis, and experiment measurement for design-partner and public launch.
---

# SurgeRank Product Analytics

## Goal
Measure product value delivery and make launch decisions from real usage data.

## Core Metrics
- Weekly value-active workspaces
- Activation rate by day 10
- Week-4 retention
- Reports exported/sent per workspace
- API cost as percentage of MRR

## Event Standards
- Use consistent naming: `domain.entity.action`.
- Include `agency_id`, `workspace_id`, `user_id`, timestamp.
- Track source context (onboarding, dashboard, report flow).

## Required Funnels
1. Signup -> workspace created
2. Workspace -> integration connected
3. Integration -> first data visible
4. First data -> first report generated

## Deliverables
- Event spec list
- Dashboard definitions
- Weekly metric review notes
