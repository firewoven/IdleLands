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
var personality_1 = require("../personality");
var Denier = (function (_super) {
    __extends(Denier, _super);
    function Denier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Denier.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Choice.Choose.No') >= 10;
    };
    return Denier;
}(personality_1.Personality));
Denier.disableOnActivate = ['Affirmer', 'Indecisive'];
Denier.description = 'All choices that would be ignored are automatically denied.';
exports.Denier = Denier;
