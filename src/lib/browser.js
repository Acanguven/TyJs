/**
 * Created by ahmetcan.guven on 14.06.2017.
 */

ty.module('browser', function() {
    var dep = ty.new();
    dep.loadSync(['http']);

    this.isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    this.isFirefox = typeof InstallTrigger !== 'undefined';
    this.isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
    this.isIE = /*@cc_on!@*/false || !!document.documentMode;
    this.isEdge = !this.isIE && !!window.StyleMedia;
    this.isChrome = !!window.chrome && !!window.chrome.webstore;
    this.isBlink = (this.isChrome || this.isOpera) && !!window.CSS;
});