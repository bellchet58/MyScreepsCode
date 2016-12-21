/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('structure.manager');
 * mod.thing == 'a thing'; // true
 */
const someUtil = require('some.util');
module.exports = {
  runTower: (roomName)=>{
  	const towers = someUtil.getTargetsByIds(Memory.rooms[roomName].tower_ids);
  	if(towers) {
        const closestDamagedStructure = Game.getObjectById(Memory.rooms[roomName].structureNeedRepair[0]);
        const closestDamagedCreep = Game.getObjectById(Memory.rooms[roomName].injured_creeps_ids[0]);
        _.forEach(towers, (tower)=>{
            const closestHostile =  Game.getObjectById(Memory.rooms[roomName].enemiesIds[0]);
            if(closestHostile) {
                tower.attack(closestHostile);
            }else{
                if(closestDamagedStructure && !Memory.rooms[roomName].roleStats["repairer"]) {
                    tower.repair(closestDamagedStructure);
                }     
                if(closestDamagedCreep){
                    tower.heal(closestDamagedCreep);
                }
            } 
        }) 
    }
    console.log(roomName, "'s tower is running");
  }
};