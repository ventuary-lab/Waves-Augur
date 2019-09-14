
export function generateHashKey (index) {
    return String.fromCharCode(97 + index);
}

export function unHashGeneratedKey (string) {
    return string.charCodeAt(0) - 97;
}

export function triggerDocumentScroll (action) {
    switch (action) {
        case 'block':
            document.body.style.overflow = 'hidden';
        case 'unblock':
            document.body.style.overflow = '';
    }
}