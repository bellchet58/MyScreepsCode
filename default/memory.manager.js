/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('memory.manager');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
  data: Memory.someData,
  initializeHarvestMapping: function(){
  	var arr = [];
  	if(this.data.harvestMapping){
  		if(this.data.discoveredRoom){
  			for(var name in this.data.discoveredRoom){
  				if(this.data.discoveredRoom[name]){
  					var roomName = this.data.discoveredRoom[name];
  					for(var id in Game.rooms[roomName].stats().sources_ids){
  						arr.push({ roomName: roomName, sourceId: Game.rooms[roomName].stats().sources_ids[id], screepId: null });
  					}
  				}
  			}
  		}
  		
  	}
  	this.data.harvestMapping = arr;
  },
  set: (name, key, value)=>{
  	if(!Memory.someData[name]){
  		Memory.someData[name] = {};
  	}

  	Memory.someData[name][key] = value;
  	
  },
  get: (key) =>{
  	console.log(key);
    if(this.data.key){
    	return this.data.key;
    }else{
    	this.data.key = null;
    	return this.data.key;
    }
  }
};