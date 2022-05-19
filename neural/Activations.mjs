const ActivationFunctions = {
    Sigmoid,
    Identity,
    SigmoidScaled,
    Clamp,
}

function Sigmoid(input) {
    return 1/(1+ Math.exp(-input));
}

function Clamp(input) {
    return Math.min(Math.max(input, 0), 1);
}

function SigmoidScaled(input){
    return Sigmoid(input) * 2 - 1;
}

function Identity(input) {
    return input;
}

export default ActivationFunctions;