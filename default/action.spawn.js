/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('action.spawn');
 * mod.thing == 'a thing'; // true
 */
var someUtil = require('some.util');

module.exports = {
  createNormalCreep: function(role, room, spawn){
  	  if(Game.spawns[spawn].canCreateCreep([WORK, MOVE, MOVE, CARRY, CARRY]) === 0){
  	  	var newName = Game.spawns[spawn].createCreep([WORK, MOVE, MOVE, CARRY, CARRY], {role: role});
        console.log('Spawning new '+role +' : ' + newName);
        Game.creeps[newName].memory.level = 1;
        Game.creeps[newName].memory.source = someUtil.getOneInRange(0, 1);
        if(room){
          Game.creeps[newName].memory.targetRoom = room;
        }
  	  }
  },
  createUpperCreep: function(role) {
  	if(Game.spawns.UBL.canCreateCreep([WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, MOVE]) === 0){
  	  	var newName = Game.spawns['UBL'].createCreep([WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, MOVE], {role: role});
        console.log('Spawning new '+role +' : ' + newName);
        Game.creeps[newName].memory.level = 2;
        Game.creeps[newName].memory.source = someUtil.getOneInRange(0, 1);
  	  }
  },
  createGreaterCreep: function(role){
	if(Game.spawns.UBL.canCreateCreep([WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY]) === 0){
	  	  	var newName = Game.spawns['UBL'].createCreep([WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY], {role: role, targetRoom: "E64N7"});
	        console.log('Spawning new '+role +' : ' + newName);
	        Game.creeps[newName].memory.level = 3;
	        Game.creeps[newName].memory.source = someUtil.getOneInRange(0, 1);
	}
  },
  createStaticUpgrader: (room)=>{
  	if(Game.spawns.UBL.canCreateCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]) === 0){
  		var newName = Game.spawns['UBL'].createCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], {role: "upgrader", targetRoom: "E64N7"});
	        console.log('Spawning new '+"upgrader" +' : ' + newName);
      if(room){
        Game.creeps[newName].memory.targetRoom = room;
      }
  	}
  },
  createDynamicUpgrader: (roomName, spawnName)=>{
    let level = Game.rooms[roomName].controller.level;
    let result = Memory.rooms[roomName].spawnEnergy;
    result = Math.floor(result / 200);
    let arr = someUtil.createWorkBodyArr(result);
    someUtil.createHelper(arr, {role: "upgrader", targetRoom: roomName}, spawnName);
  },
  createGuaidian: function(){
	if(Game.spawns.UBL.canCreateCreep([ARR, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]) === 0){
	  	  	var newName = Game.spawns['UBL'].createCreep([WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], {role: role});
	        console.log('Spawning new '+role +' : ' + newName);
	        Game.creeps[newName].memory.source = someUtil.getOneInRange(0, 1);
	}
  },
  createCatcher: (spawnName)=>{
    if(typeof spawnName === "string"){
        someUtil.createHelper([CARRY, CARRY, MOVE], {role: "catcher", targetRoom: Game.spawns[spawnName].room.name}, spawnName);
    }else{
      if(Game.spawns.UBL.canCreateCreep([CARRY, CARRY, MOVE]) === 0){
        var newName = Game.spawns['UBL'].createCreep([CARRY, CARRY, MOVE], {role: "catcher", targetRoom: "E64N7"});
        console.log('Spawning new '+"catcher" +' : ' + newName);
      }
    }
    
  },
  createStaticHavesterCreep: function(room, noNeedCarry, spawnName){
    // need to fix in the future
    if(noNeedCarry){
      
      someUtil.createHelper([WORK, WORK, WORK, WORK, WORK, MOVE], {role: "staticHarvester", targetRoom: room}, spawnName, someUtil.detemineSource);
      
    }
  	else if(Game.spawns.UBL.canCreateCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE]) === 0){
	  	  	var newName = Game.spawns['UBL'].createCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE], {role: "staticHarvester", targetRoom: "E64N7"});
	        console.log('Spawning new '+ "staticHarvester" +' : ' + newName);
	        var result = _.find(Game.creeps, (creep)=>{
	        	return creep.room.name === room && creep.memory.role === "staticHarvester" && creep.memory.source === 0;
	        });
	        if(result){
	        	Game.creeps[newName].memory.source = 1;
	        }else{
	        	Game.creeps[newName].memory.source = 0;
	        }
	        Game.creeps[newName].memory.targetRoom = room;
	  }else if(spawnName){
      someUtil.createHelper([WORK, WORK, MOVE], {role: "staticHarvester", targetRoom: room}, spawnName);
    }
  	
  },
  createCarryCreep: function(from, to, level, targetRoom , spawn){
  	if(arguments.length === 2){
  		if(Game.spawns.UBL.canCreateCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]) === 0){
	    		var newName = Game.spawns['UBL'].createCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], {role: "carry",carrying: false, from: from, to: to, targetRoom: "E64N7"});
		        console.log('Spawning new '+"carry" +' : ' + newName);
		        console.log("from", from , "to ", to);
	    }
	    else if(Game.spawns.UBL.canCreateCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]) === 0){
	    	var newName = Game.spawns['UBL'].createCreep([CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], {role: "carry",carrying: false, from: from, to: to, targetRoom: "E64N7"});
		        console.log('Spawning new '+"carry" +' : ' + newName);
		        console.log("from", from , "to ", to);
	    }
  	}else if(level === "lower" && arguments.length === 3){
  		if(Game.spawns.UBL.canCreateCreep([CARRY, CARRY, MOVE]) === 0){
	    	var newName = Game.spawns['UBL'].createCreep([CARRY, CARRY, MOVE], {role: "carry", from: from, to: to, targetRoom: "E64N7"});
		    console.log('Spawning new '+"carry" +' : ' + newName);
		    console.log("from", from , "to ", to);
	    }
  	}else if(arguments.length > 3){
        someUtil.createHelper([CARRY, CARRY, MOVE], {from : from, to: to, targetRoom: targetRoom, role: "carry"}, spawn);
      }
    
  },
    
   createRepairer: (room, spawn)=>{
    if(typeof room === "string"){
      someUtil.createHelper([WORK, CARRY, MOVE], {role: "repairer", targetRoom: room}, spawn);
    }else{
      someUtil.createHelper([WORK, CARRY, MOVE], {role: "repairer"}, spawn);
    }
  },
  createBerserker: (room)=>{
    if(typeof room === "string"){
      someUtil.createHelper([WORK, CARRY, MOVE], {role: "berserker", targetRoom: room});
    }
  },
  createAssassin: (room)=>{
    if(typeof room === "string"){
      someUtil.createHelper([CLAIM, TOUGH, MOVE], {role: "assassin", targetRoom: room});
    }
  },
  getRandomRoleName: function(){
  	var index = someUtil.getOneInRange(0, someUtil.roles.length-1);
    return someUtil.roles[index];
  },
  balanceSource: function() {
  	var obj = {};
  	_.forEach(Game.creeps, (creep)=>{            
      if(!obj[creep.memory.source]){
      	obj[creep.memory.source] = 1;
      }else{
      	obj[creep.memory.source] += 1;
      }
  	});
    var result = someUtil.getStatOfProperyValue(obj);
    console.log("source",result.maxSource,":",result.maxNum, "source", result.minSource,":",result.minNum);
    if(result.minSource === result.maxSource && result.maxNum < 5){
      var theOne = _.find(Game.creeps, (creep) =>{
      	return creep.memory.source === result.maxSource;
      });
      var arr = someUtil.getAnArrayfrom0(Game.rooms["E64N7"].stats().spawanIds.length);
      theOne.memory.source = _.find(arr, (elem)=>{ elem !== theOne.memory.source});
      console.log(theOne.name, "is changing souce to source", theOne.memory.source);
    }
    if(result.minNum !== result.maxNum && result.maxNum -1 !== result.minNum){
      //待优化
      var theOne = _.find(Game.creeps, (creep)=>{
        return creep.memory.source == result.maxSource;
      });
      console.log(theOne.name,"is changing source to source",result.minSource);
      theOne.memory.source = result.minSource;
    }
   }
};