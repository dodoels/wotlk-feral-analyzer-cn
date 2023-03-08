import { BaseSummary } from 'src/app/report/summary/base.summary';
import { StatHighlights } from 'src/app/report/analysis/stat-highlights';
import { DotFields } from 'src/app/report/summary/fields/dot.fields';
import { SummaryFields } from 'src/app/report/summary/fields/summary.fields';
import { PlayerAnalysis } from 'src/app/report/models/player-analysis';
import { EncounterFields } from 'src/app/report/summary/fields/encounter.fields';
import { HitFields } from 'src/app/report/summary/fields/hit.fields';
import { CastStats } from 'src/app/report/models/cast-stats';
import { RoarFields } from './fields/roar.fields';

export class SavageRoarSummary extends BaseSummary {
  private summaryFields: SummaryFields;
  private hitFields: HitFields;
  private dotFields: DotFields;
  private encounterFields: EncounterFields;
  private roarFields: RoarFields;

  constructor(analysis: PlayerAnalysis, highlight: StatHighlights) {
    super(analysis, highlight);

    this.summaryFields = new SummaryFields(this.analysis, this.highlight);
    this.hitFields = new HitFields(this.analysis, this.highlight);
    this.dotFields = new DotFields(this.analysis, this.highlight);
    this.encounterFields = new EncounterFields(this.analysis, this.highlight);
    this.roarFields = new RoarFields(this.analysis, this.highlight);
  }

  report(stats: CastStats) {
    return this.roarFields.fields(stats);
  }
}
