import React from 'react'
import { connect } from 'react-redux'
import { SingleGroup } from './SingleGroup'
import { fetchGroups } from '../../store/groups'

class ListGroups extends React.Component {

    constructor() {
        super()
        this.state = {
            groups: []
        }
    }



    async componentDidMount() {
        if (this.props.user.id) {
            this.setState({groups: this.props.user.groups})
        } else {
            const groups = await this.props.getGroups()
            this.setState({
                groups: groups.groups
            })
        }

    }

    componentDidUpdate() {
        if (this.props.user.id && this.state.groups !== this.props.user.groups){ 
            this.setState({groups: this.props.user.groups})
        }
    }

    render() {
        const groups = this.state.groups
        console.log(groups)
        return (
            <>
            {groups && groups.map(group => (
                <SingleGroup group={group} />
                ))
            }
            </>
        )
    }


}


const mapStateToProps = (state) => ({
    user: state.auth,
    groups: state.groups
})

const mapDispatchToProps = (dispatch) => ({
    getGroups: () => dispatch(fetchGroups())
})


export default connect(mapStateToProps, mapDispatchToProps)(ListGroups)
