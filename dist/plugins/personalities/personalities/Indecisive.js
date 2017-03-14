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
var Indecisive = (function (_super) {
    __extends(Indecisive, _super);
    function Indecisive() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Indecisive.hasEarned = function (player) {
        return player.$statistics.getStat('Character.Choice.Ignore') >= 10;
    };
    return Indecisive;
}(personality_1.Personality));
Indecisive.disableOnActivate = ['Affirmer', 'Denier'];
Indecisive.description = 'All choices that would be ignored are automatically accepted or denied.';
exports.Indecisive = Indecisive;
