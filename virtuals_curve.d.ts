/* tslint:disable */
/* eslint-disable */
export function k_from_xy(x: bigint, y: bigint): bigint;
export function spot_price_from_pair(x: bigint, y: bigint, precision: number): bigint;
export function x2_from_y_swap_amount(x: bigint, y: bigint, a: bigint): bigint;
export function y2_from_x_swap_amount(x: bigint, y: bigint, a: bigint): bigint;
export function delta_x_from_y_swap_amount(x: bigint, y: bigint, a: bigint): bigint;
export function delta_y_from_x_swap_amount(x: bigint, y: bigint, a: bigint): bigint;
export function delta_x_from_y_swap_amount_with_fee(x: bigint, y: bigint, a: bigint, fee: number): SwapResult;
export function delta_y_from_x_swap_amount_with_fee(x: bigint, y: bigint, a: bigint, fee: number): SwapResult;
export class SwapResult {
  private constructor();
  free(): void;
  amount_out: bigint;
  fee: bigint;
}
