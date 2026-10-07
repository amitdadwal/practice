export function unique(a: any[]) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}

export function cleanEmail(email: string) {
    return email.replace(/[@.]/g, '_');
}