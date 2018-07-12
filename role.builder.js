var tools = require('util.creepTools');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    
	    if(!creep.memory.building && creep.carry.energy < creep.carryCapacity) {
            creep.memory.building = false;
	    }
	    
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                
                targets = targets.sort((t1, t2) => {
                    return (t1.progressTotal - t1.progress) - (t2.progressTotal - t2.progress);
                });
                
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.say('nothing to build');
                creep.moveTo(25, 25);
                creep.memory.role = "upgrader";
                creep.memory.upgrading = true;
            }
	    }
	    else {
            var source = tools.findRandomSource(creep);
            var error = creep.harvest(source);
            if(error == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath:10});
            } else {
                if (error == ERR_INVALID_TARGET) {
                    tools.findRandomSource(creep);    
                }
            }
	    }
	}
};

module.exports = roleBuilder;