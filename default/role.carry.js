/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.carry');
 * mod.thing == 'a thing'; // true
 */
var roleHarvester = require('role.harvester');
var actionUtil = require('action.util');
var tower = Game.getObjectById('583bf06e6b5c5b05140ee9fa');
const someUtil = require('some.util');
module.exports = {
  run: function(creep) {
  	
  	//it is the state when it met the condition
  	this.changeState(creep);
	 //if there is no storage
  	if(!creep.room.storage){
	    this.runWithoutStorage(creep);
  	}else{

      if(creep.memory.carrying){
      	//if it is normally working
      	//if there are no destination set

      		//send the resource to the destination
      		this.carryToMemory(creep);
      	
	  }
	  else{

	  	this.goHarvesting(creep);

	  }
  	}
  },
  goHarvesting: function(creep){
  	//in traditional mode
  	if(!creep.room.stats().roleStats["staticHarvester"] && !creep.memory.from && !creep.memory.to && !creep.memory.source){
            var sourcesIds = Game.rooms["E64N7"].stats().sources_ids;
            if(creep.harvest(Game.getObjectById(sourcesIds[creep.memory.source])) === ERR_NOT_IN_RANGE){
                creep.moveTo(Game.getObjectById(sourcesIds[creep.memory.source]), {reusePath: 10});
            }
        }
        //new economics situation
        //find the nearest place to withdraw the energy
        else{
        	//if the type of energy source structure is not be set
        	if(!creep.memory.from){
	        	this.findStructureAndWithdraw(creep);

        	}else{
        		//waiting harvester to fill the container

        			this.withdrawFromMemory(creep);

        	}
            
        }
  },
  changeState: function(creep){
    const mtarget = creep.memory.target;
  	if(creep.memory.carrying && creep.carry.energy === 0){
      	creep.memory.carrying = false;
        creep.memory.target = null;
      	creep.say("harvesting");
      }
      if(!creep.memory.carrying && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.carrying = true;
          creep.memory.target = null;
	        creep.say('carrying');
	    }
      if(creep.memory.target){
        const target = Game.getObjectById(mtarget);
        if(target){
          if((target.structureType === STRUCTURE_SPAWN || target.structureType === STRUCTURE_EXTENSION) && target.energy === target.energyCapacity){
            creep.memory.target = null;
          }
        }
        
      }
      if(!(creep.memory.target && Game.getObjectById(mtarget))){
        creep.memory.target = null;
      }
  },
  runWithoutStorage: function(creep){
  	if(creep.memory.carrying){
	  	  this.carryToMemory(creep);
	  }else{
	  	this.goHarvesting(creep);
	  }
  },
  findStructureAndWithdraw: (creep)=>{
    let target;
    if(creep.room.storage){
      let targets = someUtil.getTargetsByIds(Memory.rooms[creep.room.name].container_ids);
      target = creep.pos.findClosestByRange([...targets, creep.room.storage]);
    }
  	
  	if(creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
  	    creep.moveTo(target, {reusePath: 10});
  	} 
  },
  withdrawFromMemory: (creep)=>{
      let target;
      const roomName = creep.room.name;
      if(!creep.memory.target){
        if(creep.memory.from === STRUCTURE_STORAGE){
          target = creep.room.storage;
        }else if (creep.memory.from === STRUCTURE_CONTAINER){
          let targets = someUtil.getTargetsByIds(Memory.rooms[roomName].container_ids);
          if(targets && targets[0] && targets[0].store.energy > creep.carryCapacity){
            target = targets[0]; 
            console.log(creep.room.name, "fuck this", target);
          }else{
            targets = Memory.rooms[roomName].dropped_resources_ids;
            target = creep.pos.findClosestByRange(someUtil.getTargetsByIds(targets));
            console.log(creep.room.name, "fuck this again!")
          }
          console.log(creep.room.name, "transfer energy from container but there is no energy in there !! ", target)
        }
        if(target){
          creep.memory.target = target.id;
        }
      }else{
        target = Game.getObjectById(creep.memory.target);
      }
      
    	if(creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE || creep.pickup(target)){
	        creep.moveTo(target, {reusePath: 10});
  	  }
  },
  carryToMemory: (creep)=>{
  	const roomName = creep.room.name;
  	if(creep.memory.to && typeof creep.memory.to === "string"){
      	let target;
        if(!creep.memory.target){
          
          if(creep.memory.to === STRUCTURE_STORAGE){
          
              target = creep.room.storage;
          }
          else if(creep.memory.to === STRUCTURE_TOWER){
            target = someUtil.getTargetsByIds(Memory.rooms[roomName].tower_ids)[0];
          }
          else if(creep.memory.to === STRUCTURE_SPAWN){
            let spawns = someUtil.getTargetsByIds(Memory.rooms[roomName].spawns_ids);
            let extensions = someUtil.getTargetsByIds(Memory.rooms[roomName].extension_ids);
            target = creep.pos.findClosestByRange([...spawns, ...extensions], { filter: (target)=> target.energy< target.energyCapacity});
          }
          else if(creep.memory.to === STRUCTURE_LINK){
            let storageLink;
            //initialize the storageLink and Controller Link
            if(!Memory.rooms[roomName].storageLink){
               storageLink = creep.pos.findClosestByRange(Memory.rooms[roomName].linksIds, {filter: (structure)=>{
                return  structure.pos.inRangeTo(creep.room.storage, 5);
              }});
              Memory.rooms[roomName].storageLink = storageLink.id;
            }else{
              storageLink = Game.getObjectById(Memory.rooms[roomName].storageLink);
            }
            let controllerLink;
            if(!Memory.rooms[roomName].controllerLink){
              controllerLink = creep.room.find(Memory.rooms[roomName].linkIds, {filter: (structure)=>{
                return structure.pos.inRangeTo(creep.room.controller, 5);
              }});
              if(controllerLink){
                Memory.rooms[roomName].controllerLink = controllerLink[0].id;
              }
            }else{
              controllerLink = Game.getObjectById(Memory.rooms[roomName].controllerLink);
            }
            target = storageLink;
          }
          if(target){
            creep.memory.target = target.id;
          }
        }else{
          target = Game.getObjectById(creep.memory.target);
        }
      	
        // console.log(creep.name, target.id);
      	if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
      		creep.moveTo(target, {reusePath: 8});
      	}else if(creep.transfer(target, RESOURCE_ENERGY) === ERR_INVALID_TARGET){
              console.log(creep.name, "encounter some problem while transfer energy at",creep.pos.x,",", creep.pos.y," in ",creep.room.name, "the targetRoom is ");
        }
      	// const controllerLink = Game.getObjectById(Memory.rooms[creep.room.name].controllerLink);
      	const storageLink = Game.getObjectById(Memory.rooms[roomName].storageLink);
      	const controllerLink = Game.getObjectById(Memory.rooms[roomName].controllerLink);
      	if(controllerLink && storageLink && controllerLink.energy === 0 && storageLink.energy === storageLink.energyCapacity){
      		storageLink.transferEnergy(controllerLink);
      	}
    }
    // else if(!creep.memory.to && creep.room.storage){
    //   target = creep.room.storage;
    // }else if(!creep.memory.to && Memory.rooms[roomName].container_ids){
    //   target = 
    // }
  }

};