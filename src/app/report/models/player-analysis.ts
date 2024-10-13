import { ActorStats } from 'src/app/logs/models/actor-stats';
import { CastStats } from 'src/app/report/models/cast-stats';
import { LogSummary } from 'src/app/logs/models/log-summary';
import { IEncounterEvents } from 'src/app/logs/logs.service';
import { Report } from 'src/app/report/models/report';
import { EventAnalyzer } from 'src/app/report/analysis/event-analyzer';
import { GcdAnalyzer } from 'src/app/report/analysis/gcd-analyzer';
import { EncounterSummary } from 'src/app/logs/models/encounter-summary';
import { CastsAnalyzer } from 'src/app/report/analysis/casts-analyzer';
import { SpellId } from 'src/app/logs/models/spell-id.enum';
import { Spell } from 'src/app/logs/models/spell-data';
import { SpellStats } from 'src/app/report/models/spell-stats';
import { Actor } from 'src/app/logs/models/actor';
import { CombatantInfo } from 'src/app/logs/models/combatant-info';
import { Settings } from 'src/app/settings';
import { EventPreprocessor } from 'src/app/report/analysis/event-preprocessor';
import { Item } from 'src/app/logs/models/item-data';
import { TierBonuses } from 'src/app/logs/interfaces';
import { RoarAnalyzer } from '../analysis/savage-roar-analyzer';
import { FeralFaerieFireAnalyzer } from '../analysis/feral-faerie-fire-analyzer';

export class PlayerAnalysis {
  public log: LogSummary;
  public encounter: EncounterSummary;
  public playerId: string;
  public actor: Actor;
  public actorInfo: CombatantInfo;
  public settings: Settings;
  public events: IEncounterEvents;
  public report: Report;
  public totalGcds: number;
  public savageRoarDuration: number;
  public feralFaerieFireCPM: number;
  public tierBonuses: TierBonuses;

  private _rawStats: ActorStats;
  private _rawEvents: IEncounterEvents;
  private _applyWrathOfAir: boolean | undefined;

  private static _cache: { [key: string]: PlayerAnalysis } = {};
  public static getCached(logId: string, encounterId: number, playerId: string) {
    return PlayerAnalysis._cache[PlayerAnalysis.cacheKey(logId, playerId, encounterId)];
  }

  public static cacheKey(logId: string, playerId: string, encounterId: number) {
    return `${logId}:${encounterId}:${playerId}`;
  }

  constructor(log: LogSummary, encounterId: number, playerId: string, actorInfo: CombatantInfo, settings: Settings, events: IEncounterEvents) {
    this.log = log;
    this.encounter = log.getEncounter(encounterId) as EncounterSummary;
    this.playerId = playerId;
    this.actor = log.getActorByRouteId(playerId) as Actor;
    this.settings = settings;
    this.actorInfo = actorInfo;
    this.savageRoarDuration = 0;
    this.feralFaerieFireCPM = 0;

    this._rawStats = actorInfo.stats;
    this._rawEvents = events;

    this.setTierBonuses();

    this.analyze();
  }

  private setTierBonuses(){
    if (this.actorInfo.gear?.length > 0) {
      const t7_2p = Item.HasTier7bonus2p(this.actorInfo.gear);
      console.log("Player has 2p tier 7? ", t7_2p);
      this.settings.tier7_2p = t7_2p;
    } else {
      console.log("No gear found");
    }
    this.tierBonuses = {tier7_2p: this.settings.tier7_2p}
  }

  refresh(settings: Settings) {
    if (!this.settings.equals(settings)) {
      this.settings = settings;
      this.setTierBonuses();
      this.analyze();
    }
  }

  get title() {
    return `${this.actor.name} - ${this.encounter.description}`
  }

  get targetIds(): number[] {
    return this.report?.targetIds || [];
  }

  getActor(actorId: number, friendly = true) {
    return this.log.getActor(actorId, friendly);
  }

  getActorName(targetId: number, targetInstance?: number) {
    return this.log.getActorName(targetId, targetInstance);
  }

  stats(options: IStatsSearch): CastStats {
    if(options.spellId == SpellId.RIP_AND_ROAR){
      return this.roarStats(options);
    }
    if(options.spellId == SpellId.SHRED_AND_FF_AND_OMEN){
      return this.shredStats(options);
    }
    let stats = options.spellId === SpellId.NONE ?
      this.report.stats :
      this.report.getSpellStats(options.spellId);

    if (options.hitCount >= 0 && Spell.data[options.spellId]?.statsByTick) {
      stats = (stats as SpellStats).statsByHitCount(options.hitCount);
    }

    if (options.targetId) {
      stats = stats.targetStats(options.targetId);
    }

    return stats;
  }

  private roarStats(options: IStatsSearch): CastStats {
    const roarStats = this.stats({
      hitCount: options.hitCount,
      spellId: SpellId.ROAR});
    const ripStats = this.stats({
      ...options,
      spellId: SpellId.RIP
    });

    // const ripRoarStats = Object.assign({}, ripStats) as CastStats;

    const ripRoarStats = new CastStats(this.report.analysis);

    ripRoarStats.merge([ripStats, roarStats]);

    return ripRoarStats;
  }

  private shredStats(options: IStatsSearch): CastStats {
    const stats = this.stats({
      hitCount: options.hitCount,
      spellId: SpellId.SHRED});
    const ffStats = this.stats({
      ...options,
      spellId: SpellId.FAERIE_FIRE_FERAL
    });

    const shredStats = new CastStats(this.report.analysis);
    shredStats.merge([ffStats, stats]);
    console.log(stats)

    return shredStats;
  }

  hitCounts(options: IStatsSearch) {
    let stats = options.spellId === SpellId.NONE ?
      this.report.stats :
      this.report.getSpellStats(options.spellId);

    if (options.targetId) {
      stats = stats.targetStats(options.targetId);
    }

    return stats?.hitCounts || [];
  }

  // if a shaman is in the raid, and wrath of air is enabled in settings...
  get applyWrathOfAir() {
    if (this._applyWrathOfAir !== undefined) {
      return this._applyWrathOfAir;
    }

    if (!this.settings?.wrathOfAir) {
      this._applyWrathOfAir = false;
    } else {
      const shamans = this.log.actors.filter((a) => {
        return a.type === 'Shaman' && a.encounterIds.includes(this.encounter.id)
      });

      this._applyWrathOfAir = shamans.length > 0;
    }
    return this._applyWrathOfAir;
  }

  private analyze() {
    this._applyWrathOfAir = undefined;

    // pre-process events
    this.actorInfo.stats = Object.assign({}, this._rawStats);
    this.events = new EventPreprocessor(this, this._rawEvents).run();

    // apply haste rating from settings if missing from log
    if (this.actorInfo.stats?.hasteRating === undefined && this.settings.hasteRating) {
      this.actorInfo.stats = ActorStats.inferred(this.settings.hasteRating);
    }

    // analyze events and generate casts report
    const eventAnalyzer = new EventAnalyzer(this);
    const casts = eventAnalyzer.createCasts();
    eventAnalyzer.showUnreadEvents();
    this.report = new CastsAnalyzer(this, casts).run();

    const roarAnalyzer = new RoarAnalyzer(this, casts);
    this.savageRoarDuration = roarAnalyzer.totalRoarUptime;

    const fffAnalyzer = new FeralFaerieFireAnalyzer(this, casts);
    this.feralFaerieFireCPM = fffAnalyzer.feralFaerieFireCPM;

    // find total possible GCDs in encounter
    this.totalGcds = new GcdAnalyzer(this).totalGcds;

    // Cache result
    PlayerAnalysis._cache[PlayerAnalysis.cacheKey(this.log.id, this.playerId, this.encounter.id)] = this;
  }
}

export interface IStatsSearch {
  spellId: number;
  targetId?: number;
  hitCount: number;
}
