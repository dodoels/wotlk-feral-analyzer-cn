import { IBuffData } from 'src/app/logs/interfaces';
import { PlayerAnalysis } from 'src/app/report/models/player-analysis';
import { AuraId } from 'src/app/logs/models/aura-id.enum';

export class RoarAnalyzer {
  private roarUptime: number;
  private roarDowntime: number;
  private events: IBuffData[];

  constructor(private analysis: PlayerAnalysis) {
    this.events = analysis.events.buffs;
  }

  public get totalRoarUptime(): number {
    if(this.roarUptime !== undefined){
      return this.roarUptime;
    }

    this.analyze();

    return this.roarUptime;
  }

  public get totalRoarDowntime(): number {
    if(this.roarDowntime !== undefined){
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
      lastRoar: number = 0,
      roarActive: boolean = false,
      buffIndex = 0,
      event: IBuffData;

    while (buffIndex < this.events.length) {
      event = this.events[buffIndex];

      if(event.ability.guid != AuraId.SAVAGE_ROAR){
        buffIndex++;
        continue;
      }

      switch (event.type) {
        case 'applybuff':
          lastRoar = event.timestamp;
          roarActive = true;
          break;
        case 'refreshbuff':
          break;
        case 'removebuff':
          roarDuration += (event.timestamp - lastRoar);
          roarActive = false;
          break;
      }

      buffIndex++;
    }

    if(roarActive){
      roarDuration += (end - lastRoar);
    }
    
    this.roarUptime = roarDuration;
    this.roarDowntime = encounterDuration - roarDuration;

    return this.roarUptime;
  }
}
