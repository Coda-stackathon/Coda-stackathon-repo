import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchSnippets, saveSnippet } from "../../store/snippets";
import { connect } from "react-redux";
import {
    Button,
    Input,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    Checkbox,
  } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    width: "400px",
    height: "300px",
  },
};

let subtitle;

class AllSnippets extends React.Component {
  constructor() {
    super();
    this.state = {
      isActive: false,
      modalOpen: false,
      name: '',
      group: ''
    };
    this.pressButton = this.pressButton.bind(this);
    this.releaseButton = this.releaseButton.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSaveAs = this.handleSaveAs.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this)
  }

  pressButton() {
    this.setState({ isActive: true });
  }

  releaseButton() {
    this.setState({ isActive: false });
    if (this.props.user.id) {
        this.openModal();
    } else {
        toast.error("Please log in to create snippet", {position: toast.POSITION.TOP_CENTER, autoClose: 3000})
    }
  }

  componentDidMount() {
    this.props.getSnippets();
  }

  handleClick() {
    this.props.history.push("/newSnippet");
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "rgb(39, 39, 230)";
    subtitle.style.fontFamily = "'Roboto Mono', monospace";
  }

  openModal() {
    const groups = this.props.user.groups;
    const user = this.props.user;
    console.log("user", user);
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  async handleSaveAs(event) {
    event.preventDefault();
    const snippetInfo = {
      name: this.state.name,
      contentHTML: '',
      contentCSS: '',
      contentJS: '',
      group: this.state.group
    };
    const newSnip = await this.props.saveSnippet(snippetInfo);
    // this.setState({ modalOpen: false });
    this.props.history.push(`/snippets/${newSnip.snippets[0].id}`);
  }

  handleFormChange(event) {
    let value = event.target.value
    this.setState({ [event.target.name]: value });
  }

  modalForm() {
    return (
      <Modal
        isOpen={this.state.modalOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles}
        contentLabel="Create new snippet"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Create Snippet</h2>
          <Button onClick={this.closeModal}>close</Button>
        </div>
        {this.props.user.id && (
          <form onSubmit={this.handleSaveAs}>
            <FormControl style={{ marginTop: "50px" }}>
              <InputLabel
                style={{ transform: "translateX(15px)", fontSize: "12px" }}
                id="label"
              >
                Snippet name
              </InputLabel>
              <Input
                variant="outlined"
                name="name"
                value={this.state.name}
                onChange={this.handleFormChange}
              />
            </FormControl>
            <FormControl style={{ marginTop: "50px" }}>
              <InputLabel
                style={{ transform: "translateX(15px)", fontSize: "12px" }}
                id="label"
              >
                Snippet group
              </InputLabel>
              <Select
                style={{ width: "150px" }}
                labelId="label"
                id="select"
                value={this.state.group}
                onChange={this.handleFormChange}
                name="group"
              >
                {this.props.user.groups.map((group) => (
                  <MenuItem value={group.id} key={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                style={{ marginTop: "50px" }}
                type="submit"
                variant="outlined"
              >
                Confirm
              </Button>
            </FormControl>
          </form>
        )}
      </Modal>
    );
  }

  render() {
    return (
      <div id="snippets-container">
        {this.modalForm()}
        <div
          id="create-snippet-button"
          className={
            this.state.isActive ? "button-clicked" : "button-unclicked"
          }
          onMouseDown={() => this.pressButton()}
          onMouseUp={() => this.releaseButton()}
        >
          New Snippet
          <FontAwesomeIcon icon={faPlus} />
        </div>
        {this.props.snippets.map((snippet) => (
          <Link to={`/snippets/${snippet.id}`} key={snippet.id}>
            <div className="all-snippets-snippet">
              <p>{snippet.name}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  }
}

const mapState = (state) => ({
  snippets: state.snippets,
  user: state.auth,
});

const mapDispatch = (dispatch) => ({
  getSnippets: () => dispatch(fetchSnippets()),
  saveSnippet: (snippetInfo) => dispatch(saveSnippet(snippetInfo)),
});

export default connect(mapState, mapDispatch)(AllSnippets);
