import { AuraId } from 'src/app/logs/models/aura-id.enum';

export class Settings {
  public hasteRating: number|null = null;
  public improvedMindBlast = 5;
  public improvedMoonkinAura = true;
  public tier7_2p = true;
  public tier8_4p = true;
  public improvedRetAura = true;
  public wrathOfAir = true;
  public ripGlyphActive = true;
  public shredGlyphActive = true;
  public showMelees = false;
  public auras: number[] = [];

  constructor(settings?: ISettings) {
    if (settings) {
      this.hasteRating = settings.hasteRating;
      this.improvedMindBlast = settings.improvedMindBlast;
      this.improvedMoonkinAura = settings.improvedMoonkinAura;
      this.ripGlyphActive = settings.ripGlyphActive;
      this.shredGlyphActive = settings.shredGlyphActive;
      this.tier7_2p = settings.tier7_2p;
      this.tier8_4p = settings.tier8_4p;
      this.showMelees = settings.showMelees;
      this.improvedRetAura = settings.improvedRetAura;
      this.wrathOfAir = settings.wrathOfAir;
      this.auras = settings.auras || [];
    }
  }

  equals(other: Settings) {
    return this.hasteRating === other.hasteRating &&
      this.improvedMindBlast === other.improvedMindBlast &&
      this.improvedMoonkinAura === other.improvedMoonkinAura &&
      this.ripGlyphActive === other.ripGlyphActive &&
      this.shredGlyphActive === other.shredGlyphActive &&
      this.tier7_2p === other.tier7_2p &&
      this.tier8_4p === other.tier8_4p &&
      this.showMelees === other.showMelees &&
      this.improvedRetAura === other.improvedRetAura &&
      this.wrathOfAir === other.wrathOfAir &&
      this.auras.length === other.auras.length &&
      this.auras.every((id) => other.auras.includes(id));
  }

  haveAura(id: AuraId) {
    return this.auras?.some((a) => a === id) || false;
  }
}

export interface ISettings {
  hasteRating: number|null;
  improvedMindBlast: number;
  improvedMoonkinAura: boolean;
  ripGlyphActive: boolean;
  shredGlyphActive: boolean;
  tier7_2p: boolean;
  tier8_4p: boolean;
  showMelees: boolean;
  improvedRetAura: boolean;
  wrathOfAir: boolean;
  auras?: number[];
}
