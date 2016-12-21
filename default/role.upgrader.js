/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */
const someUtil = require('some.util');
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.memory.target = null;
            creep.say('harvesting');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.memory.target = null;
            creep.say('upgrading');                         
        }
        if(creep.memory.upgrading) {
            const controller = creep.room.controller;
            if(creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {reusePath: 10});
            }
        }
        else {
            this.doHarvesting(creep);
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
        let target;
        if(!creep.memory.target){
            const roomName = creep.room.name,
                  storage = creep.room.storage,
                  sourceId = creep.memory.source;
            if(Memory.rooms[roomName].controllerLink){
                target = Game.getObjectById(Memory.rooms[roomName].controllerLink);

            }else if(storage && storage.store.energy > creep.carryCapacity){
                target = storage;
                 
            }else{
                target = someUtil.getTargetsByIds(Memory.rooms[roomName].container_ids)[0];
            }
            if(!target){
                var sourcesIds = creep.room.stats().sources_ids;
                if(creep.harvest(Game.getObjectById(sourcesIds[sourceId])) === ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.getObjectById(sourcesIds[sourceId]), {reusePath: 10});
                }
                target = Game.getObjectById(sourcesIds[sourceId]);
            }
            if(target){
                creep.memory.target = target.id;
            }
        }else{
            target = Game.getObjectById(creep.memory.target);
        }
        if(creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                creep.moveTo(target, {reusePath: 10});
        }  
              
    }
};

module.exports = roleUpgrader;