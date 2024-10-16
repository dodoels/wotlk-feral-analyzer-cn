import { BaseSummary } from 'src/app/report/summary/base.summary';
import { StatHighlights } from 'src/app/report/analysis/stat-highlights';
import { SummaryFields } from 'src/app/report/summary/fields/summary.fields';
import { PlayerAnalysis } from 'src/app/report/models/player-analysis';
import { CastStats } from 'src/app/report/models/cast-stats';
import { FeralFaerieFireFields } from './fields/fff.fields';
import { BaseFields } from './fields/base.fields';

export class OtherSummary extends BaseSummary {

  constructor(analysis: PlayerAnalysis, highlight: StatHighlights) {
    super(analysis, highlight);
  }

  report(stats: CastStats) {
    return [];
  }
}
