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
var achievement_1 = require("../achievement");
var Mapceptional = (function (_super) {
    __extends(Mapceptional, _super);
    function Mapceptional() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Mapceptional.achievementData = function (player) {
        var allMaps = player.$statistics.getStat('Character.Maps');
        var validMaps = [
            { name: 'Norkos Secret -1', rewards: { con: 20 } },
            { name: 'Dark Tower +1', rewards: { con: 25 } },
            { name: 'Hall of Heroes', rewards: { con: 100 } },
            { name: 'Norkos Dungeon -11', rewards: { con: 100 } },
            { name: 'Fate Lake', rewards: { con: 500 } },
            { name: 'Fate Pools -2', rewards: { con: 50 } },
            { name: 'The Astral Plane', rewards: { con: 1000 } },
            { name: 'The Elemental Plane -3', rewards: { con: 750 } },
            { name: 'Merchant\'s Guild', rewards: { con: 250 } }
        ];
        return _.compact(_.map(validMaps, function (mapData) {
            if (!allMaps[mapData.name])
                return;
            mapData.tier = 1;
            mapData.type = achievement_1.AchievementTypes.EXPLORE;
            mapData.desc = "Gain +" + mapData.rewards.con + " CON for visiting " + mapData.name + ".";
            mapData.name = "Mapceptional: " + mapData.name;
            mapData.rewards = [_.extend({ type: 'stats' }, mapData.rewards)];
            return mapData;
        }));
    };
    return Mapceptional;
}(achievement_1.Achievement));
exports.Mapceptional = Mapceptional;
