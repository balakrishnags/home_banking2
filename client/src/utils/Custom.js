export const customMethods = {
    numberFormat: (number) => {
        return number?.toLocaleString('en-IN')
    },
    getDaysInMonth: (date) => {
        // Months are zero-based, so we subtract 1 from the input month
        let year = new Date(date).getFullYear()
        let month = new Date(date).getMonth() + 1
        const lastDay = new Date(year, month, 0).getDate();
        return Array.from({ length: lastDay }, (_, index) => index + 1);
    }
}