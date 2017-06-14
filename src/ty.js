/**
 * Created by ahmetcan.guven on 14.06.2017.
 */

(function () {
    function Ty(){
        this.tyHttpService = new TyHttpLoader();
        this.tyCacheService = new TyScriptCache();


        this.module = function(moduleName, moduleClass){
            this.tyCacheService.cache(moduleName, moduleClass);
        };

        this.new = function(moduleList){
            return new TyInstance(moduleList);
        }
    }

    function TyInstance(moduleList){
        this.load = function(moduleList){

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
        var cachePrefix = "_";

        this.cache = function(moduleName, moduleClass){
            this[cachePrefix + moduleName] = moduleClass;
        };

        this.exists = function(moduleName){
            return(!!this[cachePrefix + moduleName]);
        };

        this.get = function(moduleName){
            return this[cachePrefix + moduleName];
        };

        this.clear = function(moduleName){
            delete this[cachePrefix + moduleName];
        };

        this.clearAll = function(){
            for(var module in  this){
                if(module.indexOf(cachePrefix) == 0){
                    delete this[module];
                }
            }
        };

        this.getCachedModuleNames = function(){
            return Object.keys(this).reduce(function(list, prop){
                if(prop.indexOf(cachePrefix) == 0){
                    list.push(prop.replace(cachePrefix,''));
                }
                return list;
            }, []);
        }
    }

    window.ty = new Ty();
})();