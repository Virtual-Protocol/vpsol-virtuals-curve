use thiserror::Error;

#[cfg(feature = "anchor")]
use anchor_lang::error::{AnchorError, Error, ERROR_CODE_OFFSET};

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;
#[cfg(target_arch = "wasm32")]
extern crate console_error_panic_hook;
#[cfg(target_arch = "wasm32")]
use std::panic;

#[derive(Debug)]
#[cfg_attr(
    target_arch = "wasm32",
    derive(serde::Serialize, serde::Deserialize),
    wasm_bindgen
)]
pub struct SwapInResult {
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(js_name = "yOut"))]
    pub y_out: u64,
    pub fee: u64,
}

#[derive(Debug)]
#[cfg_attr(
    target_arch = "wasm32",
    derive(serde::Serialize, serde::Deserialize),
    wasm_bindgen
)]
pub struct SwapOutResult {
    #[cfg_attr(target_arch = "wasm32", wasm_bindgen(js_name = "yIn"))]
    pub y_in: u64,
    pub fee: u64,
}

#[derive(Debug, Error)]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub enum CurveError {
    #[error("Curve Arithmetic Overflow")]
    ArithmeticOverflow,
    #[error("Invalid Supply")]
    InvalidSupply,
    #[error("Zero Amount")]
    ZeroAmount,
}

#[cfg(feature = "anchor")]
impl From<CurveError> for Error {
    fn from(value: CurveError) -> Error {
        Error::AnchorError(Box::new(AnchorError {
            error_name: value.to_string(),
            error_msg: value.to_string(),
            error_code_number: ERROR_CODE_OFFSET + 1000 + value as u32,
            error_origin: None,
            compared_values: None,
        }))
    }
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(start)]
fn init() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}

/// K from XY
///
/// Our static invariant calculation
#[inline]
pub fn k_from_xy_impl(x: u64, y: u64) -> Result<u128, CurveError> {
    if x == 0 || y == 0 {
        return Err(CurveError::ZeroAmount);
    }
    Ok((x as u128)
        .checked_mul(y as u128)
        .ok_or(CurveError::ArithmeticOverflow)?)
}

/// # Spot Price
///
/// Calculate spot price for a token in its opposing token
#[inline]
fn spot_price_impl(x: u64, y: u64, precision: u32) -> Result<u64, CurveError> {
    if x == 0 || y == 0 {
        return Err(CurveError::ZeroAmount);
    }
    Ok(u64::try_from(
        (x as u128)
            .checked_mul(
                10u128.pow(precision)
            )
            .ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(y as u128)
            .ok_or(CurveError::ArithmeticOverflow)?
    )
    .map_err(|_| CurveError::ArithmeticOverflow)?)
}

#[inline]
fn calculate_fee_impl(amount: u64, fee_bp: u16) -> u64 {
    let fee_bp = core::cmp::min(fee_bp, 100_00) as u128;
    // None of these values can overflow so this math is safe
    let fee: u64 = ((amount as u128) * fee_bp / 100_00) as u64;
    core::cmp::max(1, fee)
}

/// # Swap In
///
/// Swap amount of virtuals needed to buy tokens using constant product formula
#[inline]
fn swap_in_impl(x: u64, y: u64, x_in: u64) -> Result<u64, CurveError> {
    // Calculate constant k = x * y
    let k = k_from_xy_impl(x, y)?;

    // Calculate new x after input amount is added
    let new_x = x.checked_add(x_in).ok_or(CurveError::ArithmeticOverflow)?;

    // Calculate new y using k = xy formula
    // new_y = k / new_x
    let new_y = k
        .checked_div(new_x as u128)
        .ok_or(CurveError::ArithmeticOverflow)?;

    // Convert new_y to u64, checking for overflow
    let new_y: u64 = new_y
        .try_into()
        .map_err(|_| CurveError::ArithmeticOverflow)?;

    // Calculate output amount (y_out = y - new_y)
    let y_out = y.checked_sub(new_y).ok_or(CurveError::ArithmeticOverflow)?;

    Ok(y_out)
}

/// # Swap Out
///
/// Calculate input amount needed when swapping out x_out tokens
#[inline]
fn swap_out_impl(x: u64, y: u64, x_out: u64) -> Result<u64, CurveError> {
    // Calculate k = x * y first to maintain precision
    let k = k_from_xy_impl(x, y)?;

    // Calculate new_x = x - x_out
    let new_x = x.checked_sub(x_out).ok_or(CurveError::ArithmeticOverflow)?;

    // Calculate new_y = ceiling(k / new_x) to ensure sufficient input
    // We add (new_x - 1) to k before dividing to implement ceiling division
    // while maintaining consistent rounding direction
    let new_y = k
        .checked_add(new_x as u128 - 1)
        .ok_or(CurveError::ArithmeticOverflow)?
        .checked_div(new_x as u128)
        .ok_or(CurveError::ArithmeticOverflow)?;

    // Ensure new_y doesn't exceed u64::MAX
    let new_y: u64 = new_y
        .try_into()
        .map_err(|_| CurveError::ArithmeticOverflow)?;

    // Calculate y_in = new_y - y
    let y_in = new_y.checked_sub(y).ok_or(CurveError::ArithmeticOverflow)?;

    Ok(y_in)
}

/// # Swap In
///
/// Swap in amount of token X
#[inline]
fn swap_in_with_fee_impl(
    x: u64,
    y: u64,
    x_in: u64,
    fee_bp: u16,
    x_is_virtuals: bool,
) -> Result<SwapInResult, CurveError> {
    let (fee, y_out) = if x_is_virtuals {
        // Take fees before swap if X is virtuals
        let fee = calculate_fee_impl(x_in, fee_bp);
        let x_in_sub_fee = x_in.saturating_sub(fee);
        let y_out = swap_in_impl(x, y, x_in_sub_fee)?;
        (fee, y_out)
    } else {
        let y_out_pre_fee = swap_in_impl(x, y, x_in)?;
        // Otherwise, take fees after swap if X is virtuals
        let fee = calculate_fee_impl(y_out_pre_fee, fee_bp);
        let y_out = y_out_pre_fee.saturating_sub(fee);
        (fee, y_out)
    };

    Ok(SwapInResult { y_out, fee })
}

/// # Swap Out
///
/// Swap out amount of token X
#[inline]
fn swap_out_with_fee_impl(
    x: u64,
    y: u64,
    x_out: u64,
    fee_bp: u16,
    x_is_virtuals: bool,
) -> Result<SwapOutResult, CurveError> {
    let (y_in, fee) = if x_is_virtuals {
        // If X is virtuals, add fee first
        let fee = calculate_fee_impl(x_out, fee_bp);
        let x_out_plus_fee = x_out
            .checked_add(fee)
            .ok_or(CurveError::ArithmeticOverflow)?;
        let y_in = swap_out_impl(x, y, x_out_plus_fee)?;
        (y_in, fee)
    } else {
        // If X is not virtuals, add fee first
        let y_in_sub_fee = swap_out_impl(x, y, x_out)?;
        let fee = calculate_fee_impl(y_in_sub_fee, fee_bp);
        let y_in = y_in_sub_fee.saturating_sub(fee);
        (y_in, fee)
    };

    Ok(SwapOutResult { fee, y_in })
}

// Native interfaces
#[cfg(not(target_arch = "wasm32"))]
pub fn k_from_xy(x: u64, y: u64) -> Result<u128, CurveError> {
    k_from_xy_impl(x, y)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn calculate_fee(amount: u64, fee_bp: u16) -> u64 {
    calculate_fee_impl(amount, fee_bp)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn spot_price(x: u64, y: u64, precision: u32) -> Result<u64, CurveError> {
    spot_price_impl(x, y, precision)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn swap_in(x_balance: u64, y_balance: u64, x_in: u64) -> Result<u64, CurveError> {
    swap_in_impl(x_balance, y_balance, x_in)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn swap_in_with_fee(
    x_balance: u64,
    y_balance: u64,
    x_in: u64,
    fee_bp: u16,
    x_is_virtuals: bool,
) -> Result<SwapInResult, CurveError> {
    swap_in_with_fee_impl(x_balance, y_balance, x_in, fee_bp, x_is_virtuals)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn swap_out(x_balance: u64, y_balance: u64, x_out: u64) -> Result<u64, CurveError> {
    swap_out_impl(x_balance, y_balance, x_out)
}

#[cfg(not(target_arch = "wasm32"))]
pub fn swap_out_with_fee(
    x_balance: u64,
    y_balance: u64,
    x_out: u64,
    fee_bp: u16,
    x_is_virtuals: bool,
) -> Result<SwapOutResult, CurveError> {
    swap_out_with_fee_impl(x_balance, y_balance, x_out, fee_bp, x_is_virtuals)
}

// Wasm interfaces
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "kFromXY")]
pub fn k_from_xy(x: u64, y: u64) -> Result<js_sys::BigInt, JsError> {
    Ok(k_from_xy_impl(x, y)
        .map_err(|e| JsError::new(&e.to_string()))?
        .into())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "calculateFee")]
pub fn calculate_fee(
    amount: u64,
    #[wasm_bindgen(js_name = "feeBp")] fee_bp: u16,
) -> js_sys::BigInt {
    calculate_fee_impl(amount, fee_bp).into()
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "spotPrice")]
pub fn spot_price(
    #[wasm_bindgen(js_name = "xBalance")] x_balance: u64,
    #[wasm_bindgen(js_name = "yBalance")] y_balance: u64,
    precision: u32,
) -> Result<js_sys::BigInt, JsError> {
    Ok(spot_price_impl(x_balance, y_balance, precision)?.into())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "swapIn")]
pub fn swap_in(
    #[wasm_bindgen(js_name = "xBalance")] x_balance: u64,
    #[wasm_bindgen(js_name = "yBalance")] y_balance: u64,
    #[wasm_bindgen(js_name = "xIn")] x_in: u64,
) -> Result<js_sys::BigInt, JsError> {
    Ok(swap_in_impl(x_balance, y_balance, x_in)
        .map_err(|e| JsError::new(&e.to_string()))?
        .into())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "swapInWithFee")]
pub fn swap_in_with_fee(
    #[wasm_bindgen(js_name = "xBalance")] x_balance: u64,
    #[wasm_bindgen(js_name = "yBalance")] y_balance: u64,
    #[wasm_bindgen(js_name = "xIn")] x_in: u64,
    #[wasm_bindgen(js_name = "feeBp")] fee_bp: u16,
    #[wasm_bindgen(js_name = "xIsVirtuals")] x_is_virtuals: bool,
) -> Result<SwapInResult, JsError> {
    Ok(
        swap_in_with_fee_impl(x_balance, y_balance, x_in, fee_bp, x_is_virtuals)
            .map_err(|e| JsError::new(&e.to_string()))?
            .into(),
    )
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "swapOut")]
pub fn swap_out(
    #[wasm_bindgen(js_name = "xBalance")] x_balance: u64,
    #[wasm_bindgen(js_name = "yBalance")] y_balance: u64,
    #[wasm_bindgen(js_name = "xOut")] x_out: u64,
) -> Result<u64, JsError> {
    Ok(swap_out_impl(x_balance, y_balance, x_out)
        .map_err(|e| JsError::new(&e.to_string()))?
        .into())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "swapOutWithFee")]
pub fn swap_out_with_fee(
    #[wasm_bindgen(js_name = "xBalance")] x_balance: u64,
    #[wasm_bindgen(js_name = "yBalance")] y_balance: u64,
    #[wasm_bindgen(js_name = "xOut")] x_out: u64,
    #[wasm_bindgen(js_name = "feeBp")] fee_bp: u16,
    #[wasm_bindgen(js_name = "xIsVirtuals")] x_is_virtuals: bool,
) -> Result<SwapOutResult, JsError> {
    swap_out_with_fee_impl(x_balance, y_balance, x_out, fee_bp, x_is_virtuals)
        .map_err(|e| JsError::new(&e.to_string()))
}

#[cfg(test)]
mod tests {
    use crate::{
        k_from_xy, spot_price, swap_in, swap_in_with_fee, swap_out, swap_out_with_fee, SwapInResult, SwapOutResult
    };

    #[test]
    fn k_from_xy_test() {
        assert_eq!(k_from_xy(20, 30).unwrap(), 600)
    }

    #[test]
    fn spot_price_test() {
        assert_eq!(spot_price(30, 20, 6).unwrap(), 1500000)
    }

    #[test]
    fn swap_in_test() {
        // K = 600, Y = 30, X = 20, X2 = 24
        // Y2 = K/24 = 25 - 20 = 5
        let virtuals_amount = swap_in(20, 30, 4).unwrap();
        assert_eq!(virtuals_amount, 5);

        // K = 600, Y = 24, X = 25, X2 = 30
        // Y2 = K/25 = 24 - 20 = 4
        let virtuals_amount = swap_in(25, 24, 5).unwrap();
        assert_eq!(virtuals_amount, 4);
    }

    #[test]
    fn swap_out_test() {
        // K = 600, Y = 25, X = 24, X2 = 20
        // Y2 = K/20 = 30 - 25 = 5
        let virtuals_amount = swap_out(24, 25, 4).unwrap();
        assert_eq!(virtuals_amount, 5);

        // K = 600, Y = 20, X = 30, X2 = 25
        // Y2 = K/25 = 24 - 20 = 4
        let virtuals_amount = swap_out(30, 20, 5).unwrap();
        assert_eq!(virtuals_amount, 4);
    }

    #[test]
    fn swap_in_with_zero_fee_test() {
        // K = 600, Y = 30, X = 20, X2 = 24
        // Y2 = K/24 = 25 - 20 = 5 - fee of 1 = 4
        let SwapInResult { y_out, fee } = swap_in_with_fee(20, 30, 4, 0, false).unwrap();
        assert_eq!(y_out, 4);
        assert_eq!(fee, 1);
    }

    #[test]
    fn swap_in_with_fee_test() {
        // K = 600, Y = 30, X = 20, X2 = 24
        // Y2 = K/24 = 25 - 20 = 5 - fee of 1 = 4
        let SwapInResult { y_out, fee } = swap_in_with_fee(20, 30, 4, 1667, false).unwrap();
        assert_eq!(y_out, 4);
        assert_eq!(fee, 1);

        // K = 600, Y = 24, X = 25, X2 = 30
        // Y2 = K/30 = 24 - 20 = 4 - fee of 1 = 3
        let SwapInResult { y_out, fee } = swap_in_with_fee(25, 24, 5, 1667, false).unwrap();
        assert_eq!(y_out, 3);
        assert_eq!(fee, 1);
    }

    #[test]
    fn swap_out_with_fee_test() {
        // K = 600, Y = 25, X = 24, X2 = 20
        // Y2 = K/20 = 30 - 25 = 5 - 1 = 4
        let SwapOutResult { y_in, fee } = swap_out_with_fee(24, 25, 4, 1667, false).unwrap();
        assert_eq!(y_in, 4);
        assert_eq!(fee, 1);

        // K = 600, Y = 20, X = 30, X2 = 25
        // Y2 = K/25 = 24 - 20 = 4 - 1 = 3
        let SwapOutResult { y_in, fee } = swap_out_with_fee(30, 20, 5, 1667, false).unwrap();
        assert_eq!(y_in, 3);
        assert_eq!(fee, 1);
    }

    #[test]
    fn test_overflow() {
        assert!(swap_in(u64::MAX, u64::MAX, u64::MAX).is_err());
    }

    #[test]
    fn test_real_pool_values() {
        let buy = swap_out_with_fee(
            1_000_000_000_000_000,
            6_000_000_000_000,
            20_000_000_000_000,
            100,
            false,
        )
        .unwrap();
        let sell = swap_in_with_fee(
            980_000_000_000_000,
            6_000_000_000_000 + buy.y_in + buy.fee, // We must add the fee here to get the correct reverse result
            20_000_000_000_000,
            100,
            false,
        )
        .unwrap();

        assert_eq!(buy.y_in, sell.y_out);
    }
}
