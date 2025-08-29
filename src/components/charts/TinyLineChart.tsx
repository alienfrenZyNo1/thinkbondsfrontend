export default function TinyLineChart() {
  // This is a placeholder for a tiny line chart component
  return (
    <div className="h-20 w-full">
      <svg viewBox="0 0 100 20" className="h-full w-full">
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          points="0,15 10,10 20,12 30,8 40,10 50,5 60,8 70,6 80,4 90,6 100,5"
        />
      </svg>
    </div>
  );
}
