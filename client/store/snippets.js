import axios from 'axios'
// actions type

const SET_SNIPPETS = 'SET_SNIPPETS'

// actions creator

const _setSnippets = (snippets) => ({
    type: SET_SNIPPETS,
    snippets
})


// thunks

export const fetchSnippets = () => {
    return async dispatch => {
        try {
            const { data } = await axios.get('/api/snippets')
            return dispatch(_setSnippets(data))
        } catch (error) {
            console.log(error)
        }
    } 
} 

export const fetchSnippet = (id) => {
    return async dispatch => {
        try {
            const { data } = await axios.get(`/api/snippets/${id}`)
            return dispatch(_setSnippets([data]))
        } catch (error) {
            console.log(error)
        }
    }
}




// reducer

export default function (state = [], action) {
    switch(action.type) {
        case SET_SNIPPETS: return action.snippets
        default: return state
    }
}