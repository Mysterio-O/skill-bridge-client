export function toDate(d: string) {
    return new Date(d);
}

export function formatDateTime(d: string) {
    const dt = toDate(d);
    return dt.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatCurrency(amount: any, currency: string) {
    const n = typeof amount === "number" ? amount : Number(amount);
    const safe = Number.isFinite(n) ? n : 0;

    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: 2,
    }).format(safe);
}
