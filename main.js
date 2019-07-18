//So Perceptron is some fucking term which describes a simpliest entity of neural network
//Of courese it has input layer but has one output (many perceptrons togather are called neural networks)
//In case of neural network output of the perceptron is one input for other peceptron
//input[i]*layer[]
//https://towardsdatascience.com/what-the-hell-is-perceptron-626217814f53
//https://www.youtube.com/watch?v=tIeHLnjs5U8

function Network (layers)
{
    this.layers = [];
    for (let layer=0; layer<layers.length; layer++)
    {
        this.layers[layer] = [];
        for (let neuron=0; neuron<layers[layer]; neuron++)
        {
            this.layers[layer][neuron] = new Neuron((layer>0)?this.layers[layer-1]:null);
        }
    }
}
Network.prototype.result = function (input)
{
    for (let neuron=0; neuron<this.layers[0].length; neuron++)
    {
        this.layers[0][neuron].value = input[neuron];
    }
    for (let layer=1;layer<this.layers.length;layer++)
    {
        for (let neuron=0; neuron<this.layers[layer].length; neuron++)
        {
            this.layers[layer][neuron].result(this.layers[layer-1]);
        }
    }
    result = [];
    for (let neuron=0; neuron<this.layers[this.layers.length-1].length; neuron++)
    {
        result[neuron] = this.layers[this.layers.length-1][neuron].value;
    }
    return result;
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
Neuron.prototype.result = function result (layer)
{
    this.value = this.bias;
    for (let neuron=0;neuron<layer.length;neuron++)
    {
        this.value += layer[neuron].value*this.weights[neuron];
    }
    this.value = 1/(1+Math.pow(Math.E, -this.value));
}

function World (width, height, scale)
{
    this.scale = scale;
    this.witdh = width;
    this.height = height;
    this.map = [];
    for (let x=0; x<width; x++)
    {
        this.map[x] = [];
        for (let y=0; y<height; y++)
        {
            result = Math.floor(Math.random() * 200);
            this.map[x][y] = result>2?0:result;

        }
    }
}
World.prototype.draw = function (board)
{
    for (let x=0; x<this.map.length; x++)
    {
        for (let y=0; y<this.map[x].length; y++)
        {
            if (this.map[x][y]>0)
            {
                if (this.map[x][y]==1)
                {
                    board.fillStyle = "#4b7a2a";
                }
                else if (this.map[x][y]==2)
                {
                    board.fillStyle = "#ff0000";
                }
                board.fillRect(x*10,y*10,10,10);
            }
        }
    }

}

function Food()
{

}

function Body ()
{
    this.brain = new Network([4,6,4]);
    this.energy = 10;
}

const brain = new Network([4,6,2]);
console.log (brain.result ([1,5,3,4]));
