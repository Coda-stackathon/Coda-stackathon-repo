import React from 'react';
import { connect } from 'react-redux'
import Editor from './Editor'
import { fetchSnippet } from '../../store/snippets';

class SingleSnippet extends React.Component {

  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      snippet: {},
      html: '',
      css: '',
      js: '',
      srcDoc: ''
    }
  }

  async componentDidMount() {
    const snippet = await this.props.getSnippet(this.props.match.params.id)
    this.setState({
      snippet
    })
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
           <script>${this.state.js}</script>
         </html>
       `
       this.setState({
         srcDoc
       })
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
  snippet: state.snippets
})

const mapDispatchToProps = dispatch => ({
  getSnippet: (id) => dispatch(fetchSnippet(id))
})


export default connect(mapStateToProps, mapDispatchToProps)(SingleSnippet)



