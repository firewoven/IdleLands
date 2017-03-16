
import * as _ from 'lodash';

import { Spell, SpellType } from '../spell';

import { DamageReductionBoost } from '../effects/DamageReductionBoost';

export class EnergyShield extends Spell {
  static description = 'Creats a magical barrier around an ally, reducing the damage they take for 5 rounds.';
  static element = SpellType.BUFF;
  static tiers = [
    { name: 'energy shield',      spellPower: 100,    weight: 25, cost: 200,  profession: 'Mage', level: 5 },
    { name: 'energy buckler',     spellPower: 400,    weight: 25, cost: 900,  profession: 'Mage', level: 25 },
    { name: 'energy towershield', spellPower: 1000,   weight: 25, cost: 2200, profession: 'Mage', level: 65 },
    { name: 'energy omegashield', spellPower: 5000,   weight: 25, cost: 6000, profession: 'Mage', level: 125,
      collectibles: ['Jar of Magic Dust'] }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyWithoutEffect(caster, 'DamageReductionBoost');
  }

  determineTargets() {
    return this.$targetting.randomAllyWithoutEffect('DamageReductionBoost');
  }

  calcDuration() {
    return 5;
  }

  calcPotency() {
    return this.spellPower;
  }

  preCast() {
    const message = '%player cast %spellName on %targetName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        applyEffect: DamageReductionBoost,
        targets: [target]
      });
    });
  }
}
