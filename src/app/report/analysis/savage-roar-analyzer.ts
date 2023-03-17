import { IBuffData } from 'src/app/logs/interfaces';
import { PlayerAnalysis } from 'src/app/report/models/player-analysis';
import { AuraId } from 'src/app/logs/models/aura-id.enum';
import { CastDetails } from '../models/cast-details';
import { SpellId } from 'src/app/logs/models/spell-id.enum';

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
          roarDuration += this.GetRoarDuration(lastRoar, event.timestamp);
          lastRoar = event;
          break;
        case 'removebuff':
          roarDuration += this.GetRoarDuration(lastRoar, event.timestamp);
          roarActive = false;
          break;
      }

      buffIndex++;
    }

    if (roarActive) {
      roarDuration += this.GetRoarDuration(lastRoar, end);
    }

    this.roarUptime = roarDuration;
    this.roarDowntime = encounterDuration - roarDuration;

    return this.roarUptime;
  }

  private GetRoarDuration(lastRoar: IBuffData | undefined, end: number): number {
    if (lastRoar === undefined)
      return 0;
    const lastRoarCast = this.casts.find(x => x.castEnd == lastRoar.timestamp);
    if(lastRoarCast == undefined){
      console.log("i cant find my roar :(");
      console.log(lastRoar);
    }

    const curRoarDuration = end - lastRoar.timestamp;
    lastRoar.duration = curRoarDuration;
    return curRoarDuration;
  }
}

  // private canInferT8(IBuffData event): boolean {
  //   if (ev`)
  //   return true;
  // }
