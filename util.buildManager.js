var buildManager = {
    run: function() {
        
        var buildRoads = true; //Memory.buildroads;
        
        if (!buildRoads) {
            
        }
        
            for(var name in Game.rooms) {
                var cRoom = Game.rooms[name];
                var availableEnergy = cRoom.energyAvailable;
                var availableStorage = cRoom.energyCapacityAvailable - availableEnergy;
                console.log('Room "' + name + '" has '+ availableEnergy + ' energy and can storee ' + availableStorage + " more");
                
                if (Object.keys(Game.constructionSites).length == 0) {
                    var roomSize = 50;
                    var building  = 0;
                    for (var x = 0; x < roomSize; x+=2) {
                        for (var y = 0; y < roomSize; y+=2) {
                            
                            var sources = cRoom.find(FIND_SOURCES);
                            for (var i = 0; i < sources.length; i++) {
                                var source = sources[i];
                                var sX = source.pos.x;
                                var sY = source.pos.y;
                                range = Math.sqrt((x - sX)*(x - sX) + (y - sY)*(y - sY));
                                //console.log(source);
                            
                            
                                 if (range < 7 && range > 3) {
                                    console.log(range + " x = " + x + " y = " + y);
                                    var things = cRoom.lookAt(x, y);
                                    var present = false;
                                    for (var i = 0; i < things.length; i++) {
                                        var canBuild = true;
                                        var object = things[i];
                                          
                                        if (object.terrain != "swamp" && object.terrain != "plain") {
                                            canBuild = false;
                                        } 
                                    
                                        if (object.type == "structure" || object.type == "constructionSite") {
                                            present = true;
                                        } 
                                    }
 
                                    if (canBuild && building <= 1) {
                                        if (!present) {
                                           building++;
                                            cRoom.visual.circle(x, y);
                                         cRoom.createConstructionSite(x, y, STRUCTURE_EXTENSION);
                                       } 
                                    }
                                }
                            }
                        }
                    }
                }
            }
        
        if (buildRoads) {
            if (!Memory.heatmaps) {
                Memory.heatmaps = new Object();
                console.log("No heatmap")
            }
            
            for(var name in Game.creeps) {
                    var creep = Game.creeps[name];
                    if (creep.memory.role == "upgrader" || creep.memory.role == "harvester") {
                        processHeatMap(creep);
                    }
            }
        }
    }
}

function processHeatMap(creep) {
     var x = creep.pos.x;
    var y = creep.pos.y;
    var room = creep.room.name;
    if (!Memory.heatmaps[room]) {
        Memory.heatmaps[room] = new Array();    
        Memory.heatmaps["last"] = room;
        console.log("No heatmap for room " + room)
    }
                 
    if (!Array.isArray(Memory.heatmaps[room][x])) {
        Memory.heatmaps[room][x] = new Array();    
    }
                   
    if (Memory.heatmaps[room][x][y]) {
        Memory.heatmaps[room][x][y]++;
        if (Memory.heatmaps[room][x][y] > 350) {
            var canBuild = true;
            var things = creep.room.lookAt(x, y);
            for (var i = 0; i<things.length; i++) {
            var object = things[i];
            if (object.type == 'structure' || object.type == "constructionSite") {
                canBuild = false;
            } 
        }

        if (canBuild &&  Object.keys(Game.constructionSites).length == 0) {
            creep.room.createConstructionSite(x, y, STRUCTURE_ROAD);
            console.log("Will build road at " + x + ", " + y);
            }
        }
        } else {
            Memory.heatmaps[room][x][y] = 1;
        }
}

module.exports = buildManager;