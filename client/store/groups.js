import axios from 'axios'

// action types

const SET_GROUPS = 'SET_GROUPS'

// action creators

const _setGroups = (groups) => ({
    type: SET_GROUPS,
    groups
})

// thunk

export const fetchGroups = () => {
    return async dispatch => {
        try {
            const { data } = await axios.get('/api/groups')
            return dispatch(_setGroups(data))
        } catch (error) {
            console.log(error)
        }
    } 
}

//reducer

export default function (state = [], action) {
    switch(action.type) {
        case SET_GROUPS: return action.groups
        default: return state
    }
}



