import { k_from_xy, buy_token_with_fee, sell_token_with_fee, SwapResult } from '../dist/node/virtuals_curve';
import { equal } from "assert";

describe('Virtuals Curve', () => {
  it('Get Price', async () => {
    let k = k_from_xy(1000n, 1000n);
    equal(k,1000000n)
  })

  it('Buy Token With Zero Fee', async () => {
    let result: SwapResult = buy_token_with_fee(30n, 20n, 5n, 0);
    equal(result.amount, 4)
    equal(result.total, 4)
    equal(result.fee, 0)
  })

  it('Sell Token With Zero Fee', async () => {
    let result: SwapResult = sell_token_with_fee(25n, 24n, 5n, 0);
    equal(result.amount, 4)
    equal(result.total, 4)
    equal(result.fee, 0)
  })

  it('Buy Token With 25.00% Fee', async () => {
    let result: SwapResult = buy_token_with_fee(30n, 20n, 5n, 2500);
    equal(result.amount, 4)
    equal(result.total, 5)
    equal(result.fee, 1)
  })

  it('Sell Token With 25.00% Fee', async () => {
    let result: SwapResult = sell_token_with_fee(25n, 24n, 5n, 2500);
    equal(result.amount, 3)
    equal(result.total, 4)
    equal(result.fee, 1)
  })
})