

let xx = (function () {
  function XX() {

  }
  XX.prototype.say = function (param) {
    console.log('say: ', param)
  }
  XX.prototype.print = function (param) {
    console.log('print: ', param)
  }
  return new XX()
})();

xx.say('hello')