export default function ActivityCard() {
  return (
    <div className="rounded-lg border p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <ul className="mt-4 space-y-2">
        <li className="flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
          <span>New proposal created</span>
        </li>
        <li className="flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
          <span>Policy updated</span>
        </li>
        <li className="flex items-center">
          <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
          <span>User registered</span>
        </li>
      </ul>
    </div>
  );
}