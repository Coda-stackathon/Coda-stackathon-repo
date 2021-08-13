import React from "react";
import { connect } from "react-redux";
import Editor from "./Editor";
import { fetchSnippet, saveSnippet } from "../../store/snippets";
import Modal from "react-modal";
import {
  Button,
  Input,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@material-ui/core";

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
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.modalForm = this.modalForm.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);

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
    this.setSrcDoc();
  }

  handleChange(value, type) {
    this.setState({
      [type]: value,
    });
    this.setSrcDoc();
  }

  setSrcDoc() {
    const srcDoc = `
         <html>
           <body>${this.state.html}</body>
           <style>${this.state.css}</style>
           <script>
           const npm = p => import(\`https://unpkg.com/\${p}?module\`);
          (async () => {
            const Tone = await npm('tone');
           ${this.state.js}
          })()
           </script>
         </html>
       `;
    this.setState({
      srcDoc,
    });
  }

  async handleSave(event) {
    event.preventDefault();
    console.log(this.props.user);
    const snippetInfo = {
      name: this.state.name,
      contentHTML: this.state.html,
      contentCSS: this.state.css,
      contentJS: this.state.js,
      group: this.state.group
    };
    const newSnip = await this.props.saveSnippet(snippetInfo);
    this.setState({ modalOpen: false });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "rgb(39, 39, 230)";
    subtitle.style.fontFamily = "'Roboto Mono', monospace";
  }

  openModal() {
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
          <form onSubmit={this.handleSave}>
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
    const html = this.state.html;
    const css = this.state.css;
    const js = this.state.js;
    const srcDoc = this.state.srcDoc;
    const snippet = this.props.snippet[0];

    return snippet ? (
      <>
        <button onClick={this.openModal}>Save</button>
        {this.modalForm()}
        <h2>{snippet.name}</h2>
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
      <h3>This Snippet Doesn't Exist!!!!!</h3>
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleSnippet);
