import { BaseFields } from 'src/app/report/summary/fields/base.fields';
import { duration } from 'src/app/report/models/stat-utils';
import { CastStats } from 'src/app/report/models/cast-stats';

export class SummaryFields extends BaseFields {
  fields(stats: CastStats) {
    return [
      this.field({ label: '施法次数', value: stats.castCount }),
      this.field({ label: '伤害', value: stats.totalDamage }),
      this.field({ label: '活跃时间DPS', value: this.activeDps(stats) }),
      this.field({ label: '实时战斗时间', value: duration(stats.activeDuration, 'M:ss') }),
      this.break()
    ];
  }
}
