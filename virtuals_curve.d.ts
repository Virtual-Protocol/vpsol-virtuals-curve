/* tslint:disable */
/* eslint-disable */
/**
*/
export enum LiquidityPair {
  X = 0,
  Y = 1,
}
/**
*/
export enum CurveError {
  InvalidPrecision = 0,
  Overflow = 1,
  Underflow = 2,
  InvalidFeeAmount = 3,
  InsufficientBalance = 4,
  ZeroBalance = 5,
  SlippageLimitExceeded = 6,
}
/**
*/
export class ConstantProduct {
  free(): void;
/**
* @param {bigint} x
* @param {bigint} y
* @param {number} fee
* @param {number | undefined} precision
*/
  constructor(x: bigint, y: bigint, fee: number, precision?: number);
/**
* @param {bigint} x
* @param {bigint} y
* @returns {any}
*/
  static k_from_xy(x: bigint, y: bigint): any;
/**
* @param {bigint} x
* @param {bigint} y
* @param {number} precision
* @returns {SpotPrice}
*/
  static spot_price_from_pair(x: bigint, y: bigint, precision: number): SpotPrice;
/**
* @param {bigint} x
* @param {bigint} y
* @param {bigint} a
* @returns {any}
*/
  static x2_from_y_swap_amount(x: bigint, y: bigint, a: bigint): any;
/**
* @param {bigint} x
* @param {bigint} y
* @param {bigint} a
* @returns {any}
*/
  static y2_from_x_swap_amount(x: bigint, y: bigint, a: bigint): any;
/**
* @param {bigint} x
* @param {bigint} y
* @param {bigint} a
* @returns {any}
*/
  static delta_x_from_y_swap_amount(x: bigint, y: bigint, a: bigint): any;
/**
* @param {bigint} x
* @param {bigint} y
* @param {bigint} a
* @returns {any}
*/
  static delta_y_from_x_swap_amount(x: bigint, y: bigint, a: bigint): any;
/**
* @returns {any}
*/
  k(): any;
/**
* @returns {SpotPrice}
*/
  spot_price_x(): SpotPrice;
/**
* @returns {SpotPrice}
*/
  spot_price_y(): SpotPrice;
/**
* @param {number} p
* @param {bigint} a
* @returns {SwapResult}
*/
  swap_unsafe(p: number, a: bigint): SwapResult;
/**
* @param {number} p
* @param {bigint} a
* @param {bigint} min
* @returns {SwapResult}
*/
  swap(p: number, a: bigint, min: bigint): SwapResult;
}
/**
*/
export class SpotPrice {
  free(): void;
/**
* @returns {any}
*/
  to_bigint(): bigint;
/**
*/
  lower: bigint;
/**
*/
  precision: number;
/**
*/
  upper: bigint;
}
/**
*/
export class SwapResult {
  free(): void;
/**
*/
  deposit: bigint;
/**
*/
  fee: bigint;
/**
*/
  withdraw: bigint;
}
/**
*/
export class XYAmounts {
  free(): void;
/**
*/
  x: bigint;
/**
*/
  y: bigint;
}
