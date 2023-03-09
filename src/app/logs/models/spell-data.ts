import { SpellId } from 'src/app/logs/models/spell-id.enum';
import { HasteUtils } from 'src/app/report/models/haste';
import { ISettings, Settings } from 'src/app/settings';
import { TierBonuses } from '../interfaces';

export enum DamageType {
  NONE,
  DIRECT,
  DOT,
  CHANNEL,
  AOE,
  DIRECTAOE
}

function data(params: Partial<ISpellData> = {}): ISpellData {
  return Object.assign({}, Spell.DEFAULTS, params) as ISpellData;
}

export class Spell {
  public static readonly DEFAULTS: Partial<ISpellData> = {
    rankIds: [],
    damageIds: [],
    baseCastTime: 0,
    maxDamageInstances: 0,
    maxDuration: 0,
    maxTicks: 0,
    baseTickTime: 0,
    cooldown: 0,
    gcd: true,
    dotHaste: false,
    statsByTick: false,
    multiTarget: false,
  };

  public static baseData(id: SpellId) {
    return Spell.dataBySpellId[id];
  }

  public static get(id: SpellId, settings: Settings, currentHaste?: number, tierBonuses?: TierBonuses): ISpellData {
    const baseData = Spell.dataBySpellId[id];

    // apply overrides for dynamic data
    const dynamic = baseData.dynamic ? baseData.dynamic.call(null, baseData, settings, tierBonuses) : {};
    const data = Object.assign({}, Spell.dataBySpellId[id], dynamic);

    // apply haste adjustments if haste specified.
    if (currentHaste !== undefined && data.damageType === DamageType.DOT && data.dotHaste) {
      data.maxDuration = HasteUtils.duration(id, currentHaste);
    }

    return data;
  }

  public static rank(id: SpellId, data: ISpellData) {
    if (id === data.mainId) {
      return data.maxRank;
    }

    return data.rankIds[id];
  }

  public static fromDamageId(id: number): ISpellData | undefined {
    if (this.dataBySpellId.hasOwnProperty(id)) {
      return this.dataBySpellId[id];
    }

    return Object.values(this.data).find((spell) => spell.damageIds.includes(id));
  }

  public static data: { [spellId: number]: ISpellData } = {
    [SpellId.ADAMANTITE_GRENADE]: data({
      damageType: DamageType.AOE,
      baseCastTime: 1,
      maxDamageInstances: 20,
      gcd: false
    }),

    [SpellId.BERSERKING]: data({
      damageType: DamageType.NONE,
      gcd: false
    }),

    [SpellId.DENSE_DYNAMITE]: data({
      damageType: DamageType.AOE,
      baseCastTime: 1,
      maxDamageInstances: 20,
      gcd: false
    }),

    [SpellId.RIP]: data({
      rankIds: {
        [9896]: 6,
        [27008]: 7,
        [49799]: 8
      },
      maxRank: 9,
      damageType: DamageType.DOT,
      maxDamageInstances: 6,
      maxDuration: 12,
      maxTicks: 6,
      baseTickTime: 2,
      dynamic: (baseData, settings, tierBonuses) => ({
        maxDuration: baseData.maxDuration + 
          (tierBonuses?.tier7_2p ? 4 : 0) + (settings?.shredGlyphActive ? 6 : 0) + (settings?.ripGlyphActive ? 4 : 0),
        maxDamageInstances: baseData.maxDamageInstances + 
          (tierBonuses?.tier7_2p ? 2 : 0) + (settings?.shredGlyphActive ? 3 : 0) + (settings?.ripGlyphActive ? 2 : 0),
        maxTicks: baseData.maxTicks + 
          (tierBonuses?.tier7_2p ? 2 : 0) + (settings?.shredGlyphActive ? 3 : 0) + (settings?.ripGlyphActive ? 2 : 0),
      })
    }),

    [SpellId.NATURES_GRASP]: data({
      damageType: DamageType.NONE
    }),

    [SpellId.FAERIE_FIRE_FERAL]: data({
      damageType: DamageType.DIRECT,
      damageIds: [SpellId.FAERIE_FIRE_FERAL_DMG]
    }),

    [SpellId.FAERIE_FIRE]: data({
      damageType: DamageType.NONE
    }),

    [SpellId.REBIRTH]: data({
      damageType: DamageType.NONE,
      baseCastTime: 2,
      gcd: true
    }),

    [SpellId.FEL_IRON_BOMB]: data({
      damageType: DamageType.AOE,
      baseCastTime: 1,
      maxDamageInstances: 20,
      gcd: false
    }),

    [SpellId.GOBLIN_SAPPER]: data({
      damageType: DamageType.AOE,
      maxDamageInstances: 20,
      gcd: false
    }),

    [SpellId.SWIPE_CAT]: data({
      damageType: DamageType.DIRECTAOE,
      multiTarget: true,
      maxDuration: 0.5,
    }),

    [SpellId.SWIPE_BEAR]: data({
      damageType: DamageType.DIRECTAOE,
      rankIds: {
        [9908]: 5,
        [26997]: 6,
        [48561]: 7
      },
      maxDuration: 0.5,
      maxRank: 8,
      multiTarget: true,
    }),

    [SpellId.MELEE]: data({
      damageType: DamageType.DIRECT,
      gcd: false
    }),

    [SpellId.MAUL]: data({
      rankIds: {
        [9881]: 7,
        [26996]: 8,
        [48479]: 9
      },
      maxRank: 10,
      damageType: DamageType.AOE,
      multiTarget: true,
      maxDuration: 0.5,
      maxDamageInstances: 2,
      gcd: false
    }),

    [SpellId.SHRED]: data({
      rankIds: {
        [27001]: 6,
        [27002]: 7,
        [48571]: 8
      },
      maxRank: 9,
      damageType: DamageType.DIRECT,
      maxDamageInstances: 1,
    }),

    [SpellId.BITE]: data({
      rankIds: {
        [31018]: 5,
        [24248]: 6,
        [48576]: 7
      },
      maxRank: 8,
      damageType: DamageType.DIRECT,
      maxDamageInstances: 1,
    }),

    [SpellId.MANGLE_CAT]: data({
      rankIds: {
        [33982]: 2,
        [33983]: 3,
        [48565]: 4
      },
      maxRank: 5,
      damageType: DamageType.DIRECT,
      maxDamageInstances: 1,
    }),

    [SpellId.MANGLE_BEAR]: data({
      rankIds: {
        [33986]: 2,
        [33987]: 3,
        [48563]: 4
      },
      maxRank: 5,
      damageType: DamageType.DIRECT,
      maxDamageInstances: 1,
    }),

    [SpellId.ROAR]: data({
      maxRank: 1,
      damageType: DamageType.NONE,
    }),

    [SpellId.TIGERS_FURY]: data({
      rankIds: {
        [9845]: 3,
        [9846]: 4,
        [50212]: 5
      },
      maxRank: 6,
      damageType: DamageType.NONE,
      gcd: false
    }),

    [SpellId.ENRAGE]: data({
      damageType: DamageType.NONE,
      gcd: false
    }),

    [SpellId.FERAL_BERSERK]: data({
      damageType: DamageType.NONE,
    }),

    [SpellId.INNERVATE]: data({
      damageType: DamageType.NONE,
    }),

    [SpellId.GOTW]: data({
      rankIds: {
        [21849]: 1,
        [21850]: 2,
        [26991]: 3
      },
      maxRank: 4,
      damageType: DamageType.NONE,
    }),

    [SpellId.LACERATE]: data({
      rankIds: {
        [33745]: 1,
        [48567]: 2
      },
      maxRank: 3,
      damageType: DamageType.DOT,
      baseTickTime: 3,
      dotHaste: false
    }),

    [SpellId.SUPER_SAPPER]: data({
      damageType: DamageType.AOE,
      maxDamageInstances: 20,
      gcd: false
    }),

    [SpellId.DIRE_BEAR_FORM]: data({
      damageType: DamageType.NONE
    }),

    [SpellId.CAT_FORM]: data({
      damageType: DamageType.NONE
    }),

    [SpellId.RAKE]: data({
      damageType: DamageType.DOT,
      rankIds: {
        [9904]: 4,
        [27003]: 5,
        [48573]: 6
      },
      maxRank: 7,
      dotHaste: false,
      maxDamageInstances: 4,
      maxDuration: 9,
      maxTicks: 3,
      baseTickTime: 3
    }),

    [SpellId.POUNCE]: data({
      damageType: DamageType.DOT,
      rankIds: {
        [9904]: 2,
        [27003]: 3,
        [48573]: 4
      },
      maxRank: 5,
      dotHaste: false,
      maxDamageInstances: 6,
      maxDuration: 18,
      maxTicks: 6,
      baseTickTime: 3,
      damageIds: [SpellId.POUNCE_BLEED]
    }),

    [SpellId.MAIM]: data({
      damageType: DamageType.DIRECT,
      rankIds: {
        [22570]: 1
      },
      maxRank: 2,
    }),

    [SpellId.RAVAGE]: data({
      damageType: DamageType.DIRECT,
      rankIds: {
        [9867]: 4,
        [27005]: 5,
        [48578]: 6
      },
      maxRank: 7,
    }),

  }

  public static dataBySpellId: { [spellId: number]: ISpellData } =
    Object.keys(Spell.data).reduce((lookup, next) => {
      const spellId = parseInt(next),
        data: ISpellData = Spell.data[spellId];

      data.mainId = spellId;
      lookup[spellId] = data;

      for (let rankId of Object.keys(data.rankIds)) {
        lookup[parseInt(rankId)] = data;
      }

      return lookup;
    }, {} as { [spellId: number]: ISpellData });
}

export interface ISpellData {
  mainId: number;
  damageType: DamageType;
  rankIds: { [id: number]: number };
  maxRank: number | undefined;
  damageIds: number[]
  baseCastTime: number;
  maxDamageInstances: number;
  maxDuration: number;
  baseTickTime: number;
  maxTicks: number;
  cooldown: number;
  gcd: boolean;
  dotHaste: boolean;
  statsByTick: boolean;
  multiTarget: boolean;
  maxInstancesPerDamageId?: { [id: number]: number };
  dynamic?: (baseData: ISpellData, settings: ISettings, tierBonuses?: TierBonuses) => Partial<ISpellData>
}
