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
            const { data } = await axios.get(`/api/snippets/${id}`, {headers:{authorization: window.localStorage.getItem('token')}})
            return dispatch(_setSnippets([data]))
        } catch (error) {
            console.log(error)
        }
    }
}

export const saveSnippet = (snippetInfo) => {
    return async dispatch => {
        try {
            const { data } = await axios.post('/api/snippets', snippetInfo, {headers:{authorization: window.localStorage.getItem('token')}})
            return dispatch(_setSnippets([data]))
        } catch (err) {
            console.log(err)
        }
    }
}

export const updateSnippet = (snippetInfo) => {
    return async dispatch => {
        try {
            const { id } = snippetInfo
            const { data } = await axios.put(`/api/snippets/${id}`, snippetInfo, {headers:{authorization: window.localStorage.getItem('token')}})
            console.log(`data`, data)
            // return dispatch(_setSnippets([data]))
        } catch (err) {
            console.log(err)
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