import { describe, it, expect, beforeEach } from 'vitest';
import { errorMonitorService } from './errorMonitorService';

describe('EnterpriseErrorMonitorService', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('returns initial seed incidents and valid system health summary', () => {
    const incidents = errorMonitorService.getIncidents();
    expect(incidents.length).toBeGreaterThanOrEqual(3);

    const summary = errorMonitorService.getSystemHealthSummary();
    expect(summary.healthScore).toBeGreaterThanOrEqual(80);
    expect(summary.checks).toHaveLength(4);
  });

  it('records and classifies React DOM reconciliation errors accurately', () => {
    const err = new Error("Failed to execute 'removeChild' on 'Node'");
    err.name = 'NotFoundError';

    const recorded = errorMonitorService.captureReactError(
      err,
      { componentStack: 'at AppShell' },
      'AppShell'
    );

    expect(recorded.category).toBe('react_render');
    expect(recorded.autoHealed).toBe(true);
    expect(recorded.status).toBe('auto_healed');
  });

  it('simulates diagnostic incidents and heals all open incidents', () => {
    const simulated = errorMonitorService.simulateDiagnosticIncident('network_timeout');
    expect(simulated.status).toBe('open');
    expect(simulated.category).toBe('network_api');

    const healedCount = errorMonitorService.healAllOpenIncidents();
    expect(healedCount).toBeGreaterThanOrEqual(1);

    const summaryAfter = errorMonitorService.getSystemHealthSummary();
    expect(summaryAfter.openIncidents).toBe(0);
    expect(summaryAfter.healthScore).toBe(100);
  });
});
