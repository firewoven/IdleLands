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
var event_1 = require("../event");
var game_state_1 = require("../../../core/game-state");
var battle_1 = require("../../combat/battle");
var party_1 = require("../../party/party");
var adventure_log_1 = require("../../../shared/adventure-log");
var logger_1 = require("../../../shared/logger");
var settings_1 = require("../../../static/settings");
exports.WEIGHT = 54;
// Create a pvp battle
var BattlePvP = (function (_super) {
    __extends(BattlePvP, _super);
    function BattlePvP() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BattlePvP.operateOn = function (player) {
        if (player.level <= settings_1.SETTINGS.minBattleLevel)
            return;
        if (player.$personalities.isActive('Coward') && event_1.Event.chance.bool({ likelihood: 75 }))
            return;
        var allPlayers = _.reject(game_state_1.GameState.getInstance().getPlayers(), function (p) { return p.$battle; });
        var opponent = null;
        // 1v1
        if (!player.party || player.party.players.length === 1) {
            var partyInstance = new party_1.Party({ leader: player });
            partyInstance.isBattleParty = true;
            opponent = _(allPlayers)
                .reject(function (p) { return p.party; })
                .reject(function (p) { return p.$personalities.isActive('Camping'); })
                .reject(function (p) { return p.$personalities.isActive('Coward') && event_1.Event.chance.bool({ likelihood: 75 }); })
                .reject(function (p) { return p.score < player.score - settings_1.SETTINGS.pvpBattleRange || p.score > player.score + settings_1.SETTINGS.pvpBattleRange; })
                .sample();
            if (!opponent)
                return;
            var opponentParty = new party_1.Party({ leader: opponent });
            opponentParty.isBattleParty = true;
            // XvX
        }
        else {
            opponent = _(allPlayers)
                .reject(function (p) { return p.$personalities.isActive('Camping'); })
                .reject(function (p) { return p.$personalities.isActive('Coward') && event_1.Event.chance.bool({ likelihood: 75 }); })
                .reject(function (p) { return !p.party || p.party === player.party || p.party.players.length === 1; })
                .reject(function (p) { return p.party.score < player.party.score - settings_1.SETTINGS.pvpBattleRange || p.party.score > player.party.score + settings_1.SETTINGS.pvpBattleRange; })
                .sample();
            if (!opponent)
                return;
        }
        var parties = [player.party, opponent.party];
        var players = _.flatten(_.map(parties, function (party) { return party.players; }));
        var introText = this.eventText('battle', player, { _eventData: { parties: parties } });
        var battle = new battle_1.Battle({ introText: introText, parties: parties });
        this.emitMessage({ affected: players, eventText: introText, category: adventure_log_1.MessageCategories.COMBAT, extraData: { battleName: battle._id } });
        try {
            battle.startBattle();
        }
        catch (e) {
            logger_1.Logger.error('Battle:PvP', e, battle.saveObject());
        }
        var affected = player.party.players.concat(opponent.party.players);
        _.each(affected, function (player) { return player.recalculateStats(); });
        if (player.party.isBattleParty) {
            player.party.disband();
        }
        if (opponent.party.isBattleParty) {
            opponent.party.disband();
        }
        return affected;
    };
    return BattlePvP;
}(event_1.Event));
BattlePvP.WEIGHT = exports.WEIGHT;
exports.BattlePvP = BattlePvP;
