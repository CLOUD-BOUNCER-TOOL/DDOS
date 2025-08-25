export default function Denied() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-blue-100">
            <div className="border-2 border-gray-300 rounded-3xl p-8 text-center bg-white shadow-2xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Error 403: Forbidden</h1>
                <h5 className="text-lg text-gray-700">We&apos;re sorry, but you do not have permission to access this resource.</h5>
            </div>
        </div>
    )
}