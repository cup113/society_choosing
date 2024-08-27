export enum CodeType {
    UnknownError = "UNKNOWN",
    InternalError = "INTERNAL_ERROR",
    Unauthorized = "UNAUTHORIZED",
    AuthFailed = "AUTH_FAILED",
}

export function to_status(code: CodeType) {
    return {
        [CodeType.UnknownError]: 500,
        [CodeType.InternalError]: 500,
        [CodeType.Unauthorized]: 401,
        [CodeType.AuthFailed]: 401,
    }[code];
}
