"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var asset_loader_1 = require("../../shared/asset-loader");
var messagecreator_1 = require("../../plugins/events/messagecreator");
var server_1 = require("../../primus/server");
var _emitter_1 = require("../../plugins/players/_emitter");
var Chance = require("chance");
var chance = new Chance();
var Event = (function () {
    function Event() {
    }
    Object.defineProperty(Event, "chance", {
        get: function () { return chance; },
        enumerable: true,
        configurable: true
    });
    Event.operateOn = function () { };
    Event.makeChoice = function () { };
    Event._parseText = function (message, player, extra) {
        return messagecreator_1.MessageParser.stringFormat(message, player, extra);
    };
    Event.eventText = function (eventType, player, extra) {
        return this._parseText(_.sample(asset_loader_1.StringAssets[eventType]), player, extra);
    };
    Event.pickValidItem = function (player) {
        var _this = this;
        var validTargets = _.reject(player.equipment, function (item) { return item.isNothing || _.includes(_this.invalidItemTypes, item.type); });
        return _.sample(validTargets);
    };
    Event.pickValidItemForEnchant = function (player) {
        var _this = this;
        var validTargets = _.filter(player.equipment, function (item) { return !item.isNothing && !_.includes(_this.invalidItemTypes, item.type) && item.isNormallyEnchantable; });
        return _.sample(validTargets);
    };
    Event.pickValidItemForBless = function (player) {
        var _this = this;
        var validTargets = _.filter(player.equipment, function (item) { return !item.isNothing && !_.includes(_this.invalidItemTypes, item.type) && item.isUnderNormalPercent(player); });
        return _.sample(validTargets);
    };
    Event.pickStat = function () {
        return _.sample(['str', 'con', 'dex', 'agi', 'int', 'luk']);
    };
    Event.emitMessage = function (_a) {
        var affected = _a.affected, eventText = _a.eventText, category = _a.category, extraData = _a.extraData;
        _emitter_1.emitter.emit('player:event', { affected: affected, eventText: eventText, category: category, extraData: extraData });
    };
    Event.feedback = function (player, message) {
        server_1.primus.forEach(function (spark, next) {
            if (!spark.authToken || spark.authToken.playerName !== player.name)
                return next();
            spark.write({ type: 'error', title: '', notify: message });
            next();
        }, function () { });
    };
    return Event;
}());
Event.t0stats = ['dex', 'agi'];
Event.t1stats = ['str', 'int', 'con'];
Event.t2stats = ['luk'];
Event.invalidItemTypes = ['providence', 'trinket'];
exports.Event = Event;
