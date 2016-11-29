/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    // if(creep.carry.energy < creep.carryCapacity) {
     //        var sources = creep.room.find(FIND_SOURCES);
     //        if(creep.harvest(sources[creep.memory.source]) === ERR_NOT_IN_RANGE){
     //            creep.moveTo(sources[creep.memory.source]);
     //        }
     //    }
     //    else {
     //        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
     //            creep.moveTo(creep.room.controller);
     //        }
     //    }

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
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

module.exports = roleUpgrader;