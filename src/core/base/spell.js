
import _ from 'lodash';

import { SpellTargetStrategy } from '../../plugins/combat/spelltargetstrategy';
import { SpellTargetPossibilities } from '../../plugins/combat/spelltargetpossibilities';
import { MessageParser } from '../../plugins/events/messagecreator';

import Chance from 'chance';
const chance = new Chance();

export class Spell {
  static get chance() { return chance; }
  static tiers = [];
  static $canTarget = SpellTargetPossibilities;

  static stat = 'mp';
  static oper = 'sub';

  static bestTier(caster) {
    return _.last(_.filter(this.tiers, tier => {
      const meetsCollectibleReqs = tier.collectibles ? _.every(tier.collectibles, c => !caster.$collectibles || caster.$collectibles.hasCollectible(c)) : true;
      return tier.profession === caster.professionName && tier.level <= caster.level && meetsCollectibleReqs;
    }));
  }

  get tier() {
    const tiers = this.constructor.tiers;
    return _.last(_.filter(tiers, tier => {
      const meetsCollectibleReqs = tier.collectibles ? _.every(tier.collectibles, c => !this.caster.$collectibles || this.caster.$collectibles.hasCollectible(c)) : true;
      return tier.profession === this.caster.professionName && tier.level <= this.caster.level && meetsCollectibleReqs;
    }));
  }

  get stat() {
    return this.constructor.stat;
  }

  get oper() {
    return this.constructor.oper;
  }

  get element() {
    return this.constructor.element;
  }

  get spellPower() {
    return this.tier.spellPower;
  }

  get cost() {
    return this.tier.cost;
  }

  constructor(caster) {
    this.caster = caster;
    this.$targetting = new Proxy({}, {
      get: (target, name) => {
        return SpellTargetStrategy[name](this.caster);
      }
    });
  }

  calcDamage() {
    return 0;
  }

  determineTargets() {
    return [];
  }

  _emitMessage(player, message, extraData = {}) {
    return MessageParser.stringFormat(message, player, extraData);
  }

  cast({ damage, targets, message, messageData = {} }) {

    this.caster.$battle.tryIncrement(this.caster, `Combat.Utilize.${this.element}`);

    damage = Math.round(damage);
    messageData.damage = damage;

    this.caster.$battle.tryIncrement(this.caster, 'Combat.Give.Damage', damage);

    this.caster[`_${this.stat}`][this.oper](this.cost);

    _.each(targets, target => {
      this.caster.$battle.tryIncrement(target, 'Combat.Receive.Damage', damage);

      messageData.targetName = target.fullname;
      messageData.spellName = this.tier.name;

      // TODO mark an attack as fatal somewhere else in metadata and display metadata on site
      this.caster.$battle._emitMessage(this._emitMessage(this.caster, message, messageData));

      if(damage !== 0) {
        this.dealDamage(target, damage);
      }

      this.affect(target);
    });
  }

  preCast() {}

  dealDamage(target, damage) {
    target._hp.sub(damage);
  }

  affect() {}

  minMax(min, max) {
    return Math.max(1, Spell.chance.integer({ min: min, max: Math.max(min+1, max) }));
  }

}

export const SpellType = {
  PHYSICAL: 'Physical',

  BUFF: 'Buff',
  DEBUFF: 'Debuff',

  HEAL: 'Heal',

  ENERGY: 'Energy',
  HOLY: 'Holy',

  THUNDER: 'Thunder',
  FIRE: 'Fire',
  WATER: 'Water',
  ICE: 'Ice'
};