function Network (layers)
{
    this.layers = {};
    for (let layer=0; layer<layers.length; layer++)
    {
        this.layers[layer] = new Layer(layers[layer]);
    }
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



const brain = new Network([2,3,1]);
console.log (brain);