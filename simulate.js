var ai = require ('./ai.js');

var config = {
    name: 'test1',
    width: 10,
    height: 10,
    scale: 20,
    speed: 0,
    demo:100,
    train:20000,
    creature: {
        count: 500,
        energy: 100,
        laziness: 4

    },
    food: {
        count:0,
        energy: 100
    },
    wall: {
        count:0
    },
    brain:{
        structure: [48,48,4],
        change: 0.01 
    }
};

var world = new ai.World(config);

while (true)
{
    world.run();
}
