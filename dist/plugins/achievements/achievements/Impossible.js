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
var achievement_1 = require("../achievement");
var Impossible = (function (_super) {
    __extends(Impossible, _super);
    function Impossible() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Impossible.achievementData = function (player) {
        var requiredCollectible = player.$collectibles.hasCollectible('How Did You Even Get Out Here');
        if (!requiredCollectible)
            return [];
        return [{
                tier: 1,
                name: 'Impossible',
                desc: 'Cheater!',
                type: achievement_1.AchievementTypes.SPECIAL,
                rewards: [{
                        type: 'title', title: 'l33t h4x0r', deathMessage: '%player cheated in life, and will probably cheat in death.'
                    }, {
                        type: 'petattr', petattr: 'a big cheater'
                    }]
            }];
    };
    return Impossible;
}(achievement_1.Achievement));
exports.Impossible = Impossible;
