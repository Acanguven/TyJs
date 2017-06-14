describe("Array Module", function() {
    var module = new window[ty.Constants.testClassExposePrefix + 'array'];

    it("Expect module to be exposed to window", function() {
        expect(module).toBeDefined();
    });

    var testArray = [
        {
            name: "Ankara",
            value: 6,
            city: true
        },
        {
            name: "İstanbul",
            value: 34,
            city: true
        },
        {
            name: "Paris",
            value: 645,
            city: true
        },
        {
            name: "Malatya",
            value: 44,
            city: true
        },
        {
            name: "Çankaya",
            value: 44,
            city: false
        }
    ];

    it("It should find index by prop value", function() {
        var index = module.findIndexByProp(testArray, 'value', 34);
        expect(index).toEqual(1);
    });

    it("It should return -1 for undefined index", function() {
        var index = module.findIndexByProp(testArray, 'value', 55);
        expect(index).toEqual(-1);
    });

    it("It should find element by prop value", function() {
        var obj = module.findByProp(testArray, 'name', 'Malatya');
        expect(obj.value).toEqual(44);
    });

    it("It should return null for undefined element", function() {
        var obj = module.findByProp(testArray, 'name', 'Bursa');
        expect(obj).toEqual(null);
    });
});