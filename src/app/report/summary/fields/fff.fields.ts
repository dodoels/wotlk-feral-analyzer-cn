import { BaseFields } from 'src/app/report/summary/fields/base.fields';
import { format } from 'src/app/report/models/stat-utils';
import { CastStats } from 'src/app/report/models/cast-stats';

export class FeralFaerieFireFields extends BaseFields {
  fields(stats: CastStats, forSummary = false) {
    const spellLabel = forSummary ? ' Feral Faerie Fire' : '';

    const cpm = 100 * this.analysis.feralFaerieFireCPM / (this.analysis.encounter.duration / 600);

    return [
      this.field({
        label: `${spellLabel} CPM`,
        value: format(cpm, 2),
        ///TODO: Add highlight for low/high FFF CPM
        // highlight: this.highlight.uptime(cpm)
      }),
    ];
  }
}
