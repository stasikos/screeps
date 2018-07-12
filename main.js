var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var screepKeeper = require('util.screepKeeper');
var buildManager = require('util.buildManager');
var roomManager = require('util.roomManager');

module.exports.loop = function () {

    screepKeeper.run();
    buildManager.run(); 

    var tower = Game.getObjectById('3861905682f0beaf30cc4e74');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        for (var spawn in Game.spawns) {
            var spawnObj = Game.spawns[spawn];
            if (spawnObj.my) {
                if (spawnObj.room.name == creep.room.name && spawnObj.room.energyAvailable == (spawnObj.room.energyCapacityAvailable - 100)) {
                    if (spawnObj.renewCreep(creep) == 0) {
                        console.log(creep.name +" is renewed");
                    }
                }
            }
        }

        
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}