import React from 'react'
import { connect } from 'tone'
import { Link } from 'react-router-dom'



const SingleGroup = (props) => {

    const { group, styleId, cards } = props
    const snippets = group.snippets
    let snippetClass = "noclass"
    let snippetContainer = "noclass"
    if (cards === 'true') {
        snippetClass = "all-snippets-snippet"
        snippetContainer = "snippets-container"
        }

    return (

        <div>
            <h1 className={styleId}>{group.name}</h1>
            <div className={snippetContainer}>
        {snippets.map(snippet => {
            let snipName = snippet.name
            if (cards !== 'true') snipName = `< ${snipName} />`
            return (
                <Link to={`/snippets/${snippet.id}`} key={snippet.id}>
                    <div className={snippetClass}>
                        <p>{snipName}</p>
                    </div>
                </Link>
            )
            })}
            </div>
        </div>
    )



}


export default SingleGroup