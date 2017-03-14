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
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Monster;
}(profession_1.Profession));
Monster.baseHpPerLevel = profession_1.Profession.baseHpPerLevel + 240;
Monster.baseMpPerLevel = profession_1.Profession.baseMpPerLevel + 30;
Monster.baseConPerLevel = 4;
Monster.baseDexPerLevel = 4;
Monster.baseAgiPerLevel = 4;
Monster.baseStrPerLevel = 4;
Monster.baseIntPerLevel = 4;
exports.Monster = Monster;
