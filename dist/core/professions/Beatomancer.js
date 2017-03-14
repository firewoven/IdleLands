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
var Beatomancer = (function (_super) {
    __extends(Beatomancer, _super);
    function Beatomancer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Beatomancer;
}(profession_1.Profession));
Beatomancer.baseHpPerLevel = profession_1.Profession.baseHpPerLevel;
Beatomancer.baseConPerLevel = 1;
Beatomancer.baseDexPerLevel = 4;
Beatomancer.baseAgiPerLevel = 4;
Beatomancer.baseStrPerLevel = 1;
Beatomancer.baseIntPerLevel = 1;
Beatomancer.baseLukPerLevel = 2;
exports.Beatomancer = Beatomancer;
