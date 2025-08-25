import "./Dashboard.css";
import WindowIcon from '@mui/icons-material/Window';
import GroupsIcon from '@mui/icons-material/Groups';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import LogoutIcon from '@mui/icons-material/Logout';
import BlockedIpData from "../Components/BlockedIp";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
// import img1 from "../../../../../../Python/top_10_ip_addresses.png";
// import img2 from "../../../../../../Python/requests_over_time.png";
// import img3 from "../../../../../../Python/status_code_distribution.png";




export default function Dashboard() {
    const [activeSection, setActiveSection] = useState("overview");
    const imagesUrl = import.meta.env.VITE_ANALYSIS_IMAGES_URL;
    const [imgRefreshKey, setImgRefreshKey] = useState(0);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const navigate = useNavigate();

    const onLogOut = () => {
        localStorage.clear();
        toast.success("Logout Successful");
        setTimeout(() => {
            navigate("/");
        }, 2000);
    }

    // Regenerate graphs handler
    const handleRegenerateGraphs = async () => {
        setIsRegenerating(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/generate-graphs`, {
                method: 'POST',
            });
            const result = await response.json();
            if (result.success) {
                toast.success('Graphs regenerated successfully!');
                setImgRefreshKey(prev => prev + 1);
            } else {
                toast.error('Failed to regenerate graphs.');
            }
    } catch {
            toast.error('Error triggering graph generation.');
        } finally {
            setIsRegenerating(false);
        }
    }

    return (
        <>
            <div className="flex min-h-screen bg-gray-50">
                {/* Sidebar */}
                <aside className="flex flex-col w-64 bg-white shadow-lg p-4">
                    <div className="mb-8 text-center">
                        <h5 className="text-2xl font-bold text-blue-700">CloudBouncer</h5>
                    </div>
                    <nav className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-50 cursor-pointer"
                            onClick={() => setActiveSection("overview")}>
                            <WindowIcon className="text-blue-600" />
                            <span>Overview</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-50 cursor-pointer"
                            onClick={() => setActiveSection("reports")}>
                            <AssessmentIcon className="text-blue-600" />
                            <span>Reports</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-50 cursor-pointer"
                            onClick={() => setActiveSection("customers")}>
                            <GroupsIcon className="text-blue-600" />
                            <span>Customers</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-50 cursor-pointer">
                            <SettingsIcon className="text-blue-600" />
                            <span>Settings</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-50 cursor-pointer">
                            <CodeIcon className="text-blue-600" />
                            <span>Developer</span>
                        </div>
                    </nav>
                    <div className="mt-auto pt-8">
                        <div className="flex items-center gap-2 px-4 py-2 rounded hover:bg-red-50 cursor-pointer" onClick={onLogOut}>
                            <LogoutIcon className="text-red-600" />
                            <span>Logout</span>
                        </div>
                    </div>
                </aside>
                {/* Main Content */}
                <main className="flex-1 p-8">
                    {/* Overview Section */}
                    {activeSection === "overview" && (
                        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold mb-4 text-center">Blocked IPs</h3>
                            <BlockedIpData />
                        </div>
                    )}
                    {/* Reports Section */}
                    {activeSection === "reports" && (
                        <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-800">Traffic Analysis</h2>
                            <button onClick={handleRegenerateGraphs} disabled={isRegenerating} className={`bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition ${isRegenerating ? 'opacity-50 cursor-not-allowed' : ''}`}>{isRegenerating ? 'Regenerating...' : 'Regenerate Graphs'}</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white rounded-lg shadow p-4">
                                <h4 className="font-semibold mb-2">Top 10 IP Addresses</h4>
                                <img src={`${imagesUrl}/top_10_ip_addresses.png?key=${imgRefreshKey}`} alt="Top 10 IPs" className="w-full rounded" />
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <h4 className="font-semibold mb-2">Requests Over Time</h4>
                                <img src={`${imagesUrl}/requests_over_time.png?key=${imgRefreshKey}`} alt="Requests Over Time" className="w-full rounded" />
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <h4 className="font-semibold mb-2">Status Code Distribution</h4>
                                <img src={`${imagesUrl}/status_code_distribution.png?key=${imgRefreshKey}`} alt="Status Code Distribution" className="w-full rounded" />
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <h4 className="font-semibold mb-2">Top 10 User Agents</h4>
                                <img src={`${imagesUrl}/top_10_user_agents.png?key=${imgRefreshKey}`} alt="Top 10 User Agents" className="w-full rounded" />
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <h4 className="font-semibold mb-2">Request Method Distribution</h4>
                                <img src={`${imagesUrl}/request_method_distribution.png?key=${imgRefreshKey}`} alt="Request Method Distribution" className="w-full rounded" />
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <h4 className="font-semibold mb-2">Response Size Distribution</h4>
                                <img src={`${imagesUrl}/response_size_distribution.png?key=${imgRefreshKey}`} alt="Response Size Distribution" className="w-full rounded" />
                            </div>
                            <div className="bg-white rounded-lg shadow p-4">
                                <h4 className="font-semibold mb-2">OS Distribution</h4>
                                <img src={`${imagesUrl}/os_distribution.png?key=${imgRefreshKey}`} alt="OS Distribution" className="w-full rounded" />
                            </div>
                        </div>
                        </>
                    )}
                </main>
            </div>
            <ToastContainer />
        </>
    )
};