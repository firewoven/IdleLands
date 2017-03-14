"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var spell_1 = require("../spell");
var stat_calculator_1 = require("../../../shared/stat-calculator");
var Attack = (function (_super) {
    __extends(Attack, _super);
    function Attack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Attack.shouldCast = function () {
        return this.$canTarget.yes();
    };
    Attack.prototype.calcDamage = function () {
        var min = (this.caster.liveStats.str / 3) * (this.caster.liveStats.silver > 0 ? 1.1 : 1);
        var max = (this.caster.liveStats.str * (this.caster.liveStats.power > 0 ? 1.1 : 1));
        return this.minMax(min, max) * this.spellPower;
    };
    Attack.prototype.determineTargets = function () {
        return this.$targetting.randomEnemy;
    };
    Attack.prototype.preCast = function () {
        var _this = this;
        var message = '%player attacked %targetName with %hisher %weaponName and dealt %damage damage!';
        var weaponName = _.get(this.caster.equipment, 'mainhand.fullname', 'claw');
        var targets = this.determineTargets();
        if (_.compact(targets).length === 0) {
            return;
        }
        _.each(targets, function (target) {
            var done = false;
            var connected = true;
            var damage = _this.calcDamage();
            var messageData = {
                weaponName: weaponName,
                damage: damage
            };
            var critChance = Math.min(100, Math.max(0, 1 + _this.caster.liveStats.crit + (_this.caster.liveStats.vorpal ? 10 : 0)));
            if (spell_1.Spell.chance.bool({ likelihood: critChance }) && target.liveStats.aegis <= 0) {
                _this.caster.$battle.tryIncrement(_this.caster, 'Combat.Give.CriticalHit');
                _this.caster.$battle.tryIncrement(target, 'Combat.Receive.CriticalHit');
                damage = _this.caster.liveStats.str * _this.spellPower * (_this.caster.liveStats.lethal > 0 ? 1.5 : 1);
                message = '%player CRITICALLY attacked %targetName with %hisher %weaponName and dealt %damage damage!';
                done = true;
            }
            var canDodge = spell_1.Spell.chance.bool({ likelihood: 80 });
            var _a = [-target.liveStats.dodge, _this.caster.liveStats.overcomeDodge], dodge = _a[0], overcomeDodge = _a[1];
            var dodgeRoll = spell_1.Spell.chance.integer({ min: dodge, max: Math.max(dodge + 1, overcomeDodge) });
            if (!done && canDodge && dodgeRoll <= 0) {
                done = true;
                connected = false;
                _this.caster.$battle.tryIncrement(_this.caster, 'Combat.Give.Dodge');
                _this.caster.$battle.tryIncrement(target, 'Combat.Receive.Dodge');
                message = '%player attacked %targetName with %hisher %weaponName, but %targetName dodged!';
                damage = 0;
            }
            var canAvoidHit = spell_1.Spell.chance.bool({ likelihood: 80 });
            var _b = [-target.liveStats.avoidHit, _this.caster.liveStats.hit, -target.liveStats.deflect], avoidHit = _b[0], hit = _b[1], deflect = _b[2];
            var hitRoll = spell_1.Spell.chance.integer({ min: avoidHit, max: Math.max(avoidHit + 1, hit) });
            if (!done && canAvoidHit && deflect <= hitRoll && hitRoll <= 0) {
                message = '%player attacked %targetName with %hisher %weaponName, but %player missed!';
                damage = 0;
                connected = false;
                if (hitRoll < deflect) {
                    _this.caster.$battle.tryIncrement(_this.caster, 'Combat.Give.Deflect');
                    _this.caster.$battle.tryIncrement(target, 'Combat.Receive.Deflect');
                    var deflectItem = _.get(_.sample(_.values(target.equipment)), 'fullname', 'claw');
                    messageData.deflectItem = deflectItem;
                    message = '%player attacked %targetName with %hisher %weaponName, but %targetName deflected it with %deflectItem!';
                }
                else {
                    _this.caster.$battle.tryIncrement(_this.caster, 'Combat.Give.Miss');
                    _this.caster.$battle.tryIncrement(target, 'Combat.Receive.Miss');
                }
            }
            _super.prototype.cast.call(_this, {
                damage: damage,
                message: message,
                messageData: messageData,
                targets: [target]
            });
            if (!connected)
                return;
            _.each(stat_calculator_1.ATTACK_STATS, function (stat) {
                var canUse = _this.caster.liveStats[stat];
                if (canUse <= 0)
                    return;
                var chance = spell_1.Spell.chance.bool({ likelihood: Math.max(0, Math.min(100, canUse * 5)) });
                if (!chance)
                    return;
                var properEffect = _.capitalize(stat);
                if (target.$effects.hasEffect(properEffect))
                    return;
                var effectProto = require("../effects/" + properEffect)[properEffect];
                var effect = new effectProto({ target: target, potency: canUse, duration: 0 });
                effect.origin = { name: _this.caster.fullname, ref: _this.caster, spell: stat };
                target.$effects.add(effect);
                effect.affect(target);
                _this.caster.$battle.tryIncrement(_this.caster, "Combat.Give.CombatEffect." + properEffect);
                _this.caster.$battle.tryIncrement(target, "Combat.Receive.CombatEffect." + properEffect);
            });
        });
    };
    return Attack;
}(spell_1.Spell));
Attack.description = 'A simple attack that uses STR to deal damage.';
Attack.element = spell_1.SpellType.PHYSICAL;
Attack.tiers = [
    { name: 'attack', spellPower: 1.0, weight: 50, cost: 0, level: 1, profession: 'Archer' },
    { name: 'attack', spellPower: 1.2, weight: 30, cost: 0, level: 1, profession: 'Barbarian' },
    { name: 'strike', spellPower: 2.3, weight: 30, cost: 0, level: 50, profession: 'Barbarian' },
    { name: 'attack', spellPower: 1.0, weight: 40, cost: 0, level: 1, profession: 'Bard' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Beatomancer' },
    { name: 'attack', spellPower: 0.7, weight: 20, cost: 0, level: 1, profession: 'Bitomancer' },
    { name: 'attack', spellPower: 0.8, weight: 20, cost: 0, level: 1, profession: 'Cleric' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Clockborg' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Druid' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Fencer' },
    { name: 'attack', spellPower: 1.1, weight: 65, cost: 0, level: 1, profession: 'Fighter' },
    { name: 'strike', spellPower: 1.3, weight: 65, cost: 0, level: 50, profession: 'Fighter' },
    { name: 'assault', spellPower: 1.7, weight: 65, cost: 0, level: 100, profession: 'Fighter',
        collectibles: ['Broken Katana'] },
    { name: 'attack', spellPower: 1.0, weight: 30, cost: 0, level: 1, profession: 'Generalist' },
    { name: 'attack', spellPower: 1.0, weight: 50, cost: 0, level: 1, profession: 'Jester' },
    { name: 'strike', spellPower: 1.5, weight: 50, cost: 0, level: 90, profession: 'Jester' },
    { name: 'attack', spellPower: 0.5, weight: 50, cost: 0, level: 1, profession: 'Lich' },
    { name: 'attack', spellPower: 0.6, weight: 15, cost: 0, level: 1, profession: 'Mage' },
    { name: 'attack', spellPower: 0.9, weight: 20, cost: 0, level: 1, profession: 'MagicalMonster' },
    { name: 'attack', spellPower: 1.0, weight: 50, cost: 0, level: 1, profession: 'Monster' },
    { name: 'attack', spellPower: 0.5, weight: 20, cost: 0, level: 1, profession: 'Necromancer' },
    { name: 'attack', spellPower: 1.1, weight: 50, cost: 0, level: 1, profession: 'Pirate' },
    { name: 'strike', spellPower: 1.9, weight: 50, cost: 0, level: 75, profession: 'Pirate' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Rogue' },
    { name: 'strike', spellPower: 1.4, weight: 20, cost: 0, level: 25, profession: 'Rogue' },
    { name: 'attack', spellPower: 1.0, weight: 50, cost: 0, level: 1, profession: 'SandwichArtist' },
    { name: 'attack', spellPower: 1.0, weight: 20, cost: 0, level: 1, profession: 'Trickster' }
];
exports.Attack = Attack;
