#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

#[cfg(target_arch = "wasm32")]
pub type Result<T> = anyhow::Result<T, JsError>;

#[cfg(not(target_arch = "wasm32"))]
pub type Result<T> = anyhow::Result<T, CurveError>;

pub mod errors;
use errors::*;

#[derive(Debug)]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub struct SwapResult {
    pub amount_out: u64,
    pub fee: u64
}

// Static Invariant calculationy
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn k_from_xy(x: u64, y: u64) -> Result<u128> {
    assert_ne!(x, 0);
    assert_ne!(y, 0);
    Ok((x as u128).checked_mul(y as u128).ok_or(CurveError::ArithmeticOverflow)?)
}

// Get spot price for a token in its opposing token
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn spot_price_from_pair(x: u64, y: u64, precision: u32) -> Result<u64> {
    assert_ne!(x, 0);
    assert_ne!(y, 0);
    Ok(
        u64::try_from(
            (x as u128)
            .checked_mul(precision as u128).ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(y as u128).ok_or(CurveError::ArithmeticOverflow)?
            .checked_div(precision as u128).ok_or(CurveError::ArithmeticOverflow)?
        ).map_err(|_| CurveError::ArithmeticOverflow)?
    )
}

// Calculate new value of X after depositing Y
// When we swap amount A of Y for X, we must calculate the new balance of X from invariant K
// Y₂ = Y₁ + Amount
// X₂ = K / Y₂
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn x2_from_y_swap_amount(x: u64, y: u64, a: u64) -> Result<u64> {
    let k = k_from_xy(x, y)?;
    let x_new = (y as u128).checked_add(a as u128).ok_or(CurveError::ArithmeticOverflow)?;
    Ok(k.checked_div(x_new).ok_or(CurveError::ArithmeticOverflow)? as u64)
}

// Calculate new value of Y₂ after depositing X
// When we swap amount A of X for Y, we must calculate the new balance of Y from invariant K
// X₂ = X₁ + Amount
// Y₂ = K / X₂
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn y2_from_x_swap_amount(x: u64, y: u64, a: u64) -> Result<u64> {
    x2_from_y_swap_amount(y,x,a)
}

// Calculate the withdraw amount of X from swapping in Y
// ΔX = X₁ - X₂
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn delta_x_from_y_swap_amount(x: u64, y: u64, a: u64) -> Result<u64> {
    Ok(x.checked_sub(x2_from_y_swap_amount(x,y,a)?).ok_or(CurveError::ArithmeticOverflow)?)
}

// Calculate difference in Y from swapping in X
// ΔY = Y₁ - Y₂ 
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn delta_y_from_x_swap_amount(x: u64, y: u64, a: u64) -> Result<u64> {
    delta_x_from_y_swap_amount(y,x,a)
}

// Calculate the withdraw amount of X from swapping in Y
// ΔX = X₁ - X₂
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn delta_x_from_y_swap_amount_with_fee(x: u64, y: u64, a: u64, fee: u16) -> Result<SwapResult> {
    let raw_amount = x.checked_sub(x2_from_y_swap_amount(x,y,a)?).ok_or(CurveError::ArithmeticOverflow)?;
    let amount = raw_amount.checked_mul((10_000 - fee).into()).ok_or(CurveError::ArithmeticOverflow)?.saturating_div(10_000);
    Ok(SwapResult { amount_out: raw_amount, fee: raw_amount - amount })
}

// Calculate difference in Y from swapping in X
// ΔY = Y₁ - Y₂ 
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn delta_y_from_x_swap_amount_with_fee(x: u64, y: u64, a: u64, fee: u16) -> Result<SwapResult> {
    delta_x_from_y_swap_amount_with_fee(y,x,a, fee)
}

#[cfg(test)]
mod tests {
    use crate::{delta_y_from_x_swap_amount_with_fee, SwapResult};
    #[test]
    fn swap() {
        let SwapResult { amount_out, fee } = delta_y_from_x_swap_amount_with_fee(20, 30, 5, 0).unwrap();
        assert_eq!(amount_out, 6);
        assert_eq!(fee, 0);
        let SwapResult { amount_out, fee } = delta_y_from_x_swap_amount_with_fee(25, 24, 5, 0).unwrap();
        assert_eq!(amount_out, 4);
        assert_eq!(fee, 0);
    }

    #[test]
    fn swap_with_fee() {
        let SwapResult { amount_out, fee } = delta_y_from_x_swap_amount_with_fee(20, 30, 5, 100).unwrap();
        assert_eq!(amount_out, 5);
        assert_eq!(fee, 1);
    }
}