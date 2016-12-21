/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('develop.scale');
 * mod.thing == 'a thing'; // true
 */
const actionSpawn = require('action.spawn');
const someUtil = require('some.util');
module.exports = {
  run: (spawn)=>{
  	let level = spawn.room.controller.level;
  	const roomName = spawn.room.name;
  	const carryToStorageCreeps = (Memory.rooms[roomName].carry_storage_ids);
	const carryToSpawnCreeps = (Memory.rooms[roomName].carry_spawn_ids);
	const carryToTowerCreeps = (Memory.rooms[roomName].carry_tower_ids);
	const carryToLinkCreeps = (Memory.rooms[roomName].carry_link_ids);
  	switch(level){
  		case 6:
  		case 5: 
  		    if(spawn.room.name === "E64N7"){
  		   
		    	if(!spawn.room.stats().roleStats["staticHarvester"] || spawn.room.stats().roleStats["staticHarvester"] <    Game.rooms["E64N7"].stats().sources_ids.length){
			      actionSpawn.createStaticHavesterCreep("E64N7");
			    }
			    else if(!carryToStorageCreeps || carryToStorageCreeps.length < 3){
			        actionSpawn.createCarryCreep(STRUCTURE_CONTAINER, STRUCTURE_STORAGE);
			        console.log("fuck here");
			     }
			    else if(!carryToSpawnCreeps || carryToSpawnCreeps.length < 1 ){
			        actionSpawn.createCarryCreep(STRUCTURE_STORAGE, STRUCTURE_SPAWN);
			    }
			    else if(!Memory.rooms["E64N7"].roleStats["upgrader"] || Memory.rooms["E64N7"].roleStats["upgrader"] < 1){
			        actionSpawn.createStaticUpgrader();
			    }else if(!Memory.rooms["E64N7"].roleStats["catcher"] || Memory.rooms["E64N7"].roleStats["catcher"] < 1 ){
			        actionSpawn.createCatcher();
			    }else if(Memory.rooms["E64N7"].construction_sites_ids && (!Memory.rooms["E64N7"].roleStats["builder"] || Memory.rooms["E64N7"].roleStats["builder"] < 1)){
			        actionSpawn.createGreaterCreep("builder");
			    }else if ((!carryToLinkCreeps && Memory.rooms["E64N7"].linksIds) ||carryToLinkCreeps.length < 1){
			        actionSpawn.createCarryCreep(STRUCTURE_STORAGE, STRUCTURE_LINK, "lower");
			    }else if(!carryToTowerCreeps || carryToTowerCreeps.length < 1){
			        actionSpawn.createCarryCreep(STRUCTURE_STORAGE, STRUCTURE_TOWER);
			    }
			    break;
  		    }else{

  		    }
		  	 
  		  
  		case 4:
  		    
  		case 3:
  		case 2: 
		
  		  if(!Memory.rooms[spawn.room.name].roleStats["staticHarvester"] || Memory.rooms[spawn.room.name].roleStats["staticHarvester"] < Memory.rooms[spawn.room.name].sources_ids.length){
  		  	    actionSpawn.createStaticHavesterCreep(roomName, true, spawn.name);

  		  }else if(!carryToSpawnCreeps || carryToSpawnCreeps.length < 1 ){

		    	actionSpawn.createCarryCreep(STRUCTURE_STORAGE, STRUCTURE_SPAWN, "lower", roomName, spawn.name);
		    }
		   else if(!spawn.room.stats().roleStats["catcher"] || Memory.rooms[spawn.room.name].roleStats["catcher"] < 4){

		        actionSpawn.createCatcher(spawn.name);
		    }
		    else if(!carryToStorageCreeps || carryToStorageCreeps.length < 1){
		        actionSpawn.createCarryCreep(STRUCTURE_CONTAINER, STRUCTURE_STORAGE, "lower", roomName, spawn.name);
		    }
		    else if(!carryToTowerCreeps || carryToTowerCreeps.length < 1){
			        actionSpawn.createCarryCreep(STRUCTURE_STORAGE, STRUCTURE_TOWER, "lower", roomName, spawn.name);
			}
		    else if(!Memory.rooms[roomName].roleStats["builder"] ||  Memory.rooms[roomName].roleStats["builder"] < 1){

		        actionSpawn.createNormalCreep("builder", spawn.room.name, spawn.name);
		    }
		    else if(!Memory.rooms[roomName].roleStats["repairer"] ||  Memory.rooms[roomName].roleStats["repairer"] < 2){

		        actionSpawn.createRepairer(roomName, spawn.name);
		    }
  		  else if(!Memory.rooms[roomName].roleStats["upgrader"] ||  Memory.rooms[roomName].roleStats["upgrader"] < 3){

		        actionSpawn.createDynamicUpgrader(roomName, spawn.name);
		    }
  		  break;
  		case 1: break;
  	}
  }
};