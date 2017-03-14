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
var battle_1 = require("../../combat/battle");
var party_1 = require("../../party/party");
var monster_generator_1 = require("../../../shared/monster-generator");
var adventure_log_1 = require("../../../shared/adventure-log");
var logger_1 = require("../../../shared/logger");
var settings_1 = require("../../../static/settings");
exports.WEIGHT = isBattleDebug ? 300 : 54;
// Create a battle
var Battle = (function (_super) {
    __extends(Battle, _super);
    function Battle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Battle.operateOn = function (player) {
        if (player.level <= settings_1.SETTINGS.minBattleLevel)
            return;
        if (player.$personalities.isActive('Coward') && event_1.Event.chance.bool({ likelihood: 75 }))
            return;
        if (!player.party) {
            var partyInstance = new party_1.Party({ leader: player });
            partyInstance.isBattleParty = true;
        }
        var monsters = monster_generator_1.MonsterGenerator.generateMonsters(player.party);
        var monsterPartyInstance = new party_1.Party({ leader: monsters[0] });
        monsterPartyInstance.isMonsterParty = true;
        if (monsters.length > 1) {
            for (var i = 1; i < monsters.length; i++) {
                monsterPartyInstance.playerJoin(monsters[i]);
            }
        }
        var parties = [player.party, monsterPartyInstance];
        var introText = this.eventText('battle', player, { _eventData: { parties: parties } });
        var battle = new battle_1.Battle({ introText: introText, parties: parties });
        this.emitMessage({ affected: player.party.players, eventText: introText, category: adventure_log_1.MessageCategories.COMBAT, extraData: { battleName: battle._id } });
        try {
            battle.startBattle();
        }
        catch (e) {
            logger_1.Logger.error('Battle', e, battle.saveObject());
        }
        _.each(player.party.players, function (player) { return player.recalculateStats(); });
        if (player.party.isBattleParty) {
            player.party.disband();
        }
        monsterPartyInstance.disband();
        return [player];
    };
    return Battle;
}(event_1.Event));
Battle.WEIGHT = exports.WEIGHT;
exports.Battle = Battle;
