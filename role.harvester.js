var tools = require('util.creepTools');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.recharging && creep.carry.energy == 0) {
            creep.memory.recharging = false;
            creep.say('🔄 harvest');
	    }
	    
	    if(!creep.memory.recharging && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.recharging = true;
	        creep.say('🚧 recharge');
	    }
        
	    if(!creep.memory.recharging) {
            var source = tools.findRandomSource(creep);
            var error = creep.harvest(source);
            if(error == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else {
                if (error == ERR_INVALID_TARGET) {
                    tools.findRandomSource(creep);    
                }
            }
        }
        else {

            var target = "invalid";
            if (!creep.memory.target) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity;
                    }
                });                
                if (targets.length > 0) {
                    target = targets[0];
                }
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity && structure.id == creep.memory.target;
                    }
                });                
                if (targets.length > 0) {
                    target = targets[0];
                } else {
                    creep.memory.target = "invalid";
                    delete creep.memory.target;
                    delete creep.memory._move;
                }
            }
            
            if(target != "invalid") {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    creep.memory.target = target.id;
                }
            } else {
                delete creep.memory.target;
                delete creep.memory._move;
            }
        }
	}
};

module.exports = roleHarvester;