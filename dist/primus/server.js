"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var _ = require("lodash");
var Primus = require("primus");
var Emit = require("primus-emit");
var Rooms = require("primus-rooms");
// import Multiplex from 'primus-multiplex';
var chat_setup_1 = require("../plugins/chat/chat.setup");
var game_state_1 = require("../core/game-state");
var logger_1 = require("../shared/logger");
var allteleports = require("../../assets/maps/content/teleports.json");
exports.primus = (function () {
    if (process.env.NO_START_GAME)
        return {};
    var ip = _(require('os').networkInterfaces())
        .values()
        .flatten()
        .filter(function (val) { return val.family === 'IPv4' && val.internal === false; })
        .map('address')
        .first();
    if (ip) {
        logger_1.Logger.info('Server', "Server IP is: " + ip + ":" + (process.env.PORT || 8080) + (process.env.QUIET ? ' (quiet mode. ssh...)' : ''));
    }
    var express = require('express');
    var compression = require('compression');
    var serve = express();
    serve.use(compression(), express.static('assets', { maxAge: '7d' }));
    var compressedTeleports = _.extend({}, allteleports.towns, allteleports.bosses, allteleports.dungeons, allteleports.trainers, allteleports.other);
    var mapData = _.sortBy(_.map(game_state_1.GameState.getInstance().world.maps, function (val, key) {
        return { name: key, path: val.path };
    }), 'name');
    serve.get('/maps', function (req, res) {
        res.json({
            maps: mapData,
            teleports: compressedTeleports
        });
    });
    var finalhandler = require('finalhandler');
    // load primus
    var server = require('http').createServer(function (req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        serve(req, res, finalhandler(req, res));
    });
    server.on('error', function (e) {
        logger_1.Logger.error('HTTP', e);
        process.exit(1);
    });
    server.listen(process.env.PORT || 8080);
    logger_1.Logger.info('Server', 'Express started.');
    var primus = new Primus(server, { iknowhttpsisbetter: true, parser: 'JSON', transformer: 'websockets' });
    // load socket functions
    var normalizedPath = require('path').join(__dirname, '..');
    var getAllSocketFunctions = function (dir) {
        var results = [];
        var list = fs.readdirSync(dir);
        _.each(list, function (basefilename) {
            var filename = dir + "/" + basefilename;
            var stat = fs.statSync(filename);
            if (stat && stat.isDirectory())
                results = results.concat(getAllSocketFunctions(filename));
            else if (_.includes(basefilename, '.socket'))
                results.push(filename);
        });
        return results;
    };
    var allSocketFunctions = getAllSocketFunctions(normalizedPath);
    var allSocketRequires = _.map(allSocketFunctions, require);
    primus.use('rooms', Rooms);
    primus.use('emit', Emit);
    chat_setup_1.chatSetup(primus);
    primus.players = {};
    primus.addPlayer = function (playerName, spark) {
        if (!primus.players[playerName])
            primus.players[playerName] = [];
        // _.each(primus.players[playerName], spark => primus.delPlayer(playerName, spark));
        // if(!primus.players[playerName]) primus.players[playerName] = [];
        primus.players[playerName].push(spark);
    };
    primus.delPlayer = function (playerName, spark) {
        if (spark) {
            primus.players[playerName] = _.without(primus.players[playerName], spark);
            spark.end();
        }
        else {
            _.each(primus.players[playerName], function (iterSpark) {
                primus.players[playerName] = _.without(primus.players[playerName], iterSpark);
                iterSpark.end();
            });
        }
        if (!primus.players[playerName].length) {
            delete primus.players[playerName];
        }
    };
    primus.emitToPlayers = function (players, data) {
        if (players === void 0) { players = []; }
        _.each(players, function (player) {
            _.each(primus.players[player], function (spark) {
                spark.write(data);
            });
        });
    };
    // primus.use('multiplex', Multiplex);
    // force setting up the global connection
    new (require('../shared/db-wrapper').DbWrapper)().connectionPromise();
    primus.on('connection', function (spark) {
        var respond = function (data) {
            spark.write(data);
        };
        _.each(allSocketRequires, function (obj) { return obj.socket(spark, primus, function (data) {
            data.event = obj.event;
            respond(data);
        }); });
        spark.on('error', function (e) {
            logger_1.Logger.error('Spark', e);
        });
        setTimeout(function () {
            if (spark.authToken || spark._registering)
                return;
            spark.end();
        }, 10000);
    });
    primus.on('error', function (e) {
        logger_1.Logger.error('Primus', e);
    });
    if (process.env.NODE_ENV !== 'production') {
        _.each(['Play'], function (root) {
            var path = require('path').join(__dirname, '..', '..', '..', root);
            fs.stat(path, function (e) {
                if (e) {
                    logger_1.Logger.error('Primus:Generate', e);
                    return;
                }
                logger_1.Logger.info('Primus:Generate', root + " is installed. Generating a Primus file for it.");
                primus.save(path + "/primus.gen.js");
            });
        });
    }
    return primus;
})();
