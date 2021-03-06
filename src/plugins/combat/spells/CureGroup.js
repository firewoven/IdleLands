
import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

export class CureGroup extends Spell {
  static description = 'Heal your entire party for a small amount based on your INT.';
  static element = SpellType.HEAL;
  static tiers = [
    { name: 'cure group',       spellPower: 0.5, weight: 40, cost: 50,    level: 30,  profession: 'Cleric' },
    { name: 'heal group',       spellPower: 1.0, weight: 40, cost: 5800,  level: 55,  profession: 'Cleric' },
    { name: 'restore group',    spellPower: 1.5, weight: 40, cost: 13500, level: 95,  profession: 'Cleric' },
    { name: 'revitalize group', spellPower: 2.5, weight: 40, cost: 30000, level: 145, profession: 'Cleric',
      collectibles: ['Gauntlet'] }
  ];

  static shouldCast(caster) {
    return this.$canTarget.allyBelow50PercentHealth(caster) && caster.party && caster.party.players.length > 1;
  }

  calcDamage() {
    const min = this.caster.liveStats.int;
    const max = this.caster.liveStats.int * 2;
    return -this.minMax(min, max) * this.spellPower;
  }

  determineTargets() {
    return this.$targetting.allAllies;
  }

  preCast() {
    const message = '%player cast %spellName at %targetName and healed %healed hp!';
    const targets = this.determineTargets();
    const totalHeal = this.calcDamage();
    const damage = totalHeal/this.caster.party.players.length;

    _.each(targets, target => {
      super.cast({
        damage,
        message,
        targets: [target]
      });
    });
  }
}
