/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.manager');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
  initializeEmpire: (spawn)=>{
  	let result;
  	const roomName = spawn.room.name;
  	if(Memory.someData["empire"] instanceof Set){
		result = Memory.someData.empire;
		
  	}else{
  		result = new Set();
  	}

  	result.add(roomName);
  	Memory.someData.empire = result;
  }
};