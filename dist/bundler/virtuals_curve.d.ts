/* tslint:disable */
/* eslint-disable */
export function init(): void;
export function kFromXY(x: bigint, y: bigint): bigint;
export function calculateFee(amount: bigint, fee: number): bigint;
export function spotPrice(x: bigint, y: bigint, precision: number): bigint;
export function buyToken(token_balance: bigint, virtuals_balance: bigint, buy_amount: bigint): bigint;
export function sellToken(token_balance: bigint, virtuals_balance: bigint, sell_amount: bigint): bigint;
export function buyTokenWithFee(token_balance: bigint, virtuals_balance: bigint, buy_amount: bigint, fee: number): SwapResult;
export function sellTokenWithFee(token_balance: bigint, virtuals_balance: bigint, sell_amount: bigint, fee: number): SwapResult;
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
