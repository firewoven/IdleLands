
import _ from 'lodash';

import { Spell, SpellType } from '../../../core/base/spell';

export class SweepingGeneralization extends Spell {
  static element = SpellType.PHYSICAL;
  static tiers = [
    { name: 'sweeping generalization', spellPower: 1.0, weight: 35, cost: 100, profession: 'Generalist', level: 5 },
    { name: 'sweepo generalizo',       spellPower: 0.8, weight: 35, cost: 300, profession: 'MagicalMonster', level: 15,
      collectibles: ['Generalist\'s Guidebook'] }
  ];

  static shouldCast(caster) {
    return this.$canTarget.moreThanOneEnemy(caster);
  }

  calcDamage() {
    const min = (this.caster.stats.str + this.caster.stats.dex) / 4;
    const max = (this.caster.stats.str + this.caster.stats.dex) / 2;
    return this.minMax(min, max) * this.spellPower;
  }

  determineTargets() {
    return this.$targetting.allEnemies;
  }

  cast() {
    const message = '%player used %spellName on %targetName and dealt %damage damage!';
    const targets = this.determineTargets();
    const damage = this.calcDamage();

    _.each(targets, target => {
      super.cast({
        damage,
        message,
        targets: [target]
      });
    });

    console.log('SWEEP GEN');
    process.exit(0);
  }
}