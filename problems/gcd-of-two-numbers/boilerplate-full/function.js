

##USER_CODE_HERE##

(function() {
  const _harness_input = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\n').join(' ').split(' ');
  const _harness_a = parseInt(_harness_input.shift());
  const _harness_b = parseInt(_harness_input.shift());
  const _harness_result = gcd(_harness_a, _harness_b);
  console.log(_harness_result);
})();
    