/**
 * Created by ahmetcan.guven on 14.06.2017.
 */

(function () {
    var Constants = {
        cachePrefix: '_',
        testClassExposePrefix: '_',
        karmaTestHtml: 'context.html'
    };

    function Ty(){
        this.tyHttpService = new TyHttpLoader();
        this.tyCacheService = new TyScriptCache();


        this.module = function(moduleName, moduleClass){
            this.tyCacheService.cache(moduleName, moduleClass);

            if(this.isTestEnv()){
                console.info('Module ' + moduleName + ' exposed to window on test environment.');
                window[Constants.testClassExposePrefix + moduleName] = moduleClass;
            }
        };

        this.new = function(moduleList){
            return new TyInstance(moduleList);
        };

        this.isTestEnv = function(){
            return document.URL.indexOf(Constants.karmaTestHtml) > -1;
        };
    }

    function TyInstance(moduleList){
        this.load = function(moduleList){
            var remainingModules = this.loadModuleListFromCache(moduleList);
        };

        this.loadModuleListFromCache = function(moduleList){
            var length = moduleList.length;
            while(length--){
                var moduleClass = ty.tyCacheService.get(moduleList[length]);
                if(!!moduleClass){
                    this.constructModule(moduleList[length], moduleClass);
                    moduleList.splice(length, 1);
                }
            }
            return moduleList;
        };

        this.constructModule = function (moduleName, moduleClass) {
            this[moduleName] = new moduleClass();
        };

        if(!!moduleList){
            this.load(moduleList);
        }
    }

    function TyHttpLoader(){
        this.pendingHttpModuleList = [];

        this.request = function(moduleName, sync){
            if(!this.isModulePending(moduleName)){
                this.pendingHttpModuleList.push(moduleName);
                var src = this.cdnLinkBuilder(moduleName);
                if(sync){
                    return this.syncRequest(src, moduleName);
                }else{
                    return this.asyncRequest(src, moduleName);
                }
            }else{
                return false;
            }
        };

        this.syncRequest = function(src, moduleName){
            var xhrObj = new XMLHttpRequest();
            xhrObj.open('GET', src, false);
            var scriptElement = document.createElement('script');
            scriptElement.type = "text/javascript";
            xhrObj.onreadystatechange = function (oEvent) {
                if (xhrObj.readyState == 4) {
                    if (xhrObj.status == 200) {
                        scriptElement.text = xhrObj.responseText;
                        document.getElementsByTagName('head')[0].appendChild(scriptElement);
                    }
                }
            };
            xhrObj.onerror = function(){

            };
            xhrObj.send();
            return xhrObj;
        };

        this.asyncRequest = function(src, moduleName){
            var ready = false;
            var scriptElement = document.createElement('script');
            scriptElement.type = 'text/javascript';
            scriptElement.async = true;
            scriptElement.src = src;
            scriptElement.onload = scriptElement.onreadystatechange = function() {
                if ( !ready && (!this.readyState || this.readyState == 'complete') )
                {
                    ready = true;
                }
            };
            scriptElement.onerror = function () {

            };
            document.getElementsByTagName('head')[0].appendChild(scriptElement);
        };

        this.cdnLinkBuilder = function (moduleName) {
            return '/base/src/lib/' + moduleName + '.js';
        };

        this.isModulePending = function(moduleName){
            return this.pendingHttpModuleList.indexOf(moduleName) > -1;
        }
    }

    function TyScriptCache(){
        this.cache = function(moduleName, moduleClass){
            this[Constants.cachePrefix + moduleName] = moduleClass;
        };

        this.exists = function(moduleName){
            return(!!this[Constants.cachePrefix + moduleName]);
        };

        this.get = function(moduleName){
            return this[Constants.cachePrefix + moduleName];
        };

        this.clear = function(moduleName){
            delete this[Constants.cachePrefix + moduleName];
        };

        this.clearAll = function(){
            for(var module in  this){
                if(module.indexOf(Constants.cachePrefix) == 0){
                    delete this[module];
                }
            }
        };

        this.getCachedModuleNames = function(){
            return Object.keys(this).reduce(function(list, prop){
                if(prop.indexOf(Constants.cachePrefix) == 0){
                    list.push(prop.replace(Constants.cachePrefix,''));
                }
                return list;
            }, []);
        }
    }

    window.ty = new Ty();
    window.ty.Constants = Constants;
})();