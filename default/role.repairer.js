    /*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repairer');
 * mod.thing == 'a thing'; // true
 */
const someUtil = require('some.util');
module.exports = {
	run: (creep)=>{
		const roomName = creep.room.name;
	  	if(creep.memory.repairing && creep.carry.energy == 0) {
	        creep.memory.repairing = false;
	        creep.memory.target = null;
	            creep.say('harvesting');
	   }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.repairing = true;
	        creep.memory.target = null;
	        creep.say('repairing');
	   }
	   if(creep.memory.target && !(Memory.rooms[roomName].structureNeedRepair.indexOf(creep.memory.target)>0)){
	   		creep.memory.target = null;
	   }
	    if(creep.memory.repairing){
	    	let target;
	    	if(!creep.memory.target){
	    		const targetsIds = Memory.rooms[roomName].structureNeedRepair;
	    		creep.memory.target = targetsIds[0]
	    		target = Game.getObjectById(targetsIds[0]);
	    	}else{
	    		target = Game.getObjectById(creep.memory.target);
	    	}
			if(target) {
			    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
			        creep.moveTo(target);    
			    }
			}
	    }else{
	    	let target;
	    	if(!creep.memory.target){
	    		const storage = creep.room.storage;
	    		if((storage && storage.store.energy > creep.carryCapacity)|| (!Memory.rooms[roomName].container_ids)){
		    		target = creep.room.storage;
		    		console.log(creep.room.name, " funck this?");
		    		
		    	}else{
			        target = someUtil.getTargetsByIds(Memory.rooms[roomName].container_ids)[0];
			        console.log(creep.room.name, " funck here?");
		    	}
		    	if(target){
		    		creep.memory.target = target.id;
		    	}
		    	
	    	}else{
	    		target = Game.getObjectById(creep.memory.target);
	    	}
	    	
	    	if(creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
	    		creep.moveTo(target), {reusePath: 8};
	    	}
	    }
  	}
};