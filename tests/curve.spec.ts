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

//   it('Get Quote N', async () => {
//     const c = new Curve(1000000n, 1000n, 500n);
//     equal(c.quote_n(100n).purchase_cost, 35461479n)
//   })

//   it('Get Quote N special case', async () => {
//     const c = new Curve(1000000n, 83n, 48n);
//     equal(c.reverse_quote_n(1_000_000n).purchase_amount, 2n)
//   })

//   it('Get Reverse Quote Y', async () => {
//     const c = new Curve(1000000n, 500n, 1000n);
//     equal(c.reverse_quote_y(35461479n).purchase_amount, 100n)
//   })

//   it('Get Reverse Quote N', async () => {
//     const c = new Curve(1000000n, 1000n, 500n);
//     equal(c.reverse_quote_n(35461479n).purchase_amount, 100n)
//   })

  // it('Example flow', async () => {
  //   // Creator seeds $1000, 50/50
  //   const BASE_PRICE = 1000000n    
  //   const curve = new Curve(BASE_PRICE, 1000n, 1000n);
  //   console.log('Spot price of N', Number(curve.spot_price_n()) / Number(BASE_PRICE))
  //   console.log('Spot price of Y', Number(curve.spot_price_y()) / Number(BASE_PRICE))
    
  //   // User wants to buy $100 of N
  //   const reverse_quote_n = curve.reverse_quote_n(100n * BASE_PRICE);
  //   console.log(`Amount received for $100: ${reverse_quote_n.purchase_amount}`)
   
  //  //  User wants to buy 191 N
  //   const quote_n = curve.quote_n(reverse_quote_n.purchase_amount);
  //   console.log('Purchase amount', quote_n.purchase_amount)
  //   console.log('Purchase cost', Number(quote_n.purchase_cost) / Number (BASE_PRICE))
  //   console.log('Price impact', `${quote_n.price_impact.toFixed(4)}%`)
  //   console.log('Start price', Number(quote_n.start_price) / Number(BASE_PRICE))
  //   console.log('End price', Number(quote_n.end_price) / Number(BASE_PRICE))
  //   console.log('Average price', Number(quote_n.average_price) / Number(BASE_PRICE))  
  // })
})