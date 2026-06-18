import { Component, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GcdsContainer, GcdsHeading, GcdsNotice, GcdsText } from '@gcds-core/components-react';
import Footer from './Footer.jsx';
import Header from './Header.jsx';
import issuesData from './data/issues.json';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentMonthName = new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date());
const currentMonthIndex = new Date().getMonth();
const lastCompletedMonthIndex = Math.max(0, currentMonthIndex - 1);
const currentYearLabel = String(new Date().getFullYear());

const explicitYearStyles = {
  2024: { stroke: '#111111', fill: '#111111' },
  2025: { stroke: '#2e8540', fill: '#2e8540' },
  2026: { stroke: '#fdb81e', fill: '#fdb81e' },
};
const fallbackPalette = ['#26374a', '#d3080c', '#4b5563', '#6f42c1', '#008cba', '#8b5e3c'];
const piePalette = ['#26374a', '#d3080c', '#2e8540', '#fdb81e', '#6f42c1', '#008cba', '#8b5e3c'];

function parseJiraDate(value) {
  if (!value) return null;
  const [datePart, timePart = '0:00'] = String(value).trim().split(' ');
  const [month, day, year] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const date = new Date(year, month - 1, day, hour || 0, minute || 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

const issues = issuesData.map((issue) => {
  const createdDate = parseJiraDate(issue.Created);
  const resolvedDate = parseJiraDate(issue.Resolved);

  return {
    key: issue['Issue key'],
    priority: issue.Priority || 'Unspecified',
    created: issue.Created,
    resolved: issue.Resolved,
    createdDate,
    resolvedDate,
    component: issue['Component/s'] || issue.Component || issue['Issue Type'] || 'Unspecified',
  };
});

const years = Array.from(
  new Set(
    issues
      .flatMap((issue) => [issue.createdDate?.getFullYear(), issue.resolvedDate?.getFullYear()])
      .filter(Boolean)
      .map(String),
  ),
).sort();

const yearStyles = years.reduce((styles, year, index) => {
  styles[year] = explicitYearStyles[year] || {
    stroke: fallbackPalette[index % fallbackPalette.length],
    fill: fallbackPalette[index % fallbackPalette.length],
  };
  return styles;
}, {});

function countBy(items, getKey) {
  return items.reduce((counts, item) => {
    const key = getKey(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

const resolvedIssues = issues.filter((issue) => issue.resolvedDate);

const monthlyResolvedData = monthNames.map((month, monthIndex) => {
  const row = { name: month };
  years.forEach((year) => {
    row[year] = resolvedIssues.filter(
      (issue) => issue.resolvedDate.getFullYear() === Number(year) && issue.resolvedDate.getMonth() === monthIndex,
    ).length;
  });
  return row;
});

function getYearlyComparisonData(monthRows) {
  return years.map((year, index) => {
    const tickets = monthRows.reduce((sum, month) => sum + Number(month[year] || 0), 0);
    const previousYear = years[index - 1];
    const previousTickets = previousYear
      ? monthRows.reduce((sum, month) => sum + Number(month[previousYear] || 0), 0)
      : 0;
    const percentChange =
      previousTickets > 0 ? Math.round(((tickets - previousTickets) / previousTickets) * 100) : null;

    return {
      year,
      tickets,
      percentChange,
      previousYear,
    };
  });
}

const currentMonthRow = monthlyResolvedData.find((row) => row.name === currentMonthName);
const currentMonthPeak = currentMonthRow ? Math.max(...years.map((year) => Number(currentMonthRow[year] || 0))) : 0;
const defaultSelectedYear = years.includes(currentYearLabel) ? currentYearLabel : years[years.length - 1] || '';

function CurrentMonthBadge({ compact = false }) {
  return (
    <span className={`current-month-badge ${compact ? 'current-month-badge--compact' : ''}`}>
      Current month: {currentMonthName}
    </span>
  );
}

function CurrentMonthPin({ cx, cy }) {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null;

  return (
    <g transform={`translate(${cx}, ${cy - 18})`} pointerEvents="none">
      <circle r="8" fill="#26374a" opacity="0.2">
        <animate attributeName="r" values="8;18;8" dur="1.7s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0;0.35" dur="1.7s" repeatCount="indefinite" />
      </circle>
      <path
        d="M0 -15C-7 -15 -12 -10 -12 -3C-12 6 0 17 0 17C0 17 12 6 12 -3C12 -10 7 -15 0 -15Z"
        fill="#26374a"
        stroke="#ffffff"
        strokeWidth="2"
      />
      <circle cy="-3" r="4" fill="#ffffff" />
    </g>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{label}</div>
      {payload.map((entry) => (
        <div className="chart-tooltip__row" key={`${entry.dataKey}-${entry.name}`}>
          <span>{entry.name || entry.dataKey}</span>
          <strong style={{ color: entry.color }}>{Number(entry.value || 0).toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
}

function YearComparisonCard({ entry }) {
  const showPercent = entry.percentChange !== null;
  const isPositive = showPercent && entry.percentChange >= 0;
  const detail = !showPercent
    ? ''
    : `${isPositive ? '+' : ''}${entry.percentChange}% vs ${entry.previousYear}`;

  return (
    <article className="year-compare-card" style={{ borderTopColor: yearStyles[entry.year]?.stroke }}>
      <span>{entry.year}</span>
      <div className="year-compare-card__value">
        <strong>{entry.tickets.toLocaleString()}</strong>
        <span style={{ backgroundColor: yearStyles[entry.year]?.stroke }} />
      </div>
      {entry.year === '2024' && <small>First year on Jira</small>}
      {detail && <em className={isPositive ? 'positive' : 'negative'}>{detail}</em>}
    </article>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="dashboard-error">
          <h1>Dashboard error</h1>
          <p>{this.state.error.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(defaultSelectedYear);
  const [selectedMonth, setSelectedMonth] = useState(lastCompletedMonthIndex);
  const [monthRange, setMonthRange] = useState('all');

  const displayedMonthlyResolvedData = useMemo(() => {
    if (monthRange === 'passed') {
      return monthlyResolvedData.slice(0, lastCompletedMonthIndex + 1);
    }

    return monthlyResolvedData;
  }, [monthRange]);

  const displayedYearlyComparisonData = useMemo(
    () => getYearlyComparisonData(displayedMonthlyResolvedData),
    [displayedMonthlyResolvedData],
  );

  const showCurrentMonthPin = monthRange === 'all' && currentMonthRow;

  const selectedComponentData = useMemo(() => {
    return Object.entries(
      countBy(
        resolvedIssues.filter(
          (issue) =>
            issue.resolvedDate.getFullYear() === Number(selectedYear) &&
            issue.resolvedDate.getMonth() === Number(selectedMonth),
        ),
        (issue) => issue.component,
      ),
    )
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [selectedMonth, selectedYear]);

  const selectedMonthTotal = selectedComponentData.reduce((sum, component) => sum + component.value, 0);
  const selectedComponentPieData = useMemo(() => {
    const topComponents = selectedComponentData.slice(0, 6);
    const otherTotal = selectedComponentData.slice(6).reduce((sum, component) => sum + component.value, 0);

    return otherTotal > 0 ? [...topComponents, { name: 'Other', value: otherTotal }] : topComponents;
  }, [selectedComponentData]);

  const printComponentStats = () => {
    window.print();
  };

  return (
    <>
      <Header />
      <div className="app-shell">
        <GcdsContainer layout="page" size="xl" alignment="center" tag="main" id="main-content">
          <div className="dashboard">
            <section className="hero-panel" aria-labelledby="dashboard-title">
              <div className="hero-panel__content">
                <GcdsHeading tag="h1" characterLimit={false} marginBottom="200">
                 Stats Dashboard
                </GcdsHeading>
                <GcdsText characterLimit={false} marginBottom="0">
                  Monthly overview of completed CS-PAYWEB Jira tickets, yearly trends, and component activity.
                </GcdsText>
                <GcdsNotice
                  className="hero-notice"
                  noticeRole="success"
                  noticeTitle={`${issues.length.toLocaleString()} total issues imported`}
                  noticeTitleTag="h2"
                >
                  Imported from issues.json.
                </GcdsNotice>
              </div>
            </section>

            <section className="year-compare-grid" aria-label="Completed ticket comparison by year">
              {displayedYearlyComparisonData.map((entry) => (
                <YearComparisonCard key={entry.year} entry={entry} />
              ))}
            </section>

            <section className="chart-grid" aria-label="Ticket comparison charts">
              <article className="dashboard-panel dashboard-panel--full printable-monthly-section">
                <div className="panel-heading">
                  <div>
                    <GcdsHeading tag="h2" marginTop="0" marginBottom="0">
                      Monthly Completed Tickets
                    </GcdsHeading>
                    <p>Grouped by completed date and year.</p>
                  </div>
                  <button
                    className={`range-switch ${monthRange === 'passed' ? 'is-active' : ''}`}
                    type="button"
                    role="switch"
                    aria-checked={monthRange === 'passed'}
                    aria-label={`Monthly completed tickets view is ${
                      monthRange === 'all' ? 'year view' : 'completed months'
                    }`}
                    onClick={() => setMonthRange((current) => (current === 'all' ? 'passed' : 'all'))}
                  >
                    <span className={`range-switch__label ${monthRange === 'all' ? 'is-selected' : ''}`}>
                      Year view
                    </span>
                    <span className="range-switch__track">
                      <span className="range-switch__thumb" />
                    </span>
                    <span className={`range-switch__label ${monthRange === 'passed' ? 'is-selected' : ''}`}>
                      Completed month
                    </span>
                  </button>
                </div>
                <div className="chart-frame chart-frame--large">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayedMonthlyResolvedData} margin={{ top: 18, right: 28, left: 4, bottom: 8 }}>
                      <defs>
                        {years.map((year) => (
                          <linearGradient key={year} id={`fill-${year}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={yearStyles[year].fill} stopOpacity={0.28} />
                            <stop offset="95%" stopColor={yearStyles[year].fill} stopOpacity={0.03} />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#d6d7d9" />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#4b5563' }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#4b5563' }} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ paddingTop: 16 }} />
                      {showCurrentMonthPin && (
                        <ReferenceDot
                          x={currentMonthName}
                          y={currentMonthPeak}
                          shape={<CurrentMonthPin />}
                          ifOverflow="visible"
                        />
                      )}
                      {years.map((year) => (
                        <Area
                          key={year}
                          type="monotone"
                          dataKey={year}
                          name={year}
                          stroke={yearStyles[year].stroke}
                          fill={`url(#fill-${year})`}
                          strokeWidth={3}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </section>

            <section
              className="dashboard-panel dashboard-panel--full printable-drilldown-section"
              aria-labelledby="month-drilldown-heading"
            >
              <div className="panel-heading">
                <div>
                  <GcdsHeading tag="h2" marginTop="0" marginBottom="0">
                    Component Popularity by Month
                  </GcdsHeading>
                  <p id="month-drilldown-heading">
                    Select a completed month and year to see component type popularity and counts.
                  </p>
                  <p className="print-only">
                    Component popularity for {monthNames[selectedMonth]} {selectedYear}
                  </p>
                </div>
              </div>

              <div className="drilldown-grid">
                <div className="drilldown-chart-group">
                  {selectedComponentData.length > 0 ? (
                    <>
                    <div className="chart-frame chart-frame--pie" aria-label="Component share chart">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                          <Tooltip content={<ChartTooltip />} />
                          <Pie
                            data={selectedComponentPieData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="48%"
                            outerRadius="78%"
                            paddingAngle={2}
                            stroke="#ffffff"
                            strokeWidth={2}
                          >
                            {selectedComponentPieData.map((component, index) => (
                              <Cell key={component.name} fill={piePalette[index % piePalette.length]} />
                            ))}
                          </Pie>
                          <Legend layout="vertical" align="right" verticalAlign="middle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="chart-frame chart-frame--compact chart-frame--bar">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={selectedComponentData.slice(0, 10)}
                          layout="vertical"
                          margin={{ top: 10, right: 32, left: 0, bottom: 8 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#d6d7d9" />
                          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#4b5563' }} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={100}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#4b5563', fontSize: 12 }}
                          />
                          <Tooltip content={<ChartTooltip />} />
                          <Bar dataKey="value" name="Tickets" fill="#26374a" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    </>
                  ) : (
                    <p className="empty-state empty-state--chart">
                      No completed tickets found for {monthNames[selectedMonth]} {selectedYear}.
                    </p>
                  )}
                </div>

                <div className="drilldown-table-panel">
                  <div className="drilldown-controls" aria-label="Month detail filters">
                    <label>
                      <span>Year</span>
                      <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)}>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Month</span>
                      <select
                        value={selectedMonth}
                        onChange={(event) => setSelectedMonth(Number(event.target.value))}
                      >
                        {monthNames.map((month, index) => (
                          <option key={month} value={index}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button className="share-print-button" type="button" onClick={printComponentStats}>
                      Share PDF
                    </button>
                  </div>

                  <div className="drilldown-summary">
                    <strong>{selectedMonthTotal.toLocaleString()}</strong>
                    <span>
                      completed tickets in {monthNames[selectedMonth]} {selectedYear}
                    </span>
                  </div>

                  {selectedComponentData.length > 0 ? (
                    <div className="table-scroll">
                      <table className="data-table data-table--compact">
                        <thead>
                          <tr>
                            <th scope="col">Component</th>
                            <th scope="col">Count</th>
                            <th scope="col">Share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedComponentData.map((component) => (
                            <tr key={component.name}>
                              <th scope="row">{component.name}</th>
                              <td>{component.value.toLocaleString()}</td>
                              <td>{selectedMonthTotal ? Math.round((component.value / selectedMonthTotal) * 100) : 0}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="empty-state">Select another month or year to view component counts.</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        </GcdsContainer>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}

export default App;
