
export default function DashboardCard({ title, value, icon, color }) {
    return (
        <div className="bg-white overflow-hidden shadow rounded-lg p-5 border border-gray-100 flex items-center space-x-4 transition hover:shadow-md">
            <div className={`p-3 rounded-full text-white ${color || 'bg-blue-500'}`}>
                {/* Fallback to text icon if not SVG */}
                <span className="text-xl">{icon}</span>
            </div>
            <div>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd className="mt-1 text-2xl font-bold text-gray-900">{value}</dd>
            </div>
        </div>
    );
}
