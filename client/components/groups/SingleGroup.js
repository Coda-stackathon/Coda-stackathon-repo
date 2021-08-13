import React from 'react'
import { Link } from 'react-router-dom'


export const SingleGroup = (props) => {

    const group = props.group
    return (
        <>
            <Link to={`/groups/${group.id}`}><h2>{group.name}:</h2></Link>
            {group.snippets.map(snippet => (
                <div>
                    <Link to={`/snippets/${snippet.id}`}>{`< ${snippet.name} />`}</Link>
                </div>
            ))
            }
        </>
    )


}