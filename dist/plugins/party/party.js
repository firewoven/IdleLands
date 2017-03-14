"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Chance = require("chance");
var chance = new Chance();
var game_state_1 = require("../../core/game-state");
var string_generator_1 = require("../../shared/string-generator");
var _emitter_1 = require("../../plugins/players/_emitter");
var PartyLeave_1 = require("../events/events/PartyLeave");
var adventure_log_1 = require("../../shared/adventure-log");
var messagecreator_1 = require("../../plugins/events/messagecreator");
var Party = (function () {
    function Party(_a) {
        var leader = _a.leader;
        this.players = [];
        this.name = this.generateName();
        game_state_1.GameState.getInstance().parties[this.name] = this;
        this.playerJoin(leader);
    }
    Object.defineProperty(Party.prototype, "humanPlayers", {
        get: function () {
            return _.filter(this.players, function (player) { return player.isPlayer; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Party.prototype, "score", {
        get: function () {
            var score = 0;
            if (!this.leader) {
                // Bonecraft edge case ends party with no players
                return 0;
            }
            else if (this.leader.isPlayer) {
                score = _.sum(_.map(this.humanPlayers, 'itemScore')) / this.humanPlayers.length;
            }
            else {
                score = _.sum(_.map(this.players, 'itemScore')) / this.players.length;
            }
            return score;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Party.prototype, "level", {
        get: function () {
            var level = 0;
            if (!this.leader) {
                // Bonecraft edge case ends party with no players
                return 0;
            }
            else if (this.leader.isPlayer) {
                level = _.sum(_.map(this.humanPlayers, 'level')) / this.humanPlayers.length;
            }
            else {
                level = _.sum(_.map(this.players, 'level')) / this.players.length;
            }
            return level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Party.prototype, "displayName", {
        get: function () {
            return this.players.length === 1 ? this.players[0].fullname : this.name + " (" + _.map(this.players, 'fullname').join(', ') + ")";
        },
        enumerable: true,
        configurable: true
    });
    Party.prototype.generateName = function () {
        var name = null;
        do {
            name = string_generator_1.StringGenerator.party();
        } while (game_state_1.GameState.getInstance().parties[name]);
        return name;
    };
    Party.prototype.allowPlayerToLeaveParty = function (player) {
        PartyLeave_1.PartyLeave.operateOn(player);
    };
    Party.prototype.setPartySteps = function (player) {
        player.partySteps = chance.integer({ min: 50, max: 200 });
    };
    Party.prototype.playerTakeStep = function (player) {
        if (!player.partySteps)
            this.setPartySteps(player);
        player.partySteps--;
        if (player.partySteps <= 0) {
            this.allowPlayerToLeaveParty(player);
        }
    };
    Party.prototype.playerJoin = function (player) {
        this.players.push(player);
        player.$partyName = this.name;
        if (player.isPlayer) {
            player.$statistics.incrementStat('Character.Party.Join');
            player.partySteps = 0;
            if (this.players.length > 1) {
                this.teleportNear(player, this.players[this.players.length - 2]);
            }
            if (this.players.length > 1) {
                game_state_1.GameState.getInstance().reAddPlayersInOrder(this.players);
            }
        }
    };
    Party.prototype.playerLeave = function (player, disbanding) {
        if (disbanding === void 0) { disbanding = false; }
        if (!disbanding && !this.isMonsterParty && !player.$battle && player.isPlayer) {
            _emitter_1.emitter.emit('player:event', {
                affected: [player],
                eventText: messagecreator_1.MessageParser.stringFormat('%player has left %partyName.', player, { partyName: this.name }),
                category: adventure_log_1.MessageCategories.PARTY
            });
        }
        var doDisband = false;
        if (!player.$battle && player.isPlayer && ((this.players.length <= 2 && !disbanding) || player === this.leader))
            doDisband = true;
        this.players = _.without(this.players, player);
        player.$partyName = null;
        if (player.isPlayer) {
            player.$statistics.incrementStat('Character.Party.Leave');
        }
        player.choices = _.reject(player.choices, function (c) { return c.event === 'PartyLeave'; });
        if (doDisband && !disbanding)
            this.disband(player);
    };
    Object.defineProperty(Party.prototype, "leader", {
        get: function () {
            return this.players[0];
        },
        enumerable: true,
        configurable: true
    });
    Party.prototype.getFollowTarget = function (player) {
        if (player === this.leader)
            return;
        return this.players[_.indexOf(this.players, player) - 1];
    };
    Party.prototype.teleportNear = function (me, target) {
        me.x = target.x;
        me.y = target.y;
        me.map = target.map;
    };
    Party.prototype.buildTransmitObject = function () {
        return {
            name: this.name,
            isBattleParty: this.isBattleParty,
            players: _.map(this.players, function (p) {
                return {
                    name: p.fullname,
                    shortName: p.name,
                    level: p.level,
                    profession: p.professionName
                };
            })
        };
    };
    Party.prototype.prepareForCombat = function () {
        var _this = this;
        _.each(this.players, function (p) {
            var pet = p.$pets ? p.$pets.activePet : null;
            if (!pet || !chance.bool({ likelihood: pet.$_scale.battleJoinPercent }))
                return;
            _this.playerJoin(pet);
        });
    };
    Party.prototype.disband = function (player, showMessage) {
        var _this = this;
        if (showMessage === void 0) { showMessage = true; }
        if (!this.isBattleParty && !this.isMonsterParty && showMessage) {
            _emitter_1.emitter.emit('player:event', {
                affected: this.players,
                eventText: messagecreator_1.MessageParser.stringFormat('%player has disbanded %partyName.', player || this.leader, { partyName: this.name }),
                category: adventure_log_1.MessageCategories.PARTY
            });
        }
        _.each(this.players, function (p) { return _this.playerLeave(p, true); });
        game_state_1.GameState.getInstance().parties[this.name] = null;
        delete game_state_1.GameState.getInstance().parties[this.name];
    };
    return Party;
}());
exports.Party = Party;
