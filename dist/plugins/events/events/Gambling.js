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
exports.WEIGHT = 6;
var MIN_GOLD = 5000;
var INCOME_PERCENT = 10;
// Get the opportunity to gamble away your gold
var Gambling = (function (_super) {
    __extends(Gambling, _super);
    function Gambling() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Gambling.operateOn = function (player) {
        if (player.gold < MIN_GOLD * INCOME_PERCENT)
            return;
        var cost = this.chance.integer({ min: MIN_GOLD, max: player.gold / INCOME_PERCENT });
        var id = event_1.Event.chance.guid();
        var multiplier = this.chance.floating({ fixed: 2, min: 1.3, max: 2 });
        var odds = this.chance.integer({ min: 10, max: 50 });
        var message = "Would you like to gamble " + cost.toLocaleString() + " gold at a " + multiplier + "x rate with " + odds + "% chance to win?";
        var extraData = { multiplier: multiplier, cost: cost, odds: odds };
        player.addChoice({ id: id, message: message, extraData: extraData, event: 'Gambling', choices: ['Yes', 'No', 'Double Down'] });
        return [player];
    };
    Gambling.makeChoice = function (player, id, response) {
        if (response === 'No')
            return;
        var choice = _.find(player.choices, { id: id });
        var _a = choice.extraData, cost = _a.cost, multiplier = _a.multiplier, odds = _a.odds;
        var isDoubleDown = response === 'Double Down';
        if (isDoubleDown) {
            cost *= 2;
            multiplier *= 2;
            odds /= 2;
        }
        if (player.gold < cost || _.isNaN(cost) || cost < 0)
            return false;
        if (isDoubleDown) {
            player.$statistics.incrementStat('Character.Gamble.DoubleDown');
        }
        var message = '';
        if (this.chance.bool({ likelihood: odds })) {
            var winnings = Math.round(cost * multiplier);
            player.gainGold(winnings, false);
            player.$statistics.incrementStat('Character.Gold.Gamble.Win', winnings);
            player.$statistics.incrementStat('Character.Gamble.WinTimes');
            if (isDoubleDown) {
                player.$statistics.incrementStat('Character.Gamble.WinTimesDoubleDown');
            }
            message = "%player got lucky and bet " + cost.toLocaleString() + " gold against the odds of " + odds + "%" + (isDoubleDown ? ' (Double Down)' : '') + ". %She came out ahead with " + winnings.toLocaleString() + " gold!";
        }
        else {
            player.gainGold(-cost, false);
            player.$statistics.incrementStat('Character.Gold.Gamble.Lose', cost);
            player.$statistics.incrementStat('Character.Gamble.LoseTimes');
            if (isDoubleDown) {
                player.$statistics.incrementStat('Character.Gamble.LoseTimesDoubleDown');
            }
            message = "%player felt lucky and bet " + cost.toLocaleString() + " gold against the odds of " + odds + (isDoubleDown ? ' (Double Down)' : '') + "%. %She lost it all at the table.";
        }
        message = this._parseText(message, player);
        this.emitMessage({ affected: [player], eventText: message, category: adventure_log_1.MessageCategories.GOLD });
    };
    Gambling.feedback = function (player) {
        event_1.Event.feedback(player, 'You do not have enough gold!');
    };
    return Gambling;
}(event_1.Event));
Gambling.WEIGHT = exports.WEIGHT;
exports.Gambling = Gambling;
