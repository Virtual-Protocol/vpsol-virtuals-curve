/* tslint:disable */
/* eslint-disable */
/**
 * K from XY
 * 
 * Our static invariant calculation
 */
export function k_from_xy(x: bigint, y: bigint): bigint;
/**
 * # Spot Price
 * 
 * Calculate spot price for a token in its opposing token
 */
export function spot_price_from_pair(x: bigint, y: bigint, precision: number): bigint;
export function calculate_fee(amount: bigint, fee: number): bigint;
export function sell_token_with_fee(token_balance: bigint, virtuals_balance: bigint, sell_amount: bigint, fee_bp: number): any;
export function buy_token_with_fee(token_balance: bigint, virtuals_balance: bigint, buy_amount: bigint, fee_bp: number): any;
export enum CurveError {
  ArithmeticOverflow = 0,
  RatioExceeded = 1,
  InvalidSupply = 2,
}
export class SwapResult {
  private constructor();
  free(): void;
  total: bigint;
  amount: bigint;
  fee: bigint;
}
