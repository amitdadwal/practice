// Recharts prefers row-based objects (an array of records)
export const rechartsData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 5500 },
];

// Chart.js separates categories (labels) and series values (datasets)
export const chartJsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
        {
            label: "Revenue",
            data: [4000, 3000, 5000, 4500, 6000, 5500],
            borderColor: "#2563eb",
            backgroundColor: "#2563eb",
            tension: 0.3, // smooth curve matching Recharts type="monotone"
        },
    ],
};