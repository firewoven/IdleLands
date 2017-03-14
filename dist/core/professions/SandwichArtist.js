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
var SandwichArtist = (function (_super) {
    __extends(SandwichArtist, _super);
    function SandwichArtist() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SandwichArtist;
}(profession_1.Profession));
SandwichArtist.baseHpPerLevel = profession_1.Profession.baseHpPerLevel - 90;
SandwichArtist.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 30;
SandwichArtist.baseMpPerInt = 12;
SandwichArtist.baseConPerLevel = 1;
SandwichArtist.baseDexPerLevel = 5;
SandwichArtist.baseAgiPerLevel = 1;
SandwichArtist.baseStrPerLevel = 3;
SandwichArtist.baseIntPerLevel = 1;
SandwichArtist.classStats = {
    mpregen: function (target) { return target._mp.maximum * 0.025; }
};
exports.SandwichArtist = SandwichArtist;
