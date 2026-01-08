// idb.js - Vanilla Version
const idb = {
    db: null,

    // 1. פתיחת מסד הנתונים
    openCostsDB: function(name, version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(name, version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('costs')) {
                    // יצירת מחסן נתונים עם מפתח רץ (autoIncrement)
                    db.createObjectStore('costs', { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this);
            };

            request.onerror = (event) => reject("Error opening DB: " + event.target.errorCode);
        });
    },

    // 2. הוספת פריט הוצאה
    addCost: function(cost) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['costs'], 'readwrite');
            const store = transaction.objectStore('costs');
            
            // הוספת תאריך נוכחי (חובה לפי הדרישות)
            const costWithDate = {
                ...cost,
                date: new Date() 
            };

            const request = store.add(costWithDate);

            request.onsuccess = () => resolve(cost);
            request.onerror = () => reject("Error adding cost");
        });
    },

    // 3. הפקת דוח מפורט כולל המרת מטבע
    getReport: async function(year, month, currency) {
        // הבאת שערי חליפין מהשרת (שהקמת בשלב 1)
        const response = await fetch('https://raw.githubusercontent.com/AlonDlv/cost-manager/refs/heads/main/rates.json');
        const rates = await response.json();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['costs'], 'readonly');
            const store = transaction.objectStore('costs');
            const request = store.getAll();

            request.onsuccess = (event) => {
                const allCosts = event.target.result;

                // סינון לפי שנה וחודש (חודשים ב-JS הם 0-11, לכן +1)
                const filteredCosts = allCosts.filter(item => {
                    const d = new Date(item.date);
                    return d.getFullYear() === year && (d.getMonth() + 1) === month;
                });

                // חישוב סך הכל עם המרה למטבע היעד
                let totalSum = 0;
                const formattedCosts = filteredCosts.map(item => {
                    // המרה ל-USD ואז למטבע היעד
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
                    year,
                    month,
                    costs: formattedCosts,
                    total: { currency: currency, total: totalSum }
                });
            };

            request.onerror = () => reject("Error fetching report");
        });
    }
};

// הזרקה לאובייקט הגלובלי עבור הטסט האוטומטי
window.idb = idb;