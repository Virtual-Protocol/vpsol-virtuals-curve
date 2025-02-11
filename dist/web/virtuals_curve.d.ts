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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_swapinresult_free: (a: number, b: number) => void;
  readonly __wbg_get_swapinresult_yOut: (a: number) => bigint;
  readonly __wbg_set_swapinresult_yOut: (a: number, b: bigint) => void;
  readonly __wbg_get_swapinresult_fee: (a: number) => bigint;
  readonly __wbg_set_swapinresult_fee: (a: number, b: bigint) => void;
  readonly __wbg_swapoutresult_free: (a: number, b: number) => void;
  readonly init: () => void;
  readonly kFromXY: (a: bigint, b: bigint) => [number, number, number];
  readonly calculateFee: (a: bigint, b: number) => any;
  readonly spotPrice: (a: bigint, b: bigint, c: number) => [number, number, number];
  readonly swapIn: (a: bigint, b: bigint, c: bigint) => [number, number, number];
  readonly swapInWithFee: (a: bigint, b: bigint, c: bigint, d: number, e: number) => [number, number, number];
  readonly swapOut: (a: bigint, b: bigint, c: bigint) => [bigint, number, number];
  readonly swapOutWithFee: (a: bigint, b: bigint, c: bigint, d: number, e: number) => [number, number, number];
  readonly __wbg_get_swapoutresult_yIn: (a: number) => bigint;
  readonly __wbg_get_swapoutresult_fee: (a: number) => bigint;
  readonly __wbg_set_swapoutresult_yIn: (a: number, b: bigint) => void;
  readonly __wbg_set_swapoutresult_fee: (a: number, b: bigint) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
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
