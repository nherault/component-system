/* eslint-disable */
const Benchmark = require('benchmark');
const utils = require('../lib/utils');

const suite = new Benchmark.Suite;

const add = (a, b) => a + b;
const dbl = (num) => num * 2;

console.log('utils.log("my log"): ' + utils.log("my log"));
console.log('utils.pipe(add, dbl)(5, 2): ' + utils.pipe(add, dbl)(5, 2));

// add tests
suite
.add('utils.log("my log")', () => {
    utils.log("my log");
})
.add('utils.pipe(add, dbl)(5, 2)', () => {
    utils.pipe(add, dbl)(5, 2);
})
// add listeners
.on('cycle', (event) => {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
  console.log('Slowest is ' + this.filter('slowest').map('name'));
})
// run async
.run({ 'async': true });
