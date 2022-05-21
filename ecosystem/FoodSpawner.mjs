import Food from "./Food.mjs";

export default class FoodSpawner{
    constructor(){
        this.spawnsPerSecond = 1;
        this.timeSinceLastSpawn = 0;
    }

    update(delta){
        this.timeSinceLastSpawn += delta;
        if(this.timeSinceLastSpawn > this.spawnsPerSecond){
            this.spawnFoods(gameConfig.foodPerSecond);
        }
    }

    spawnFoods(amount){
        this.timeSinceLastSpawn = 0;
        // roll the dice if it's < 1
        if(amount < 1)
        {
            const chance = amount / this.spawnsPerSecond;
            amount = Math.random() < chance ? 1 : 0;
        }
        for(let i = 0; i < amount; i++){
            let foodToSpawn = new Food(window.gameManager.randomScreenPos(window.gameConfig.foodSize), 0xfcf8ec, window.gameConfig.foodSize);
            window.gameManager.app.stage.addChild(foodToSpawn);
        }
    }
}