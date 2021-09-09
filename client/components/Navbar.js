import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import { Login, Signup } from './modals'
import { toast } from 'react-toastify'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div className="header">
    <Link to='/home'>
    <div id="title">
    <h1>{'{coda}'}</h1>
    <h3>making music with code</h3>
    </div>
    </Link>
    <nav>
      {isLoggedIn ? (
        <div className="navbar">
          {/* The navbar will show these links after you log in */}
          <Link to="/snippets">Browse Snippets</Link>
          {/* <Link to="/blog">Blog</Link> */}
          <Link to="/home">Home</Link>
          <a onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div className="navbar">
          {/* The navbar will show these links before you log in */}
          <Link to="/snippets">Browse Snippets</Link>
          {/* <Link to="/blog">Blog</Link> */}
          <Link to="/home">Home</Link>
          {/* <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link> */}
          <Login />
          <Signup />
        </div>
      )}
    </nav>
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.auth.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
      toast.error('logged out', {position: toast.POSITION.TOP_CENTER, autoClose: 3000})
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)
