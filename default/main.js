var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var actionSpawn = require('action.spawn');
var someUtil = require('some.util');
var roleBuilder = require('role.builder');
var roomUtil = require('room.util');

module.exports.loop = function () {
    roomUtil.initialize();

    someUtil.clearSuicidedCreep();
    actionSpawn.createGreaterCreep(actionSpawn.getRandomRoleName());
    someUtil.balanceSource();
    
    var tower = Game.getObjectById('583bf06e6b5c5b05140ee9fa');
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}