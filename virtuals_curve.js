
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder } = require(`util`);

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_0.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * @param {bigint} x
 * @param {bigint} y
 * @returns {bigint}
 */
module.exports.k_from_xy = function(x, y) {
    const ret = wasm.k_from_xy(x, y);
    if (ret[3]) {
        throw takeFromExternrefTable0(ret[2]);
    }
    return (BigInt.asUintN(64, ret[0]) | (BigInt.asUintN(64, ret[1]) << BigInt(64)));
};

/**
 * @param {bigint} x
 * @param {bigint} y
 * @param {number} precision
 * @returns {bigint}
 */
module.exports.spot_price_from_pair = function(x, y, precision) {
    const ret = wasm.spot_price_from_pair(x, y, precision);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
};

/**
 * @param {bigint} x
 * @param {bigint} y
 * @param {bigint} a
 * @returns {bigint}
 */
module.exports.x2_from_y_swap_amount = function(x, y, a) {
    const ret = wasm.x2_from_y_swap_amount(x, y, a);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
};

/**
 * @param {bigint} x
 * @param {bigint} y
 * @param {bigint} a
 * @returns {bigint}
 */
module.exports.delta_x_from_y_swap_amount = function(x, y, a) {
    const ret = wasm.delta_x_from_y_swap_amount(x, y, a);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
};

/**
 * @param {bigint} x
 * @param {bigint} y
 * @param {bigint} a
 * @returns {bigint}
 */
module.exports.delta_y_from_x_swap_amount = function(x, y, a) {
    const ret = wasm.delta_y_from_x_swap_amount(x, y, a);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
};

/**
 * @param {bigint} amount
 * @param {number} fee
 * @returns {bigint}
 */
module.exports.calculate_fee = function(amount, fee) {
    const ret = wasm.calculate_fee(amount, fee);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
};

/**
 * @param {bigint} token_balance
 * @param {bigint} virtuals_balance
 * @param {bigint} virtuals_amount_in
 * @param {number} fee
 * @returns {SwapResult}
 */
module.exports.buy_token_with_fee = function(token_balance, virtuals_balance, virtuals_amount_in, fee) {
    const ret = wasm.buy_token_with_fee(token_balance, virtuals_balance, virtuals_amount_in, fee);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return SwapResult.__wrap(ret[0]);
};

/**
 * @param {bigint} token_balance
 * @param {bigint} virtuals_balance
 * @param {bigint} token_amount_in
 * @param {number} fee
 * @returns {SwapResult}
 */
module.exports.sell_token_with_fee = function(token_balance, virtuals_balance, token_amount_in, fee) {
    const ret = wasm.sell_token_with_fee(token_balance, virtuals_balance, token_amount_in, fee);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return SwapResult.__wrap(ret[0]);
};

const SwapResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_swapresult_free(ptr >>> 0, 1));

class SwapResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SwapResult.prototype);
        obj.__wbg_ptr = ptr;
        SwapResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SwapResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_swapresult_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get amount_out() {
        const ret = wasm.__wbg_get_swapresult_amount_out(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set amount_out(arg0) {
        wasm.__wbg_set_swapresult_amount_out(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get fee() {
        const ret = wasm.__wbg_get_swapresult_fee(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set fee(arg0) {
        wasm.__wbg_set_swapresult_fee(this.__wbg_ptr, arg0);
    }
}
module.exports.SwapResult = SwapResult;

module.exports.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

module.exports.__wbindgen_init_externref_table = function() {
    const table = wasm.__wbindgen_export_0;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

const path = require('path').join(__dirname, 'virtuals_curve_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

wasm.__wbindgen_start();

