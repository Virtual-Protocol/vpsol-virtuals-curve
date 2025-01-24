import { SwapResult, sellTokenWithFee, buyTokenWithFee, kFromXY } from '../dist/node/virtuals_curve';
import { equal } from "assert";

describe('Virtuals Curve', () => {
  it('Get Price', async () => {
    let k = kFromXY(1000n, 1000n);
    equal(k,1000000n)
  })

  it('Buy Token With Zero Fee', async () => {
    let result: SwapResult = buyTokenWithFee(30n, 20n, 5n, 0);
    equal(result.amount, 4n)
    equal(result.total, 4n)
    equal(result.fee, 0n)
  })

  it('Sell Token With Zero Fee', async () => {
    let result: SwapResult = sellTokenWithFee(25n, 24n, 5n, 0);
    equal(result.amount, 4n)
    equal(result.total, 4n)
    equal(result.fee, 0n)
  })

  it('Buy Token With 25.00% Fee', async () => {
    let result: SwapResult = buyTokenWithFee(30n, 20n, 5n, 2500);
    equal(result.amount, 4n)
    equal(result.total, 5n)
    equal(result.fee, 1n)
  })

  it('Sell Token With 25.00% Fee', async () => {
    let result: SwapResult = sellTokenWithFee(25n, 24n, 5n, 2500);
    equal(result.amount, 3n)
    equal(result.total, 4n)
    equal(result.fee, 1n)
  })
})