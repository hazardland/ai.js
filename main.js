//So Perceptron is some fucking term which describes a simpliest entity of neural network
//Of courese it has input layer but has one output (many perceptrons togather are called neural networks)
//In case of neural network output of the perceptron is one input for other peceptron
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
        this.weights = [];
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

Network.prototype.mutate = function (input)
{
    for (let layer=1;layer<this.layers.length;layer++)
    {
        for (let neuron=0; neuron<this.layers[layer].length; neuron++)
        {
            this.layers[layer][neuron].mutate();
        }
    }
}
Neuron.prototype.mutate = function ()
{
    for (let i=0;i<this.weights.length;i++)
    {
        this.weights[i] = this.weights[i] + 0.001*(Math.ceil(Math.random()*2)==1?1:-1);
    }
}

function World (width, height, scale)
{
    this.scale = scale;
    this.width = width;
    this.height = height;
    this.populate();
}
World.prototype.populate = function(brain)
{
    this.hero = null;
    this.map = [];
    for (let x=0; x<this.width; x++)
    {
        this.map[x] = [];
        for (let y=0; y<this.height; y++)
        {
            this.map[x][y] = 0;
        }
    }    
    this.food = [];
    this.creatures = [];
    for (let i=0; i<50; i++)
    {
        point = this.place();
        if (point!=false)
        {
            this.food.push(new Food(this,i,point.x,point.y));
        }
    }
    for (let i=0; i<3; i++)
    {
        point = this.place();
        if (point!=false)
        {
            if (brain)
            {
                brain.mutate();
            }
            this.creatures.push(new Creature(this,i,point.x,point.y,brain));
        }
    }
}
World.prototype.place = function ()
{
    attempts = 0; 
    while (true)
    {
        attempts++;
        x = Math.floor(Math.random() * this.width);
        y = Math.floor(Math.random() * this.height);
        if (this.map[x][y]==0)
        {
            return {x:x, y:y};
        }
        else if (attempts>10)
        {
            return false;
        }
    }
}
World.prototype.draw = function (view)
{
    view.clearRect(0, 0, this.width*this.scale, canvas.height*this.scale);
    for (let i=0; i<this.food.length; i++)
    {
        this.food[i].draw(view);
    }
    let alive = 0;    
    for (let i=0; i<this.creatures.length; i++)
    {
        if (this.creatures[i].alive)
        {
            alive++;
            this.creatures[i].move();
        }
        this.creatures[i].draw(view);
    }
    let hero = null;
    if (alive==0 && !this.hero)
    {
        let score = 0;
        for (let i=0; i<this.creatures.length; i++)
        {
            if (this.creatures[i].points>score)
            {
                hero = this.creatures[i];
                score = hero.points;
            }
        }
        hero.hero = true;
        this.hero = true;
        this.populate(hero.brain);
    }
}

function Food(world,index,x,y)
{
    this.alive = true;
    this.index = index;
    this.type = 2;
    this.world = world;
    this.x = x;
    this.y = y;
    this.energy = 10;
    this.alocate();
}
Food.prototype.alocate = function()
{
    this.world.map[this.x][this.y] = this;
}
Food.prototype.destroy = function()
{
    this.alive = false;
    this.world.map[this.x][this.y] = 0;
}
Food.prototype.draw = function (view)
{
    //console.log ('drawing food at '+this.x+','+this.y);    
    view.fillStyle = this.alive?"red":"yellow";
    view.fillRect(this.x*this.world.scale,this.y*this.world.scale,1*this.world.scale,1*this.world.scale);    
}


function Creature (world,index,x,y,brain)
{
    this.points = 0;
    this.alive = true;
    this.index = index;
    this.type = 3;
    this.world = world;
    this.x = x;
    this.y = y;
    this.energy = 10;
    if (brain)
    {
        this.brain = brain;
    }
    else
    {
        this.brain = new Network([48,2,4]);
    }
    this.hero = false;
    this.alocate();
}
Creature.prototype.alocate = function()
{
    this.world.map[this.x][this.y] = this;
}
Creature.prototype.draw = function (view)
{
    //console.log ('drawing creature at '+this.x+','+this.y);
    if (this.hero)
    {
        view.fillStyle = "white";
    }    
    else
    {
        view.fillStyle = this.alive?"blue":"grey";
    }
    //view.fillStyle = "#ff0000";
    view.fillRect(this.x*this.world.scale,this.y*this.world.scale,1*this.world.scale,1*this.world.scale);
    view.font = "12px Consolas";
    view.fillStyle = this.alive?"white":"grey";    
    view.fillText(this.index+"|"+this.energy+"|"+this.points, this.x*this.world.scale, this.y*this.world.scale);
}
Creature.prototype.scan = function (x,y)
{
    if (this.x+x<0 || this.x+x>=this.world.width || this.y+y<0 || this.y+y>=this.world.height)
    {
        return 1;
    }
    if (this.world.map[this.x+x][this.y+y]!=0)
    {
        return this.world.map[this.x+x][this.y+y].type;
    }
    return 0;
}
Creature.prototype.vision = function ()
{
    result = [
        this.scan(-3,-3),this.scan(-2,-3),this.scan(-1,-3),this.scan(0,-3),this.scan(1,-3),this.scan(2,-3),this.scan(3,-3),
        this.scan(-3,-2),this.scan(-2,-2),this.scan(-1,-2),this.scan(0,-2),this.scan(1,-2),this.scan(2,-2),this.scan(3,-2),
        this.scan(-3,-1),this.scan(-2,-1),this.scan(-1,-1),this.scan(0,-1),this.scan(1,-1),this.scan(2,-1),this.scan(3,-1),
        this.scan(-3,0),this.scan(-2,0),this.scan(-1,0),/*this.scan(0,0)*/this.scan(1,0),this.scan(2,0),this.scan(3,0),
        this.scan(-3,1),this.scan(-2,1),this.scan(-1,1),this.scan(0,1),this.scan(1,1),this.scan(2,1),this.scan(3,1),
        this.scan(-3,2),this.scan(-2,2),this.scan(-1,2),this.scan(0,2),this.scan(1,2),this.scan(2,2),this.scan(3,2),
        this.scan(-3,3),this.scan(-2,3),this.scan(-1,3),this.scan(0,3),this.scan(1,3),this.scan(2,3),this.scan(3,3),
    ];

    // let vision = '';
    // for (let i=0;i<7;i++)
    // {
    //     for (let j=0;j<7;j++)
    //     {
    //         if (i==3 && j==3)
    //         {
    //             vision = vision + "  ";
    //         }
    //         else
    //         {
    //             vision = vision+result[(i*7)+j]+" ";
    //         }
    //     }
    //     vision = vision+"\n";
    // }    
    //console.log (result.length);

    return result;
}
Creature.prototype.move = function()
{
    vision = this.vision();
    let result = [Math.random(),Math.random(),Math.random(),Math.random(),Math.random()];
    result = this.brain.result(vision);
    let debug = ['staying','moving left','moving right','moving up','moving down'];
    let max = 0;
    let action = 0;
    let x = 0;
    let y = 0;
    for (let i=0; i<5; i++)
    {
        if (result[i]>max)
        {
            max = result[i];
            action = i;
        }
    }
    //stay = 0
    //left
    //
    if (action==1)
    {
        x = -1;
    }
    //right
    else if (action==2)
    {
        x = 1;
    }
    //up
    else if (action==3)
    {
        y = -1;
    }
    //down
    else if (action==4)
    {
        y = 1;
    }
    if ((x!=0 || y!=0) && this.test (this.x+x, this.y+y))
    {
        //console.log (this.index+"("+this.energy+") "+debug[action]);
        if (this.food(this.x+x,this.y+y))
        {
            this.eat(this.x+x,this.y+y);
        }
        this.world.map[this.x][this.y] = 0;
        this.x = this.x+x;
        this.y = this.y+y;
        this.points++;
        this.alocate();
    }
    this.energy--;
    if (this.energy<=0)
    {
        this.destroy();
    }
}
Creature.prototype.destroy = function()
{
    this.world.map[this.x][this.y] = 0;
    this.alive = false;
}
Creature.prototype.test = function (x,y)
{
    //console.log ("testing at "+x+","+y);
    if (x<0 || x>=this.world.width || y<0 || y>=this.world.height)
    {
        return false;
    }
    if (this.world.map[x][y]!=0 && this.world.map[x][y].type==3)
    {
        return false;
    }
    return true;
}
Creature.prototype.food = function (x,y)
{
    if (typeof this.world.map[x][y]!=='undefined' && this.world.map[x][y]!=0 && this.world.map[x][y].type==2)
    {
        return true;
    }
    return false;
}
Creature.prototype.eat = function (x,y)
{
    this.energy += this.world.map[x][y].energy;
    this.world.map[x][y].energy = 0;
    this.world.map[x][y].destroy();
}


//const brain = new Network([4,6,2]);
//console.log (brain.result ([1,5,3,4]));
