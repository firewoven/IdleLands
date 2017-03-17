
import * as _ from 'lodash';
import { Spell, SpellType } from '../spell';

import { DownloadedRAM } from '../effects/DownloadedRAM';

export class DownloadRAM extends Spell {
  static description = 'Download some RAM and get better, faster, and stronger. Costs INT but increases STR, DEX, and AGI.';
  static element = SpellType.DIGITAL;
  static stat = 'special';
  static tiers = [
    { name: 'single-channel RAM',   spellPower: 1, weight: 40, cost: 32,    level: 8,    profession: 'Bitomancer' },
    { name: 'dual-channel RAM',     spellPower: 2, weight: 40, cost: 64,    level: 16,   profession: 'Bitomancer' },
    { name: 'triple-channel RAM',   spellPower: 3, weight: 40, cost: 128,   level: 32,   profession: 'Bitomancer' },
    { name: 'quad-channel RAM',     spellPower: 4, weight: 40, cost: 256,   level: 64,   profession: 'Bitomancer' }
  ];

  static shouldCast(caster) {
    return !caster.$effects.hasEffect('DownloadedRAM');
  }

  calcDuration() {
    return this.spellPower + 3;
  }

  calcPotency() {
    return this.spellPower * 10;
  }

  determineTargets() {
    return this.$targetting.self;
  }

  preCast() {
    const message = '%player downloaded some %spellName!';
    const targets = this.determineTargets();

    _.each(targets, target => {
      super.cast({
        damage: 0,
        message,
        applyEffect: DownloadedRAM,
        targets: [target]
      });
    });
  }
}
