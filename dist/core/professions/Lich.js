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
var profession_1 = require("../base/profession");
var Lich = (function (_super) {
    __extends(Lich, _super);
    function Lich() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lich.setupSpecial = function (target) {
        var numProfessions = Math.floor(target.level / 100) + 1;
        var secondaries = ['Bard', 'Cleric', 'Fighter', 'Generalist', 'Mage', 'SandwichArtist'];
        if (target.$statistics) {
            var allProfsBeen_1 = _.keys(target.$statistics.getStat('Character.Professions'));
            secondaries = _.filter(function (secondary) { return _.includes(allProfsBeen_1, secondary); });
        }
        target.$secondaryProfessions = _.sampleSize(secondaries, numProfessions);
        target._special.name = 'Phylactic Energy';
        target._special.maximum = Math.floor(target.level / 25) + 1;
        target._special.toMaximum();
    };
    Lich.resetSpecial = function (target) {
        _super.resetSpecial.call(this, target);
        delete target.$secondaryProfessions;
    };
    Lich._eventSelfKilled = function (target) {
        if (target._special.atMinimum())
            return;
        target.$effects.clear();
        target.$battle._emitMessage(target.fullname + " sprang back to life via the magic of Phylactery!");
        target._special.sub(1);
        target._hp.toMaximum();
    };
    return Lich;
}(profession_1.Profession));
Lich.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Lich.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 150;
Lich.baseMpPerInt = 75;
Lich.baseConPerLevel = 5;
Lich.baseDexPerLevel = 0;
Lich.baseAgiPerLevel = 0;
Lich.baseStrPerLevel = 7;
Lich.baseIntPerLevel = 7;
Lich.classStats = {
    mpregen: function (target) { return target._mp.maximum * 0.02; }
};
exports.Lich = Lich;
