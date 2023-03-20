import { IBuffData } from 'src/app/logs/interfaces';
import { PlayerAnalysis } from 'src/app/report/models/player-analysis';
import { AuraId } from 'src/app/logs/models/aura-id.enum';
import { CastDetails } from '../models/cast-details';
import { SpellId } from 'src/app/logs/models/spell-id.enum';
import { duration } from '../models/stat-utils';

export class RoarAnalyzer {
  private roarUptime: number;
  private roarDowntime: number;
  private events: IBuffData[];
  private casts: CastDetails[];

  constructor(private analysis: PlayerAnalysis, casts: CastDetails[]) {
    this.events = analysis.events.buffs.filter(x => x.ability.guid == AuraId.SAVAGE_ROAR);
    this.casts = casts.filter(x => x.spellId == SpellId.ROAR);
  }

  public get totalRoarUptime(): number {
    if (this.roarUptime !== undefined) {
      return this.roarUptime;
    }

    this.analyze();

    return this.roarUptime;
  }

  public get totalRoarDowntime(): number {
    if (this.roarDowntime !== undefined) {
      return this.roarDowntime;
    }

    this.analyze();

    return this.roarDowntime;
  }

  private analyze(): number {
    let start = this.analysis.encounter.start,
      end = this.analysis.encounter.end,
      encounterDuration = end - start,
      roarDuration: number = 0,
      lastRoar: IBuffData | undefined = undefined,
      roarActive: boolean = false,
      buffIndex = 0,
      event: IBuffData;

    while (buffIndex < this.events.length) {
      event = this.events[buffIndex];

      switch (event.type) {
        case 'applybuff':
          lastRoar = event;
          roarActive = true;
          break;
        case 'refreshbuff':
          roarDuration += this.GetRoarDuration(lastRoar, event.timestamp, event);
          lastRoar = event;
          break;
        case 'removebuff':
          roarDuration += this.GetRoarDuration(lastRoar, event.timestamp, event);
          roarActive = false;
          break;
      }

      buffIndex++;
    }

    if (roarActive) {
      roarDuration += this.GetRoarDuration(lastRoar, end, undefined);
    }

    this.roarUptime = roarDuration;
    this.roarDowntime = encounterDuration - roarDuration;

    return this.roarUptime;
  }

  private GetRoarDuration(lastRoar: IBuffData | undefined, end: number, event: any): number {
    if (lastRoar === undefined) {
      console.log("can't find starting roar");
      return 0;
    }
    const lastRoarCast = this.casts.find(x => Math.abs(x.castEnd - lastRoar.timestamp) < 100);
    if (lastRoarCast == undefined) {
      console.log("can't match roar cast with buff refresh/end");
      console.log(event);
      console.log(duration(lastRoar.timestamp - this.analysis.encounter.start), lastRoar.timestamp);
      // console.log(this.casts);
    }

    const curRoarDuration = end - lastRoar.timestamp;
    lastRoar.duration = curRoarDuration;
    return curRoarDuration;
  }
}

/// TODO: Infer t8 from roar duration
