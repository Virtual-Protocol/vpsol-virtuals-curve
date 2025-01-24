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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_swapresult_free: (a: number, b: number) => void;
  readonly __wbg_get_swapresult_total: (a: number) => bigint;
  readonly __wbg_set_swapresult_total: (a: number, b: bigint) => void;
  readonly __wbg_get_swapresult_amount: (a: number) => bigint;
  readonly __wbg_set_swapresult_amount: (a: number, b: bigint) => void;
  readonly __wbg_get_swapresult_fee: (a: number) => bigint;
  readonly __wbg_set_swapresult_fee: (a: number, b: bigint) => void;
  readonly k_from_xy: (a: bigint, b: bigint) => [bigint, bigint, number, number];
  readonly spot_price_from_pair: (a: bigint, b: bigint, c: number) => [bigint, number, number];
  readonly calculate_fee: (a: bigint, b: number) => [bigint, number, number];
  readonly sell_token_with_fee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
  readonly buy_token_with_fee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
