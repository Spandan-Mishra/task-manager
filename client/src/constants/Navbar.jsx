import { Link } from 'react-router-dom';

import "./Navbar.css"

const Navbar = () => {
    return (
        <div className='navbar'>
            <div>
                <Link to={"/todo"} >Todos</Link>
            </div>
            <div>
                <Link to={"/signup"} >Signup</Link>
            </div>
            <div>
                <Link to={"/login"} >Login</Link>
            </div> 
        </div>
    )
}

export default Navbar;