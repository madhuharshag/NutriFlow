/**
 * Server-Timing header generator and performance measurement utility
 */

export interface TimingMetric {
  name: string;
  durationMs: number;
  description?: string;
}

export class PerformanceTracker {
  private marks = new Map<string, number>();
  private metrics: TimingMetric[] = [];

  start(name: string): void {
    this.marks.set(name, Date.now());
  }

  stop(name: string, description?: string): number {
    const started = this.marks.get(name);
    if (!started) return 0;

    const durationMs = Date.now() - started;
    this.marks.delete(name);
    this.metrics.push({ name, durationMs, description });
    return durationMs;
  }

  formatServerTimingHeader(): string {
    return this.metrics
      .map((m) => {
        const desc = m.description ? `;desc="${m.description}"` : "";
        return `${m.name};dur=${m.durationMs}${desc}`;
      })
      .join(", ");
  }

  getMetrics(): TimingMetric[] {
    return [...this.metrics];
  }
}
