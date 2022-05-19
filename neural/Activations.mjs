const ActivationFunctions = {
    Sigmoid,
    Identity,
    SigmoidScaled,
    Clamp,
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

export default ActivationFunctions;
