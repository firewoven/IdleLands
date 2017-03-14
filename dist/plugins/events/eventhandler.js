"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var fs = require("fs");
var stat_calculator_1 = require("../../shared/stat-calculator");
var Chance = require("chance");
var chance = new Chance();
exports.allEvents = {};
var loadAllEvents = function () {
    var list = fs.readdirSync(__dirname + "/events");
    _.each(list, function (basefilename) {
        exports.allEvents[basefilename.split('.')[0]] = require(__dirname + "/events/" + basefilename);
    });
};
loadAllEvents();
var EventHandler = (function () {
    function EventHandler() {
    }
    EventHandler.doEvent = function (player, eventName) {
        if (!exports.allEvents[eventName])
            return;
        var chosenEvent = exports.allEvents[eventName][eventName];
        var affected = chosenEvent.operateOn(player);
        _.each(affected, function (affect) {
            if (!affect || !affect.$statistics)
                return;
            affect.$statistics.batchIncrement(['Character.Events', "Character.Event." + eventName]);
        });
    };
    EventHandler.tryToDoEvent = function (player) {
        if (player.eventSteps > 0) {
            player.eventSteps--;
            return;
        }
        var requiredEventSteps = chance.integer({ min: 35, max: 50 });
        var modifier = player.calcLuckBonusFromValue();
        player.eventSteps = Math.max(7, requiredEventSteps - modifier);
        var events = [];
        var weights = [];
        _.each(_.keys(exports.allEvents), function (evtName) {
            var weight = exports.allEvents[evtName].WEIGHT;
            if (!weight || weight <= 0)
                return;
            var modWeight = stat_calculator_1.StatCalculator.stat(player, evtName + "Chance", weight);
            events.push(evtName);
            weights.push(modWeight);
        });
        var chosenEventName = chance.weighted(events, weights);
        this.doEvent(player, chosenEventName);
    };
    return EventHandler;
}());
exports.EventHandler = EventHandler;
