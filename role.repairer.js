var tools = require('util.creepTools');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	    }
	    
	    if(!creep.memory.repairing && creep.carry.energy < creep.carryCapacity) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	    }
	    
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	        creep.say('🚧 repair');
	    }

	    if(creep.memory.repairing) {
	        var targets = creep.room.find(FIND_STRUCTURES);
            if(targets.length) {
                
                targets = targets.sort((t1, t2) => {
                    return (t2.hitsMax - t2.hits) - (t1.hitsMax - t1.hits);
                });
                
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
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
	}
};

module.exports = roleRepairer;