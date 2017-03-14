"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var game_state_1 = require("../../core/game-state");
exports.handleIp = function (player, fromIp) {
    if (!player.allIps)
        player.allIps = [];
    if (!_.includes(player.allIps, fromIp))
        player.allIps.push(fromIp);
    player.allIps = _.compact(_.uniq(player.allIps));
    player.$currentIp = fromIp;
    if (player.isPardoned)
        return;
    var playerLoad = game_state_1.GameState.getInstance().playerLoad;
    playerLoad.playerDb.getOffenses(fromIp).then(function (offenses) {
        if (!offenses)
            return;
        player.isMuted = true;
        player._saveSelf();
    });
};
