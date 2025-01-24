use thiserror::Error;

#[cfg(feature = "anchor")]
use anchor_lang::error::{AnchorError, Error, ERROR_CODE_OFFSET};

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;
#[cfg(target_arch = "wasm32")]
extern crate console_error_panic_hook;
#[cfg(target_arch = "wasm32")]
use std::panic;

#[cfg(target_arch = "wasm32")]
pub type Result<T> = std::result::Result<T, JsError>;

#[cfg(not(target_arch = "wasm32"))]
pub type Result<T> = std::result::Result<T, CurveError>;

#[derive(Debug)]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen, derive(serde::Serialize, serde::Deserialize))]
pub struct SwapResult {
    pub total: u64,
    pub amount: u64,
    pub fee: u64
}

#[derive(Debug, Error)]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub enum CurveError {
    #[error("Curve Arithmetic Overflow")]
    ArithmeticOverflow,
    #[error("Asset Ratio Exceeded")]
    RatioExceeded,
    #[error("Invalid Supply")]
    InvalidSupply,
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
fn init() {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}

/// K from XY
/// 
/// Our static invariant calculation
#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen)]
pub fn k_from_xy(x: u64, y: u64) -> Result<u128> {
    assert_ne!(x, 0);
    assert_ne!(y, 0);
    Ok((x as u128).checked_mul(y as u128).ok_or(CurveError::ArithmeticOverflow)?)
}

/// # Spot Price
/// 
/// Calculate spot price for a token in its opposing token
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

/// # Buy Token
/// 
/// Calculate amount of virtuals needed to buy tokens using constant product formula
#[inline]
pub fn buy_token(token_balance: u64, virtuals_balance: u64, buy_amount: u64) -> Result<u64> {
    // 1. We start from K = XY (Constant = Token x Virtuals)
    let k = k_from_xy(token_balance, virtuals_balance)?;
    // 2. We calculate the new balance of X (Tokens)
    let new_token_balance = token_balance.checked_sub(buy_amount).ok_or(CurveError::ArithmeticOverflow)? as u128;
    // 3. We calculate the new balance of Y (Virtuals)
    let new_virtuals_balance: u64 = k.checked_div(new_token_balance).ok_or(CurveError::ArithmeticOverflow)?.try_into().map_err(|_| CurveError::ArithmeticOverflow)?;
    // 4. Return our amount by subtracting new_virtuals_balance from old.
    new_virtuals_balance.checked_sub(virtuals_balance).ok_or(CurveError::ArithmeticOverflow.into())
}

/// # Sell Token
/// 
/// Calculate amount of virtuals received when selling tokens using constant product formula
#[inline]
pub fn sell_token(token_balance: u64, virtuals_balance: u64, sell_amount: u64) -> Result<u64> {
    // 1. We start from K = XY (Constant = Token x Virtuals)
    let k = k_from_xy(token_balance, virtuals_balance)?;
    // 2. We calculate the new balance of X (Tokens)
    let new_token_balance = token_balance.checked_add(sell_amount).ok_or(CurveError::ArithmeticOverflow)? as u128;
    // 3. We calculate the new balance of Y (Virtuals)
    let new_virtuals_balance: u64 = k.checked_div(new_token_balance)
        .ok_or(CurveError::ArithmeticOverflow)?
        .try_into()
        .map_err(|_| CurveError::ArithmeticOverflow)?;
    // 4. Return our amount by subtracting new_virtuals_balance from old.
    virtuals_balance.checked_sub(new_virtuals_balance).ok_or(CurveError::ArithmeticOverflow.into())
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

/// # Buy Token With Fee
/// 
/// Calculate the amount, fee and total in virtuals a user must pay to buy a certain amount of tokens
#[inline]
pub fn buy_token_with_fee_impl(token_balance: u64, virtuals_balance: u64, buy_amount: u64, fee_bp: u16) -> Result<SwapResult> {
    let amount = buy_token(token_balance, virtuals_balance, buy_amount)?;
    let fee = calculate_fee(amount, fee_bp)?;
    let total = amount.checked_add(fee).ok_or(CurveError::ArithmeticOverflow)?;
    Ok(SwapResult { amount, fee, total })
}

/// # Sell Token With Fee
/// 
/// Calculate the amount, fee and total in virtuals a user will receive for selling a certain amount of tokens
#[inline]
pub fn sell_token_with_fee_impl(token_balance: u64, virtuals_balance: u64, sell_amount: u64, fee_bp: u16) -> Result<SwapResult> {
    let total = sell_token(token_balance, virtuals_balance, sell_amount)?;
    let fee = calculate_fee(total, fee_bp)?;
    let amount = total.checked_sub(fee).ok_or(CurveError::ArithmeticOverflow)?;
    Ok(SwapResult { amount, fee, total })
}

#[cfg(target_arch="wasm32")]
#[wasm_bindgen]
pub fn sell_token_with_fee(token_balance: u64, virtuals_balance: u64, sell_amount: u64, fee_bp: u16) -> Result<JsValue> {
    Ok(serde_wasm_bindgen::to_value(&sell_token_with_fee_impl(token_balance, virtuals_balance, sell_amount, fee_bp)?)?)
}

#[cfg(not(target_arch="wasm32"))]
pub fn sell_token_with_fee(token_balance: u64, virtuals_balance: u64, sell_amount: u64, fee_bp: u16) -> Result<SwapResult> {
    sell_token_with_fee_impl(token_balance, virtuals_balance, sell_amount, fee_bp)
}

#[cfg(target_arch="wasm32")]
#[wasm_bindgen]
pub fn buy_token_with_fee(token_balance: u64, virtuals_balance: u64, buy_amount: u64, fee_bp: u16) -> Result<JsValue> {
    Ok(serde_wasm_bindgen::to_value(&buy_token_with_fee_impl(token_balance, virtuals_balance, buy_amount, fee_bp)?)?)
}

#[cfg(not(target_arch="wasm32"))]
pub fn buy_token_with_fee(token_balance: u64, virtuals_balance: u64, buy_amount: u64, fee_bp: u16) -> Result<SwapResult> {
    buy_token_with_fee_impl(token_balance, virtuals_balance, buy_amount, fee_bp)
}


#[cfg(test)]
mod tests {
   use super::*;

   #[test]
   fn test_base_swaps() {
       assert_eq!(buy_token_with_fee(30, 20, 5, 0).unwrap().total, 6);
    //    assert_eq!(buy_token(25, 24, 5).unwrap(), 4);
    //    assert_eq!(sell_token(20, 30, 5).unwrap(), 6);
   }

   #[cfg(test)]
mod tests {
    use crate::{buy_token_with_fee, sell_token_with_fee, SwapResult};
    #[test]
    fn swap() {
        // Execute a buy
        // K = XY,
        // 600 = 30/20
        // X2 = 25
        // Y2 = 600/25 = 24
        // Y2 - Y = 4
        let SwapResult { amount, ..} = buy_token_with_fee(30, 20, 5, 0).unwrap();
        assert_eq!(amount, 4);
        // Execute the reverse sell
        // K = XY,
        // 600 = 25/24
        // X2 = 30
        // Y2 = 600/30 = 20
        // Y2 - Y = 4
        let SwapResult { amount, ..} = sell_token_with_fee(25, 24, 5, 0).unwrap();
        assert_eq!(amount, 4);
    }

    #[test]
    fn swap_with_fee() {
        // Execute a sell
        // K = XY,
        // 600 = 20/30
        // X2 = 25
        // Y2 = 600/25 = 24
        // Y - Y2 = 6
        // 6 * 1667 / 10000 = 1
        let SwapResult { amount, fee, .. } = sell_token_with_fee(20, 30, 5, 1667).unwrap();
        assert_eq!(amount, 5);
        assert_eq!(fee, 1);
        // Execute a sell
        // K = XY,
        // 600 = 20/30
        // X2 = 25
        // Y2 = 600/25 = 24
        // Y - Y2 = 6
        // 6 * 1666 / 10000 = 0
        let SwapResult { amount, fee, .. } = sell_token_with_fee(20, 30, 5, 1666).unwrap();
        assert_eq!(amount, 6);
        assert_eq!(fee, 0);
    }
}

   #[test]
   fn test_overflow() {
       assert!(buy_token(u64::MAX, u64::MAX, u64::MAX).is_err());
   }
}