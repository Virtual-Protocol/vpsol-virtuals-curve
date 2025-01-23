/* tslint:disable */
/* eslint-disable */
export function k_from_xy(x: bigint, y: bigint): bigint;
export function spot_price_from_pair(x: bigint, y: bigint, precision: number): bigint;
export function x2_from_y_swap_amount(x: bigint, y: bigint, a: bigint): bigint;
export function delta_x_from_y_swap_amount(x: bigint, y: bigint, a: bigint): bigint;
export function delta_y_from_x_swap_amount(x: bigint, y: bigint, a: bigint): bigint;
export function calculate_fee(amount: bigint, fee: number): bigint;
export function buy_token_with_fee(token_balance: bigint, virtuals_balance: bigint, virtuals_amount_in: bigint, fee: number): SwapResult;
export function sell_token_with_fee(token_balance: bigint, virtuals_balance: bigint, token_amount_in: bigint, fee: number): SwapResult;
export class SwapResult {
  private constructor();
  free(): void;
  amount_out: bigint;
  fee: bigint;
}
