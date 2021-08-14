import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSnippets } from '../../store/snippets';
import { connect } from 'react-redux'
import { Box } from '@material-ui/core'


class AllSnippets extends React.Component{

    componentDidMount() {
        console.log('hello')
        this.props.getSnippets()
    }
    
    render () {
        console.log(`this.props.snippets`, this.props.snippets)
        return (
            <div id="snippets-container">
               {this.props.snippets.map(snippet => <Link to={`/snippets/${snippet.id}`} key={snippet.id}><div className="all-snippets-snippet"><p>{snippet.name}</p></div></Link>)}
            </div>
        )
    }
}

const mapState = (state) => ({
    snippets: state.snippets
})

const mapDispatch = (dispatch) => ({
    getSnippets: () => dispatch(fetchSnippets())
})

export default connect(mapState, mapDispatch)(AllSnippets)

