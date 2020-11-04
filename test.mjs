import { calc } from './index.mjs'

var testList = [
    ['2 + 2 * 2', 6],
    ['(2 + 2)* 2', 8],
    ['(1+2)^2', 9],
    ['2-1+5*5-2', 24],
]

const tests = () => testList.forEach(x => {
    const res = calc(x[0])
    const isPassed = res === x[1]
    console.log(x[0], '=', res, isPassed)
})

tests()
