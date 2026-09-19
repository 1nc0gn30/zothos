import { SpeedSegment } from '../types/models';

export interface SpeedPiece {
  sourceStart: number;
  sourceEnd: number;
  rate: number;
  outputStart: number;
  sourceDuration: number;
  outputDuration: number;
  outputEnd: number;
}

export class SpeedTimeline {
  public readonly sourceStart: number;
  public readonly sourceEnd: number;
  public readonly pieces: SpeedPiece[];
  public readonly duration: number;

  constructor(sourceStart: number, sourceEnd: number, segments: SpeedSegment[]) {
    const lower = Math.max(0, Math.min(sourceStart, sourceEnd));
    const upper = Math.max(lower, sourceEnd);
    this.sourceStart = lower;
    this.sourceEnd = upper;

    if (upper <= lower) {
      this.pieces = [];
      this.duration = 0;
      return;
    }

    const clippedSegments = segments
      .map(seg => {
        const start = Math.max(lower, seg.startTime);
        const end = Math.min(upper, seg.startTime + seg.duration);
        return { start, end, rate: seg.rate };
      })
      .filter(seg => seg.end > seg.start);

    const boundaries = [lower, upper];
    for (const seg of clippedSegments) {
      boundaries.push(seg.start);
      boundaries.push(seg.end);
    }
    boundaries.sort((a, b) => a - b);

    const uniqueBoundaries: number[] = [];
    for (const b of boundaries) {
      if (uniqueBoundaries.length === 0 || Math.abs(uniqueBoundaries[uniqueBoundaries.length - 1] - b) > 0.000001) {
        uniqueBoundaries.push(b);
      }
    }

    let outputCursor = 0;
    const built: SpeedPiece[] = [];

    for (let i = 0; i < uniqueBoundaries.length - 1; i++) {
      const start = uniqueBoundaries[i];
      const end = uniqueBoundaries[i + 1];
      if (end <= start) continue;

      const midpoint = start + (end - start) / 2;
      const matched = clippedSegments.find(s => midpoint >= s.start && midpoint < s.end);
      const rate = Math.max(0.25, Math.min(4.0, matched ? matched.rate : 1.0));

      const sourceDuration = end - start;
      const outputDuration = sourceDuration / rate;
      const piece: SpeedPiece = {
        sourceStart: start,
        sourceEnd: end,
        rate,
        outputStart: outputCursor,
        sourceDuration,
        outputDuration,
        outputEnd: outputCursor + outputDuration,
      };

      built.push(piece);
      outputCursor = piece.outputEnd;
    }

    this.pieces = built;
    this.duration = built.length > 0 ? built[built.length - 1].outputEnd : 0;
  }

  outputOffset(sourceTime: number): number {
    if (this.pieces.length === 0) return 0;
    const first = this.pieces[0];
    const last = this.pieces[this.pieces.length - 1];
    const clamped = Math.max(this.sourceStart, Math.min(sourceTime, this.sourceEnd));

    if (clamped <= first.sourceStart) return 0;
    if (clamped >= last.sourceEnd) return this.duration;

    const piece = this.pieces.find(p => clamped <= p.sourceEnd + 0.000001);
    if (!piece) return this.duration;

    return piece.outputStart + (clamped - piece.sourceStart) / piece.rate;
  }

  sourceTime(outputOffset: number): number {
    if (this.pieces.length === 0) return this.sourceStart;
    const first = this.pieces[0];
    const last = this.pieces[this.pieces.length - 1];
    const clamped = Math.max(0, Math.min(outputOffset, this.duration));

    if (clamped <= 0) return first.sourceStart;
    if (clamped >= this.duration) return last.sourceEnd;

    const piece = this.pieces.find(p => clamped <= p.outputEnd + 0.000001);
    if (!piece) return this.sourceEnd;

    return piece.sourceStart + (clamped - piece.outputStart) * piece.rate;
  }

  rate(sourceTime: number): number {
    if (this.pieces.length === 0) return 1;
    const clamped = Math.max(this.sourceStart, Math.min(sourceTime, this.sourceEnd));
    const piece = this.pieces.find(p => clamped >= p.sourceStart && clamped < p.sourceEnd);
    return piece ? piece.rate : (this.pieces[this.pieces.length - 1]?.rate ?? 1);
  }
}
