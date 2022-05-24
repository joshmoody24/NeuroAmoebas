const ActivationFunctions = {
    Sigmoid,
    Identity,
    SigmoidScaled,
    Clamp,
    Inverse,
    Sin,
    Log2,
    Exp,
    Abs,
    Square,
    Cube,
}

export function RandomActivation(){
    // only select the good ones for random nodes
    const choices = ["Sigmoid", "SigmoidScaled", "Clamp", "Inverse", "Sin", "Log2", "Exp", "Abs", "Square", "Cube"];
    return choices[Math.floor(Math.random() * choices.length)];
}



function Sigmoid(input) {
    return 1/(1 + Math.exp(-input));
}

function Clamp(input) {
	const result = Math.min(Math.max(input, 0), 1);
    return result; 
}

function SigmoidScaled(input){
    const result = Sigmoid(input) * 2 - 1;
	return result;
}

function Identity(input) {
    return input;
}

function Inverse(input){
    if(input === 0) return Infinity;
    return 1/input;
}

function Sin(input){
    return Math.sin(input);
}

function Relu(input){
    if(input > 0) return input;
    else return 0;
}

function Log2(input){
    return Math.log2(input);
}

function Square(input){
    return input * input;
}

function Abs(input){
    return Math.abs(input);
}

function Exp(input){
    return Math.exp(input);
}

function Cube(input){
    return input * input * input;
}

export default ActivationFunctions;