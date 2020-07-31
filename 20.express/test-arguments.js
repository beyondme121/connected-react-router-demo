function test(a, b) {
  b = a
  a = '/'
  console.log(Array.from(arguments))
  console.log("a, b:", a, b)
}
test(11, 22)



