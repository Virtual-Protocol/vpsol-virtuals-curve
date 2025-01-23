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

#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn calculate_fee(amount: u64, fee: u16) -> Result<u64> {
    let fee: u64 = (amount as u128)
        .checked_mul(fee as u128).ok_or(CurveError::ArithmeticOverflow)?
        .saturating_div(10_000u128)
        .try_into()
        .map_err(|_| CurveError::ArithmeticOverflow)?;
    Ok(fee)
}

// Calculate the withdraw amount of X from swapping in Y minus a fee
// ΔX = X₁ - X₂
//
// For a buy, we take the fee out of the virtuals amount in before performing the invariant conversion.
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn buy_token_with_fee(token_balance: u64, virtuals_balance: u64, virtuals_amount_in: u64, fee: u16) -> Result<SwapResult> {
    // The fee, payable in VIRTUALS, calculated from virtuals amount in
    let fee = calculate_fee(virtuals_amount_in, fee)?;

    // Amount in minus the fee
    let amount_in_minus_fee = virtuals_amount_in.saturating_sub(fee);

    // Then we calculate the fee ΔX from making our swap
    let amount_out = delta_x_from_y_swap_amount(token_balance,virtuals_balance, amount_in_minus_fee)?;
    Ok(SwapResult { amount_out, fee })
}

// Calculate difference in Y from swapping in X
// ΔY = Y₁ - Y₂ 
//
// For a sell, we first perform the invariant conversion, then take the fee out of the result virtuals amount.
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn sell_token_with_fee(token_balance: u64, virtuals_balance: u64, token_amount_in: u64, fee: u16) -> Result<SwapResult> {
    // The amount of VIRTUALS tokens for the amount of TOKEN sold
    let virtuals_amount_out = delta_x_from_y_swap_amount(virtuals_balance,token_balance, token_amount_in)?;
    
    // The fee, payable in VIRTUALS, calculated from virtuals amount out
    let fee = calculate_fee(virtuals_amount_out, fee)?;
    
    // The fee, payable in VIRTUALS, deducted from amount out
    let amount_out = virtuals_amount_out.saturating_sub(fee);
    
    Ok(SwapResult {
        amount_out,
        fee,
    })
}

#[cfg(test)]
mod tests {
    use crate::{buy_token_with_fee, sell_token_with_fee, SwapResult};
    #[test]
    fn swap() {
        let SwapResult { amount_out, fee } = buy_token_with_fee(30, 20, 5, 0).unwrap();
        assert_eq!(amount_out, 6);
        assert_eq!(fee, 0);
        let SwapResult { amount_out, fee } = buy_token_with_fee(24, 25, 5, 0).unwrap();
        assert_eq!(amount_out, 4);
        assert_eq!(fee, 0);
    }

    #[test]
    fn swap_with_fee() {
        let SwapResult { amount_out, fee } = sell_token_with_fee(20, 30, 5, 1667).unwrap();
        assert_eq!(amount_out, 5);
        assert_eq!(fee, 1);
        let SwapResult { amount_out, fee } = sell_token_with_fee(20, 30, 5, 1666).unwrap();
        assert_eq!(amount_out, 6);
        assert_eq!(fee, 0);
    }
}