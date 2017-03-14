"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isBattleDebug = process.env.BATTLE_DEBUG;
var isQuiet = process.env.QUIET;
var _ = require("lodash");
var string_generator_1 = require("../../shared/string-generator");
var messagecreator_1 = require("../../plugins/events/messagecreator");
var battle_db_1 = require("./battle.db");
var Chance = require("chance");
var chance = new Chance();
var MAX_ROUND = 100;
var Battle = (function () {
    function Battle(_a) {
        var parties = _a.parties, introText = _a.introText;
        this.parties = parties;
        this.introText = introText;
        this.happenedAt = Date.now();
        this.name = this.generateName();
        this.setId();
        this.messageData = [];
        this.currentRound = 0;
    }
    Battle.prototype.generateName = function () {
        return string_generator_1.StringGenerator.battle();
    };
    Battle.prototype.isPlayerAlive = function (player) {
        return player.hp > 0;
    };
    Object.defineProperty(Battle.prototype, "allPlayers", {
        get: function () {
            return _.flatten(_.map(this.parties, 'players'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Battle.prototype, "shouldGoOn", {
        get: function () {
            var _this = this;
            return this.currentRound < MAX_ROUND && _.every(this.parties, function (party) {
                return _.some(party.players, function (p) { return _this.isPlayerAlive(p); });
            });
        },
        enumerable: true,
        configurable: true
    });
    Battle.prototype._emitMessage = function (message, data) {
        if (data === void 0) { data = null; }
        if (isBattleDebug && !isQuiet) {
            console.log(message);
        }
        this.messageData.push({ message: message, data: data });
    };
    Battle.prototype.startBattle = function () {
        this.setupParties();
        this._initialParties = _.cloneDeep(this._partyStats());
        this.startMessage();
        this.startTakingTurns();
    };
    Battle.prototype.startMessage = function () {
        this._emitMessage(this.introText);
    };
    Battle.prototype._partyStats = function () {
        return _.map(this.parties, function (party) {
            return {
                name: party.name,
                players: _.map(party.players, function (p) {
                    return { name: p.fullname, hp: _.clone(p._hp), mp: _.clone(p._mp), special: _.clone(p._special), level: p.level, profession: p.professionName };
                })
            };
        });
    };
    Battle.prototype.roundMessage = function () {
        if (isBattleDebug && !isQuiet) {
            _.each(this._partyStats(), function (party) {
                console.log(party.name);
                console.log(party.players);
            });
        }
        this._emitMessage("Round " + this.currentRound + " start.", this._partyStats());
    };
    Battle.prototype.tryIncrement = function (p, stat, value) {
        if (value === void 0) { value = 1; }
        if (!p.$statistics)
            return;
        p.$statistics.incrementStat(stat, value);
    };
    Battle.prototype._setupPlayer = function (player) {
        player.$battle = this;
        player._hp.toMaximum();
        player._mp.toMaximum();
        player.$profession.setupSpecial(player);
        this.tryIncrement(player, 'Combats');
    };
    Battle.prototype.setupParties = function () {
        var _this = this;
        _.each(this.parties, function (p) {
            p.prepareForCombat();
        });
        _.each(this.allPlayers, function (p) {
            _this._setupPlayer(p);
        });
    };
    Battle.prototype.calculateTurnOrder = function () {
        this.turnOrder = _.sortBy(this.allPlayers, function (p) { return -p.liveStats.agi; });
    };
    Battle.prototype.startTakingTurns = function () {
        while (this.shouldGoOn) {
            this.doRound();
        }
        this.endBattle();
    };
    Battle.prototype.doRound = function () {
        var _this = this;
        if (!this.shouldGoOn) {
            this.endBattle();
            return;
        }
        this.currentRound++;
        this.roundMessage();
        this.calculateTurnOrder();
        _.each(this.turnOrder, function (p) { return _this.takeTurn(p); });
    };
    Battle.prototype.takeTurn = function (player) {
        if (!this.isPlayerAlive(player) || !this.shouldGoOn)
            return;
        var stunned = player.liveStats.isStunned;
        if (stunned) {
            this._emitMessage(stunned);
        }
        else {
            this.doAttack(player);
        }
        this.emitEvents(player, 'TakeTurn');
        // Don't allow player to regen if they kill themselves
        if (!this.isPlayerAlive(player))
            return;
        var hpRegen = player.liveStats.hpregen;
        var mpRegen = player.liveStats.mpregen;
        player._hp.add(hpRegen);
        player._mp.add(mpRegen);
        if (hpRegen > 0 || mpRegen > 0) {
            this._emitMessage(player.fullname + " regenerated " + hpRegen.toLocaleString() + " hp and " + mpRegen.toLocaleString() + " mp!");
        }
        player.$effects.tick();
    };
    Battle.prototype.doAttack = function (player, forceSkill) {
        var spell = null;
        if (!forceSkill) {
            var validSpells = this.validAttacks(player);
            var spellChoice = chance.weighted(_.map(validSpells, 'name'), _.map(validSpells, function (s) { return s.bestTier(player).weight; }));
            spell = _.find(player.spells, { name: spellChoice });
        }
        else {
            spell = _.find(player.spells, { name: forceSkill });
        }
        var spellRef = new spell(player);
        spellRef.preCast();
    };
    Battle.prototype.validAttacks = function (player) {
        return _(player.spells)
            .filter(function (spell) { return spell.shouldCast(player); })
            .filter(function (spell) {
            var tier = spell.bestTier(player);
            if (!tier)
                return false;
            if (_.isFunction(tier.cost) && !tier.cost(player))
                return false;
            if (_.isNumber(tier.cost) && player["_" + spell.stat].lessThan(tier.cost))
                return false;
            return true;
        })
            .value();
    };
    Object.defineProperty(Battle.prototype, "winningTeam", {
        get: function () {
            var _this = this;
            return _.filter(this.parties, function (party) { return _.some(party.players, function (p) { return _this.isPlayerAlive(p); }); })[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Battle.prototype, "losingTeam", {
        get: function () {
            var _this = this;
            return _.filter(this.parties, function (party) { return party !== _this.winningTeam; })[0];
        },
        enumerable: true,
        configurable: true
    });
    Battle.prototype.isLoser = function (party) {
        return _.every(party.players, function (p) { return p.hp === 0; });
    };
    Battle.prototype.endBattle = function () {
        this._emitMessage('Battle complete.', this._partyStats());
        this.endBattleBonuses();
        battle_db_1.persistToDb(this);
        this.cleanUp();
        if (isBattleDebug && this.kill) {
            process.exit(0);
        }
    };
    Battle.prototype.emitEvents = function (target, event) {
        target.$profession.handleEvent(target, event, { battle: this });
    };
    Battle.prototype.endBattleBonuses = function () {
        var _this = this;
        if (this.currentRound >= MAX_ROUND || !this.winningTeam) {
            this._emitMessage('No one wins! It was a tie! Give it up already, people!');
            this._isTie = true;
            return;
        }
        _.each(this.parties, function (party) {
            // no monster bonuses
            // rare edge case with Bonecraft reducing loser's party size to one summon and then killing it.
            if (!party.leader || !party.leader.isPlayer)
                return;
            // if this team won
            if (_this.winningTeam === party) {
                _this._emitMessage(party.displayName + " won!");
                var compareLevel_1 = _this.losingTeam.level;
                var level_1 = party.level;
                var levelDiff_1 = Math.max(-5, Math.min(5, compareLevel_1 - level_1)) + 6;
                var goldGainedInParty_1 = Math.max(1, Math.round((compareLevel_1 * 1560) / _.reject(party.players, function (p) { return p.$isMinion; }).length));
                _.each(party.players, function (p) {
                    _this.tryIncrement(p, 'Combat.Win');
                    var gainedXp = Math.max(1, Math.round(p._xp.maximum * (levelDiff_1 / 300)));
                    if (compareLevel_1 < level_1 - 5)
                        gainedXp = 0;
                    var modXp = p.gainXp(gainedXp);
                    var modGold = p.gainGold(goldGainedInParty_1);
                    _this._emitMessage(p.fullname + " gained " + modXp.toLocaleString() + "xp and " + modGold.toLocaleString() + "gold!");
                });
            }
            else {
                _this._emitMessage(party.displayName + " lost!");
                _.each(party.players, function (p) {
                    _this.tryIncrement(p, 'Combat.Lose');
                    var compareLevel = _this.winningTeam.level;
                    var currentGold = _.isNumber(p.gold) ? p.gold : p.gold.__current;
                    var lostGold = Math.round(currentGold / 250);
                    var lostXp = Math.round(p._xp.maximum / 50);
                    if (compareLevel > party.level + 5) {
                        lostXp = 0;
                    }
                    var modXp = Math.abs(p.gainXp(-Math.abs(lostXp)));
                    var modGold = Math.abs(p.gainGold(-Math.abs(lostGold)));
                    _this._emitMessage(p.fullname + " lost " + modXp.toLocaleString() + "xp and " + modGold.toLocaleString() + "gold!");
                });
            }
        });
    };
    Battle.prototype.healDamage = function (target, healing, source) {
        if (healing > 0) {
            this.tryIncrement(source, 'Combat.Give.Healing', healing);
            this.tryIncrement(target, 'Combat.Receive.Healing', healing);
            target._hp.add(healing);
        }
        return healing;
    };
    Battle.prototype.dealDamage = function (target, damage, source) {
        if (damage > 0) {
            damage = Math.max(0, damage - target.liveStats.damageReduction);
            this.tryIncrement(source, 'Combat.Give.Damage', damage);
            this.tryIncrement(target, 'Combat.Receive.Damage', damage);
            var overkill = damage - target.hp;
            target._hp.sub(damage);
            // TODO Display overkill damage in battle log.
            if (target.hp === 0) {
                this.tryIncrement(source, 'Combat.Give.Overkill', overkill);
                this.tryIncrement(target, 'Combat.Receive.Overkill', overkill);
            }
        }
        else if (damage < 0) {
            this.healDamage(target, Math.abs(damage), source);
        }
        return damage;
    };
    Battle.prototype.handleDeath = function (target, killer) {
        this.tryIncrement(killer, "Combat.Kills." + (target.isPlayer ? 'Player' : 'Monster'));
        this.tryIncrement(target, "Combat.Deaths." + (killer.isPlayer ? 'Player' : 'Monster'));
        // TODO Get death message from killed character
        var message = target.deathMessage || '%player has died!';
        message = messagecreator_1.MessageParser.stringFormat(message, target);
        this._emitMessage(message);
        this.emitEvents(killer, 'Kill');
        this.emitEvents(target, 'Killed');
        target.$effects.clear();
    };
    Battle.prototype.setId = function () {
        this._id = this.happenedAt + "-" + this.name.split(' ').join('_');
    };
    Battle.prototype.saveObject = function () {
        return {
            _id: this._id,
            name: this.name,
            happenedAt: new Date(this.happenedAt),
            messageData: this.messageData,
            initialParties: this._initialParties,
            parties: _.map(this.parties, function (party) { return party.buildTransmitObject(); })
        };
    };
    Battle.prototype.cleanUp = function () {
        var _this = this;
        _.each(this.allPlayers, function (p) {
            if (p.$prevParty) {
                p._hp.toMinimum();
                p.party.playerLeave(p);
                p.$prevParty.playerJoin(p);
                delete p.$prevParty;
            }
            p.$battle = null;
            p.$profession.resetSpecial(p);
            p.$effects.clear();
            if (p.$statistics) {
                p.$statistics.save();
            }
            if (p.$personalities && p.$personalities.isActive('Solo') && (!p.party || p.party.isBattleParty)) {
                _this.tryIncrement(p, 'CombatSolo');
            }
            if (!p.isPlayer) {
                p.party.playerLeave(p);
                // pet flags for update
                if (p.updatePlayer)
                    p.updatePlayer();
            }
        });
    };
    return Battle;
}());
exports.Battle = Battle;
