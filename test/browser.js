/**
 * Created by ahmetcan.guven on 14.06.2017.
 */

describe("Browser Module", function() {
    var module = new window[ty.Constants.testClassExposePrefix + 'browser'];

    it("Expect module to be exposed to window", function() {
        expect(module).toBeDefined();
    });
});