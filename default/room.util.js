/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.util');
 * mod.thing == 'a thing'; // true
 */
var someUtil = require('some.util');
var memoryManager = require('memory.manager');

module.exports = {
  // roomStats: memoryManager.get("roomStats"),
  initialize: function(){
  	  let me = this;
      Room.prototype.getRoomParam = me.getRoomParam.bind(this);
      Room.prototype.stats = function() {
        return {
            
            roleStats: me.getRoleStats(this),
            myCreepsCnt: Memory.rooms[this.name].myCreepsCnt,
            enemiesIds: me.getEnemyIds(this, me),
            
            construction_sites_ids: me.getConstructionSitesIds(this),

            sources_ids: me.getSoucesIds(this),

            dropped_resources_ids: me.getDroppedRecourseIds(this, me),

            linksIds: me.getLinksIds(this),
            structureNeedRepair: me.getStructuresNeedRepairIds(this, me),
            storageResourceNum: me.storageResourceNum(this),
            spawnEnergy: me.getSpawnEnergy(this),
            container_ids: me.getContainerIds(this),
            tower_ids: me.getTowerIds(this, me),
            spawns_ids: me.getSpawnsIds(this, me),
            extension_ids: me.getExtensionIds(this, me),
            carry_storage_ids: me.getCarryToStorageIds(this, me),
            carry_spawn_ids: me.getCarryToSpawnIds(this, me),
            carry_link_ids: me.getCarryToLinkIds(this, me),
            carry_tower_ids: me.getCarryToTowerIds(this, me),
            injured_creeps_ids: me.getInjuredCreeps(this, me),
            controller_link_id: me.getControllerLinkId(this),
            storage_link_id: me.getStorageLinkId(this),
            container_link_ids: me.getContainerLinkIds(this, me)
        };
    };

  },
  getSoucesIds: function(room){
    if(Memory.rooms[room.name].sources_ids){
      return  Memory.rooms[room.name].sources_ids;
    }else{
      if(Memory.someData.harvestMapping)
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
        Memory.rooms[room.name].sources_ids = arr;
        Memory.someData.harvestMapping = mapping;
        return arr;
    }
   },
  getConstructionSitesIds: function(room){
     var arr = [];
     var targets = room.find(FIND_CONSTRUCTION_SITES);
     for(var name in targets){
      if(targets[name]){
        arr.push(targets[name].id);
      }
     }
     Memory.rooms[room.name].construction_sites_ids = arr;
     return arr;
   },
  getRoleStats: function(room){
     let roleStatsResult = {};
     let myScreepsCount = 0;
     _.forEach(Game.creeps, (creep)=>{
      if(creep.room === room && creep.my){
        if(!roleStatsResult[creep.memory.role]){
          roleStatsResult[creep.memory.role] = 1;
        }else{
          roleStatsResult[creep.memory.role] += 1;
        }
        myScreepsCount += 1;
      }
     });
     if(!Memory.rooms[room.name]){
      Memory.rooms[room.name] = {};
     }
     Memory.rooms[room.name].roleStats = roleStatsResult;
     Memory.rooms[room.name].myCreepsCnt = myScreepsCount;
     return roleStatsResult;
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
  storageResourceNum: (room)=>{
  	var sum = 0;
  	if(room.storage){
      sum = _.sum(room.storage.store);
  	}
  	Memory.rooms[room.name].storageResourceNum = sum;
  	return sum;
  },
  getLinksIds: (room)=>{
  	let result = [];
  	if(!Memory.rooms[room.name]){
  		Memory.rooms[room.name] = {};
  	}
  	if(!Memory.rooms[room.name].linksIds){
	  	let targets = room.find(FIND_MY_STRUCTURES, {filter: (structure)=>{ return structure.structureType === STRUCTURE_LINK;}});
	  	for(let name in targets){
	  		result.push(targets[name].id);
	  	}
	  	Memory.rooms[room.name].linksIds = result;	
	  }else{
	  	result = Memory.rooms[room.name].linksIds;
	  }
  	return result;
  },
  getStructureNeedRepair: (room)=>{
  	let result = [];
    let targets = room.find(FIND_STRUCTURES, {filter: (structure) => (structure.structureType === STRUCTURE_ROAD && structure.hits < 4200) || (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax - 800 ) || (structure.structureType === STRUCTURE_RAMPART && structure.hits < 10000)});
      targets.sort((a,b) => a.hits - b.hits);
	    for(let name in targets){
	    	result.push(targets[name].id);
	    }
	  Memory.rooms[room.name].structureNeedRepair = result;
    return result;
  },
  getSpawnEnergy: (room)=>{
    let result = 0;
    let targets = room.find(FIND_MY_STRUCTURES, {filter: (structure)=>{
      return structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN;
    }});
    if(targets){
      for(let i = 0, len = targets.length; i< len; i++){
        result += targets[i].energyCapacity;
      }
    }else{
      result = 0;
    }
    Memory.rooms[room.name].spawnEnergy = result;
    return result;
  },
  getContainerIds:(room)=>{
      let result = [];
      let targets = room.find(FIND_STRUCTURES, {filter: (structure)=>{
        return structure.structureType === STRUCTURE_CONTAINER;
      }})
      targets.sort((a,b) => b.store.energy - a.store.energy);
      for(let name in targets){
        result.push(targets[name].id);
      }
      Memory.rooms[room.name].container_ids = result;
      return result;
  },
  getStructuresNeedRepairIds: (room, me)=>{
    let targets = room.find(FIND_STRUCTURES, { filter: (structure)=>{
      return (structure.structureType === STRUCTURE_ROAD && structure.hits < 4200) 
              || (structure.structureType === STRUCTURE_WALL && structure.hits < 1000 * 4) 
              || (structure.structureType === STRUCTURE_RAMPART && structure.hits < 10000)
    }});
    let containerids = room.getRoomParam("container_ids");
    let containerResultsIds = [];
    if(containerids){
      for(let i=0; i< containerids.length; i++){
        let container = Game.getObjectById(containerids[i]);
        if((container.hits < container.hitsMax - 800)){
          containerResultsIds.push(containerids[i]);
        }
      }
    }
    
    targets.sort((prev, current)=>{ return prev.hits - current.hits;});
    let targetsId = targets.map((target)=>{
      return target.id;
    })
    Memory.rooms[room.name].structureNeedRepair = [...targetsId, ... containerResultsIds]
    return Memory.rooms[room.name].structureNeedRepair;
  },
  getRoomParam: (key)=>{
    if(typeof key === "string"){
      if(Memory.rooms[this.name][key]){
        return Memory.rooms[this.name][key];
      }else{
        // console.log("you asking for room parameter ", key, "is ", Memory.rooms[this.name].key);
      }
    }
  },
  getEnemyIds: (room, me)=>{
    let targets = room.find(FIND_HOSTILE_CREEPS);
    targets.sort((a, b)=>{ return a.hits - b.hits;});
    targets = me.getIds(targets);
    Memory.rooms[room.name].enemiesIds = targets;
    return targets;
  },
  getDroppedRecourseIds: (room, me)=>{
    let targets = room.find(FIND_DROPPED_RESOURCES);
    targets.sort((a, b)=> b.energy - a.energy);
    targets = me.getIds(targets);
    Memory.rooms[room.name].dropped_resources_ids = targets;
    return targets;
  },
  getTowerIds: (room, me)=>{
    let targets = room.find(FIND_MY_STRUCTURES, {filter: (structure)=> structure.structureType === STRUCTURE_TOWER});
    targets.sort((a, b)=> a.energy - b.energy);
    targets = me.getIds(targets);
    Memory.rooms[room.name].tower_ids = targets;
    return targets;
  },
  getSpawnsIds: (room, me)=>{
    let targets = room.find(FIND_MY_STRUCTURES, {filter: ( structure)=> structure.structureType === STRUCTURE_SPAWN});
    targets = me.getIds(targets);
    Memory.rooms[room.name].spawns_ids = targets;
    return targets;
  },
  getExtensionIds: (room, me)=>{
    let targets = room.find(FIND_MY_STRUCTURES, {filter: (structure)=> structure.structureType === STRUCTURE_EXTENSION});
    targets = me.getIds(targets);
    Memory.rooms[room.name].extension_ids = targets;
    return targets;
  },
  getCarryToStorageIds: (room, me)=>{
    let targets = room.find(FIND_MY_CREEPS, {filter: (creep)=> creep.memory.targetRoom === room.name && creep.memory.role === "carry" && creep.memory.from === STRUCTURE_CONTAINER && creep.memory.to === STRUCTURE_STORAGE});
    targets = me.getIds(targets);
    Memory.rooms[room.name].carry_storage_ids = targets;
    return targets;
  },
  getCarryToSpawnIds: (room, me)=>{
    let targets = room.find(FIND_MY_CREEPS, {filter: (creep)=> creep.memory.targetRoom === room.name && creep.memory.role === "carry" && creep.memory.from === STRUCTURE_STORAGE && creep.memory.to === STRUCTURE_SPAWN});
    targets = me.getIds(targets);
    Memory.rooms[room.name].carry_spawn_ids = targets;
    return targets;
  },
  getCarryToLinkIds: (room, me)=>{
    let targets = room.find(FIND_MY_CREEPS, {filter: (creep)=> creep.memory.targetRoom === room.name && creep.memory.role === "carry" && creep.memory.from === STRUCTURE_STORAGE && creep.memory.to === STRUCTURE_LINK});
    targets = me.getIds(targets);
    Memory.rooms[room.name].carry_link_ids = targets;
    return targets;
  },
  getCarryToTowerIds: (room, me)=>{
    let targets = room.find(FIND_MY_CREEPS, {filter: (creep)=> creep.memory.targetRoom === room.name && creep.memory.role === "carry" && creep.memory.from === STRUCTURE_STORAGE && creep.memory.to === STRUCTURE_TOWER});
    targets = me.getIds(targets);
    Memory.rooms[room.name].carry_tower_ids = targets;
    return targets;
  },
  getInjuredCreeps: (room, me)=>{
    let targets = room.find(FIND_MY_CREEPS, {filter: (creep)=> creep.memory.targetRoom === room.name && creep.hits < creep.hitsMax});
    targets.sort((a, b)=> b.hits - a.hits);
    targets = me.getIds(targets);
    Memory.rooms[room.name].injured_creeps_ids = targets;
    return targets;
  },
  getControllerLinkId: (room)=>{
    let controllerLink;
    const roomName = room.name;
    if(!Memory.rooms[roomName].controller_link_id){
      controllerLink = _.find(someUtil.getTargetsByIds(Memory.rooms[roomName].linksIds), (structure)=>{
        return structure.pos.inRangeTo(room.controller, 5);
       });
      if(controllerLink){
        Memory.rooms[roomName].controller_link_id = controllerLink.id;
      }
    }else{
      controllerLink = Game.getObjectById(Memory.rooms[roomName].controller_link_id);
     }
  },
  getStorageLinkId: (room)=>{
    let storageLink;
    const roomName = room.name;
    if(!Memory.rooms[roomName].storage_link_id){
       storageLink = _.find(someUtil.getTargetsByIds(Memory.rooms[roomName].linksIds), (structure)=>{
        return  structure.pos.inRangeTo(room.storage, 5);
      });
      if(storageLink){
        Memory.rooms[roomName].storage_link_id = storageLink.id;
      }
    }else{
      storageLink = Game.getObjectById(Memory.rooms[roomName].storage_link_id);
    }
    return storageLink; 
  },
  getContainerLinkIds: (room, me)=>{
    let containerLinks;
    const containers = someUtil.getTargetsByIds(Memory.rooms[room.name].container_ids);
    if(!Memory.rooms[room.name].container_link_ids){
      containerLinks = _.filter(someUtil.getTargetsByIds(Memory.rooms[room.name].linksIds), (structure)=>{
        for(let container of containers){
          if(structure.pos.inRangeTo(container, 5)){
            return true;
          }
        }
        return false;
      });
      Memory.rooms[room.name].container_link_ids = me.getIds(containerLinks);
    }else{
      containerLinks = someUtil.getTargetsByIds(Memory.rooms[room.name].container_link_ids);
    }
    return containerLinks;
  },
  getIds: (targets)=>{
    let arr = [];
    for(var name in targets){
        if(targets[name]){
          arr.push(targets[name].id);
        }
       }
    return arr;
  }
};