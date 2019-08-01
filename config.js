var config = {
    name: 'mem_step_52',
    width: 60,
    height: 30,
    scale: 20,
    speed: 0,
    demo:500,
    train:200000,
    goal: 800,
    borders:false,

    creature: {
        type: 3,
        count: 1000,
        energy: 30,
        laziness: 5

    },

    food: {
        type: 2,
        count:30,
        energy: 30
    },

    wall: {
        type:1,
        count:30
    },

    brain:{
        structure: [52,4,4],
        change: 0.1
    }
};
