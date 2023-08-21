import {Link,Outlet} from 'react-router-dom';

function Admin() {

    return(
        <div className="container mt-4">
            <h2>Welcome to Admin Home Page</h2>
            <nav className="nav">
            <Link className="nav-link" to="viewMedicine">View Medicine</Link>
            <Link className="nav-link" to="/">Logout</Link>
            </nav>
            <hr className="my-4" />
            <div className="mt-4">
            <Outlet></Outlet>
        </div>
        </div>
    )

}

export default Admin;