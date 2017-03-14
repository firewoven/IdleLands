"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Profession = (function () {
    function Profession() {
    }
    Profession.load = function () { };
    Profession.unload = function () { };
    Profession.handleEvent = function (target, event, args) {
        _.each(args.battle.allPlayers, function (player) {
            var func = '';
            if (player === target) {
                func = "_eventSelf" + event;
            }
            else if (player.party === target.party) {
                func = "_eventAlly" + event;
            }
            else {
                func = "_eventEnemy" + event;
            }
            if (target.$profession[func]) {
                target.$profession[func](target, args);
            }
            if (target[func]) {
                target[func](target, args);
            }
        });
    };
    Profession.setupSpecial = function () { };
    Profession.resetSpecial = function (target) {
        target._special.name = '';
        target._special.maximum = target._special.minimum = target._special.__current = 0;
    };
    return Profession;
}());
Profession.baseHpPerLevel = 270;
Profession.baseHpPerCon = 30;
Profession.baseHpPerInt = 0;
Profession.baseHpPerDex = 0;
Profession.baseHpPerStr = 0;
Profession.baseHpPerAgi = 0;
Profession.baseHpPerLuk = 0;
Profession.baseMpPerLevel = 0;
Profession.baseMpPerInt = 0;
Profession.baseMpPerCon = 0;
Profession.baseMpPerDex = 0;
Profession.baseMpPerStr = 0;
Profession.baseMpPerAgi = 0;
Profession.baseMpPerLuk = 0;
Profession.baseConPerLevel = 3;
Profession.baseDexPerLevel = 3;
Profession.baseAgiPerLevel = 3;
Profession.baseStrPerLevel = 3;
Profession.baseIntPerLevel = 3;
Profession.baseLukPerLevel = 0;
Profession.classStats = {};
exports.Profession = Profession;
