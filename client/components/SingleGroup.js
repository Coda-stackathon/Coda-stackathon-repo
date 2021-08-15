import React from 'react'
import { connect } from 'tone'
import { Link } from 'react-router-dom'



const SingleGroup = (props) => {

    const { group, styleId } = props
    const snippets = group.snippets

    return (

        <div>
            <h2 id={styleId}>{group.name}</h2>
            
        {snippets.map(snippet => (
            <div><Link to={`/snippets/${snippet.id}`} > {`< ${snippet.name} />`} </Link></div>
        )) }
        </div>
    )



}


export default SingleGroup