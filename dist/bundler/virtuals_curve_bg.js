let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

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

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

export function init() {
    wasm.init();
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_3.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
/**
 * @param {bigint} x
 * @param {bigint} y
 * @returns {bigint}
 */
export function kFromXY(x, y) {
    const ret = wasm.kFromXY(x, y);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} amount
 * @param {number} feeBp
 * @returns {bigint}
 */
export function calculateFee(amount, feeBp) {
    const ret = wasm.calculateFee(amount, feeBp);
    return ret;
}

/**
 * @param {bigint} xBalance
 * @param {bigint} yBalance
 * @param {number} precision
 * @returns {bigint}
 */
export function spotPrice(xBalance, yBalance, precision) {
    const ret = wasm.spotPrice(xBalance, yBalance, precision);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} xBalance
 * @param {bigint} yBalance
 * @param {bigint} xIn
 * @returns {bigint}
 */
export function swapIn(xBalance, yBalance, xIn) {
    const ret = wasm.swapIn(xBalance, yBalance, xIn);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * @param {bigint} xBalance
 * @param {bigint} yBalance
 * @param {bigint} xIn
 * @param {number} feeBp
 * @param {boolean} xIsVirtuals
 * @returns {SwapInResult}
 */
export function swapInWithFee(xBalance, yBalance, xIn, feeBp, xIsVirtuals) {
    const ret = wasm.swapInWithFee(xBalance, yBalance, xIn, feeBp, xIsVirtuals);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return SwapInResult.__wrap(ret[0]);
}

/**
 * @param {bigint} xBalance
 * @param {bigint} yBalance
 * @param {bigint} xOut
 * @returns {bigint}
 */
export function swapOut(xBalance, yBalance, xOut) {
    const ret = wasm.swapOut(xBalance, yBalance, xOut);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return BigInt.asUintN(64, ret[0]);
}

/**
 * @param {bigint} xBalance
 * @param {bigint} yBalance
 * @param {bigint} xOut
 * @param {number} feeBp
 * @param {boolean} xIsVirtuals
 * @returns {SwapOutResult}
 */
export function swapOutWithFee(xBalance, yBalance, xOut, feeBp, xIsVirtuals) {
    const ret = wasm.swapOutWithFee(xBalance, yBalance, xOut, feeBp, xIsVirtuals);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return SwapOutResult.__wrap(ret[0]);
}

/**
 * @enum {0 | 1 | 2}
 */
export const CurveError = Object.freeze({
    ArithmeticOverflow: 0, "0": "ArithmeticOverflow",
    InvalidSupply: 1, "1": "InvalidSupply",
    ZeroAmount: 2, "2": "ZeroAmount",
});

const SwapInResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_swapinresult_free(ptr >>> 0, 1));

export class SwapInResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SwapInResult.prototype);
        obj.__wbg_ptr = ptr;
        SwapInResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SwapInResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_swapinresult_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get yOut() {
        const ret = wasm.__wbg_get_swapinresult_yOut(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set yOut(arg0) {
        wasm.__wbg_set_swapinresult_yOut(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get fee() {
        const ret = wasm.__wbg_get_swapinresult_fee(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set fee(arg0) {
        wasm.__wbg_set_swapinresult_fee(this.__wbg_ptr, arg0);
    }
}

const SwapOutResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_swapoutresult_free(ptr >>> 0, 1));

export class SwapOutResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SwapOutResult.prototype);
        obj.__wbg_ptr = ptr;
        SwapOutResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SwapOutResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_swapoutresult_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get yIn() {
        const ret = wasm.__wbg_get_swapinresult_yOut(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set yIn(arg0) {
        wasm.__wbg_set_swapinresult_yOut(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get fee() {
        const ret = wasm.__wbg_get_swapinresult_fee(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {bigint} arg0
     */
    set fee(arg0) {
        wasm.__wbg_set_swapinresult_fee(this.__wbg_ptr, arg0);
    }
}

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
};

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_bigint_from_u128(arg0, arg1) {
    const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
    return ret;
};

export function __wbindgen_bigint_from_u64(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return ret;
};

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_3;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

