
var roleUpgrader = require('role.upgrader');
var actionSpawn = require('action.spawn');
var someUtil = require('some.util');
var roleBuilder = require('role.builder');
var roleCarry = require('role.carry');
var roleStaticHarvester = require('role.staticHarvester');
var roomUtil = require('room.util');
var roleCatcher = require('role.catcher');
var roleHarvester = require('role.harvester');
const roleRepairer = require('role.repairer');
const profiler = require('screeps-profiler');
const roleBerserker = require('role.berserker');
const roleRider = require('role.rider');
const roleAssassion = require('role.assassin');
const develeopScale = require('develop.scale');
const roomManager = require('room.manager');
const structureManager = require('structure.manager');

profiler.enable();
module.exports.loop = function () {
    profiler.wrap(()=>{
        roomUtil.initialize();

    someUtil.clearSuicidedCreep();
    // memoryManager.initializeHarvestMapping();
    var tower = Game.getObjectById('583bf06e6b5c5b05140ee9fa');
    var tower2 = Game.getObjectById('58459a9afb7aeeee4b9d1cbc');
    var towers = [tower, tower2];
    
    for(let name in Game.spawns){
        develeopScale.run(Game.spawns[name]);
        roomManager.initializeEmpire(Game.spawns[name]);
    }
    
    if(Memory.someData.empire instanceof Set){
        for(let roomName of Memory.someData.empire){
            structureManager.runTower(roomName);
        }
    }

    Game.rooms["E65N8"].stats().linksIds;
    if((Game.rooms["E64N7"].stats().enemiesIds.length >0 && tower.enengy)){
        Game.rooms["E64N7"].controller.activateSafeMode();
    }


    // if(Game.rooms["E64N7"].stats().myCreepsCnt)
    // someUtil.balanceSource();
    
    
    // if(towers) {
    //     var closestDamagedStructure = towers[0].pos.findClosestByRange(FIND_STRUCTURES, {
    //                 filter: (structure) => (structure.structureType === STRUCTURE_ROAD && structure.hits < 4200) || (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax - 800 ) || (structure.structureType === STRUCTURE_WALL && structure.hits < 1000 * 4) || (structure.structureType === STRUCTURE_RAMPART && structure.hits < 10000)
    //             });
    //     var closestDamagedCreep = towers[0].pos.findClosestByRange(FIND_CREEPS, {
    //                 filter: (creep) => { return creep.hits< creep.hitsMax;}
    //             });
    //     _.forEach(towers, (tower)=>{
    //         var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //         if(closestHostile) {
    //             tower.attack(closestHostile);
    //         }else{
    //             if(closestDamagedStructure) {
    //                 tower.repair(closestDamagedStructure);
    //             }     
    //             if(closestDamagedCreep){
    //                 tower.heal(closestDamagedCreep);
    //             }
    //         } 
    //     })
        
        
    // }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester'){
            roleStaticHarvester.run(creep);
        }
        if(creep.memory.role == 'staticHarvester'){
            roleStaticHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role === 'carry'){
            roleCarry.run(creep);
        }
        if(creep.memory.role === 'catcher'){
            roleCatcher.run(creep);
        }
        if(creep.memory.role === 'repairer'){
            roleRepairer.run(creep);
        }
        if(creep.memory.role === 'berserker'){
            roleBerserker.run(creep);
        }
        if(creep.memory.role === 'rider'){
            roleRider.run(creep);
        }
        if(creep.memory.role === 'assassin'){
            roleAssassion.run(creep);
        }
    }
    });
    
}