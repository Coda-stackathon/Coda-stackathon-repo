import React from 'react';
import { connect } from 'react-redux'
import Editor from './Editor'
import { fetchSnippet, saveSnippet } from '../../store/snippets';

class SingleSnippet extends React.Component {

  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.state = {
      snippet: {},
      html: '',
      css: '',
      js: '',
      srcDoc: ''
    }
  }

  async componentDidMount() {
    const { snippets } = await this.props.getSnippet(this.props.match.params.id)
    this.setState({
      html: snippets[0].contentHTML,
      css: snippets[0].contentCSS,
      js: snippets[0].contentJS,
      snippet: snippets
    })
    this.setSrcDoc()
  }


  handleChange(value, type) {
    this.setState({
      [type]: value
    })
    this.setSrcDoc()
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
       `
       this.setState({
         srcDoc
       })
  }

  async handleSave() {
    console.log('We are saving')
    const snippetInfo = {
      name: 'THIS IS A SNIPPET\'S NAME!',
      contentHTML: this.state.html,
      contentCSS: this.state.css,
      contentJS: this.state.js,
    }
    const newSnip = await this.props.saveSnippet(snippetInfo)
    console.log("THIS SHOULD BE A NEW SNIP: ", newSnip)
  }

  render() {

    const html = this.state.html
    const css = this.state.css
    const js = this.state.js
    const srcDoc = this.state.srcDoc
    const snippet = this.props.snippet[0]

    return  (
        snippet ? (
          <>
          <button onClick={this.handleSave}>Save</button>
          <h2>{snippet.name}</h2>
          <div className="pane top-pane">
            <Editor
              language="xml"
              displayName="HTML"
              value={html}
              onChange={(value) => this.handleChange(value, 'html')}
            />
            <Editor
              language="css"
              displayName="CSS"
              value={css}
              onChange={(value) => this.handleChange(value, 'css')}
            />
            <Editor
              language="javascript"
              displayName="JS"
              value={js}
              onChange={(value) => this.handleChange(value, 'js')}
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
        </>) : (<h3>This Snippet Doesn't Exist!!!!!</h3>)
  )
  }
}

const mapStateToProps = (state) => ({
  snippet: state.snippets,
  synths: state.synths
})

const mapDispatchToProps = dispatch => ({
  getSnippet: (id) => dispatch(fetchSnippet(id)),
  saveSnippet: (snippetInfo) => dispatch(saveSnippet(snippetInfo))
})


export default connect(mapStateToProps, mapDispatchToProps)(SingleSnippet)



