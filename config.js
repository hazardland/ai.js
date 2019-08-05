var config = {
    name: 'submarine_short_short_2',
    width: 60,
    height: 30,
    scale: 20,
    speed: 1000,
    demo:500,
    train:200000,
    goal: 800,
    borders:false,

    creature: {
        type: 3,
        count: 1,
        energy: 30,
        laziness: 5,
        vision: 10

    },

    food: {
        type: 2,
        count:50,
        energy: 30
    },

    wall: {
        type:1,
        count:100
    },

    brain:{
        structure: [12,4],
        change: 0.1
    }
};
