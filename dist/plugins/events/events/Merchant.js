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
var equipment_1 = require("../../../core/base/equipment");
var item_generator_1 = require("../../../shared/item-generator");
var adventure_log_1 = require("../../../shared/adventure-log");
var settings_1 = require("../../../static/settings");
var MerchantEnchant_1 = require("./MerchantEnchant");
exports.WEIGHT = 306;
// Get the opportunity to buy an item
var Merchant = (function (_super) {
    __extends(Merchant, _super);
    function Merchant() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Merchant.operateOn = function (player, opts) {
        var merchantBonus = (opts || {}).merchantBonus;
        merchantBonus = +merchantBonus;
        if (_.isNaN(merchantBonus))
            merchantBonus = event_1.Event.chance.integer({ min: -3, max: 15 });
        if (event_1.Event.chance.bool({ likelihood: Math.max(0, Math.min(100, merchantBonus / 10)) })) {
            MerchantEnchant_1.MerchantEnchant.operateOn(player);
            return [player];
        }
        var item = item_generator_1.ItemGenerator.generateItem(null, player.calcLuckBonusFromValue(player.stats.luk + player.liveStats.merchantItemGeneratorBonus + merchantBonus), player.level);
        if (!player.canEquip(item)) {
            var playerItem = player.equipment[item.type];
            var text = playerItem.score > item.score ? 'weak' : 'strong';
            player.$statistics.incrementStat('Character.Item.Discard');
            var message_1 = "%player was offered %item by a wandering merchant, but it was too " + text + " for %himher.";
            var parsedMessage = this._parseText(message_1, player, { item: item.fullname });
            this.emitMessage({ affected: [player], eventText: parsedMessage, category: adventure_log_1.MessageCategories.GOLD });
            return [player];
        }
        var sellScore = item.score * settings_1.SETTINGS.merchantMultiplier;
        var cost = Math.round((sellScore - (sellScore * player.liveStats.merchantCostReductionMultiplier)) * player._$priceReductionMultiplier());
        if (cost > player.gold) {
            player.$statistics.incrementStat('Character.Item.TooExpensive');
            var message_2 = '%player was offered %item by a wandering merchant, but it costs too much gold for %himher.';
            var parsedMessage = this._parseText(message_2, player, { item: item.fullname });
            this.emitMessage({ affected: [player], eventText: parsedMessage, category: adventure_log_1.MessageCategories.GOLD });
            return [player];
        }
        var id = event_1.Event.chance.guid();
        var message = "Would you like to buy \u00AB" + item.fullname + "\u00BB for " + cost.toLocaleString() + " gold?";
        var eventText = this.eventText('merchant', player, { item: item.fullname, shopGold: cost });
        var extraData = { item: item, cost: cost, eventText: eventText };
        player.addChoice({ id: id, message: message, extraData: extraData, event: 'Merchant', choices: ['Yes', 'No'] });
        return [player];
    };
    Merchant.makeChoice = function (player, id, response) {
        if (response !== 'Yes')
            return;
        var choice = _.find(player.choices, { id: id });
        if (player.gold < choice.extraData.cost)
            return false;
        player.equip(new equipment_1.Equipment(choice.extraData.item));
        player.gainGold(-choice.extraData.cost, false);
        player.$statistics.incrementStat('Character.Gold.Spent', choice.extraData.cost);
        this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: adventure_log_1.MessageCategories.GOLD });
    };
    Merchant.feedback = function (player) {
        event_1.Event.feedback(player, 'You do not have enough gold!');
    };
    return Merchant;
}(event_1.Event));
Merchant.WEIGHT = exports.WEIGHT;
exports.Merchant = Merchant;
