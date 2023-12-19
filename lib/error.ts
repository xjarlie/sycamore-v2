import { Response } from "express";

export function sycError(res: Response, code: string, message: string = '') {
    res.status(200).json({
        success: false,
        error: {
            code,
            message
        }
    });
    return 'errored';
}