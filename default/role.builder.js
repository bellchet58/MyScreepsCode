/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = require('role.harvester');
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
	    	var targetIds;
	    	targetIds = Game.rooms["E64N7"].stats().construction_sites_ids;
            if(targetIds.length) {
                if(creep.build(Game.getObjectById(targetIds[0])) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(targetIds[0]));
                }
            }else if(Game.rooms["E64N7"].stats().structures_need_repair_ids.length > 0){
            	targetIds = Game.rooms["E64N7"].stats().structures_need_repair_ids;
            	if(creep.repair(Game.getObjectById(targetIds[0])) === ERR_NOT_IN_RANGE){
            		creep.moveTo(Game.getObjectById(targetIds[0]));
            	}
            }
            else{
            	creep.memory.temp = true;
            	creep.memory.harvesting = true;
                roleHarvester.run(creep);
            }
	    }
	    else {
	        var sourcesIds = Game.rooms["E64N7"].stats().sources_ids;
             if(creep.harvest(Game.getObjectById(sourcesIds[creep.memory.source])) === ERR_NOT_IN_RANGE){
                 creep.moveTo(Game.getObjectById(sourcesIds[creep.memory.source]));
             }

	    }
	}
};

module.exports = roleBuilder;