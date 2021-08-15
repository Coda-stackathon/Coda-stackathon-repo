import React from 'react'
import { connect } from 'react-redux'
import SingleGroup from './SingleGroup'

const ListGroups = (props) => {

    const { user } = props
    let groups = []
    if (user.id) groups = user.groups

    return (

        <div>
            {groups.map(group => (
                <div key={group.id}>
                <SingleGroup group={group} styleId="groupName" cards="true"/>
                </div>
            ))}
            
        </div>
    )


}

const mapStateToProps = state => ({
    user: state.auth
})

export default connect(mapStateToProps)(ListGroups)