/*
    emm it appears bias is connected also with weights with other neurons in next layer
    https://stackoverflow.com/questions/2480650/role-of-bias-in-neural-networks
*/

//this is nothing I tried to run this in node instead of browser for calculation speed I thought it would be faster but it was fuster
function browser ()
{
    if (typeof module === "undefined")
    {
        return true;
    }
    return false;
}
//this is also nothing node has no browser like localStorage
if (!browser())
{
    var localStorage = require('localStorage');
}

//This is the main thing here the Neural Network aka the Brain
function Network (layers)
{
    //neural network composition is provided with layer array
    //it is like [4,5,5,2]
    //which means input layer will have 4 inputs (+bias input), there are 2 hidden layers with 5 neuron in each (+ 1 bias neuron per each hidden layer)
    //and 2 output neouron (output neurons does not have bias of course)

    //so we init layers to populate them with neurons
    //it will be like this.layer[0] will have 4 input neurons
    this.layers = new Array(layers.length);
    for (let layer=0; layer<layers.length; layer++)
    {
        //input and hidden layers have bias neurons so they must have +1 neuron than specified (except last neuron)
        this.layers[layer] = new Array(layer==layers.length-1?layers[layer]-1:layers[layer]);
        for (let neuron=0; neuron<=layers[layer]; neuron++)
        {
            //if this is output(last) layer than we skip bias neuron
            if (layer==layers.length-1 && neuron==layers[layer])
            {
                //console.log ("skip last");
                break;
            }
            //create neuron and specify it if it is bias or not (bias is always last has value=1)
            this.layers[layer][neuron] = new Neuron((layer>0)?this.layers[layer-1]:null,neuron==layers[layer]?true:false);
        }
    }
}
if (!browser())
{
    module.exports.Network = Network;
}
//Network result calculation (maybe aka forward propagation)
//Input is an array
Network.prototype.result = function (input)
{
    //First we write input in the this.layer[0][n].value-s of input layer (input layer is always first)
    for (let neuron=0; neuron<this.layers[0].length-1; neuron++)
    {
        this.layers[0][neuron].value = input[neuron];
    }
    //Then we calculate result for each neuron in each layer starting from 2nd layer till output layer
    for (let layer=1;layer<this.layers.length;layer++)
    {
        for (let neuron=0; neuron<this.layers[layer].length; neuron++)
        {
            this.layers[layer][neuron].result(this.layers[layer-1]);
        }
    }
    //And lastly we copy output into new result array from last layer
    result = [];
    for (let neuron=0; neuron<this.layers[this.layers.length-1].length; neuron++)
    {
        result[neuron] = this.layers[this.layers.length-1][neuron].value;
    }
    return result;
}

//Neuron is an object which has weights for all neurons in previous layer
function Neuron (layer, bias)
{
    //If this is bias value is always 0
    this.value = bias?1:0;

    //If it is not neoron of input layer than there will be a parent layer
    if (layer)
    {
        //So if parent layer is not null we init weights array equal to parent layer
        this.weights = new Array(layer.length);
        //And then we generate random weights for each parent layer neuron
        for (let position=0; position<layer.length; position++)
        {
            //Random weight is between -1 and 1 (not including -1 and 1)
            this.weights[position] = Math.random()*(Math.ceil(Math.random()*2)==1?1:-1);
        }
    }
}
//To calculate result value of neuron we input parent layer
Neuron.prototype.result = function result (layer)
{
    this.value = 0;
    //We multiply parent layer neuron values on weights for parent layer neurons and sum them
    for (let neuron=0;neuron<layer.length;neuron++)
    {
        this.value += layer[neuron].value*this.weights[neuron];
    }
    //After we have value we pass it in acivation function in this case activation function is sigmoid
    this.value = 1/(1+Math.pow(Math.E, -this.value));
}

//I am not sure in in mutation this is totaly my invention and do not know how eficcently it works
//Idea of mutation is to create copy of Network and randomize its weights a bit
Network.prototype.mutate = function (rate)
{
    //first collect data about neural network layer lengths
    let structure = [];
    for (let layer=0;layer<this.layers.length;layer++)
    {
        structure[layer] = layer<this.layers.length-1?this.layers[layer].length-1:this.layers[layer].length;
    }
    //create clone for value coping
    let clone = new Network(structure);

    //iterate over layers to copy neurons (we skip first layer because it has no weights)
    for (let layer=1;layer<this.layers.length;layer++)
    {
        //iterate over layer neurons
        for (let neuron=0; neuron<this.layers[layer].length; neuron++)
        {
            //And mutate them by parent neuron weights
            clone.layers[layer][neuron].mutate(this.layers[layer][neuron], rate);
        }
    }
    return clone;
}
Neuron.prototype.mutate = function (parent, rate)
{
    //for every weight we need to create new weight
    for (let i=0;i<this.weights.length;i++)
    {
        //still do not know if it is better to adjust some weights only
        if (false && Math.ceil(Math.random()*2)==2)
        {
            this.weights[i] = parent.weights[i];

        }
        else
        {
            if (parent.weights[i] + rate>=1)
            {
                this.weights[i] = parent.weights[i]-rate;
            }
            else if (parent.weights[i] + rate<=-1)
            {
                this.weights[i] = parent.weights[i]+rate;
            }
            else
            {
                this.weights[i] = parent.weights[i] + rate*(Math.ceil(Math.random()*2)==1?1:-1);
            }
        }
    }
}
