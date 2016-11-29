/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
// var roleBuilder = require('role.builder');
var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            creep.say('harvesting');
        }
        if(creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
            creep.say('harvested');
        }
        if(Game.rooms["E64N7"].stats().construction_sites_ids.length>0 && creep.memory.temp){
             creep.memory.temp = false;
         }
         //采集丢弃的资源
        var droppedResourcesIds = Game.rooms["E64N7"].stats().dropped_resources_ids;
        if(droppedResourcesIds.length) {
            creep.moveTo(Game.getObjectById(droppedResourcesIds[0]));
            creep.pickup(Game.getObjectById(droppedResourcesIds[0]));
        }
        if(!creep.memory.harvesting) {
            //待优化
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType ==  STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_SPAWN ||
                                  structure.structureType == STRUCTURE_TOWER) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
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

module.exports = roleHarvester;