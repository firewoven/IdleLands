var _ = require('lodash');
var Primus = require('primus');
var argv = require('minimist')(process.argv.slice(2));
var isQuiet = process.env.QUIET;
var al = require('../../shared/asset-loader');
// get a big list of names (don't really care what)
var names = [
    'Jombocom', 'Carple', 'Danret', 'Swilia', 'Bripz', 'Goop',
    'Jeut', 'Axce', 'Groat', 'Jack', 'Xefe', 'Ooola', 'Getry',
    'Seripity', 'Tence', 'Rawgle', 'Plez', 'Zep', 'Shet', 'Jezza',
    'Lord Sirpy', 'Sir Pipe', 'Pleb', 'Rekter', 'Pilu', 'Sengai',
    'El Shibe', 'La Gpoy', 'Wizzrobu', 'Banana', 'Chelpe', 'Q',
    'Azerty'
];
_.each(['mainhand', 'offhand', 'monster', 'trainer', 'bread', 'meat', 'veg'], function (type) {
    names.push(_.map(al.ObjectAssets[type], function (o) { return o.name; }));
});
_.each(['deity'], function (type) {
    names.push(al.StringAssets[type]);
});
var players = [].concat.apply([], names);
names = {};
var numPlayers = Math.max(1, Math.min(players.length, argv.players)) || 1;
var numConnected = 0;
var doDisplayConnections = false;
console.log("Testing with " + numPlayers + " players." + (process.env.QUIET ? ' (quiet mode. ssh...)' : ''));
var sockets = {};
var play = function (name, index) {
    var Socket = Primus.createSocket({
        transformer: 'websockets',
        parser: 'JSON',
        plugin: {
            rooms: require('primus-rooms'),
            emit: require('primus-emit'),
            multiplex: require('primus-multiplex')
        }
    });
    var socket = new Socket('ws://localhost:' + (process.env.PORT || 8080));
    var login = function () {
        var userId = "local|" + name;
        socket.emit('plugin:player:login', { name: name, userId: userId });
        socket.emit('plugin:player:request:pets');
    };
    sockets[name] = socket;
    socket.on('open', function () {
        numConnected++;
        if (!isQuiet || doDisplayConnections) {
            console.log(name + " connected.");
        }
        login();
    });
    socket.on('close', function () {
        console.log(name + " disconnected.");
        numConnected--;
    });
    socket.on('data', function (msg) {
        if (msg.update === 'player') {
            var choices = msg.data.choices;
            var name_1 = msg.data.name;
            if (choices.length > 0) {
                _.each(choices, function (choice) {
                    // if(choice.event === 'PartyLeave') return;
                    socket.emit('plugin:player:makechoice', {
                        playerName: name_1,
                        id: choice.id,
                        response: 'Yes'
                    });
                });
            }
        }
        if (msg.update === 'petbasic') {
            _.each(msg.data, function (petInfo) {
                if (petInfo.bought)
                    return;
                console.log("Buying " + petInfo.name);
                socket.emit('plugin:pet:buy', { petType: petInfo.name, petName: petInfo.name });
            });
        }
        if (!msg.type || !msg.text)
            return;
        if (isQuiet)
            return;
        if (msg.type === 'Global' && index === 1) {
            console.log("[" + msg.type + "] " + msg.text);
        }
        else if (msg.type === 'Single' && msg.targets[0] === name) {
            _.each(msg.targets, function (target) {
                console.log("[" + target + "] " + msg.text);
            });
        }
    });
};
if (argv.random) {
    _.each(_.sampleSize(players, numPlayers), play);
}
else if (argv.name) {
    console.log("Playing with " + argv.name);
    play(argv.name, 0);
}
else {
    _.each(players.slice(0, numPlayers), play);
}
// expect 50 players a second to join. Do it this way so quiet mode is quieter
setTimeout(function () {
    if (numConnected == numPlayers) {
        console.log('all players connected');
    }
    else {
        console.log(numConnected + ' of ' + numPlayers + ' connected.');
    }
    doDisplayConnections = true;
}, 1000 * Math.ceil(numPlayers / 50));
