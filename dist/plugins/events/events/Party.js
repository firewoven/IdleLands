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
var isBattleDebug = process.env.BATTLE_DEBUG;
var _ = require("lodash");
var event_1 = require("../event");
var game_state_1 = require("../../../core/game-state");
var party_1 = require("../../../plugins/party/party");
var adventure_log_1 = require("../../../shared/adventure-log");
var settings_1 = require("../../../static/settings");
exports.WEIGHT = isBattleDebug ? 250 : 72;
// Create a party
var Party = (function (_super) {
    __extends(Party, _super);
    function Party() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Party.operateOn = function (player) {
        if (player.$personalities.isActive('Solo') || player.level < settings_1.SETTINGS.minPartyLevel)
            return;
        var validPlayers = _.reject(game_state_1.GameState.getInstance().getPlayers(), function (p) { return p.$partyName || p === player
            || p.$personalities.isActive('Solo')
            || p.$personalities.isActive('Camping')
            || p.level < settings_1.SETTINGS.minPartyLevel
            || p.map !== player.map; });
        if (player.$partyName) {
            if (player.party.players.length < settings_1.SETTINGS.maxPartyMembers && validPlayers.length >= 1) {
                var newPlayer = _.sample(validPlayers);
                player.party.playerJoin(newPlayer);
                this.emitMessage({
                    affected: player.party.players,
                    eventText: this._parseText('%partyName picked up a stray %player on their travels!', newPlayer, { partyName: player.party.name }),
                    category: adventure_log_1.MessageCategories.PARTY
                });
            }
            return;
        }
        if (validPlayers.length < 3)
            return;
        var partyInstance = new party_1.Party({ leader: player });
        var newPlayers = _.sampleSize(validPlayers, 3);
        player.$statistics.incrementStat('Character.Party.Create');
        _.each(newPlayers, function (p) {
            partyInstance.playerJoin(p);
        });
        var partyMemberString = _(newPlayers).map(function (p) { return "\u00AB" + p.fullname + "\u00BB"; }).join(', ');
        var eventText = this.eventText('party', player, { partyName: partyInstance.name, partyMembers: partyMemberString });
        this.emitMessage({ affected: partyInstance.players, eventText: eventText, category: adventure_log_1.MessageCategories.PARTY });
        return player.party.players;
    };
    return Party;
}(event_1.Event));
Party.WEIGHT = exports.WEIGHT;
exports.Party = Party;
