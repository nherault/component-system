/* eslint-disable */
const Benchmark = require('benchmark');
const math = require('../lib/math');

const suite = new Benchmark.Suite;

console.log('math.sum(1, 2): ' + math.sum(1, 2));
console.log('math.divide(1, 2): ' + math.divide(1, 2));
console.log('math.substract(1, 2): ' + math.substract(1, 2));

// add tests
suite
.add('Math.sum', () => {
  math.sum(1, 2);
})
.add('math.divide(1, 2)', () => {
  math.divide(1, 2);
})
.add('math.substract(1, 2)', () => {
  math.substract(1, 2);
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
