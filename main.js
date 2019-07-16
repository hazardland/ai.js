//So Perceptron is some fucking term which describes a simpliest entity of neural network
//Of courese it has input layer but has one output (many perceptrons togather are called neural networks)
//In case of neural network output of the perceptron is one input for other peceptron
//input[i]*layer[]
//https://towardsdatascience.com/what-the-hell-is-perceptron-626217814f53


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
    function weight ()
    {
        //returns random number between -1 and 1
        return Math.random()*(Math.ceil(Math.random()*2)==1?1:-1);
    }
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

const brain = new Network([2,1]);
console.log (brain);