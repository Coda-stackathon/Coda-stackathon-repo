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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { SaveSnippetCopy, AddInstrument } from "../modals";


class SingleSnippet extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.setSrcDoc = this.setSrcDoc.bind(this)
    this.snippetHasChanged = this.snippetHasChanged.bind(this)
    this.handleAddInstrument = this.handleAddInstrument.bind(this)

    this.state = {
      snippet: {},
      html: "",
      css: "",
      js: "",
      srcDoc: "",
      group: "",
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


  handleAddInstrument(event) {
    event.preventDefault()
    let newJs = `const ${event.target.instrumentName.value.replaceAll(' ', '_')} = coda.newInstrument('${event.target.instrument.value}') \n`
    let notesJs = ''
    if (event.target.notes.value.length > 0) {
      if (event.target.useSequencer.checked) {
        notesJs = `const notes = [${event.target.notes.value}] \n` +
        `const ${event.target.sequenceName.value.replaceAll(' ', '_')} = new coda.newSequence('8n') \n` +
        `${event.target.sequenceName.value.replaceAll(' ', '_')}.addNotes(notes) \n` +
        `${event.target.sequenceName.value.replaceAll(' ', '_')}.play(${event.target.instrumentName.value.replaceAll(' ', '_')}) \n`
      } else {
        notesJs = event.target.notes.value.split(',').reduce((accum, currentNote, index) => {
          return accum + `${event.target.instrumentName.value.replaceAll(' ', '_')}.playNote(${currentNote},'8n',${index}) \n`
        }, '')

      }
    }
    newJs += notesJs + this.state.js
    this.setState({
      js: newJs
    })
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
            <AddInstrument handleAddInstrument={this.handleAddInstrument} />
          </div>
        </div>

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
