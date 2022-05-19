export default class Manager {
    constructor(){
        this.latestInnovation = 0;
        this.pressedKeys = {};
    }

    nextInnovationNumber(){
        return ++this.latestInnovation;
    }

    getKeys(){
        return this.pressedKeys;
    }

    getKey(key){
        return this.pressedKeys[key];
    }

    setKey(key, isPressed=true){
        this.pressedKeys[key] = isPressed;
    }

}