/*
    emm it appears bias is connected also with weights with other neurons in next layer 
    https://stackoverflow.com/questions/2480650/role-of-bias-in-neural-networks
*/

function Network (layers)
{
    this.layers = [];
    for (let layer=0; layer<layers.length; layer++)
    {
        this.layers[layer] = new Array(layer==layers.length-1?layers[layer]-1:layers[layer]);
        for (let neuron=0; neuron<=layers[layer]; neuron++)
        {
            //if this is output(last) layer than we skip bias neuron
            if (layer==layers.length-1 && neuron==layers[layer]) 
            {
                //console.log ("skip last");
                break;
            }
            //create neuron and specify it if it is bias or not (bias is always last)
            this.layers[layer][neuron] = new Neuron((layer>0)?this.layers[layer-1]:null,neuron==layers[layer]?true:false);
        }
    }
}
Network.prototype.result = function (input)
{
    for (let neuron=0; neuron<this.layers[0].length-1; neuron++)
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

function Neuron (layer, bias)
{
    this.value = bias?1:0;
    if (layer)
    {
        this.weights = new Array(layer.length);
        for (let position=0; position<layer.length; position++)
        {
            this.weights[position] = Math.random()*(Math.ceil(Math.random()*2)==1?1:-1);
        }
    }
}
Neuron.prototype.result = function result (layer)
{
    //this.value = this.bias;
    this.value = 0;
    for (let neuron=0;neuron<layer.length;neuron++)
    {
        this.value += layer[neuron].value*this.weights[neuron];
    }
    this.value = 1/(1+Math.pow(Math.E, -this.value));
}

Network.prototype.mutate = function (rate)
{
    //create clone
    let structure = [];
    for (let layer=0;layer<this.layers.length;layer++)
    {
        structure[layer] = layer<this.layers.length-1?this.layers[layer].length-1:this.layers[layer].length;
    }
    let clone = new Network(structure);
    //copy neurons
    for (let layer=1;layer<this.layers.length;layer++)
    {
        for (let neuron=0; neuron<this.layers[layer].length; neuron++)
        {
            clone.layers[layer][neuron].mutate(this.layers[layer][neuron], rate);
        }
    }
    return clone;
}
Neuron.prototype.mutate = function (parent, rate)
{
    for (let i=0;i<this.weights.length;i++)
    {
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

function World (config)
{
    this.config = config;
    this.generation = 1;
    this.scale = config.scale;
    this.width = config.width;
    this.height = config.height;
    this.populate(this.load());
}
World.prototype.populate = function(brain)
{
    if (this.generation==1 && brain)
    {
        console.log(brain);
        console.log("loaded brain "+brain.layers[1][17].weights[13]);
    }
    this.generation++;
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

    point = this.place();
    this.creatures = [];
    for (let i=0; i<this.config.creature.count; i++)
    {
        this.creatures.push(new Creature(this,i,point.x,point.y,brain?brain.mutate(this.config.brain.change):null));
    }

    this.food = [];
    for (let i=0; i<this.config.food.count; i++)
    {
        point = this.place();
        if (point!=false)
        {
            this.food.push(new Food(this,i,point.x,point.y));
        }
    }

    //if (!this.walls)
    //{
        this.walls = [];
        for (let i=0; i<this.config.wall.count; i++)
        {
            point = this.place();
            if (point!=false)
            {
                this.walls.push(new Wall(this,i,point.x,point.y));
            }
        }
    //}

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
    if (view)
    {
        view.clearRect(0, 0, this.width*this.scale, canvas.height*this.scale);
    }
    for (let i=0; i<this.walls.length; i++)
    {
        this.walls[i].draw(view);
    }
    for (let i=0; i<this.food.length; i++)
    {
        this.food[i].draw(view);
        if (!this.food[i].alive)
        {
            point = this.place();
            if (point!=false)
            {
                this.food[i] = new Food(this,i,point.x,point.y);
            }    
        }
    }
    let alive = 0;    
    for (let i=0; i<this.creatures.length; i++)
    {
        if (this.creatures[i].alive)
        {
            alive++;
            this.creatures[i].move();
            this.creatures[i].draw(view);
        }
        
    }
    let hero = null;
    if (alive==0 && !this.hero)
    {
        let score = 0;
        for (let i=0; i<this.creatures.length; i++)
        {
            if (this.creatures[i].score()>score)
            {
                hero = this.creatures[i];
                score = hero.score();
            }
        }
        if (hero)
        {
            hero.hero = true;
            this.hero = true;
            this.save(hero.brain);
            document.title = this.generation+" "+hero.dinners+" "+hero.curiosity+" "+hero.energy;
            this.populate(hero.brain);    
        }
        else
        {
            this.populate();
        }
    }
}
World.prototype.save = function (brain)
{
    //console.log("saved brain "+brain.layers[1][17].weights[13]);
    localStorage.setItem (this.config.name, JSON.stringify(brain));
}
World.prototype.load = function ()
{
    string = localStorage.getItem(this.config.name);
    if (!string)
    {
        return;
    }
    brain = JSON.parse(string);
    brain.__proto__ = new Network(this.config.brain.structure);
    return brain;
}


function Wall(world,index,x,y)
{
    this.index = index;
    this.type = -50;
    this.world = world;
    this.x = x;
    this.y = y;
    this.alocate();
}
Wall.prototype.alocate = function()
{
    this.world.map[this.x][this.y] = this;
}
Wall.prototype.draw = function (view)
{
    if (!view)
    {
        return;
    }
    view.fillStyle = "#181818";
    view.fillRect(this.x*this.world.scale,this.y*this.world.scale,1*this.world.scale,1*this.world.scale);    
}

function Food(world,index,x,y)
{
    this.alive = true;
    this.index = index;
    this.type = 50;
    this.world = world;
    this.x = x;
    this.y = y;
    this.energy = this.world.config.food.energy;
    this.alocate();
    this.eaten = 0;
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
    if (!view)
    {
        return;
    }
    //console.log ('drawing food at '+this.x+','+this.y);    
    view.fillStyle = !this.eaten?"red":"yellow";
    //view.fillRect(this.x*this.world.scale,this.y*this.world.scale,1*this.world.scale,1*this.world.scale);    

    view.beginPath();
    view.arc(this.x*this.world.scale+this.world.scale/2,this.y*this.world.scale+this.world.scale/2, this.world.scale/2, 0, 2 * Math.PI, false);
    //ctx.fillStyle = "rgb(255, 0, 0)";
    view.fill();

    if (this.eaten)
    {
        view.font = "12px Consolas";
        view.fillStyle = this.alive?"white":"grey";    
        view.fillText(this.eaten, this.x*this.world.scale+this.world.scale, this.y*this.world.scale);
    
    }

}
Food.prototype.hit = function ()
{
    this.eaten ++;
}



function Creature (world,index,x,y,brain)
{
    this.eaten = [];
    this.dinners = 0;
    this.path = [];
    this.curiosity = 0;
    this.laziness = 0;
    this.points = 0;
    this.alive = true;
    this.index = index;
    this.type = 3;
    this.world = world;
    this.x = x;
    this.y = y;
    this.energy = this.world.config.creature.energy;
    if (brain)
    {
        //console.log (brain.layers[1][2].weights[20]);
        this.brain = brain;
    }
    else
    {
        this.brain = new Network(this.world.config.brain.structure);
    }
    this.hero = false;
    this.alocate();
}
Creature.prototype.alocate = function()
{
    //this.world.map[this.x][this.y] = this;
}
Creature.prototype.draw = function (view)
{
    if (!view) return;
    //console.log ('drawing creature at '+this.x+','+this.y);
    if (this.dinners)
    {
        view.fillStyle = this.alive?"green":"white";
    }    
    else
    {
        view.fillStyle = this.alive?"blue":"grey";
    }
    //view.fillStyle = "#ff0000";
    view.fillRect(this.x*this.world.scale,this.y*this.world.scale,1*this.world.scale,1*this.world.scale);
    //view.fillText(this.index+"|"+this.energy+"|"+this.points, this.x*this.world.scale, this.y*this.world.scale);
    if (this.dinners || this.curiosity)
    {
        view.font = "12px Consolas";
        view.fillStyle = this.alive?"white":"grey";        
        view.fillText(this.dinners+"|"+this.curiosity, this.x*this.world.scale, this.y*this.world.scale);
    }
}
Creature.prototype.scan = function (x,y)
{
    if (this.x+x<0 || this.x+x>=this.world.width || this.y+y<0 || this.y+y>=this.world.height)
    {
        return -50;
    }
    x = this.xx (this.x+x);
    y = this.yy (this.y+y);
    if (this.world.map[x][y]!=0)
    {
        return this.world.map[x][y].type;
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
    if (!this.alive)
    {
        console.log ('wtf');
    }
    vision = this.vision();
    //let result = [Math.random(),Math.random(),Math.random(),Math.random(),Math.random()];
    let result = this.brain.result(vision);
    let debug = ['moving left','moving right','moving up','moving down'];
    let max = 0;
    let action = 0;
    let x = 0;
    let y = 0;
    for (let i=0; i<4; i++)
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
    if (action==0)
    {
        x = -1;
    }
    //right
    else if (action==1)
    {
        x = 1;
    }
    //up
    else if (action==2)
    {
        y = -1;
    }
    //down
    else if (action==3)
    {
        y = 1;
    }
    if ((x!=0 || y!=0) && !this.wall(this.x+x,this.y+y))
    {
        //console.log (this.index+"("+this.energy+") "+debug[action]);
        if (this.food(this.xx(this.x+x),this.yy(this.y+y)))
        {
            this.eat(this.xx(this.x+x),this.yy(this.y+y));
        }
        //this.world.map[this.x][this.y] = 0;
        this.x = this.xx(this.x+x);
        this.y = this.yy(this.y+y);
        this.log(this.x,this.y);
        this.points++;
        this.alocate();
    }
    else
    {
        //console.log ('hiy');
        this.destroy();
    }
    this.energy--;
    if (this.energy<=0 || this.laziness>this.world.config.creature.laziness)
    {
        this.destroy();
    }
}
Creature.prototype.destroy = function()
{
    //this.world.map[this.x][this.y] = 0;
    this.alive = false;
}
Creature.prototype.xx = function (x)
{
    if (x<0)
    {
        x = this.world.width-1;
    }
    if (x>=this.world.width)
    {
        x = 0;
    }
    return x;
}
Creature.prototype.yy = function (y)
{
    if (y<0)
    {
        y = this.world.height-1;
    }
    if (y>=this.world.height)
    {
        y = 0;
    }
    return y    
}
Creature.prototype.wall = function (x,y)
{
    //console.log ("testing at "+x+","+y);
    if (x<0 || x>=this.world.width || y<0 || y>=this.world.height)
    {
        return true;
    }
    //if (this.world.map[x][y]!=0 && (this.world.map[x][y].type==3 || this.world.map[x][y].type==1))
    x = this.xx(x);
    y = this.yy(y);
    if (this.world.map[x][y]!=0 && this.world.map[x][y].type==-50)
    {
        return true;
    }
    return false;
}
Creature.prototype.food = function (x,y)
{
    if (typeof this.world.map[x][y]!=0 && this.world.map[x][y]!=0 && this.world.map[x][y].type==50)
    {
        return true;
    }
    return false;
}
Creature.prototype.eat = function (x,y)
{
    if (!this.eaten[this.world.map[x][y].index])
    {
        this.dinners++;
        this.world.map[x][y].hit();
        this.energy += this.world.map[x][y].energy;
        this.eaten[this.world.map[x][y].index] = true;    
    }
    //this.world.map[x][y].energy = 0;
    //this.world.map[x][y].destroy();
}
Creature.prototype.log = function(x,y)
{
    if (!this.path[x])
    {
        this.path[x] = [];
    }
    if (!this.path[x][y])
    {
        this.path[x][y] = true;
        this.curiosity++;
    }
    else
    {
        this.laziness++;
    }
}
Creature.prototype.score = function ()
{
    return (this.dinners+1)*(this.curiosity+1);
}
brain = new Network([1,1,1]);
brain = brain.mutate(0.1).mutate(1);
console.log (brain);
console.log (JSON.stringify(brain));
