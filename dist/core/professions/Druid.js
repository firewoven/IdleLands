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
var Druid = (function (_super) {
    __extends(Druid, _super);
    function Druid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Druid.setupSpecial = function (target) {
        target._special.name = 'Pets';
        target._special.set(0);
        target._special.maximum = Math.floor(target.level / 100) + 1;
    };
    return Druid;
}(profession_1.Profession));
Druid.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 50;
Druid.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 50;
Druid.baseMpPerInt = 26;
Druid.baseConPerLevel = 8;
Druid.baseDexPerLevel = 2;
Druid.baseAgiPerLevel = 2;
Druid.baseStrPerLevel = 2;
Druid.baseIntPerLevel = 4;
Druid.classStats = {
    mpregen: function (target) { return target._mp.maximum * 0.01; }
};
exports.Druid = Druid;
