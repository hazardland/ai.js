var config = {
    name: 'vision_inverse_4',
    width: 30,
    height: 30,
    scale: 20,
    speed: 0,
    demo:500,
    train:200000,
    goal: 20,
    borders:true,

    creature: {
        type: 3,
        count: 500,
        energy: 30,
        laziness: 10,
        vision: 10

    },

    food: {
        type: 2,
        count:20,
        energy: 30
    },

    wall: {
        type:1,
        count:50
    },

    brain:{
        structure: [12,4,4],
        change: 0.1
    }
};
