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
var adventure_log_1 = require("../../../shared/adventure-log");
var Enchant_1 = require("./Enchant");
exports.WEIGHT = -1;
// Get the opportunity to buy an item
var MerchantEnchant = (function (_super) {
    __extends(MerchantEnchant, _super);
    function MerchantEnchant() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MerchantEnchant.operateOn = function (player) {
        player.$statistics.batchIncrement(['Character.Events', 'Character.Event.MerchantEnchant']);
        var cost = Math.round(event_1.Event.chance.integer({ min: 100000, max: 500000 }) * player._$priceReductionMultiplier());
        if (cost > player.gold) {
            player.$statistics.incrementStat('Character.Enchant.TooExpensive');
            var message_1 = '%player was offered an enchantment by a wandering merchant, but %she doesn\'t have enough gold.';
            var parsedMessage = this._parseText(message_1, player, { item: 'an enchantment' });
            this.emitMessage({ affected: [player], eventText: parsedMessage, category: adventure_log_1.MessageCategories.GOLD });
            return [player];
        }
        var id = event_1.Event.chance.guid();
        var message = "Would you like to buy an enchantment for " + cost.toLocaleString() + " gold?";
        var eventText = this.eventText('merchant', player, { item: 'an enchantment', shopGold: cost });
        var extraData = { cost: cost, eventText: eventText };
        player.addChoice({ id: id, message: message, extraData: extraData, event: 'MerchantEnchant', choices: ['Yes', 'No'] });
        return [player];
    };
    MerchantEnchant.makeChoice = function (player, id, response) {
        if (response !== 'Yes')
            return;
        var choice = _.find(player.choices, { id: id });
        if (player.gold < choice.extraData.cost)
            return false;
        player.gainGold(-choice.extraData.cost, false);
        player.$statistics.incrementStat('Character.Gold.Spent', choice.extraData.cost);
        this.emitMessage({ affected: [player], eventText: choice.extraData.eventText, category: adventure_log_1.MessageCategories.GOLD });
        Enchant_1.Enchant.operateOn(player);
    };
    MerchantEnchant.feedback = function (player) {
        event_1.Event.feedback(player, 'You do not have enough gold!');
    };
    return MerchantEnchant;
}(event_1.Event));
MerchantEnchant.WEIGHT = exports.WEIGHT;
exports.MerchantEnchant = MerchantEnchant;
