export function aggregateByCategory(costs) {
    const result = {};

    costs.forEach(cost => {
        const category = cost.category;
        if (!result[category]) {
            result[category] = 0;
        }
        result[category] += cost.sum;
    });

    return result;
}
export function aggregateByMonth(costs, year) {
    const monthlyTotals = Array(12).fill(0);

    costs.forEach(cost => {
        if (cost.date.year === year) {
            const monthIndex = cost.date.month - 1;
            monthlyTotals[monthIndex] += cost.sum;
        }
    });

    return monthlyTotals;
}

export function aggregateByCategoryForMonth(costs, year, month) {
    const result = {};

    costs.forEach(cost => {
        if (
            cost.date.year === year &&
            cost.date.month === month
        ) {
            const category = cost.category;

            if (!result[category]) {
                result[category] = 0;
            }

            result[category] += cost.sum;
        }
    });

    return result;
}
