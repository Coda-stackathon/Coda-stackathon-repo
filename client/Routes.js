import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "./components/Home";
import { Loops } from "./components/Loops";
import { BinaryTree } from "./components/BinaryTree";
import { Amatrix } from "./components/Amatrix";
import { Snippet } from './components/snippet/Snippet'
import AllSnippets from './components/snippet/AllSnippets'
import SingleSnippet from "./components/snippet/SingleSnippet";
import { me } from "./store";
import ListGroups from "./components/ListGroups";

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData();
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <div>
        <Switch>
          <React.Fragment>
            <Route path="/home" component={Home} />
            <Route path="/loops" component={Loops} />
            <Route path="/binaryTree" component={BinaryTree} />
            <Route path="/aMatrix" component={Amatrix} />
            <Route path="/snippet" component={Snippet} />
            <Route path="/groups" component={ListGroups} />
            <Route exact path="/snippets" component={AllSnippets} />
            <Route path="/snippets/:id" component={SingleSnippet} />
            <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          </React.Fragment>
        </Switch>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.auth that has a truthy id.
    // Otherwise, state.auth will be an empty object, and state.auth.id will be falsey
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadInitialData() {
      dispatch(me());
    },
  };
};

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes));
