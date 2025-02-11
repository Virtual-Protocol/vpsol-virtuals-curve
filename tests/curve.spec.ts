import { expect } from 'chai';
import { swapIn, swapOut, swapInWithFee, swapOutWithFee, kFromXY, init, spotPrice } from '../dist/node/virtuals_curve';

describe('Virtuals Curve', () => {
  it('K from XY', async () => {
    let k = kFromXY(1000n, 1000n);
    expect(k).to.equal(1000000n)
  })

  it('Spot price', async () => {
    let price = spotPrice(30n, 20n, 6);
    expect(price).to.equal(1500000n)
  })

  it('Swap in', async () => {
    // K = 600, Y = 30, X = 20, X2 = 24
    // Y2 = K/24 = 25 - 20 = 5
    let result = swapIn(20n, 30n, 4n)
    expect(result).to.equal(5n)

    // K = 600, Y = 24, X = 25, X2 = 30
    // Y2 = K/25 = 24 - 20 = 4
    result = swapIn(25n, 24n, 5n)
    expect(result).to.equal(4n)
  })

  it('Swap out', async () => {
    // K = 600, Y = 25, X = 24, X2 = 20
    // Y2 = K/20 = 30 - 25 = 5
    let result = swapOut(24n, 25n, 4n)
    expect(result).to.equal(5n)

    // K = 600, Y = 20, X = 30, X2 = 25
    // Y2 = K/25 = 24 - 20 = 4
    result = swapOut(30n, 20n, 5n)
    expect(result).to.equal(4n)
  })

  it('Swap in with zero fee', async () => {
    // K = 600, Y = 30, X = 20, X2 = 24
    // Y2 = K/24 = 25 - 20 = 5 - fee of 1 = 4
    let result = swapInWithFee(20n, 30n, 4n, 0, false)
    expect(result.yOut).to.equal(4n)
    expect(result.fee).to.equal(1n)
  })

  it('Swap in with fee', async () => {
    // K = 600, Y = 30, X = 20, X2 = 24
    // Y2 = K/24 = 25 - 20 = 5 - fee of 1 = 4
    let result = swapInWithFee(20n, 30n, 4n, 1667, false)
    expect(result.yOut).to.equal(4n)
    expect(result.fee).to.equal(1n)

    // K = 600, Y = 24, X = 25, X2 = 30
    // Y2 = K/30 = 24 - 20 = 4 - fee of 1 = 3
    result = swapInWithFee(25n, 24n, 5n, 1667, false)
    expect(result.yOut).to.equal(3n)
    expect(result.fee).to.equal(1n)
  })

  it('Swap out with fee', async () => {
    // K = 600, Y = 25, X = 24, X2 = 20
    // Y2 = K/20 = 30 - 25 = 5 - 1 = 4
    let result = swapOutWithFee(24n, 25n, 4n, 1667, false)
    expect(result.yIn).to.equal(4n)
    expect(result.fee).to.equal(1n)

    // K = 600, Y = 20, X = 30, X2 = 25
    // Y2 = K/25 = 24 - 20 = 4 - 1 = 3
    result = swapOutWithFee(30n, 20n, 5n, 1667, false)
    expect(result.yIn).to.equal(3n)
    expect(result.fee).to.equal(1n)
  })

  it('Overflow', async () => {
    expect(() => { swapIn(0xFFFFFFFFFFFFFFFFn, 0xFFFFFFFFFFFFFFFFn, 0xFFFFFFFFFFFFFFFFn) }).to.throw()
  })

  it('Real pool values', async () => {
    let buy = swapOutWithFee(1_000_000_000_000_000n, 6_000_000_000_000n, 20_000_000_000_000n, 100, false);
    let sell = swapInWithFee(980_000_000_000_000n, 6_000_000_000_000n + buy.yIn + buy.fee, 20_000_000_000_000n, 100, false);
    expect(buy.yIn).to.equal(sell.yOut)
  })
})