"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var SpellTargetStrategy = (function () {
    function SpellTargetStrategy() {
    }
    SpellTargetStrategy.all = function (caster) {
        return caster.$battle.allPlayers;
    };
    SpellTargetStrategy.allAlive = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .value();
    };
    SpellTargetStrategy.allEnemies = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party === caster.party; })
            .value();
    };
    SpellTargetStrategy.enemyWithMostMp = function (caster) {
        return [_(caster.$battle.allPlayers)
                .reject(function (p) { return p.hp === 0; })
                .reject(function (p) { return p.party === caster.party; })
                .sortBy(function (p) { return p.mp; })
                .reverse()
                .value()[0]];
    };
    SpellTargetStrategy.strongestEnemyScore = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .reject(function (p) { return p.party === caster.party; })
            .sortBy(function (p) { return p.itemScore; })
            .reverse()
            .value()[0];
    };
    SpellTargetStrategy.randomEnemyNotProfession = function (caster) {
        return function (profession) {
            return [_(caster.$battle.allPlayers)
                    .reject(function (p) { return p.hp === 0; })
                    .reject(function (p) { return p.professionName === profession; })
                    .reject(function (p) { return p.party === caster.party; })
                    .sample()];
        };
    };
    SpellTargetStrategy.randomEnemy = function (caster) {
        if (caster.professionName === 'Lich')
            return this.allEnemies(caster);
        return [_(caster.$battle.allPlayers)
                .reject(function (p) { return p.hp === 0; })
                .reject(function (p) { return p.party === caster.party; })
                .sample()];
    };
    SpellTargetStrategy.randomEnemies = function (caster) {
        return function (numEnemies) {
            var validTargets = _(caster.$battle.allPlayers)
                .reject(function (p) { return p.hp === 0; })
                .reject(function (p) { return p.party === caster.party; })
                .value();
            return _.map(new Array(numEnemies), function () { return _.sample(validTargets); });
        };
    };
    SpellTargetStrategy.randomDeadEnemy = function (caster) {
        return [_(caster.$battle.allPlayers)
                .reject(function (p) { return p.hp > 0; })
                .reject(function (p) { return p.party === caster.party; })
                .sample()];
    };
    // Dead enemy and not bonecrafted before
    SpellTargetStrategy.randomBonecraftable = function (caster) {
        return [_(caster.$battle.allPlayers)
                .reject(function (p) { return p.hp > 0; })
                .reject(function (p) { return p.party === caster.party; })
                .reject(function (p) { return p.$prevParty; })
                .sample()];
    };
    // Not boss, not bitomancer
    SpellTargetStrategy.randomBitFlippable = function (caster) {
        return [_(caster.$battle.allPlayers)
                .reject(function (p) { return p.hp === 0; })
                .reject(function (p) { return p.party === caster.party; })
                .reject(function (p) { return p.$isBoss; })
                .reject(function (p) { return p.professionName === 'Bitomancer'; })
                .sample()];
    };
    SpellTargetStrategy.allAllies = function (caster) {
        return _(caster.$battle.allPlayers)
            .reject(function (p) { return p.hp === 0; })
            .filter(function (p) { return p.party === caster.party; })
            .value();
    };
    SpellTargetStrategy.randomAlly = function (caster) {
        return [_(caster.$battle.allPlayers)
                .reject(function (p) { return p.hp === 0; })
                .reject(function (p) { return p.party !== caster.party; })
                .sample()];
    };
    SpellTargetStrategy.randomDeadAlly = function (caster) {
        return [_(caster.$battle.allPlayers)
                .reject(function (p) { return p.hp > 0; })
                .reject(function (p) { return p.party !== caster.party; })
                .sample()];
    };
    SpellTargetStrategy.randomAllyBelowHealthPercent = function (caster) {
        return function (percent) {
            return [_(caster.$battle.allPlayers)
                    .reject(function (p) { return p.hp === 0; })
                    .reject(function (p) { return p.party !== caster.party; })
                    .reject(function (p) { return p._hp.greaterThanPercent(percent); })
                    .sample()];
        };
    };
    SpellTargetStrategy.randomAllyBelowMaxHealth = function (caster) {
        return [_(caster.$battle.allPlayers)
                .reject(function (p) { return p.hp === 0; })
                .reject(function (p) { return p.party !== caster.party; })
                .reject(function (p) { return p._hp.atMaximum(); })
                .sample()];
    };
    SpellTargetStrategy.randomAllyWithoutEffect = function (caster) {
        return function (effect) {
            return [_(caster.$battle.allPlayers)
                    .reject(function (p) { return p.hp === 0; })
                    .reject(function (p) { return p.party !== caster.party; })
                    .reject(function (p) { return p.$effects.hasEffect(effect); })
                    .sample()];
        };
    };
    SpellTargetStrategy.randomEnemyWithoutEffect = function (caster) {
        return function (effect) {
            return [_(caster.$battle.allPlayers)
                    .reject(function (p) { return p.hp === 0; })
                    .reject(function (p) { return p.party === caster.party; })
                    .reject(function (p) { return p.$effects.hasEffect(effect); })
                    .sample()];
        };
    };
    SpellTargetStrategy.self = function (caster) {
        return [caster];
    };
    return SpellTargetStrategy;
}());
exports.SpellTargetStrategy = SpellTargetStrategy;
