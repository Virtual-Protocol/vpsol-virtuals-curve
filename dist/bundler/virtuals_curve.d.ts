/* tslint:disable */
/* eslint-disable */
export function init(): void;
export function kFromXY(x: bigint, y: bigint): bigint;
export function calculateFee(amount: bigint, feeBp: number): bigint;
export function spotPrice(xBalance: bigint, yBalance: bigint, precision: number): bigint;
export function swapIn(xBalance: bigint, yBalance: bigint, xIn: bigint): bigint;
export function swapInWithFee(xBalance: bigint, yBalance: bigint, xIn: bigint, feeBp: number, xIsVirtuals: boolean): SwapInResult;
export function swapOut(xBalance: bigint, yBalance: bigint, xOut: bigint): bigint;
export function swapOutWithFee(xBalance: bigint, yBalance: bigint, xOut: bigint, feeBp: number, xIsVirtuals: boolean): SwapOutResult;
export enum CurveError {
  ArithmeticOverflow = 0,
  InvalidSupply = 1,
  ZeroAmount = 2,
}
export class SwapInResult {
  private constructor();
  free(): void;
  yOut: bigint;
  fee: bigint;
}
export class SwapOutResult {
  private constructor();
  free(): void;
  yIn: bigint;
  fee: bigint;
}
