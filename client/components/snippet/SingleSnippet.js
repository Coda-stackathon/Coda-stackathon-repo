import React from "react";
import { connect } from "react-redux";
import Editor from "./Editor";
import { fetchSnippet, saveSnippet, updateSnippet } from "../../store/snippets";
import Modal from "react-modal";
import {
  Button,
  Input,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";
import Coda from '../../Coda objects/Coda'
import { loadingHtml, loadingCss, loadingJs } from "../../Coda objects/loading";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

toast.configure()

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

class SingleSnippet extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleSaveAs = this.handleSaveAs.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.modalForm = this.modalForm.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.setSrcDoc = this.setSrcDoc.bind(this)
    this.snippetHasChanged = this.snippetHasChanged.bind(this)

    this.state = {
      snippet: {},
      html: "",
      css: "",
      js: "",
      srcDoc: "",
      modalOpen: false,
      group: "",
      name: "",
    };
  }

  async componentDidMount() {
    const { snippets } = await this.props.getSnippet(
      this.props.match.params.id
    );
    this.setState({
      html: snippets[0].contentHTML,
      css: snippets[0].contentCSS,
      js: snippets[0].contentJS,
      snippet: snippets,
    });
  }

  handleChange(value, type) {
    this.setState({
      [type]: value,
    });
  }

  // const npm = p => import(\`https://unpkg.com/\${p}?module\`);
  //         (async () => {
  //           const Tone = await npm('tone');
  // })()

  setSrcDoc() {
    const jsWithSpace = this.state.js + ' ';
    const srcDoc = `
         <html>
           <body>${loadingHtml} ${this.state.html}</body>
           <style>${loadingCss} ${this.state.css}</style>
           <link href="https://fonts.googleapis.com/css?family=Material+Icons&display=block" rel="stylesheet"/>
           <script src="https://tonejs.github.io/build/Tone.js"></script>
           <script src="https://tonejs.github.io/examples/js/tone-ui.js"></script>
           <script src="https://tonejs.github.io/examples/js/components.js"></script>
           <script>
            ${loadingJs}
            ${Coda}
           ${jsWithSpace}
           </script>
         </html>
       `
    this.setState({
      srcDoc,
      js: jsWithSpace
    });
  }

  async handleSaveAs(event) {
    event.preventDefault();
    const snippetInfo = {
      name: this.state.name,
      contentHTML: this.state.html,
      contentCSS: this.state.css,
      contentJS: this.state.js,
      group: this.state.group,
      id: this.props.match.params.id
    };
    const newSnip = await this.props.saveSnippet(snippetInfo);
    this.setState({ modalOpen: false });
    this.props.history.push(`/snippets/${newSnip.snippets[0].id}`)
  }

  async handleSave(event) {
    event.preventDefault();
    const snippetInfo = {
      name: this.state.snippet[0].name,
      contentHTML: this.state.html,
      contentCSS: this.state.css,
      contentJS: this.state.js,
      group: this.state.group,
      id: this.props.match.params.id
    };
    await this.props.updateSnippet(snippetInfo)
    toast.success("Snippet saved!", {position: toast.POSITION.TOP_CENTER, autoClose: 1500})
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "rgb(39, 39, 230)";
    subtitle.style.fontFamily = "'Roboto Mono', monospace";
  }

  openModal() {
    const groupIds = this.props.user.groups.map(group => (group.id))
    console.log("Conditional", groupIds.includes(this.state.snippet[0].groupId))
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  handleFormChange(event) {
    console.log("this.state.name", this.state.name);
    console.log("this.state.group", this.state.group);
    console.log('event.currentTarget.getAttribute("name")', event.target.name);
    console.log("event.target.value", event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  modalForm() {
    return (
      <Modal
        isOpen={this.state.modalOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Save Snippet</h2>
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

  snippetHasChanged(snippet, state) {
    if(snippet.html !== state.html) true
    if(snippet.css !== state.css) true 
    if(snippet.js !== state.js) true
    return false
  }

  render() {
    const html = this.state.html;
    const css = this.state.css;
    const js = this.state.js;
    const srcDoc = this.state.srcDoc;
    const snippet = this.props.snippet[0];
    const groupIds = this.props.user.id && this.props.user.groups.map(group => (group.id))
    const userGroupValidation = groupIds && groupIds.includes(snippet.groupId)
    return snippet ? (
      <>
        <div className="save-buttons">
        <ToastContainer />
        {userGroupValidation && <Button variant="outlined" onClick={this.handleSave} style={{"marginRight": "10px"}}>Save</Button>} 
        {this.props.user.id && <Button variant="outlined" onClick={this.openModal} style={{"marginRight": "10px"}}>Save a copy</Button>}
        </div>
        {this.modalForm()}
            <div className="run-button-and-name">
        <h2 className='snippet-name'>{snippet.name}</h2>
            <Button variant="outlined" onClick={this.setSrcDoc} style={{"height":"50px"}}>RUN</Button>
            </div>
        {!this.state.modalOpen && (
          <React.Fragment>
            <div className="pane top-pane">
              <Editor
                language="xml"
                displayName="HTML"
                value={html}
                onChange={(value) => this.handleChange(value, "html")}
              />
              <Editor
                language="css"
                displayName="CSS"
                value={css}
                onChange={(value) => this.handleChange(value, "css")}
              />
              <Editor
                language="javascript"
                displayName="JS"
                value={js}
                onChange={(value) => this.handleChange(value, "js")}
              />
            </div>
            <div className="pane">
              <iframe
                srcDoc={srcDoc}
                title="output"
                sandbox="allow-scripts"
                frameBorder="0"
                width="100%"
                height="100%"
              />
            </div>
          </React.Fragment>
        )}
      </>
    ) : (
      <h3 className="snippet-loading">Loading...</h3>
    );
  }
}

const mapStateToProps = (state) => ({
  snippet: state.snippets,
  synths: state.synths,
  user: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  getSnippet: (id) => dispatch(fetchSnippet(id)),
  saveSnippet: (snippetInfo) => dispatch(saveSnippet(snippetInfo)),
  updateSnippet: (snippetInfo) => dispatch(updateSnippet(snippetInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleSnippet);
