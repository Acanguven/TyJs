/**
 * Created by ahmetcan.guven on 14.06.2017.
 */

(function () {
    var Constants = {
        cachePrefix: '_',
        testClassExposePrefix: '_',
        karmaTestHtml: 'context.html',
        moduleEvents: {
            success: 'success',
            error: 'error',
            timeout: 'timeout',
        }
    };
    function Ty(){
        this.tyHttpService = new TyHttpLoader();
        this.tyCacheService = new TyScriptCache();

        this.module = function(moduleName, moduleClass){
            this.tyCacheService.cache(moduleName, moduleClass);
            this.tyHttpService.moduleWaiterList.notifyEvent(moduleName, Constants.moduleEvents.success);

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
            var remainingModules = this.constructModuleListFromCache(moduleList);
            for(var x = 0; x < remainingModules.length; x++){
                ty.tyHttpService.request(remainingModules[x], false, this);
            }
            return this;
        };

        this.loadSync = function(moduleList){
            var remainingModules = this.constructModuleListFromCache(moduleList);
            for(var x = 0; x < remainingModules.length; x++){
                ty.tyHttpService.request(remainingModules[x], true, this);
            }
            return this;
        };

        this.constructModuleListFromCache = function(moduleList){
            var length = moduleList.length;
            while(length--){
                var moduleClass = ty.tyCacheService.get(moduleList[length]);
                if(!!moduleClass){
                    this.constructModule(moduleList[length], moduleClass);
                    this.fireEvent(moduleList[length], Constants.moduleEvents.success);
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

        var loadEvent = null;
        this.onLoad = function(cb){
            loadEvent = cb;
            return this;
        };

        var onLoadAllEvent = null;
        this.onLoadAll = function(cb){
            onLoadAllEvent = cb;
            return this;
        };

        var onTimeoutEvent = null;
        this.onTimeout = function(cb){
            onTimeoutEvent = cb;
            return this;
        };

        var onErrorEvent = null;
        this.onError = function(cb){
            onErrorEvent = cb;
            return this;
        };

        this.fireEvent = function(moduleName, eventType){
            switch(eventType){
                case Constants.moduleEvents.success:
                    if(!!loadEvent){
                        loadEvent(moduleName);
                    }
                    break;
                case Constants.moduleEvents.error:
                    if(!!onErrorEvent){
                        onErrorEvent(moduleName);
                    }
                    break;
                case Constants.moduleEvents.timeout:
                    if(!!onTimeoutEvent){
                        onTimeoutEvent(moduleName);
                    }
                    break;
            }
        }
    }

    function TyModuleWaiterQueue() {
        this.waiterList = [];

        this.register = function(moduleName, instance){
            this.waiterList.push({
                moduleName: moduleName,
                instance: instance
            });
        };

        this.notifyEvent = function(moduleName, eventType){
            var length = this.waiterList.length;
            while(length--){
                if(this.waiterList[length].moduleName == moduleName){
                    if(eventType == Constants.moduleEvents.success){
                        var moduleClass = ty.tyCacheService.get(moduleName);
                        this.waiterList[length].instance.constructModule(moduleName, moduleClass);
                    }
                    this.waiterList[length].instance.fireEvent(moduleName, eventType);
                    this.waiterList.splice(length, 1);
                }
            }
        };
    }

    function TyHttpLoader(){
        this.pendingHttpModuleList = [];
        this.moduleWaiterList = new TyModuleWaiterQueue();

        this.request = function(moduleName, sync, instance){
            this.moduleWaiterList.register(moduleName, instance);
            var src = this.cdnLinkBuilder(moduleName);
            if(sync){
                return this.syncRequest(src, moduleName);
            }else{
                if(!this.isModulePending(moduleName)){
                    this.pendingHttpModuleList.push(moduleName);
                    return this.asyncRequest(src, moduleName);
                }else{
                    return false;
                }
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
            return '../src/lib/' + moduleName + '.js';
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