import { BaseFields, IStatField } from 'src/app/report/summary/fields/base.fields';
import { format, latency } from 'src/app/report/models/stat-utils';
import { CastStats } from 'src/app/report/models/cast-stats';

export class CooldownFields extends BaseFields {
  fields(stats: CastStats) {
    const spellData = this.spellData(stats);
    let fields: IStatField[] = [];

    if (spellData) {
      fields = [
        // this.field({
        //   label: 'Avg Delay',
        //   value: latency(stats.avgNextCastLatency),
        //   highlight: this.highlight.castLatency(stats)
        // }),
        this.field({
          label: '平均暴击率',
          value: format(stats.critRate * 100, 1, '%')
        }),
        this.field({
          label: '每GCD平均伤害',
          value: format(stats.damagePerGcd, 0)
        })
      ];
    }

    // fields = fields.concat([
    //   this.field({
    //     label: 'Avg Off Cooldown',
    //     value: format(stats.cooldownStats.avgOffCooldown, 1, 's')
    //   })
    // ]);

    if (spellData) {
      fields = fields.concat([this.break()]);
    }

    return fields;
  }
}
