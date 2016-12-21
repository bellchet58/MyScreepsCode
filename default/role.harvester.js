/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.harvester');
 * mod.thing == 'a thing'; // true
 */
// var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
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
        //有毒
        if(Game.rooms["E64N7"].stats().construction_sites_ids.length>0 && creep.memory.temp){
             creep.memory.temp = false;
         }
         //采集丢弃的资源
        var droppedResourcesIds = Game.rooms["E64N7"].stats().dropped_resources_ids;
        if(droppedResourcesIds.length &&  creep.energy < creep.carryCapacity) {
            creep.moveTo(Game.getObjectById(droppedResourcesIds[0]));
            creep.pickup(Game.getObjectById(droppedResourcesIds[0]));
        }else{
            if(!creep.memory.harvesting) {
                //待优化
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN ) &&
                                structure.energy < structure.energyCapacity;
                        }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }else{
                    creep.memory.upgrading = false;
                    roleUpgrader.run(creep);
                }
            }
            else {
                this.doHarvesting(creep);
            }   
        }
        
	},
    doHarvesting: function(creep){
        if(!creep.room.stats().roleStats["staticHarvester"]){
            var sourcesIds = Game.rooms["E64N7"].stats().sources_ids;
            if(creep.harvest(Game.getObjectById(sourcesIds[creep.memory.source])) === ERR_NOT_IN_RANGE){
                creep.moveTo(Game.getObjectById(sourcesIds[creep.memory.source]));
            }
            console.log('fuck');
        }else{
            var storageTotal = _.sum(creep.room.storage.store);
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) =>{
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < structure.storeCapacity) || (structure.structureType == STRUCTURE_STORAGE && storageTotal < structure.storeCapacity);
                }
            });
            var target = creep.pos.findClosestByRange(targets, { filter: (structure)=> { return structure.store.energy > 0;}});
            if(creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            } 

        }
        
    }
};

module.exports = roleHarvester;