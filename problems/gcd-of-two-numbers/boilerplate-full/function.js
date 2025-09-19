
##USER_CODE_HERE##

const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n').join(' ').split(' ');
const a = parseInt(input.shift());
  const b = parseInt(input.shift());
const result = gcd(a, b);
console.log(result);
    