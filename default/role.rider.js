/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.rider');
 * mod.thing == 'a thing'; // true
 */
const someUtil = require('some.util');
module.exports = {
  run: (creep)=>{
  	if(creep.memory.targetRoom && creep.memory.targetRoom !== creep.room.name){
      for(let name in Game.flags){
	    	if(Game.flags[name].color === COLOR_WHITE && Game.flags[name].secondaryColor === COLOR_WHITE && creep.room === Game.flags[name].room){
	    	    if(!(creep.pos.x === Game.flags[name].pos.x && creep.pos.y === Game.flags[name].pos.y)){
					creep.moveTo(Game.flags[name]);
				}else{
					creep.move(someUtil.findOutTheDirection(Game.flags[name].name));
				}
	    	}
	    }
  	}else{
  		//do something scout
  	}
  }
};