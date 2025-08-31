export enum CodeType {
    UnknownError = "UNKNOWN",
    InternalError = "INTERNAL_ERROR",
    Forbidden = "FORBIDDEN",
    Unauthorized = "UNAUTHORIZED",
    AuthFailed = "AUTH_FAILED",
    BadRequest = "BAD_REQUEST",
}

export function to_status(code: CodeType) {
    return {
        [CodeType.UnknownError]: 500,
        [CodeType.InternalError]: 500,
        [CodeType.Forbidden]: 403,
        [CodeType.Unauthorized]: 401,
        [CodeType.AuthFailed]: 401,
        [CodeType.BadRequest]: 400,
    }[code];
}
