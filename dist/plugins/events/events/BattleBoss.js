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
var battle_1 = require("../../combat/battle");
var party_1 = require("../../party/party");
var FindItem_1 = require("./FindItem");
var monster_generator_1 = require("../../../shared/monster-generator");
var adventure_log_1 = require("../../../shared/adventure-log");
var _emitter_1 = require("../../players/_emitter");
var logger_1 = require("../../../shared/logger");
var settings_1 = require("../../../static/settings");
exports.WEIGHT = -1;
// Create a battle
var BattleBoss = (function (_super) {
    __extends(BattleBoss, _super);
    function BattleBoss() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BattleBoss.operateOn = function (player, _a) {
        var bossName = _a.bossName, bosses = _a.bosses;
        if (player.level <= settings_1.SETTINGS.minBattleLevel)
            return;
        if (player.$personalities.isActive('Coward') && event_1.Event.chance.bool({ likelihood: 75 }))
            return;
        if (!player.party) {
            var partyInstance = new party_1.Party({ leader: player });
            partyInstance.isBattleParty = true;
        }
        var monsterPartyInstance = new party_1.Party({ leader: bosses[0] });
        monsterPartyInstance.isMonsterParty = true;
        if (bosses.length > 1) {
            for (var i = 1; i < bosses.length; i++) {
                monsterPartyInstance.playerJoin(bosses[i]);
            }
        }
        var parties = [player.party, monsterPartyInstance];
        var introText = player.party.displayName + " is gearing up for an epic boss battle against " + monsterPartyInstance.displayName + "!";
        var battle = new battle_1.Battle({ introText: introText, parties: parties });
        this.emitMessage({ affected: player.party.players, eventText: introText, category: adventure_log_1.MessageCategories.COMBAT, extraData: { battleName: battle._id } });
        try {
            battle.startBattle();
        }
        catch (e) {
            logger_1.Logger.error('BattleBoss', e, battle.saveObject());
        }
        if (!battle.isLoser(player.party) && !battle._isTie) {
            _.each(player.party.players, function (p) {
                if (!p.$statistics)
                    return;
                _.each(bosses, function (boss) {
                    p.$statistics.incrementStat("Character.BossKills." + boss._name);
                });
            });
            monster_generator_1.MonsterGenerator._setBossTimer(bossName);
            var dropItems = _.compact(_.flattenDeep(_.map(bosses, function (boss) {
                return _.map(_.values(boss.equipment), function (item) {
                    if (!item.dropPercent)
                        return null;
                    if (!event_1.Event.chance.bool({ likelihood: item.dropPercent }))
                        return null;
                    return item;
                });
            })));
            var dropCollectibles = _.compact(_.flattenDeep(_.map(bosses, function (boss) {
                return _.map(boss._collectibles, function (coll) {
                    if (!coll.dropPercent)
                        return null;
                    if (!event_1.Event.chance.bool({ likelihood: coll.dropPercent }))
                        return null;
                    return coll;
                });
            })));
            if (dropItems.length > 0) {
                _.each(dropItems, function (item) {
                    _.each(player.party.players, function (p) {
                        if (!p.canEquip(item))
                            return;
                        FindItem_1.FindItem.operateOn(p, null, item);
                    });
                });
            }
            if (dropCollectibles.length > 0) {
                _.each(dropCollectibles, function (coll) {
                    var collectibleObj = {
                        name: coll.name,
                        map: 'Boss',
                        region: bossName,
                        rarity: coll.rarity || 'guardian',
                        description: coll.flavorText,
                        storyline: coll.storyline,
                        foundAt: Date.now()
                    };
                    _.each(player.party.players, function (p) {
                        if (p.$collectibles.hasCollectible(collectibleObj.name))
                            return;
                        p.$collectibles.addCollectible(collectibleObj);
                        _emitter_1.emitter.emit('player:collectible', { player: p, collectible: collectibleObj });
                    });
                });
            }
        }
        var affected = player.party.players;
        _.each(affected, function (player) { return player.recalculateStats(); });
        if (player.party.isBattleParty) {
            player.party.disband();
        }
        monsterPartyInstance.disband();
        return affected;
    };
    return BattleBoss;
}(event_1.Event));
BattleBoss.WEIGHT = exports.WEIGHT;
exports.BattleBoss = BattleBoss;
