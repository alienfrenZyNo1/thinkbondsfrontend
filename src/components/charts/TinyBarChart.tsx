export default function TinyBarChart() {
  // This is a placeholder for a tiny bar chart component
  return (
    <div className="h-20 w-full">
      <div className="flex h-full items-end space-x-1">
        {[10, 30, 20, 40, 15, 25, 35].map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-blue-500"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}
