const brain = require('brain.js');

const network = new brain.NeuralNetwork({
    hiddenLayers:[0]
});

const data = [
    {input:[0,0,0], output:[0]},
    {input:[0,0,1], output:[0]},
    //{input:[0,1,0], output:[0]},
    {input:[0,1,1], output:[0]},
    {input:[1,0,1], output:[1]},
    {input:[1,1,1], output:[1]},
    ];

network.train (data, {
    //log: (error) => console.log (error)
});

console.log (JSON.stringify(network.toJSON()))


//console.log (network.run([1,0,0]))
//console.log (network.run([0,1,0]))


