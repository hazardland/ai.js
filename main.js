//So Perceptron is some fucking term which describes a simpliest entity of neural network
//Of courese it has input layer but has one output (many perceptrons togather are called neural networks)
//In case of neural network output of the perceptron is one input for other peceptron
//input[i]*layer[]
//https://towardsdatascience.com/what-the-hell-is-perceptron-626217814f53
//https://www.youtube.com/watch?v=tIeHLnjs5U8

function Network (layers)
{
    this.layers = {};
    for (let layer=0; layer<layers.length; layer++)
    {
        this.layers[layer] = new Layer(layers[layer]);
    }
}
Network.prototype.input = function (input)
{

}
function Layer(neurons){

    this.bias = weight()
    this.weights = {};
    for (let neuron=0; neuron<neurons; neuron++)
    {
        this.weights[neuron] = weight();
    }
}
//here input is single number
Layer.prototype.output = function (input)
{

}

function Neuron (layer)
{
    this.value = 0;
    if (layer)
    {
        this.bias = 1;
        this.weights = {};
        for (let position=0; position<layer.length; position++)
        {
            this.weights[position] = Math.random()*(Math.ceil(Math.random()*2)==1?1:-1);
        }
    }

}
const brain = new Network([2,1]);
console.log (brain);