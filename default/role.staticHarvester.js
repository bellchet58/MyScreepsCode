/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.staticHarvester');
 * mod.thing == 'a thing'; // true 
 */
const someUtil = require('some.util');
module.exports = {
  run: function(creep){
  		var bodyWorkNum = _.filter(creep.body, (elem)=> elem.type === WORK).length;
      var bodyCarryNum = _.filter(creep.body, (elem)=> elem.type === CARRY).length;
      if(bodyCarryNum){
        if(!creep.memory.harvesting && creep.carry.energy == 0) {
            creep.memory.harvesting = true;
            // creep.say('harvesting');
        }
        if(creep.memory.harvesting && creep.carry.energy + bodyWorkNum * 2 > creep.carryCapacity) {
            creep.memory.harvesting = false;
            // creep.say('harvested');
        }
      }else{
          creep.memory.harvesting = true;
      }
    	
        if(!creep.memory.harvesting) {
            //it is full
            
              let target = creep.pos.findClosestByRange(someUtil.getTargetsByIds(Memory.rooms[creep.room.name].dropped_resources_ids));
              if(target && creep.pickup(target) == OK) {
                    creep.moveTo(target, {reusePath: 10});
              }else{
                if(creep.room.storage){
                      let targets = someUtil.getTargetsByIds(Memory.rooms[creep.room.name].container_ids);
                      target = creep.pos.findClosestByRange(targets, { filter: (structure)=> structure.store.energy + creep.carry.energy <= structure.storeCapacity});
                      if(!target){
                        creep.drop(RESOURCE_ENERGY);
                      }
                  if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                          creep.moveTo(target, {reusePath: 10});
                  } 

                }
                //if there is only container
                else{
                  var sourcesIds = creep.room.stats().sources_ids;
                   if(creep.harvest(Game.getObjectById(sourcesIds[creep.memory.source])) === ERR_NOT_IN_RANGE){
                       creep.moveTo(Game.getObjectById(sourcesIds[creep.memory.source]), {reusePath: 10});
                   }
                }
                
                
              }
            

            
        }   
        else {
            if(creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom){
              for(let name in Game.flags){
                if(Game.flags[name].color === COLOR_WHITE && Game.flags[name].secondaryColor === COLOR_WHITE && creep.room === Game.flags[name].room){
                    if(!(creep.pos.x === Game.flags[name].pos.x && creep.pos.y === Game.flags[name].pos.y)){
                      creep.moveTo(Game.flags[name]);
                    }else{
                      creep.move(someUtil.findOutTheDirection(Game.flags[name].name).direction);
                      console.log(creep.name, someUtil.findOutTheDirection(Game.flags[name].name).direction);
                    }
                }
              }
            }else{
              var sourcesIds = creep.room.stats().sources_ids;
              
               if(creep.harvest(Game.getObjectById(sourcesIds[creep.memory.source])) === ERR_NOT_IN_RANGE){
                   creep.moveTo(Game.getObjectById(sourcesIds[creep.memory.source]));
               }else{
                  
               }
             }
        }
  }
};