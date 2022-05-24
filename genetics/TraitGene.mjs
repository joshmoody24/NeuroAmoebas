import Color from "../geometry/Color.mjs";
import { clamp } from "../geometry/MathUtils.mjs";

export default class TraitGene {
    constructor(value, mutable, mutateFunction="default", min=0.01, max=100){
        this.value = value;
        this.mutable = mutable;
        this.min = min;
        this.max = max;
        this.mutateFunction=mutateFunction;
    }

    static mutate(traitGene, mutationRate){
        const func = TraitGene.mutateFunctions[traitGene.mutateFunction];
        traitGene.value = func(traitGene.value, traitGene.min, traitGene.max, mutationRate);
        return traitGene;
    }

    static mutateFunctions = {
        "default": TraitGene.mutateDefault,
        "color": TraitGene.mutateColor,
    }

    static mutateDefault(trait, min, max, rate, amount=window.gameConfig.traitMutateAmount){
        const stepSize = amount * trait * rate * (Math.random() * 2 - 1);
        const result = clamp(trait + stepSize, min, max);
        return result;
    }
    
    static mutateColor(trait, min, max, rate, amount=window.gameConfig.traitMutateAmount){
        const rStepSize = trait.r * amount * rate * (Math.random() * 2 - 1);
        const gStepSize = trait.g * amount * rate * (Math.random() * 2 - 1);
        const bStepSize = trait.b * amount * rate * (Math.random() * 2 - 1);
        
        // color class clamps automatically
        const newColor = new Color(
            clamp(trait.r + rStepSize, min, max),
            clamp(trait.g + gStepSize, min, max),
            clamp(trait.b + bStepSize, min, max));
        return newColor;
    }
}