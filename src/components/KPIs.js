import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOfficeIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";

function KPIs({ data, allData, selectedYear, selectedType }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 italic p-6">
        No KPI data available.
      </div>
    );
  }

  // Top 5 emitters
  const topEmitters = [...data]
    .sort(
      (a, b) =>
        (b["Total GHG Emissions (KG)"] || 0) -
        (a["Total GHG Emissions (KG)"] || 0)
    )
    .slice(0, 5);

  // Average energy intensity
  const avgIntensity =
    data.reduce(
      (sum, d) => sum + (d["Total Energy Intensity (EkWh/SqFt)"] || 0),
      0
    ) / data.length;

  // YoY change in total GHG
  const currentYearTotal = data.reduce(
    (sum, d) => sum + (d["Total GHG Emissions (KG)"] || 0),
    0
  );
  const prevYear = selectedYear - 1;
  const prevYearData = allData.filter(
    (d) => Number(d.Year) === prevYear && d["Operation Type"] === selectedType
  );
  const prevYearTotal = prevYearData.reduce(
    (sum, d) => sum + (d["Total GHG Emissions (KG)"] || 0),
    0
  );
  const yoyChange =
    prevYearTotal > 0
      ? ((currentYearTotal - prevYearTotal) / prevYearTotal) * 100
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Average Intensity */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center 
                      transition-transform transform hover:scale-[1.02] hover:shadow-lg">
        <div className="flex justify-center mb-2">
          <BoltIcon className="h-7 w-7 text-blue-500" />
        </div>
        <h2 className="text-sm font-medium text-gray-600">
          Avg Energy Intensity
        </h2>
        <p className="text-2xl font-bold text-blue-600 mt-1">
          {avgIntensity.toFixed(2)} EkWh/SqFt
        </p>
      </div>

      {/* Top Emitters */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 
                      transition-transform transform hover:scale-[1.02] hover:shadow-lg">
        <div className="flex justify-center mb-2">
          <BuildingOfficeIcon className="h-7 w-7 text-purple-500" />
        </div>
        <h2 className="text-sm font-medium text-gray-600 mb-3">Top 5 Emitters</h2>
        {topEmitters.length > 0 ? (
          <ul className="text-sm text-gray-700 space-y-1">
            {topEmitters.map((d, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{d["Operation Name"]}</span>
                <span className="font-medium">
                  {Math.round(
                    d["Total GHG Emissions (KG)"]
                  ).toLocaleString()}{" "}
                  kg
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No emitters found</p>
        )}
      </div>

      {/* YoY Change */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center 
                      transition-transform transform hover:scale-[1.02] hover:shadow-lg">
        <div className="flex justify-center mb-2">
          {yoyChange !== null ? (
            yoyChange < 0 ? (
              <ArrowTrendingDownIcon className="h-7 w-7 text-green-600" />
            ) : (
              <ArrowTrendingUpIcon className="h-7 w-7 text-red-600" />
            )
          ) : (
            <ArrowTrendingUpIcon className="h-7 w-7 text-gray-400" />
          )}
        </div>
        <h2 className="text-sm font-medium text-gray-600">YoY GHG Change</h2>
        {yoyChange !== null ? (
          <p
            className={`text-2xl font-bold mt-1 ${
              yoyChange < 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {yoyChange < 0 ? "↓" : "↑"} {Math.abs(yoyChange).toFixed(1)}%
          </p>
        ) : (
          <p className="text-gray-500 mt-1">No data</p>
        )}
        <p className="text-sm text-gray-500">vs {prevYear}</p>
      </div>
    </div>
  );
}

export default KPIs;
