import { useRef } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Consistent Tailwind palette colors
const typeColors = {
  "Indoor ice rinks": "#3b82f6",   // Blue
  "Arenas": "#f97316",             // Orange
  "Pools": "#22c55e",              // Green
  "Community centres": "#a855f7",  // Purple
  "Administration": "#06b6d4",     // Teal
  "Other": "#eab308",              // Yellow
};

function PieChart({ data }) {
  const chartRef = useRef(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 italic p-6">
        No data available for this selection.
      </div>
    );
  }

  // Group emissions by Operation Type
  const grouped = {};
  data.forEach((d) => {
    const type = d["Operation Type"];
    grouped[type] =
      (grouped[type] || 0) + (d["Total GHG Emissions (KG)"] || 0);
  });

  const labels = Object.keys(grouped);
  const values = Object.values(grouped);

  if (labels.length === 0 || values.length === 0) {
    return (
      <div className="text-center text-gray-500 italic p-6">
        No emissions data available.
      </div>
    );
  }

  // Threshold for grouping into "Other" (5% of total)
  const total = values.reduce((a, b) => a + b, 0);
  const threshold = total * 0.05;

  let groupedLabels = [];
  let groupedValues = [];
  let groupedColors = [];
  let otherTotal = 0;

  labels.forEach((label, idx) => {
    if (values[idx] < threshold) {
      otherTotal += values[idx];
    } else {
      groupedLabels.push(label);
      groupedValues.push(values[idx]);
      groupedColors.push(typeColors[label] || "#9ca3af");
    }
  });

  if (otherTotal > 0) {
    groupedLabels.push("Other");
    groupedValues.push(otherTotal);
    groupedColors.push(typeColors["Other"] || "#d1d5db");
  }

  // Export PNG
  const handleDownloadPNG = () => {
    if (!chartRef.current) return;
    const url = chartRef.current.toBase64Image();
    const a = document.createElement("a");
    a.href = url;
    a.download = "emissions-pie.png";
    a.click();
  };

  // Export CSV
  const handleDownloadCSV = () => {
    const rows = [["Facility Type", "Emissions (kg)"]];
    groupedLabels.forEach((label, idx) => {
      rows.push([label, groupedValues[idx]]);
    });
    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csvContent);
    a.download = "emissions-data.csv";
    a.click();
  };

  return (
    <div className="w-full">
      {/* Chart */}
      <div className="h-96">
        <Pie
          ref={chartRef}
          data={{
            labels: groupedLabels,
            datasets: [
              {
                data: groupedValues,
                backgroundColor: groupedColors,
                borderColor: "#ffffff",
                borderWidth: 2,
                hoverOffset: 12,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  usePointStyle: true,
                  padding: 16,
                  font: { size: 12 },
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.raw || 0;
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${context.label}: ${value.toLocaleString()} kg (${percentage}%)`;
                  },
                },
              },
              title: {
                display: true,
                text: "Emissions by Facility Type",
                font: { size: 16, weight: "bold" },
                padding: { top: 10, bottom: 10 },
              },
            },
          }}
        />
      </div>

      {/* Export buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={handleDownloadPNG}
          className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
        >
          📥 Download PNG
        </button>
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 text-sm font-medium text-green-600 border border-green-300 rounded-lg bg-green-50 hover:bg-green-100 transition"
        >
          📊 Export CSV
        </button>
      </div>
    </div>
  );
}

export default PieChart;
