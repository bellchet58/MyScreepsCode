/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('some.util');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
  roles: ["harvester", "upgrader", "builder"],
  roleFilter: function(role){
      return  _.filter(Game.creeps, (creep) =>{
          creep.memory.role === role;
      })
  },
  clearSuicidedCreep: function(){
  	for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
  },
  getOneInRange: function(min, max){
  	return Math.floor(Math.random()*(max - min+1))+min;
  },
  getACreepByRole: function(role){
  	var result = _.find(Game.creeps, (creep)=>{
      creep.memory.role === role;
  	});
  	return result;
  },
  getStatOfProperyValue: function(obj) {
  	var arr = [];
  	for(var name in obj){
  		if(obj[name]){
  			arr.push(Number(obj[name]));
  		}
  	}
    var maxNum =  Math.max.apply(null, arr);
    var minNum = Math.min.apply(null, arr);
    var max, min;
    for(var name in obj){
    	if(maxNum === obj[name]){
    		max = name;
    	}else if(minNum === obj[name]){
            min = name;
    	}
    }
    return { maxSource: max, maxNum: maxNum, minSource: min, minNum:minNum };
  },
  getMinOfProperyValue: function(numArray) {
    return Math.max.apply(null, numArray);
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
    var result = this.getStatOfProperyValue(obj);
    console.log("source",result.maxSource,":",result.maxNum, "source", result.minSource,":",result.minNum);

    if(result.minNum !== result.maxNum && result.maxNum -1 !== result.minNum){
      //待优化
      var theOne = _.find(Game.creeps, (creep)=>{
        return creep.memory.source == result.maxSource;
      });
      console.log(theOne.name,"is changing source to source",result.minSource);
      theOne.memory.source = result.minSource;
    }
   },
   getConstructionSitesIds: function(room){
     var arr = [];
     var targets = room.find(FIND_CONSTRUCTION_SITES);
     for(var name in targets){
     	if(targets[name]){
     		arr.push(targets[name].id);
     	}
     }
     return arr;
   },
   getSoucesIds: function(room){
   	var arr = [];
   	var sources = room.find(FIND_SOURCES);
   	for(var name in sources){
   		if(sources[name]){
   			arr.push(sources[name].id);
   		}
   	}
   	return arr;
   },
   getSpecialIds: function(room, findResources, option){
     var arr = [];
     if(arguments.length === 2){
	     var sources = room.find(findResources);
	     for(var name in sources){
	     	if(sources[name]){
	     		arr.push(sources[name].id);
	     	}
	     }
	     return arr;
     }else if(arguments.length === 3){
     	var sources = room.find(findResources,option);
	     for(var name in sources){
	     	if(sources[name]){
	     		arr.push(sources[name].id);
	     	}
	     }
	     return arr;
     }
     
   }
};