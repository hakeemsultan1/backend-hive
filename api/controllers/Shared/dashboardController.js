import WorkOrder from "../../models/WorkOrder.js";
export async function dashboard(req, res) {
    try {
        const currentDate = new Date();
        const months = [];

        // Generate the last 3 months with month names and numbers
        for (let i = 2; i >= 0; i--) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - i);
            months.push({
                year: date.getFullYear(),
                monthName: date.toLocaleString("default", { month: "short" }),
                monthNumber: date.getMonth() + 1,
            });
        }

        // Function to merge results with default months and counts
        const mergeResults = (results) => {
            const resultMap = {};
            results.forEach(({ _id, count }) => {
                const key = `${_id.year}-${_id.monthNumber}`;
                resultMap[key] = count;
            });

            return months.map(({ year, monthName, monthNumber }) => {
                const key = `${year}-${monthNumber}`;
                return resultMap[key] || 0; // Default to 0 if not found
            });
        };

        // Aggregation pipeline to group by year and month
        const aggregateByMonth = async (dateField, type) => {
            return await WorkOrder.aggregate([
                {
                    $match: {
                        [dateField]: {
                            $gte: new Date(new Date().setMonth(new Date().getMonth() - 3)),
                        },
                        type: type,
                    },
                },
                {
                    $project: {
                        year: { $year: `$${dateField}` },
                        monthNumber: { $month: `$${dateField}` },
                    },
                },
                {
                    $group: {
                        _id: { year: "$year", monthNumber: "$monthNumber" },
                        count: { $sum: 1 },
                    },
                },
            ]);
        };

        // Aggregate data
        const workOrdersCreatedUnplanned = await aggregateByMonth(
            "createdAt",
            "un-planned"
        );
        const workOrdersCompletedUnplanned = await aggregateByMonth(
            "completedDate",
            "un-planned"
        );
        const workOrdersCreatedPlanned = await aggregateByMonth(
            "createdAt",
            "planned"
        );
        const workOrdersCompletedPlanned = await aggregateByMonth(
            "completedDate",
            "planned"
        );

        // Merge results with months
        const unplannedCreated = mergeResults(workOrdersCreatedUnplanned);
        const unplannedCompleted = mergeResults(workOrdersCompletedUnplanned);
        const plannedCreated = mergeResults(workOrdersCreatedPlanned);
        const plannedCompleted = mergeResults(workOrdersCompletedPlanned);

        // Final structured data
        const plannedWorkOrders = {
            months: months.map((m) => m.monthName),
            created: plannedCreated,
            completed: plannedCompleted,
        };

        const unPlannedWorkOrders = {
            months: months.map((m) => m.monthName),
            created: unplannedCreated,
            completed: unplannedCompleted,
        };
        let categories = ["Motor Mechanic", "Manager", "Admin", "Accounting"];
        let thirtyDays = [65, 20, 20, 20];
        let sixtyDays = [65, 20, 20, 20];
        let ninetyDays = [65, 20, 20, 20];
        return res.status(200).json({ data: { planned: plannedWorkOrders, unPlanned: unPlannedWorkOrders, "30Days": { "Categories": categories, "data": thirtyDays }, "60Days": { "Categories": categories, "data": sixtyDays }, "90Days": { "Categories": categories, "data": ninetyDays } } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getWorkOrdersSchedule(req, res) {
    try {
        let currentDate = new Date();
        let curentMonth = currentDate.getMonth() + 1;
        let days = [];
        let totalDays;
        if (curentMonth == 1 || curentMonth == 3 || curentMonth == 5 || curentMonth == 7 || curentMonth == 8 || curentMonth == 10 || curentMonth == 12) {
            totalDays = 31;
        }
        else if (curentMonth == 4 || curentMonth == 6 || curentMonth == 9 || curentMonth == 11) {
            totalDays = 30;
        }
        else {
            totalDays = 28;
        }
        for (let i = 1; i <= totalDays; i++) {
            days.push(i);
        }
        let workOrders = [];
        for (let i = 0; i < days.length; i++) {
            let date = `${currentDate.getFullYear()}-${curentMonth}-${days[i]}`; //currentDate.getFullYear(), curentMonth - 1, days[i];
            //2024-12-27

            let criticalWorkOrders = await WorkOrder.find({ date: date, priorityLevel: "critical" }).countDocuments();
            let highWorkOrders = await WorkOrder.find({ date: date, priorityLevel: "high" }).countDocuments();
            let mediumWorkOrders = await WorkOrder.find({ date: date, priorityLevel: "medium" }).countDocuments();
            let lowWorkOrders = await WorkOrder.find({ date: date, priorityLevel: "low" }).countDocuments();
            workOrders.push({ date: date, data: { critical: criticalWorkOrders, high: highWorkOrders, medium: mediumWorkOrders, low: lowWorkOrders } });
        }
        return res.status(200).json({ data: workOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}