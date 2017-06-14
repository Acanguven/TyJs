/**
 * Created by ahmetcan.guven on 14.06.2017.
 */

ty.module('array', function(){
    this.findIndexByProp = function (arr, prop, value) {
        return arr.reduce(function(index, item, iterationIndex){
            if(item[prop] === value && index == -1){
                index = iterationIndex;
            }
            return index;
        }, -1);
    };

    this.findByProp = function (arr, prop, value) {
        return arr.reduce(function(ret, item){
            if(item[prop] === value && ret == null){
                ret = item;
            }
            return ret;
        }, null);
    };
});