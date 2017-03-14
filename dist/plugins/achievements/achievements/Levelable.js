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
var Levelable = (function (_super) {
    __extends(Levelable, _super);
    function Levelable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Levelable.achievementData = function (player) {
        var tier = Math.floor(player.level / 10);
        if (tier === 0)
            return [];
        var rewards = [{
                type: 'stats',
                luk: tier,
                xp: tier
            }];
        if (tier >= 10) {
            rewards.push({ type: 'title', title: 'Centennial', deathMessage: '%player was so old, this was probably coming.' });
        }
        if (tier >= 15) {
            rewards.push({ type: 'petattr', petattr: 'an old person' });
        }
        if (tier >= 20) {
            rewards.push({ type: 'title', title: 'Bicentennial', deathMessage: '%player should have wasted away a long time ago!' });
        }
        if (tier >= 25) {
            rewards.push({ type: 'petattr', petattr: 'a really old person' });
        }
        if (tier > 100) {
            rewards.push({ type: 'title', title: 'Milennial', deathMessage: '%player oversaw many generations before finally crumbling into dust.' });
        }
        return [{
                tier: tier,
                name: 'Levelable',
                desc: "Gain +" + tier + " LUK and +" + tier + " Bonus XP (added every time XP is gained) for being level " + (tier * 10).toLocaleString() + ".",
                type: achievement_1.AchievementTypes.PROGRESS,
                rewards: rewards
            }];
    };
    return Levelable;
}(achievement_1.Achievement));
exports.Levelable = Levelable;
