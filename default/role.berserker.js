/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.berserker');
 * mod.thing == 'a thing'; // true
 */
const someUtil = require('some.util');
 const roleBerserker = {
  run: (creep)=>{
  	if(creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom){
	  	for(let name in Game.flags){
	    	if(Game.flags[name].color === COLOR_BLUE && Game.flags[name].secondaryColor === COLOR_GREY && creep.room === Game.flags[name].room){
	    	    if(!(creep.pos.x === Game.flags[name].pos.x && creep.pos.y === Game.flags[name].pos.y)){
					creep.moveTo(Game.flags[name]);
				}else{
					creep.move(someUtil.findOutTheDirection(Game.flags[name].name));
				}
	    	}
	    }
  	}else{
  		let target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
  		if(creep.dismantle(target) === ERR_NOT_IN_RANGE){
  			creep.moveTo(target);
  		}
  	}
  }
};
module.exports = roleBerserker;