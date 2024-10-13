import { BaseSummary } from 'src/app/report/summary/base.summary';
import { StatHighlights } from 'src/app/report/analysis/stat-highlights';
import { SummaryFields } from 'src/app/report/summary/fields/summary.fields';
import { PlayerAnalysis } from 'src/app/report/models/player-analysis';
import { EncounterFields } from 'src/app/report/summary/fields/encounter.fields';
import { HitFields } from 'src/app/report/summary/fields/hit.fields';
import { CastStats } from 'src/app/report/models/cast-stats';
import { FeralFaerieFireFields } from './fields/fff.fields';

export class ShredSummary extends BaseSummary {
  private summaryFields: SummaryFields;
  private hitFields: HitFields;
  private encounterFields: EncounterFields;
  private fffFields: FeralFaerieFireFields;

  constructor(analysis: PlayerAnalysis, highlight: StatHighlights) {
    super(analysis, highlight);
    this.fffFields = new FeralFaerieFireFields(this.analysis, this.highlight);
    this.summaryFields = new SummaryFields(this.analysis, this.highlight);
    this.hitFields = new HitFields(this.analysis, this.highlight);
    this.encounterFields = new EncounterFields(this.analysis, this.highlight);
  }

  report(stats: CastStats) {
    return this.summaryFields.fields(stats)
      .concat(this.hitFields.fields(stats))
      .concat([this.break()])
      .concat(this.fffFields.fields(stats, true))
      .concat(this.encounterFields.fields(stats));
  }
}
