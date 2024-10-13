import { SpellId } from 'src/app/logs/models/spell-id.enum';
import { TimelineSummary } from 'src/app/report/summary/timeline.summary';
import { BaseSummary } from 'src/app/report/summary/base.summary';
import { RipSummary } from 'src/app/report/summary/rip-summary';
import { SavageRoarSummary } from '../summary/savage-roar.summary';
import { ShredSummary } from '../summary/shred-summary';

export enum Tab {
  Timeline = 0,
  DP,
  VT,
  SWP,
  MB,
  Death,
  Flay,
  Rip,
  SR
}

export const TabDefinitions: ITabDefinition[] = [
  // Tab.Timeline
  {
    label: '时间轴',
    spellId: SpellId.NONE,
    summaryType: TimelineSummary
  },

  // Tab.Rip
  {
    label: '割裂',
    icon: 'rip',
    spellId: SpellId.RIP,
    summaryType: RipSummary
  },

  // Tab.Roar
  {
    label: '割裂/咆哮错位',
    // icon: 'savage-roar',
    icon: 'rip-and-roar',
    spellId: SpellId.RIP_AND_ROAR,
    summaryType: SavageRoarSummary
  },

  {
    label: '撕碎质量',
    // icon: 'savage-roar',
    icon: 'shred',
    spellId: SpellId.SHRED_AND_FF_AND_OMEN,
    summaryType: ShredSummary
  },

  // {
  //   label: '清晰损失',
  //   // icon: 'savage-roar',
  //   icon: 'omen',
  //   spellId: SpellId.OMEN,
  //   summaryType: SavageRoarSummary
  // },

  // {
  //   label: '斜掠覆盖',
  //   // icon: 'savage-roar',
  //   icon: 'rake',
  //   spellId: SpellId.RAKE,
  //   summaryType: SavageRoarSummary
  // },

  // {
  //   label: '撕咬收益',
  //   // icon: 'savage-roar',
  //   icon: 'ferocious-bite',
  //   spellId: SpellId.BITE,
  //   summaryType: SavageRoarSummary
  // },

  // {
  //   label: 'AHK检测',
  //   // icon: 'savage-roar',
  //   icon: 'pig',
  //   spellId: SpellId.RIP_AND_ROAR,
  //   summaryType: SavageRoarSummary
  // },
];

export interface ITabDefinition {
  label: string;
  spellId: SpellId;
  icon?: string;
  summaryType: Constructor<BaseSummary>;
}
