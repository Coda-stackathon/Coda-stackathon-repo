import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import notes from "../../public/lotties/notes";
import laptop from "../../public/lotties/laptop";
import SingleGroup from "./SingleGroup";

/**
 * COMPONENT
 */
export const Home = (props) => {
  const { user } = props;
  const username = user.username
  const [isActive, setActive] = useState(false);

  const pressButton = () => {
    setActive(true);
  };

  const releaseButton = () => {
    setActive(false);
  };

  const notesOptions = {
    loop: true,
    autoplay: true,
    animationData: notes,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const laptopOptions = {
    loop: true,
    autoplay: true,
    animationData: laptop,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="parent-div">
      <div className="greeting">
        {username && (<h3>user: {username}</h3>)}
      </div>
      <div className="links-sidebar">
        {username && <SingleGroup group={user.groups[0]} styleId="sidebar-header"/>}
      </div>
      <div id="hero-text">
        <h1>{"{coda}"}</h1>
        <div>
        <p>a web application for the exploration of{"   {"}</p>
        <p>{"(music && code)"}</p>
        <p>{"}"}</p>
        <div id="get-started-button" className={isActive ? 'button-clicked': 'button-unclicked'} onMouseDown={()=> pressButton()} onMouseUp={()=> releaseButton()} >Get Started</div>
        </div>
      </div>
      <div id="homepage-animation">
        <div id="notes-animation">
          <Lottie options={notesOptions}  width={800}/>
        </div>
        <div id="laptop-animation">
          <Lottie options={laptopOptions} width={800}/>
        </div>
      </div>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    user: state.auth,
  };
};

export default connect(mapState)(Home);
