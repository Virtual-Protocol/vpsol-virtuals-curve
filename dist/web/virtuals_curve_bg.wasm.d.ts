/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export const __wbg_swapresult_free: (a: number, b: number) => void;
export const __wbg_get_swapresult_total: (a: number) => bigint;
export const __wbg_set_swapresult_total: (a: number, b: bigint) => void;
export const __wbg_get_swapresult_amount: (a: number) => bigint;
export const __wbg_set_swapresult_amount: (a: number, b: bigint) => void;
export const __wbg_get_swapresult_fee: (a: number) => bigint;
export const __wbg_set_swapresult_fee: (a: number, b: bigint) => void;
export const k_from_xy: (a: bigint, b: bigint) => [bigint, bigint, number, number];
export const spot_price_from_pair: (a: bigint, b: bigint, c: number) => [bigint, number, number];
export const calculate_fee: (a: bigint, b: number) => [bigint, number, number];
export const sell_token_with_fee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
export const buy_token_with_fee: (a: bigint, b: bigint, c: bigint, d: number) => [number, number, number];
export const __wbindgen_malloc: (a: number, b: number) => number;
export const __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
export const __wbindgen_export_2: WebAssembly.Table;
export const __externref_table_dealloc: (a: number) => void;
export const __wbindgen_start: () => void;
