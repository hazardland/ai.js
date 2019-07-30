var ai = require ('./lib/ai.js');
var ai = require ('./lib/world.js');

var config = {
    name: 'final',
    width: 10,
    height: 10,
    scale: 20,
    speed: 0,
    demo:100,
    train:200000,
    creature: {
        count: 500,
        energy: 400,
        laziness: 4

    },
    food: {
        count:0,
        energy: 100
    },
    wall: {
        count:5
    },
    brain:{
        structure: [8,8,4],
        change: 0.01
    }
};

var world = new ai.World(config);

while (true)
{
    world.run();
}
