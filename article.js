function Perceptron(opts) {
    //აქ დეფაულტებს აყენებს
    if (!opts) opts = {}

  // თუ დებაგი არ შემოვიდა დებაგი არის გათიშულია
  var debug = 'debug' in opts ? opts.debug : false;

 // slice აკეთებს მასივის კლონირებას თუ არ შემოვიდა წონები ცარიელი არის მასივი
  var weights = 'weights' in opts
    ? opts.weights.slice()
    : []

// რა არის სრეზოლდი არ ვიცით დეფაულტი არის 1
  var threshold = 'threshold' in opts
    ? opts.threshold
    : 1

// ეს შეიძლება იყოს შეცდომის შემთხვევაში რა მნიშვნელობით უნდა შეიცვალოს წონა დეფაულტი არის 0.1
  var learningrate;
  if (!('learningrate' in opts)) {
    learningrate = 0.1
  }
  else {
    learningrate = opts.learningrate
  }

  // ჯერ არ ვიცით სად იყენებს
  var data = []

  var api = {
    weights: weights,
    retrain: function() {
      var length = data.length
      var success = true
      for(var i=0; i<length; i++) {
        var training = data.shift()
        success = api.train(training.input, training.target) && success
      }
      return success
    },
    train: function(inputs, expected) {
      while (weights.length < inputs.length) {
        weights.push(Math.random())
      }
      // add a bias weight for the threshold
      if (weights.length == inputs.length) {
        weights.push('bias' in opts ? opts.bias : 1)
      }

      var result = api.perceive(inputs)
      data.push({input: inputs, target: expected, prev: result})

      if (debug) console.log('> training %s, expecting: %s got: %s', inputs, expected, result)

      if (result == expected) {
        return true
      }
      else {
        if (debug) console.log('> adjusting weights...', weights, inputs);
        for(var i=0; i < weights.length; i++) {
          var input = (i == inputs.length)
            ? threshold
            : inputs[i]
          api.adjust(result, expected, input, i)
        }
        if (debug) console.log(' -> weights:', weights)
        return false
      }
    },

    adjust: function(result, expected, input, index) {
      var d = api.delta(result, expected, input, learningrate);
      weights[index] += d;
      if (isNaN(weights[index])) throw new Error('weights['+index+'] went to NaN!!')
    },

    delta: function(actual, expected, input, learnrate) {
      return (expected - actual) * learnrate * input
    },

    perceive: function(inputs, net, activationFunc) {
      var result = 0
      for(var i=0; i<inputs.length; i++) {
        result += inputs[i] * weights[i]
      }
      
      result += threshold * weights[weights.length - 1];

      // Set the activation function to sigmoid, hardside, or a custom formula.
      activationFunc = activationFunc || ((x) => { return Number(this.sigmoid(x) >= 0.5) });
      //activationFunc = activationFunc || ((x) => { return this.sigmoid(x) });
      //activationFunc = activationFunc || ((x) => { return Number(this.hardside(x) > 0) });

      // Finally, pass the result through an activation function to determine if the neuron fires.
      return activationFunc ? activationFunc(result) : (net ? result : (result > 0 ? 1 : 0));
    },
    
    sigmoid: function(t) {
    	return 1/(1+Math.pow(Math.E, -t));
    },
    
    hardside: function(t) {
    	return t;
    }
  }

  return api;
}

var print = function(msg) {
  document.getElementById('output').innerHTML += msg + '<br/>';
  console.log(msg);
}

var or = new Perceptron();

or.train([0, 0], 0);
or.train([0, 1], 1);
or.train([1, 0], 1);
or.train([1, 1], 1);

// practice makes perfect (we hope...)
var i = 0;
while(i++ < 10000 && !or.retrain()) {}

print('OR');
print(or.perceive([0, 0]));
print(or.perceive([0, 1]));
print(or.perceive([1, 0]));
print(or.perceive([1, 1]));

var and = new Perceptron();

and.train([0, 0], 0);
and.train([0, 1], 0);
and.train([1, 0], 0);
and.train([1, 1], 1);

// practice makes perfect (we hope...)
var i = 0;
while(i++ < 10000 && !and.retrain()) {}

print('AND');
print(and.perceive([0, 0]));
print(and.perceive([0, 1]));
print(and.perceive([1, 0]));
print(and.perceive([1, 1]));
