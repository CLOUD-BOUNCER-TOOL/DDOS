import "./Dashboard.css";
import WindowIcon from '@mui/icons-material/Window';
import GroupsIcon from '@mui/icons-material/Groups';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BlockedIpData from "../Components/BlockedIp";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import img1 from "../../../../../../Python/top_10_ip_addresses.png";
import img2 from "../../../../../../Python/requests_over_time.png";
import img3 from "../../../../../../Python/status_code_distribution.png";



export default function Dashboard() {

    const navigate = useNavigate();

    const onLogOut = () => {
        localStorage.clear();
        toast.success("Logout Successful");
        setTimeout(() => {
            navigate("/");
        }, 2000);

    }

    return (
        <>
            <div className="d-flex">
                <div className="dash-side-bar">
                    <div className="icon">
                        <h5>CloudBouncer</h5>
                    </div>
                    <div className="dash-nav-link">
                        <div className="dash-links">
                            <div className="dash-link-icon">
                                <WindowIcon />
                            </div>
                            <div>
                                Overview
                            </div>

                        </div>
                        <div className="dash-links">
                            <div className="dash-link-icon">
                                <AssessmentIcon />
                            </div>
                            Reports
                        </div>
                        <div className="dash-links">
                            <div className="dash-link-icon">
                                <GroupsIcon />
                            </div>
                            Customers
                        </div>
                        <div className="dash-links">
                            <div className="dash-link-icon">
                                <SettingsIcon />
                            </div>
                            Settings
                        </div>
                        <div className="dash-links">
                            <div className="dash-link-icon">
                                <CodeIcon />
                            </div>
                            Developer
                        </div>
                        <div className="dash-links" style={{ marginTop: "auto" }} onClick={onLogOut}>
                            <div className="dash-link-icon">
                                <LogoutIcon />
                            </div>
                            Logout
                        </div>

                    </div>
                </div>
                <div className="main-screen">
                    <div className="dash-nav">
                        <div>Dashboard</div>
                        <button style={{ border: "none", backgroundColor: "#fff" }} ><AccountCircleIcon fontSize="large" /></button>
                    </div>
                    <div className="graph-1">
                        <img src={img1} alt="request_time" />
                        <img src={img2} alt="request_time" />
                    </div>
                    <div className="graph-2">
                        <div className="blocked-ip">
                            <h3 style={{ margin: "10px" }}>Blocked IPs</h3>
                            <BlockedIpData />
                        </div>
                        <img src={img3} alt="" />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
};