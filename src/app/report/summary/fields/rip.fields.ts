import { BaseFields } from 'src/app/report/summary/fields/base.fields';
import { DamageType } from 'src/app/logs/models/spell-data';
import { format, latency, NO_VALUE } from 'src/app/report/models/stat-utils';
import { CastStats } from 'src/app/report/models/cast-stats';

export class RipFields extends BaseFields {
  fields(stats: CastStats, forSummary = false) {
    const spellData = this.spellData(stats);
    // if (spellData?.damageType !== DamageType.CHANNEL) {
    //   stats = new CastStats(this.analysis);
    // }

    const spellLabel = forSummary ? ' Rip' : '';

    const uptime = 100 * stats.activeDuration / this.analysis.encounter.duration;

    return [
      this.field({
        label: `Avg${spellLabel} Downtime`,
        value: format(stats.dotDowntimeStats.avgDowntime, 1, 's'),
        highlight: this.highlight.dotDowntime(stats)
      }),

      this.field({
        label: `${spellLabel} Uptime`,
        value: format(uptime, 2, '%'),
        highlight: this.highlight.uptime(uptime)
      }),

      this.field({
        label: `Early${spellLabel} Clips`,
        value: this.clipString(stats),
        highlight: this.highlight.clippedEarly(stats)
      }),

      this.field({
        label: `Clipped${spellLabel} ticks`,
        value: this.clippedTicksStr(stats),
        highlight: this.highlight.clippedDots(stats)
      }),
      this.break()
    ];
  }

  private clipString(stats: CastStats) {
    let clipStr = stats.clipStats.castCount > 0 ? stats.clipStats.clipCount.toString() : NO_VALUE;

    if (stats.clipStats.clipCount > 0) {
      clipStr += ` (${format(stats.clipStats.clippedPercent * 100, 1, '%')})`;
    }

    return clipStr;
  }

  private clippedTicksStr(stats: CastStats) {
    const clippedCt = stats.clipStats.clippedTicks;

    return `${format(clippedCt, 0)}`;
  }
}
