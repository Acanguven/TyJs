# TyJs
 
Write once use everywhere

## Demo

```javascript
    var exampleArray = [
        {
            name: 'Trendyol',
            value: 10
        },
        {
            name: 'Modagram',
            value: 5
        },
        {
            name: 'Web Team',
            value: 7
        }
    ];

    var tyInstance = ty.new();

    tyInstance.onLoad(function(moduleName){
        //Handle loaded module without waiting others
        console.log('loaded:' + moduleName);
    }).onLoadAll(function (){
        //All modules are ready to run. Browser module might not be defined as it has timeout
        console.log(tyInstance);
        tyInstance.arrayUtils.findIndexByProp(exampleArray, 'value', 5); // -> 1
        tyInstance.arrayUtils.findByProp(exampleArray, 'name', 'Web Team'); // -> { name: 'Web Team', value:7 }
    }).onTimeout(function(moduleName){
        //Browser module might be timed out.
        console.info("Timeout:" + moduleName);
    }).onError(function(moduleName){
        //There is not module named err
        console.error("Error:" + moduleName);
    }).load(['err','array']);
```

## Usage

### Instance

```javascript
    var tyInstance = ty.new();
```

### (Short Form) Load Modules async

```javascript
    var tyInstance = ty.new(['array','browser']);
```

### (long Form) Load Modules async

```javascript
    var tyInstance = ty.new().load(['array','browser']);
    console.log(tyInstance.array) //Undefined
```

### Sync Loading

```javascript
    var tyInstance = ty.new(); //initialization line
    tyInstance.loadSync(['array','browser']); //Load sync cant be used with the initialization line.
    console.log(tyInstance.array); //defined
```

### Cache Loading

```javascript
    //load is async but if modules coming from cache so they are directly injected and fires event
    //Whenever any module is loaded it gets cached
    var tyInstance = ty.new().load(['array','browser']); 
    console.log(tyInstance.array) //array module defined
```

### Events (OnLoad, OnError, OnTimeout, onLoadedAll)

```javascript
    var tyInstance = ty.new().onLoad(function(moduleName){
        if(moduleName == 'browser'){
            console.log(tyInstance.browser);
        }
    }).load(['browser']);
```

### Creating Modules

```javascript
    ty.module('exampleModule', function(){
        this.exampleMethod = function(){
            return 'foo';
        }
    });
```

### Importing Modules Inside Modules

```javascript
    ty.module('exampleModule', function(){
        var innerInstance = ty.new() 
        innerInstance.loadSync(['array']); //Sync or async load
        console.log(innerInstance.array) //array module defined;
        
        this.exampleMethod = function(){
            return 'foo';
        }
    });
```

### Creating Module Tests

```javascript
    describe("exampleModule", function() {
        var module = new window[ty.Constants.testClassExposePrefix + 'exampleModule'];
    
        it("Expect module to be exposed to window", function() {
            expect(module).toBeDefined();
        });
        
        it("Expect method to return foo", function() {
            expect(module.exampleMethod()).toEqual('foo');
        });
    });
```