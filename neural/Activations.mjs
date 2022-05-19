const ActivationFunctions = {
    Sigmoid,
    Identity,
    SigmoidScaled,
}

function Sigmoid(input) {
    return 1/(1+ Math.exp(-input));
}

function SigmoidScaled(input){
    return Sigmoid(input) * 2 - 1;
}

function Identity(input) {
    return input;
}

export default ActivationFunctions;