# Municipal Energy & GHG Dashboard

An interactive dashboard to visualize **municipal energy usage** and **GHG emissions** (2015–2017 dataset).  
Built with **React + Chart.js + TailwindCSS** for clean, responsive, and professional analytics.

---

## Features
- **Interactive Charts**
  - Electricity vs Gas consumption (Bar chart)
  - GHG Emissions trend over time (Line chart)
  - Emissions by facility type (Pie chart)

- **Smart Filters**
  - Filter by Year, Facility Type, and Building
  - Reset filters with a single click

- **KPIs & Insights**
  - Avg Energy Intensity
  - Top 5 emitters
  - Year-over-Year GHG changes
  - Automated insights for trends

- **Export & Share**
  - Download any chart as PNG
  - Export data as CSV for offline analysis

---

## Tech Stack
- **Frontend:** React (Vite/CRA) + TailwindCSS
- **Charts:** Chart.js + react-chartjs-2
- **Styling:** Tailwind utility classes
- **Data:** JSON (2015–2017 municipal dataset)

---

## Getting Started

Clone the repo:
```bash
git clone https://github.com/chhabra-anirudh/municipal-energy-dashboard.git
cd municipal-energy-dashboard
```
Install dependencies:
```bash
npm install
```
Run locally:
```bash
npm start
```
Build for production:
```bash
npm run build
```

---

## Project Structure:
```
municipal-energy-dashboard/
├── src/
│   ├── components/    # Reusable chart & UI components
│   ├── data/          # Dataset (JSON)
│   ├── App.js         # Main app entry
│   └── Dashboard.js   # Dashboard page
├── public/            # Static assets
├── package.json
└── README.md
```

---

## Future Improvements:
Add support for newer datasets (post-2017)
