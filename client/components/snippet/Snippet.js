import React, { useState, useEffect } from 'react';
import Editor from './Editor'
import useLocalStorage from './hooks/useLocalStorage'
import { loadingHtml, loadingCss, loadingJs } from "../../Coda objects/loading";
import { Button } from '@material-ui/core';

export const Snippet = () => {
  const [html, setHtml] = useLocalStorage('html', '')
  const [css, setCss] = useLocalStorage('css', '')
  const [js, setJs] = useLocalStorage('js', '')
  const [srcDoc, setSrcDoc] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${loadingHtml} ${html}</body>
          <style>${loadingCss} ${css}</style>
          <script src="https://tonejs.github.io/build/Tone.js"></script>
          <script>${loadingJs} ${js}</script>
        </html>
      `)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [html, css, js])

  return (
    <>
    <div className="run-button-and-name">
            <Button variant="outlined" onClick={setSrcDoc} style={{"height":"50px"}}>RUN</Button>
            </div>
      <div className="pane top-pane">
        <Editor
          language="xml"
          displayName="HTML"
          value={html}
          onChange={setHtml}
        />
        <Editor
          language="css"
          displayName="CSS"
          value={css}
          onChange={setCss}
        />
        <Editor
          language="javascript"
          displayName="JS"
          value={js}
          onChange={setJs}
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
    </>
  )
}

