// idb-module.js - React Version
const idb = {
    db: null,

    openCostsDB: function(name, version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(name, version);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('costs')) {
                    db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
                }
            };
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this);
            };
            request.onerror = (event) => reject(event.target.errorCode);
        });
    },

    addCost: function(cost) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['costs'], 'readwrite');
            const store = transaction.objectStore('costs');
            const costWithDate = { ...cost, date: new Date() };
            const request = store.add(costWithDate);
            request.onsuccess = () => resolve(cost);
            request.onerror = () => reject("Error adding cost");
        });
    },

    getReport: async function(year, month, currency, customUrl = null) {
        // לוגיקת Fallback: אם אין URL מהגדרות, משתמשים בברירת המחדל שלך בגיטהאב
        const defaultUrl = 'https://raw.githubusercontent.com/AlonDlv/cost-manager/main/rates.json';
        const urlToFetch = customUrl || defaultUrl;

        try {
            const response = await fetch(urlToFetch);
            const rates = await response.json();

            return new Promise((resolve, reject) => {
                const transaction = this.db.transaction(['costs'], 'readonly');
                const store = transaction.objectStore('costs');
                const request = store.getAll();

                request.onsuccess = (event) => {
                    const allCosts = event.target.result;
                    const filteredCosts = allCosts.filter(item => {
                        const d = new Date(item.date);
                        return d.getFullYear() === year && (d.getMonth() + 1) === month;
                    });

                    let totalSum = 0;
                    const formattedCosts = filteredCosts.map(item => {
                        // חישוב המרה דינמי (פירוט בסעיף 2 למטה)
                        const sumInUSD = item.sum / rates[item.currency];
                        const convertedSum = sumInUSD * rates[currency];
                        totalSum += convertedSum;

                        return {
                            sum: item.sum,
                            currency: item.currency,
                            category: item.category,
                            description: item.description,
                            Date: { day: new Date(item.date).getDate() }
                        };
                    });

                    resolve({
                        year, month,
                        costs: formattedCosts,
                        total: { currency: currency, total: Number(totalSum.toFixed(2)) }
                    });
                };
                request.onerror = () => reject("Error fetching report");
            });
        } catch (error) {
            console.error("Currency fetch failed", error);
        }
    }
};

// הפקודה הקריטית עבור React
export default idb;
