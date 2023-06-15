import { PlayerAnalysis } from 'src/app/report/models/player-analysis';
import { CastDetails } from '../models/cast-details';
import { SpellId } from 'src/app/logs/models/spell-id.enum';

export class FeralFaerieFireAnalyzer {
  private cpm: number;
  private casts: CastDetails[];

  constructor(private analysis: PlayerAnalysis, casts: CastDetails[]) {
    this.casts = casts.filter(x => x.spellId == SpellId.FAERIE_FIRE_FERAL);
  }

  public get feralFaerieFireCPM(): number {
    if (this.cpm !== undefined) {
      return this.cpm;
    }

    this.analyze();

    return this.cpm;
  }

  private analyze(): number {
    this.cpm = this.casts.length;

    return this.cpm;
  }
}
