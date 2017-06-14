/**
 * Created by ahmetcan.guven on 14.06.2017.
 */

describe("TY", function() {
    it("Expect ty to be globally available", function() {
        expect(ty).toBeDefined();
    });

    it("Ty should register to cache module", function() {
        ty.module('moduleName', function(){});
        expect(ty.tyCacheService.exists('moduleName')).toEqual(true);
        ty.tyCacheService.clearAll();
    });

    it("It should return new TyInstance", function() {
        var newTyIstance = ty.new();
        expect(typeof newTyIstance).toEqual('object');
    });
});

describe("TyScriptCache", function() {
    it("It should cache module", function() {
        ty.tyCacheService.cache('testModule', function(){});
        expect(ty.tyCacheService['_testModule']).toBeDefined();
    });

    it("It should return true if module exists", function() {
        var exist = ty.tyCacheService.exists('testModule', function(){});
        var notExist = ty.tyCacheService.exists('testModuleNotExists', function(){});
        expect(exist).toBe(true);
        expect(notExist).toBe(false);
    });

    it("It should return module", function() {
        var module = ty.tyCacheService.get('testModule', function(){});
        expect(typeof module).toBe('function');
    });

    it("It should return undefined for not cached module", function() {
        var module = ty.tyCacheService.get('testModuleNotExists', function(){});
        expect(typeof module).toBe('undefined');
    });

    it("It should clear cached module", function() {
        ty.tyCacheService.clear('testModule');
        var module = ty.tyCacheService.get('testModule', function(){});
        expect(typeof module).toBe('undefined');
    });

    it("It should return all cached module names", function() {
        ty.tyCacheService.cache('testModule1', function(){});
        ty.tyCacheService.cache('testModule2', function(){});
        ty.tyCacheService.cache('testModule3', function(){});
        var moduleList = ty.tyCacheService.getCachedModuleNames();
        expect(moduleList).toEqual(['testModule1','testModule2','testModule3']);
    });

    it("It should clear all cached modules", function() {
        ty.tyCacheService.clearAll();
        var module = ty.tyCacheService.get('testModule');
        expect(typeof module).toBe('undefined');
    });
});

describe("TyHttpLoader", function(){
    it("It should return cdn link", function() {
        expect(ty.tyHttpService.cdnLinkBuilder('module').indexOf('.js') > 0).toBe(true);
    });

    it("It should appendScript sync", function() {
        var cdnLink = ty.tyHttpService.cdnLinkBuilder('array');
        var xhrObj = ty.tyHttpService.request('array', true);
        setTimeout(function(){
            if(xhrObj.readyState == 4 && xhrObj.stats == 200){
                var script = document.querySelector('[src="'+cdnLink+'"]');
                expect(script).not.toEqual(null);
            }
        }, 500);
    });

    it("It should appendScript async", function() {
        var cdnLink = ty.tyHttpService.cdnLinkBuilder('array2');
        ty.tyHttpService.request('array2');
        var script = document.querySelector('[src="'+cdnLink+'"]');
        expect(script).not.toEqual(null);
    });

    it("It should check if module is pending for download", function() {
        ty.tyHttpService.request('testModule');
        var isPending = ty.tyHttpService.isModulePending('testModule');
        expect(isPending).toEqual(true);
    });

    it("It should not redownload pending module", function() {
        ty.tyHttpService.request('testModule');
        var isDownloading = ty.tyHttpService.request('testModule');
        expect(isDownloading).toEqual(false);
    });
});