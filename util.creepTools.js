var creepTools = {
    findSource: function(creep) {
        var sources = creep.room.find(FIND_SOURCES, {
                filter: (source) => {
                    return (source.energy > 50);}
                });
        return sources[0];
    },
    
     findRandomSource: function(creep) {
        var sources;
        if (!creep.memory.source) {
            sources = creep.room.find(FIND_SOURCES, {
            filter: (source) => {
                return (source.energy > creep.carryCapacity);}
            });
            var randIndex = Math.floor(Math.random() * (sources.length + 0.1) );
            console.log(randIndex + " in " + sources.length);
            var source = sources[randIndex];
            creep.memory.source = source.id;
            if (!Memory.source) {
                Memory.source = new Object;
            }
            if (Memory.source[source.id]) {
                Memory.source[source.id]++;
            } else {
                Memory.source[source.id] = 1;
            }
        } else {
            sources = creep.room.find(FIND_SOURCES, {
            filter: (source) => {
                return (source.id == creep.memory.source);}
            });
            if (sources.length) {
                source = sources[0];
            } else {
                delete creep.memory.source;
            }
        }
        return source;
    }
}
module.exports = creepTools;