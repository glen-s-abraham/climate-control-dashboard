import Tabs from '../components/Tabs';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    return (
        <div className="container-fluid p-0">
            <Navbar />
            <div className="container">
                <h1 className="my-3 text-center">Live Dashboard</h1>
                <Tabs />
            </div>
        </div>
    );
};

export default Dashboard;