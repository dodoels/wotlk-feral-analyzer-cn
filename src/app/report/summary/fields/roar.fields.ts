import { BaseFields } from 'src/app/report/summary/fields/base.fields';
import { DamageType } from 'src/app/logs/models/spell-data';
import { format, latency, NO_VALUE } from 'src/app/report/models/stat-utils';
import { CastStats } from 'src/app/report/models/cast-stats';

export class RoarFields extends BaseFields {
  fields(stats: CastStats, forSummary = false) {
    const spellLabel = forSummary ? ' Roar' : '';

    const uptime = 100 * this.analysis.savageRoarDuration / this.analysis.encounter.duration;

    return [
      this.field({
        label: `${spellLabel} Uptime`,
        value: format(uptime, 2, '%'),
        highlight: this.highlight.uptime(uptime)
      }),
    ];
  }
}
