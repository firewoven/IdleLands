"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var SpellTargetPossibilities = (function () {
    function SpellTargetPossibilities() {
    }
    SpellTargetPossibilities.yes = function () {
        return true;
    };
    SpellTargetPossibilities.enemyHasMp = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party === caster.party; })
            .filter(function (p) { return p.mp; })
            .value().length > 1;
    };
    SpellTargetPossibilities.moreThanOneEnemy = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party === caster.party; })
            .value().length > 1;
    };
    SpellTargetPossibilities.enemyNotProfession = function (caster, profession) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party === caster.party; })
            .reject(function (p) { return p.professionName === profession; })
            .value().length >= 1;
    };
    SpellTargetPossibilities.anyEnemyDead = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp > 0; })
            .reject(function (p) { return p.party === caster.party; })
            .value().length >= 1;
    };
    // Dead and not bonecrafted before
    SpellTargetPossibilities.anyBonecraftable = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp > 0; })
            .reject(function (p) { return p.party === caster.party; })
            .reject(function (p) { return p.$prevParty; })
            .value().length >= 1;
    };
    // Not a boss, not a bitomancer
    SpellTargetPossibilities.anyBitFlippable = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party === caster.party; })
            .reject(function (p) { return p.$isBoss; })
            .reject(function (p) { return p.professionName === 'Bitomancer'; })
            .value().length >= 1;
    };
    SpellTargetPossibilities.allyWithoutEffect = function (caster, effect) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party !== caster.party; })
            .reject(function (p) { return p.$effects.hasEffect(effect); })
            .value().length >= 1;
    };
    SpellTargetPossibilities.allyBelowHealthPercent = function (caster, percent) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party !== caster.party; })
            .reject(function (p) { return p._hp.greaterThanPercent(percent); })
            .value().length >= 1;
    };
    SpellTargetPossibilities.allyBelowMaxHealth = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party !== caster.party; })
            .reject(function (p) { return p._hp.atMaximum(); })
            .value().length >= 1;
    };
    SpellTargetPossibilities.anyAllyDead = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp > 0; })
            .reject(function (p) { return p.party !== caster.party; })
            .value().length >= 1;
    };
    SpellTargetPossibilities.allyBelow50PercentHealth = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party !== caster.party; })
            .reject(function (p) { return p._hp.greaterThanPercent(50); })
            .value().length >= 1;
    };
    SpellTargetPossibilities.enemyWithoutEffect = function (caster, effect) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party === caster.party; })
            .reject(function (p) { return p.$effects.hasEffect(effect); })
            .value().length >= 1;
    };
    return SpellTargetPossibilities;
}());
exports.SpellTargetPossibilities = SpellTargetPossibilities;
