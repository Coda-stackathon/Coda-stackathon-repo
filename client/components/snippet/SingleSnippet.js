import React from "react";
import { connect } from "react-redux";
import Editor from "./Editor";
import { fetchSnippet, updateSnippet } from "../../store/snippets";
import Modal from "react-modal";
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
import Coda, { instrumentList } from '../../Coda objects/Coda'
import { loadingHtml, loadingCss, loadingJs } from "../../Coda objects/loading";
// import { ToastContainer, toast } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { SaveSnippetCopy } from "../modals";


const addFormCustomStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    width: "400px",
    height: "500px",
  },
};

let subtitle;

class SingleSnippet extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.setSrcDoc = this.setSrcDoc.bind(this)
    this.snippetHasChanged = this.snippetHasChanged.bind(this)

    this.afterOpenModalAdd = this.afterOpenModalAdd.bind(this);
    this.closeModalAdd = this.closeModalAdd.bind(this);
    this.openModalAdd = this.openModalAdd.bind(this);
    this.modalAddForm = this.modalAddForm.bind(this);
    this.handleAddInstrument = this.handleAddInstrument.bind(this)

    this.state = {
      snippet: {},
      html: "",
      css: "",
      js: "",
      srcDoc: "",
      modalAddOpen: false,
      group: "",
      name: "",
      instrument: 'simpleSynth',
      instrumentName: 'synthName',
      notes: ['\'D3\'','\'C3\'','\'D3\''],
      useSequencer: false,
      sequenceName: 'seq'
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


  handleFormChange(event) {
    let value = event.target.value
    if (event.target.name === 'useSequencer') {
      value = event.target.value == "true" ? true : false
    }
    this.setState({ [event.target.name]: value });
  }

  handleAddInstrument(event) {
    event.preventDefault()
    let newJs = `const ${this.state.instrumentName.replaceAll(' ', '_')} = coda.newInstrument('${this.state.instrument}') \n`
    let notesJs = ''
    if (this.state.notes.length > 0) {
      if (!this.state.useSequencer) {
        notesJs = this.state.notes.reduce((accum, currentNote, index) => {
          return accum + `${this.state.instrumentName.replaceAll(' ', '_')}.playNote(${currentNote},'8n',${index}) \n`
        }, '')
      } else {
        notesJs = `const notes = [${this.state.notes}] \n` +
        `const ${this.state.sequenceName} = new coda.newSequence('8n') \n` +
        `${this.state.sequenceName}.addNotes(notes) \n` +
        `${this.state.sequenceName}.play(${this.state.instrumentName}) \n`
      }
    }
    newJs += notesJs + this.state.js
    this.setState({
      modalAddOpen: false,
      js: newJs
    })
  }


  afterOpenModalAdd() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "rgb(39, 39, 230)";
    subtitle.style.fontFamily = "'Roboto Mono', monospace";
  }

  openModalAdd() {
    const groupIds = this.props.user.groups.map(group => (group.id))
    this.setState({ modalAddOpen: true });
  }

  closeModalAdd() {
    this.setState({ modalAddOpen: false });
  }

  // Add Instrument Form
  modalAddForm() {
    return (
      <Modal
        isOpen={this.state.modalAddOpen}
        onAfterOpen={this.afterOpenModalAdd}
        onRequestClose={this.closeModalAdd}
        style={addFormCustomStyles}
        contentLabel="Add Instrument Modal"
        ariaHideApp={false}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Add instrument</h2>
          <Button onClick={this.closeModalAdd}>close</Button>
        </div>
          <form onSubmit={this.handleAddInstrument}>
            <FormControl style={{ marginTop: "50px" }}>
              <InputLabel
                style={{ transform: "translateX(15px)", fontSize: "12px" }}
                id="label"
              >
                Instrument Name
              </InputLabel>
              <Input
                variant="outlined"
                name="instrumentName"
                value={this.state.instrumentName}
                onChange={this.handleFormChange}
              />
            </FormControl>
            <FormControl style={{ marginTop: "50px" }}>
              <InputLabel
                style={{ transform: "translateX(15px)", fontSize: "12px" }}
                id="label"
              >
                Notes
              </InputLabel>
              <Input
                variant="outlined"
                name="notes"
                value={this.state.notes}
                onChange={this.handleFormChange}
              />
            </FormControl>

            <FormControl style={{ marginTop: "50px" }}>
              <FormControlLabel
                control={<Checkbox checked={this.state.useSequencer} onChange={this.handleFormChange} name="useSequencer" value={!this.state.useSequencer}/>}
                label="Use Sequencer"
              />
            </FormControl>
            {this.state.useSequencer && 
            <FormControl style={{ marginTop: "50px" }}>
              <InputLabel
                style={{ transform: "translateX(15px)", fontSize: "12px" }}
                id="label"
              >
                Sequencer Name
              </InputLabel>
              <Input
                variant="outlined"
                name="sequenceName"
                value={this.state.sequenceName}
                onChange={this.handleFormChange}
              />
            </FormControl>
            }
            <FormControl style={{ marginTop: "50px" }}>
              <InputLabel
                style={{ transform: "translateX(15px)", fontSize: "12px" }}
                id="label"
              >
                Instrument
              </InputLabel>
              <Select
                style={{ width: "150px" }}
                labelId="label"
                id="select"
                value={this.state.instrument}
                onChange={this.handleFormChange}
                name="instrument"
              >
                {instrumentList.map((name, index) => (
                  <MenuItem value={name} key={index}>
                    {name}
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
    const userGroupValidation = (groupIds && snippet) && groupIds.includes(snippet.groupId)
    const snippetInfo = { html, css, js }

    return snippet ? (
      <div id="singleSnippetContainter">
        {/* <ToastContainer /> */}
        <div className="buttons-div">
        <div>
        {/* save button */}
        {userGroupValidation && <Button variant="outlined" onClick={this.handleSave} style={{"marginRight": "10px"}}>Save</Button>}
         {/*save as button  */}
        
        {this.props.user.id && <SaveSnippetCopy history={this.props.history} snippetInfo={snippetInfo}/>}

        </div>
        <div>
        {/* add instrument button */}
        <Button id="add-instrument" variant="outlined" onClick={this.openModalAdd} style={{"justifySelf": "flexEnd"}}>Add Instrument</Button>
        </div>
        </div>
        {this.modalAddForm()}

            <div className="run-button-and-name">
        <h2 className='snippet-name'>{snippet.name}</h2>
            <Button variant="outlined" onClick={this.setSrcDoc} style={{"height":"50px"}}>RUN</Button>
            </div>

        
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
      </ div>
    ) : (
      <h3 className="snippet-loading">Loading...</h3>
    );
  }
}

const mapStateToProps = (state) => ({
  snippet: state.snippets,
  user: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  getSnippet: (id) => dispatch(fetchSnippet(id)),
  updateSnippet: (snippetInfo) => dispatch(updateSnippet(snippetInfo))
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleSnippet);
