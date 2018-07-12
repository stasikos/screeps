var screepKeeper = {
    
    run: function(){

        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    
        var harvesterLimit = 5;
        var buildersLimit = Object.keys(Game.constructionSites).length*2;
        if (buildersLimit > 6) {
            buildersLimit = 6;
        }
        
        var repairersLimit = 0;
        if (buildersLimit > 1) {
            repairersLimit = 1;
        }
        
        var availableStorage = 0;
        var availableEnergy = 0;
        var contollerLevel = 0;
        
        for(var name in Game.rooms) {
            var cRoom = Game.rooms[name];
            availableStorage += cRoom.energyCapacityAvailable;
            availableEnergy += cRoom.energyAvailable;
            contollerLevel += cRoom.controller.level;
        }
        
        if (availableStorage > 0) {
            if (availableEnergy < 300 + (100*harvesters)) {
                return;
            }
        } else {
            if (availableEnergy < 300) {
                return;
            }
        }

        var upgradersLimit = 2 * contollerLevel;
        if ((availableStorage - availableEnergy) == 0) {
            upgradersLimit += 1;
        }
        
        if (upgradersLimit > 6) {
            upgradersLimit = 6;
        }
        

        // Garbage collector
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        // Keep them exist

        console.log('Harvesters: ' + harvesters.length + " of " + harvesterLimit);

        if(harvesters.length < harvesterLimit) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            var config = screepKeeper.configureCreep("harvester", availableEnergy);
            Game.spawns['Spawn1'].spawnCreep(config, newName,
                {memory: {role: 'harvester'}});
        }

        // Keep them exist
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        console.log('Builders: ' + builders.length + " of " + buildersLimit);

        if(builders.length < buildersLimit && upgraders.length == upgradersLimit && harvesters.length == harvesterLimit) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            var config = screepKeeper.configureCreep("builder", availableEnergy);

            Game.spawns['Spawn1'].spawnCreep(config, newName,
                {memory: {role: 'builder'}});
        }

        // Keep them exist
        console.log('Upgraders: ' + upgraders.length + " of " + upgradersLimit);

        if(upgraders.length < upgradersLimit && harvesters.length == harvesterLimit) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            var config = screepKeeper.configureCreep("upgrader", availableEnergy);
            Game.spawns['Spawn1'].spawnCreep(config, newName,
                {memory: {role: 'upgrader'}});
        }
        
                // Keep them exist
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
        console.log('Repairers: ' + repairers.length);

        if(repairers.length < repairersLimit && builders.length == buildersLimit) {
            var newName = 'Repairer' + Game.time;
            var config = screepKeeper.configureCreep("repairer", availableEnergy);
            console.log('Spawning new repairer: ' + newName);
            Game.spawns['Spawn1'].spawnCreep(config, newName,
                {memory: {role: 'repairer'}});
        }
    },
    configureCreep: function(type, storage) {
        var config = [WORK, MOVE, CARRY];
        
        var harvesterOrder = [MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK];
        var upgraderOrder = [MOVE, WORK, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, MOVE, CARRY];
        var repairerOrder = [MOVE, WORK, MOVE];
        var builderOrder = [MOVE, WORK, CARRY, MOVE, CARRY, WORK, MOVE, MOVE];
        
        storage = storage - 200;
        var orderIndex = 0;
        var part;
        partCost = 100;
        while (storage > 0 && orderIndex < 50) {
            if (type == "harvester") {
                part = harvesterOrder[orderIndex];
                partCost = getPartCost(part);
                if (partCost < storage&& orderIndex < harvesterOrder.length) {
                    config.push(part);
                }
            } else if (type == "repairer") {
                part = repairerOrder[orderIndex];
                partCost = getPartCost(part);
                if (partCost < storage&& orderIndex < repairerOrder.length) {
                    config.push(part);
                }            
                
            } else if (type == "builder") {
                part =builderOrder[orderIndex];
                partCost = getPartCost(part);
                if (partCost < storage&& orderIndex < builderOrder.length) {
                    config.push(part);
                }            
                
            } else if (type == "upgrader") {
                part = upgraderOrder[orderIndex];
                partCost = getPartCost(part);
                if (partCost < storage && orderIndex < upgraderOrder.length) {
                    config.push(part);
                }            
            }
            storage = storage - partCost;
            orderIndex++;
        }
        console.log(config.length + " = " + config + " storage left " + storage);
        return config;
    }
}

function getPartCost(part) {
    switch (part) {
        case MOVE:
        case CARRY:
            return 50;
        case WORK:
            return 100;
        case ATTACK:
            return 80;
        case HEAL:
            return 250;
        case CLAIM:
            buildCost += 600;
    }
    return 50;
}

module.exports = screepKeeper;