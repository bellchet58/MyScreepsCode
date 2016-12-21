/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('some.util');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
  roles: ["harvester", "upgrader", "builder", "carry"],
  roleFilter: function(role){
      return  _.filter(Game.creeps, (creep) =>{
          creep.memory.role === role;
      })
  },
  clearSuicidedCreep: function(){
  	for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
  },
  getOneInRange: function(min, max){
  	return Math.floor(Math.random()*(max - min+1))+min;
  },
  getACreepByRole: function(role){
  	var result = _.find(Game.creeps, (creep)=>{
      creep.memory.role === role;
  	});
  	return result;
  },
  getStatOfProperyValue: function(obj) {
  	var arr = [];
  	for(var name in obj){
  		if(obj[name]){
  			arr.push(Number(obj[name]));
  		}
  	}
    var maxNum =  Math.max.apply(null, arr);
    var minNum = Math.min.apply(null, arr);
    var max, min;
    for(var name in obj){
    	if(maxNum === obj[name]){
    		max = name;
    	}else if(minNum === obj[name]){
            min = name;
    	}
    }
    return { maxSource: max, maxNum: maxNum, minSource: min, minNum:minNum };
  },
  getMinOfProperyValue: function(numArray) {
    return Math.max.apply(null, numArray);
  },
   getConstructionSitesIds: function(room){
     var arr = [];
     var targets = room.find(FIND_CONSTRUCTION_SITES);
     for(var name in targets){
     	if(targets[name]){
     		arr.push(targets[name].id);
     	}
     }
     return arr;
   },
   getSoucesIds: function(room){
   	var arr = [];
   	var mapping = [];
   	var sources = room.find(FIND_SOURCES);
   	if(!Memory.someData.harvestMapping){
   		Memory.someData.harvestMapping = [];
   	}

	for(var name in sources){
	    if(sources[name]){
	   		arr.push(sources[name].id);
	   		mapping.push({roomName: room.name, sourceId: sources[name].id, creepId: null});
	   	}
	}
	Memory.someData.harvestMapping = mapping;
   	return arr;
   },
   getSpecialIds: function(room, findResources, option){
     var arr = [];
     if(arguments.length === 2){
	     var sources = room.find(findResources);
	     for(var name in sources){
	     	if(sources[name]){
	     		arr.push(sources[name].id);
	     	}
	     }
	     return arr;
     }else if(arguments.length === 3){
     	var sources = room.find(findResources,option);
	     for(var name in sources){
	     	if(sources[name]){
	     		arr.push(sources[name].id);
	     	}
	     }
	     return arr;
     }
     
   },
   getAnArrayfrom0: function(length){
     var arr = [];
     for(let i=0; i< length; i++){
     	arr.push(i);
     }
     return arr;
   },
   getRoleStats: function(room){
     let result = {};
     _.forEach(Game.creeps, (creep)=>{
      if(creep.room === room){
        if(!result[creep.memory.role]){
          result[creep.memory.role] = 1;
        }else{
          result[creep.memory.role] += 1;
        }
      }
     });
     if(!Memory.rooms[room.name]){
      Memory.rooms[room.name] = {};
     }
     Memory.rooms[room.name].roleStats = result;
     return result;
   },
   createHelper: function(bodayArr, option, spawn, callback){
     let newName;
     let role = option.role?option.role: "unknown";
     // console.log(bodayArr, Game.spawns[spawn].canCreateCreep(bodayArr));
     if(spawn){
      if(Game.spawns[spawn].canCreateCreep(bodayArr) === OK){
        newName = Game.spawns[spawn].createCreep(bodayArr, option);
        if(callback){
          let gg = callback(newName, Game.spawns[spawn].room.name);
          console.log(gg);
        }
        console.log(callback);
      }

     }else{
      if(Game.spawns['UBL'].canCreateCreep(bodayArr) === OK){
        newName =  Game.spawns['UBL'].createCreep(bodayArr, option);
        if(callback){
          callback(newName, Game.spawns[spawn].room.name);
        }
      }
     }
     if(newName && spawn){
       console.log(spawn,' spawning new '+role +' : ' + newName);
     }else if(newName){
      console.log('Spawning new '+role +' : ' + newName);
     }
     return newName;
   },
  findOutTheDirection: (flagName)=>{
    let arr = flagName.split("_");
    let roomName = arr[0];
    let direction = arr[1];
    switch(direction){
      case "TOP": dicrection = TOP;
        break;
      case "BOTTOM": dicrection = BOTTOM;
       break;
      case "LEFT": dicrection = LEFT;
        break;
      case "RIGHT": dicrection = RIGHT;
        break;
    }
    return {
      roomName: roomName,
      direction: eval(direction)
    };
  },
   detemineSource: function(newName, roomName){
    if(typeof newName === "string"){
          var result = _.find(Game.creeps, (creep)=>{
            return creep.room.name === roomName && creep.memory.role === "staticHarvester" && creep.memory.source === 0;
          });
          if(result){
            Game.creeps[newName].memory.source = 1;
          }else{
            Game.creeps[newName].memory.source = 0;
          }
          console.log("the source is "+ Game.creeps[newName].memory.source);
          return Game.creeps[newName].memory.source;
      }
   },
   createWorkBodyArr: (num)=>{
     let unit = [WORK, MOVE, CARRY];
     let result = [];
     for(let i=0; i< num; i++){
       result = [...result, ...unit];
     }
     return result;
   },
   getTargetsByIds: (ids)=>{
     let result = [];
     if(ids){
      for(let name in ids){
        if(Game.getObjectById(ids[name])){
          result.push(Game.getObjectById((ids[name])));
        }
      }
     }
     return result;
   }
};