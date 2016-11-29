/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.util');
 * mod.thing == 'a thing'; // true
 */
var someUtil = require('some.util');

module.exports = {
  initialize: function(){
      Room.prototype.stats = function() {
        return {
            myCreepsCnt: this.find(FIND_MY_CREEPS).length,
            enemiesCnt: this.find(FIND_HOSTILE_CREEPS).length,
            construction_sites_ids: someUtil.getConstructionSitesIds(this),
            sources_ids: someUtil.getSoucesIds(this),
            dropped_resources_ids: someUtil.getSpecialIds(this, FIND_DROPPED_RESOURCES),
            structures_need_repair_ids: someUtil.getSpecialIds(this, FIND_STRUCTURES, { filter: (structure)=>{ return structure.hits < structure.hitsMax; }})
        };
    };
  }
};