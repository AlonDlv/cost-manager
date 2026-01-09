const STORAGE_KEY = "currency_rates_url";

export function saveRatesUrl(url) {
    localStorage.setItem(STORAGE_KEY, url);
}

export function getRatesUrl() {
    return localStorage.getItem(STORAGE_KEY);
}
export async function fetchRates() {
    const url = getRatesUrl();

    if (!url) {
        throw new Error("Currency rates URL is not set");
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch currency rates");
    }

    const data = await response.json();
    return data;
}

export function convertCurrency(amount, fromCurrency, toCurrency, rates) {
    if (fromCurrency === toCurrency) {
        return amount;
    }

    const amountInUSD = amount / rates[fromCurrency];
    const convertedAmount = amountInUSD * rates[toCurrency];

    return convertedAmount;
}

