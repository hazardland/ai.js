function debug (brain, canvas, titles)
{

    let view = canvas.getContext("2d");

    let config = {
        left: 90,
        top: 3,
        radius: 15,
        right: 120,
        bottom: 20,
        max: 0,
        glow: 2,
        bold: 0.8 //when to change line color
    };


    function center(row, column, columns)
    {

        //console.log (row+";"+column+" "+config.max+"-"+columns);
        return {
            x: config.left+column*(config.radius*2+config.right)-config.radius,
            y: config.top*2+((config.max-columns)/2)*(config.radius*2+config.bottom)+row*(config.radius*2+config.bottom)-config.radius
        };
    }

    config.max = 0;
    for (column=0; column<brain.layers.length; column++)
    {
        if (brain.layers[column].length>config.max)
        {
            config.max = brain.layers[column].length;
        }
    }
    //console.log (config.max);

    width = config.left*2+(brain.layers.length-1)*(config.radius*2+config.right);
    height  = config.top*2+(config.max)*(config.radius*2+config.bottom);

    canvas.setAttribute('width', width+"px");
    canvas.setAttribute('height', height+"px");

    //console.log (width+"x"+height);
    view.clearRect(0, 0, width, height);


    for (column=0; column<brain.layers.length; column++)
    {
        for (row=0; row<brain.layers[column].length; row++)
        {
            point = center(row,column,brain.layers[column].length-1);
            if (column>=1)
            {
                for (neuron=0; neuron<brain.layers[column][row].weights.length; neuron++)
                {
                    from = center(neuron,column-1,brain.layers[column-1].length-1);
                    view.beginPath();
                    view.moveTo(point.x-config.radius/2, point.y);
                    view.lineTo(from.x+config.radius/2, from.y);
                    weight = brain.layers[column][row].weights[neuron];
                    width = weight/config.glow+0.0000001;
                    width = width<0?(-1*width):width;
                    view.lineWidth = width;
                    if (weight>=config.bold)
                    {
                        color = 'yellow';
                    }
                    else if (weight<=-1*config.bold)
                    {
                        color = 'red';
                    }
                    else
                    {
                        color = '#514747';
                    }
                    view.strokeStyle = color;
                    //console.log(weight+" "+width+" "+color);
                    view.stroke();
                }
            }
        }
    }


    for (column=0; column<brain.layers.length; column++)
    {
        for (row=0; row<brain.layers[column].length; row++)
        {
            point = center(row,column,brain.layers[column].length-1);

                    weight = brain.layers[column][row].value;
                    if (weight>1) weight = 1;
                    if (weight<-1) weight = -1;
                    width = weight/0.4+0.0000001;
                    width = width<0?(-1*width):width;
                    width = width<0.7?0.7:width;
                    if (weight>=config.bold)
                    {
                        color = 'yellow';
                    }
                    else if (weight<=-1*config.bold)
                    {
                        color = 'red';
                    }
                    else
                    {
                        color = '#514747';
                    }

            view.beginPath();
            view.fillStyle = "black";
            view.arc(point.x, point.y, config.radius, 0, 2 * Math.PI, false);
            view.lineWidth = width;
            view.strokeStyle= color;
            view.stroke();

            view.beginPath();
            view.arc(point.x, point.y, config.radius-width/2, 0, 2 * Math.PI, false);
            view.fill();

            //weight = Math.round(brain.layers[column][row].value*100)/100;
            weight = brain.layers[column][row].value.toFixed(2);
            view.font = "9px Arial";
            view.fillStyle = "white";
            view.fillText(weight, point.x-9, point.y+2);
            view.font = "10px Verdana";


            if (column==0 && titles && titles.input && titles.input[row])
            {
                view.fillText(titles.input[row], point.x-config.radius-titles.input[row].length*5-5, point.y+2);
            }
        }
    }
}
