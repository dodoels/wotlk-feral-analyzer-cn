import { BaseFields } from 'src/app/report/summary/fields/base.fields';
import { format } from 'src/app/report/models/stat-utils';
import { CastStats } from 'src/app/report/models/cast-stats';

export class HitFields extends BaseFields {
  fields(stats: CastStats) {
    return [
      this.field({ label: '击中', value: stats.totalHits }),
      this.field({ label: '平均伤害', value: format(stats.avgHit) }),
      this.field({ label: '平均暴击率', value: `${format(stats.critRate * 100, 1, '%')}` }),
      this.field({ label: '每GCD平均伤害', value: format(stats.damagePerGcd, 0) }),
      this.break()
    ];
  }
}
