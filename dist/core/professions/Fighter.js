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
var profession_1 = require("../base/profession");
var Fighter = (function (_super) {
    __extends(Fighter, _super);
    function Fighter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Fighter;
}(profession_1.Profession));
Fighter.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 150;
Fighter.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 18;
Fighter.baseMpPerStr = 6;
Fighter.baseMpPerInt = 6;
Fighter.baseConPerLevel = 2;
Fighter.baseDexPerLevel = 4;
Fighter.baseAgiPerLevel = 3;
Fighter.baseStrPerLevel = 5;
Fighter.baseIntPerLevel = 1;
Fighter.classStats = {
    hpregen: function (target) { return target._hp.maximum * 0.0075; },
    prone: 1
};
exports.Fighter = Fighter;
