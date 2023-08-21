import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button } from 'react-bootstrap';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEmail } from "./redux/emailActions"; // Import your action creator

function Login() {
  const [emailid, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [typeofuser, setTypeOfUser] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('danger');

  const signIn = async (event) => {
    event.preventDefault();
    const login = { emailid, password, typeofuser };
    try {
      const result = await axios.post("http://54.162.14.59:8080/login/signIn", login);
      if (result.data === "Admin Success") {
        dispatch(setEmail(emailid)); // Dispatch action to set email
        navigate("/Admin", { replace: true });
      } else if (result.data === "Customer success") {
        dispatch(setEmail(emailid)); // Dispatch action to set email
        navigate("/Customer", { replace: true });
      } else {
        setShowAlert(true);
      setAlertMessage(result.data);
      setAlertVariant('danger');
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Medicine App</h1>
      <h2>Login Page</h2>
      <form onSubmit={signIn}>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          name="emidlid"
          onChange={(e) => setEmailId(e.target.value)}
        />
        </div>
        <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        <div className="form-group">
        <label>TypeOfUser</label>
        <div className="form-check">
        <input
          type="radio"
          className="form-check-input" 
          name="typeofuser"
          value="admin"
          onChange={(e) => setTypeOfUser(e.target.value)}
        />
         <label className="form-check-label">Admin</label>
        </div>
        <div className="form-check">
        <input
          type="radio"
          className="form-check-input" 
          name="typeofuser"
          value="customer"
          onChange={(e) => setTypeOfUser(e.target.value)}
        />
        <label className="form-check-label">Customer</label>
                    </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                <button type="reset" className="btn btn-secondary btn-sm">Reset</button>
        <br/>
        <br/>
        <nav className="nav">
        <Link className="nav-link" to="signup">Click here to Sign Up</Link>
        </nav>
        </form>
        {showAlert && (
    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
        {alertMessage}
    </Alert>
    )}
        </div>
  );
}

export default Login;
