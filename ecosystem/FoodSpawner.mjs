import Food from "./Food.mjs";

export default class FoodSpawner{
    constructor(){
        this.spawnsPerSecond = 1;
        this.timeSinceLastSpawn = 0;
    }

    update(delta){
        this.timeSinceLastSpawn += delta;
        if(this.timeSinceLastSpawn > this.spawnsPerSecond
            && window.gameManager.app.stage.children.filter(f => f instanceof Food).length <= window.gameConfig.maxFood - window.gameConfig.foodPerSecond){
            this.spawnFoods(gameConfig.foodPerSecond);
        }
    }

    spawnFoods(amount){
        this.timeSinceLastSpawn = 0;
        // deal with fractional amounts
        const remainder = amount - Math.floor(amount);
        const chance = remainder / this.spawnsPerSecond;
        const spawnAmount = Math.random() < chance ? Math.ceil(amount) : Math.floor(amount);
                
        for(let i = 0; i < spawnAmount; i++){
            let foodToSpawn = new Food(window.gameManager.randomScreenPos(window.gameConfig.foodSize), 0xfcf8ec, window.gameConfig.foodSize);
            window.gameManager.app.stage.addChild(foodToSpawn);
        }
    }
}