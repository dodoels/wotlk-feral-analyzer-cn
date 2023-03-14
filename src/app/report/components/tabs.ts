import { SpellId } from 'src/app/logs/models/spell-id.enum';
import { TimelineSummary } from 'src/app/report/summary/timeline.summary';
import { BaseSummary } from 'src/app/report/summary/base.summary';
import { DevouringPlagueSummary } from 'src/app/report/summary/devouring-plague.summary';
import { VampiricTouchSummary } from 'src/app/report/summary/vampiric-touch.summary';
import { PainSummary } from 'src/app/report/summary/pain.summary';
import { MindFlaySummary } from 'src/app/report/summary/mind-flay.summary';
import { DeathSummary } from 'src/app/report/summary/death.summary';
import { MindBlastSummary } from 'src/app/report/summary/mind-blast.summary';
import { SavageRoarSummary } from '../summary/savage-roar.summary';

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
    label: 'Timeline',
    spellId: SpellId.NONE,
    summaryType: TimelineSummary
  },

  // Tab.Rip
  {
    label: 'Rip',
    icon: 'rip',
    spellId: SpellId.RIP,
    summaryType: DevouringPlagueSummary
  },

  // Tab.Roar
  {
    label: 'Rip/Roar',
    // icon: 'savage-roar',
    icon: 'rip-and-roar',
    spellId: SpellId.ROAR,
    summaryType: SavageRoarSummary
  },
];

export interface ITabDefinition {
  label: string;
  spellId: SpellId;
  icon?: string;
  summaryType: Constructor<BaseSummary>;
}
