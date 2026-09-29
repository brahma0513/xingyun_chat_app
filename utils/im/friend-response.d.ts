export function friendOperationResult(response: unknown): {
    code: number;
    message?: string;
    [key: string]: unknown;
};
