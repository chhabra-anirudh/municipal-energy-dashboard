import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";

function Insights({ data, allData, selectedYear }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 italic p-6 mb-8">
        No insights available for this selection.
      </div>
    );
  }

  // Total GHG this year
  const totalGHG = data.reduce(
    (sum, d) => sum + (d["Total GHG Emissions (KG)"] || 0),
    0
  );

  // Compare to previous year
  const prevYear = selectedYear - 1;
  const prevYearData = allData.filter((d) => Number(d.Year) === prevYear);
  const prevYearTotal = prevYearData.reduce(
    (sum, d) => sum + (d["Total GHG Emissions (KG)"] || 0),
    0
  );

  const yoyChange =
    prevYearTotal > 0
      ? ((totalGHG - prevYearTotal) / prevYearTotal) * 100
      : null;

  // Find highest emitter type
  const emissionsByType = {};
  data.forEach((d) => {
    const type = d["Operation Type"];
    emissionsByType[type] =
      (emissionsByType[type] || 0) + (d["Total GHG Emissions (KG)"] || 0);
  });
  const topType =
    Object.entries(emissionsByType).sort((a, b) => b[1] - a[1])[0] || null;

  return (
    <div
      className="bg-white p-6 rounded-xl shadow border border-gray-200 mb-8
                 transition-transform transform hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="h-6 w-6 text-indigo-500" />
        <h2 className="text-xl font-semibold text-gray-800">Insights</h2>
      </div>

      {/* Summary */}
      <p className="text-gray-700 leading-relaxed text-sm md:text-base">
        In <span className="font-semibold">{selectedYear}</span>, total GHG
        emissions reached{" "}
        <span className="font-bold text-indigo-600">
          {Math.round(totalGHG).toLocaleString()} kg
        </span>
        .
        {yoyChange !== null && (
          <>
            {" "}This represents a{" "}
            <span
              className={`font-semibold ${
                yoyChange < 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {Math.abs(yoyChange).toFixed(1)}%{" "}
              {yoyChange < 0 ? "decrease" : "increase"}
            </span>{" "}
            compared to {prevYear}.
          </>
        )}
        {topType && (
          <>
            {" "}The largest contributor was{" "}
            <span className="font-semibold">{topType[0]}</span>, producing{" "}
            <span className="font-bold text-orange-500">
              {Math.round(topType[1]).toLocaleString()} kg
            </span>{" "}
            of emissions.
          </>
        )}
      </p>

      {/* YoY Change Badge */}
      {yoyChange !== null && (
        <div className="mt-5 flex justify-center">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm
              ${yoyChange < 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {yoyChange < 0 ? (
              <ArrowTrendingDownIcon className="h-5 w-5" />
            ) : (
              <ArrowTrendingUpIcon className="h-5 w-5" />
            )}
            {yoyChange < 0 ? "↓" : "↑"} {Math.abs(yoyChange).toFixed(1)}% vs {prevYear}
          </div>
        </div>
      )}
    </div>
  );
}

export default Insights;
