# TyJs
 
Write once use everywhere

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