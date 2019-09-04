
export function generateHashKey (index) {
    return String.fromCharCode(97 + index);
}
export function unHashGeneratedKey (string) {
    return string.charCodeAt(0) - 97;
}