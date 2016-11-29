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
  createNormalCreep: function(role){
  	  if(Game.spawns.UBL.canCreateCreep([WORK, MOVE, MOVE, MOVE, CARRY]) === 0){
  	  	var newName = Game.spawns['UBL'].createCreep([WORK, MOVE, MOVE, MOVE, CARRY], {role: role});
        console.log('Spawning new '+role +' : ' + newName);
        Game.creeps[newName].memory.source = someUtil.getOneInRange(0, 1);
  	  }
  },
  createUpperCreep: function(role) {
  	if(Game.spawns.UBL.canCreateCreep([WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, MOVE]) === 0){
  	  	var newName = Game.spawns['UBL'].createCreep([WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, MOVE], {role: role});
        console.log('Spawning new '+role +' : ' + newName);
        Game.creeps[newName].memory.source = someUtil.getOneInRange(0, 1);
  	  }
  },
  createGreaterCreep: function(role){
	if(Game.spawns.UBL.canCreateCreep([WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]) === 0){
	  	  	var newName = Game.spawns['UBL'].createCreep([WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], {role: role});
	        console.log('Spawning new '+role +' : ' + newName);
	        Game.creeps[newName].memory.source = someUtil.getOneInRange(0, 1);
	}
  },
  getRandomRoleName: function(){
  	var index = someUtil.getOneInRange(0, someUtil.roles.length-1);
    return someUtil.roles[index];
  }
};