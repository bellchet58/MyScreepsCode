/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var someUtil = require('some.util');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	    	if(creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom){
	    		for(let name in Game.flags){
			    	if(Game.flags[name].color === COLOR_WHITE && Game.flags[name].secondaryColor === COLOR_WHITE && creep.room === Game.flags[name].room){
			    	    if(!(creep.pos.x === Game.flags[name].pos.x && creep.pos.y === Game.flags[name].pos.y)){
							creep.moveTo(Game.flags[name], {reusePath: 10});
						}else{
							creep.move(someUtil.findOutTheDirection(Game.flags[name].name).direction);
						}
			    	}
	    		}
	    	}else{
		    		let targets = someUtil.getTargetsByIds(Memory.rooms[creep.room.name].construction_sites_ids);
		    		if(creep.build(targets[0]) === ERR_NOT_IN_RANGE){
		    			creep.moveTo(targets[0] , {reusePath: 10});
		    		}else if(creep.build(targets[0]) === ERR_INVALID_TARGET){
		    			console.log(creep.name, "encounter some problem while building at",creep.pos.x,",", creep.pos.y," in ",creep.room.name, "the targetRoom is ");
		    		}
	    	}
	    	
	    	
	    }
	    else {
	    	var targets = Memory.rooms[creep.room.name].construction_sites_ids;
	    	if(targets){
	    		this.doHarvesting(creep);
	    	}
	    }
	},
	doHarvesting: function(creep){
        if(!creep.room.stats().roleStats["staticHarvester"]){
            var sourcesIds = creep.room.stats().sources_ids;
            if(creep.harvest(Game.getObjectById(sourcesIds[creep.memory.source])) === ERR_NOT_IN_RANGE){
                creep.moveTo(Game.getObjectById(sourcesIds[creep.memory.source]), {reusePath: 10});
            }

        }else{
            this.withdrawFromSource(creep);
        }
    },
    withdrawFromSource: (creep)=>{
        var target = creep.room.storage;
        if(!target){
        	let targets = Memory.rooms[creep.room.name].container_ids;
		  	target = creep.pos.findClosestByRange(targets);
        }
        if(creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
            creep.moveTo(target, {reusePath: 10});
        } 
    }
};

module.exports = roleBuilder;