import { Link, useLocation, Outlet } from 'react-router-dom';
import './App.css'; // Import your CSS file

function Customer() {
    return (
        <div className="container mt-4">
            <h2>Welcome to Customer Home Page</h2>
            <nav className="nav">
            <Link className="nav-link" to="viewMedicine">View Medicine </Link>
            <Link className="nav-link" to="order-details">Order Details </Link>
            <Link className="nav-link" to="/">Logout</Link>
            </nav>
            <hr className="my-4" />
            <div className="mt-4">
            <Outlet></Outlet>
            </div>
        </div>
    );
}

export default Customer;
