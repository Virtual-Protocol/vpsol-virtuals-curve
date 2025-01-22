#[cfg(feature = "anchor")]
use anchor_lang::error::{AnchorError, Error, ERROR_CODE_OFFSET};

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

use thiserror::Error;

#[derive(Debug, Error)]
pub enum CurveError {
    #[error("Curve Arithmetic Overflow")]
    ArithmeticOverflow,
    #[error("Asset Ratio Exceeded")]
    RatioExceeded,
    #[error("Invalid Supply")]
    InvalidSupply,
}