import { BaseFields } from 'src/app/report/summary/fields/base.fields';
import { format } from 'src/app/report/models/stat-utils';
import { CastStats } from 'src/app/report/models/cast-stats';

export class EncounterFields extends BaseFields {
  fields(stats: CastStats) {
    return [
      this.field({ label: '平均AP', value: format(stats.avgSpellpower) }),
      this.field({ label: '总活跃时间', value: format(100 * stats.activeDuration / this.analysis.encounter.duration, 2, '%')})
      // this.field({ label: 'Avg Haste', value: format(stats.avgHaste * 100, 1, '%') }),
      // this.field({ label: 'GCD Usage', value: this.gcdUsage(stats) })
    ];
  }
}
