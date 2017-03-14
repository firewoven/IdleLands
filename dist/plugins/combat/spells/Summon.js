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
var monster_generator_1 = require("../../../shared/monster-generator");
var monsters = {
    Necromancer: [
        { name: 'zombie', statMult: 0.5, slotCost: 1, restrictLevel: 5, restrictClasses: ['Monster'] },
        {
            name: 'skeleton',
            statMult: 0.8,
            slotCost: 1,
            restrictLevel: 25,
            restrictClasses: ['Generalist', 'Rogue', 'Mage', 'Cleric', 'Barbarian', 'Fighter', 'SandwichArtist']
        },
        { name: 'wraith', statMult: 1.1, slotCost: 1, restrictLevel: 55 },
        { name: 'vampire', statMult: 1.0, slotCost: 2, restrictLevel: 70, baseStats: { vampire: 10 } },
        { name: 'plaguebringer', statMult: 1.0, slotCost: 2, restrictLevel: 70, baseStats: { venom: 10 } },
        { name: 'ghoul', statMult: 1.0, slotCost: 2, restrictLevel: 70, baseStats: { poison: 10 } },
        {
            name: 'dracolich',
            statMult: 1.35,
            slotCost: 4,
            restrictLevel: 85,
            restrictClasses: ['Lich'],
            requireCollectibles: ['Undead Dragon Scale']
        },
        {
            name: 'demogorgon',
            statMult: 1.75,
            slotCost: 6,
            restrictLevel: 150,
            baseStats: { mirror: 1 },
            requireCollectibles: ['Gorgon Snake']
        }
    ]
};
var Summon = (function (_super) {
    __extends(Summon, _super);
    function Summon() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Summon.shouldCast = function (caster) {
        return !caster.$isMinion && !caster._special.atMaximum();
    };
    Summon.prototype.determineTargets = function () {
        return this.$targetting.self;
    };
    Summon.prototype.chooseValidMonster = function () {
        var _this = this;
        return _(monsters[this.caster.professionName])
            .reject(function (mon) { return mon.restrictLevel > _this.caster.level; })
            .reject(function (mon) { return _this.caster.$collectibles && mon.requireCollectibles && !_.every(mon.requireCollectibles, function (col) { return _this.caster.$collectibles.hasCollectible(col); }); })
            .reject(function (mon) { return mon.slotCost > _this.caster._special.maximum - _this.caster.special; })
            .sample();
    };
    Summon.prototype.preCast = function () {
        var _this = this;
        var baseMonster = _.cloneDeep(this.chooseValidMonster());
        _.extend(baseMonster, baseMonster.baseStats);
        if (baseMonster.restrictClasses) {
            baseMonster.class = _.sample(baseMonster.restrictClasses);
        }
        var mimicTarget = this.$targetting.strongestEnemyScore;
        var summonedMonster = monster_generator_1.MonsterGenerator.augmentMonster(baseMonster, mimicTarget);
        summonedMonster.name = this.caster.fullname + "'s " + summonedMonster.name;
        summonedMonster.$isMinion = true;
        summonedMonster._level.set(Math.floor(this.caster.level / 2));
        summonedMonster.recalculateStats();
        this.caster.party.playerJoin(summonedMonster);
        this.caster.$battle._setupPlayer(summonedMonster);
        var isLich = summonedMonster.professionName === 'Lich';
        // Lich summons use default death message if they have phylacteries left.
        if (!isLich) {
            summonedMonster._deathMessage = '%player exploded into a pile of arcane dust!';
        }
        summonedMonster._eventSelfKilled = function () {
            // If the lich has phylacteries left, he stays in the party.
            if (isLich && !summonedMonster._special.atMinimum()) {
                return;
            }
            // If the lich has HP but no phylacteries, he's on his last life, so he stays in the party.
            if (isLich && !summonedMonster._hp.atMinimum()) {
                // Change to the standard minion death message.
                summonedMonster._deathMessage = '%player exploded into a pile of arcane dust!';
                return;
            }
            _this.caster._special.sub(baseMonster.slotCost);
            summonedMonster.party.playerLeave(summonedMonster);
        };
        var message = "%player used %spellName and spawned a " + baseMonster.name + "!";
        this.caster._special.add(baseMonster.slotCost);
        _super.prototype.cast.call(this, {
            damage: 0,
            message: message,
            targets: [this.caster]
        });
    };
    return Summon;
}(spell_1.Spell));
Summon.element = spell_1.SpellType.PHYSICAL;
Summon.tiers = [
    { name: 'summon', spellPower: 1, weight: 90, cost: 350, level: 25, profession: 'Necromancer' }
];
exports.Summon = Summon;
