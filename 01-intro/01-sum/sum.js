function sum(a, b) {

  if (typeof a !== 'number' || typeof b !== 'number') 
    throw TypeError('arguments are not a numbers')

  return a + b
}

module.exports = sum;
