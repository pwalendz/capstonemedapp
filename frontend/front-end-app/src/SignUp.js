import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import axios from 'axios';
function SignUp() {

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');
let [emailid,setEmailiId]=useState("");
let [password,setPassword]=useState("");
let [typeofuser,setTypeOfUser]=useState("");
let navigate = useNavigate(); 

let signIn=async (event)=> {
    event.preventDefault();
    let login = {"emailid":emailid,"password":password,"typeofuser":typeofuser};
    try{
    let result = await axios.post("http://54.162.14.59:8080/login/signUp",login);
    console.log(result.data);
    setShowAlert(true);
    setAlertMessage(result.data);
       setAlertVariant('success');
       setEmailiId("");
            setPassword("");
    }catch(ex){
        console.log(ex);
    }
}
    return(
        <div className="container mt-4">
            <h1>Medicine App</h1>
        <h2>Sign Up</h2>
        <form onSubmit={signIn}>
        <div className="form-group">
        <label>Email</label>
        <input type="email" className="form-control" name="emidlid" value={emailid} onChange={e=>setEmailiId(e.target.value)}/>
        </div>
        <div className="form-group">
        <label>Password</label>
        <input type="password" className="form-control" name="password" value={password} onChange={e=>setPassword(e.target.value)}/>
        </div>
        <div className="form-group">
        <label>TypeOfUser</label>
        <div className="form-check">
        <input type="radio" className="form-check-input" name="typeofuser" value="admin" onChange={e=>setTypeOfUser(e.target.value)}/>
        <label className="form-check-label">Admin</label>
        </div>
        <div className="form-check">
        <input type="radio" className="form-check-input" name="typeofuser" value="customer" onChange={e=>setTypeOfUser(e.target.value)}/>
        <label className="form-check-label">Customer</label>
                    </div>
                    </div>
        <button type="submit" className="btn btn-primary btn-sm">Submit</button>
                <button type="reset" className="btn btn-secondary btn-sm">Reset</button>
        <br/>
        <br/>
        <nav className="nav">
        <Link className="nav-link" to="/">Login Page</Link>
        </nav>
        </form>
        {showAlert && (
    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
        {alertMessage}
    </Alert>
)}
        </div>
    )
}

export default SignUp;