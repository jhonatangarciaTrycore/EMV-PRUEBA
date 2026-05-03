const formatters = {}

formatters.price = (val) => {
    return val.toLocaleString('es-CO', { style: 'currency', currency: 'COP', useGrouping: true, maximumFractionDigits: 0 })
}

formatters.date = (val) => {
    const date = new Date(val);
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: '2-digit' });
}
export { formatters }