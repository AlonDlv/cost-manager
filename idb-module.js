// idb-module.js - Integrated Version
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
            // חובה לשמור את המטבע המקורי לפי סעיף 5 במטלה
            const costWithDate = { ...cost, date: new Date() };
            const request = store.add(costWithDate);
            request.onsuccess = () => resolve(cost);
            request.onerror = () => reject("Error adding cost");
        });
    },

    getReport: async function(year, month, currency) {
        // משיכת URL מהגדרות (סעיף 6) או שימוש בברירת מחדל (סעיף 5)
        const customUrl = localStorage.getItem('exchangeRateUrl');
        const defaultUrl = 'https://raw.githubusercontent.com/AlonDlv/cost-manager/refs/heads/main/rates.json';
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
                        // המרה לפי שערי החליפין מהשרת
                        const sumInUSD = item.sum / rates[item.currency];
                        const convertedSum = sumInUSD * rates[currency];
                        totalSum += convertedSum;

                        return {
                            sum: item.sum,
                            currency: item.currency,
                            category: item.category,
                            description: item.description,
                            Date: { day: new Date(item.date).getDate() } // פורמט נדרש לפי המטלה
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
            console.error("Fetch failed", error);
            throw error;
        }
    }
};

export default idb;
