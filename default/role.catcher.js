/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.catcher');
 * mod.thing == 'a thing'; // true
 */
const someUtil = require('some.util');
module.exports = {
  run: (creep)=>{
  	if(!creep.memory.catching && creep.carry.energy == 0) {
        creep.memory.catching = true;
            creep.say('looking for losers');
   }
    if(creep.memory.catching && creep.carry.energy == creep.carryCapacity) {
        creep.memory.catching = false;
        creep.say('collecting lost kids');
   }
    if(creep.memory.catching){
    	var targets = Memory.rooms[creep.room.name].dropped_resources_ids;
    	var target = creep.pos.findClosestByRange(someUtil.getTargetsByIds(targets));
    	if(creep.pickup(target) == ERR_NOT_IN_RANGE){
    		creep.moveTo(target);
    	}
    }else{
    	if(creep.room.storage){
    		if(creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
    			creep.moveTo(creep.room.storage);
    		}
    	}else{
            let target = creep.pos.findClosestByRange(someUtil.getTargetsByIds(Memory.rooms[creep.room.name].container_ids), { filter: (structure)=>{
                return structure.store.energy + creep.carry.energy <= structure.storeCapacity;
            }});
            if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }
    	
    }
  	}

};