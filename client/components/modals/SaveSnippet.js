import React from 'react'
import Modal from "react-modal"
import {authenticate} from '../../store'
import {
  Button,
  Input,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import modalStyle from './modalStyle';
import { saveSnippet } from '../../store/snippets';

class SaveModal extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            group: '',
            name: ''
        }

        this.afterOpenModal = this.afterOpenModal.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.handleFormChange = this.handleFormChange.bind(this)
        this.handleSaveAs = this.handleSaveAs.bind(this)

        this.customStyles = modalStyle()
        this.subtitle = '';
        
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = "rgb(39, 39, 230)";
        this.subtitle.style.fontFamily = "'Roboto Mono', monospace";

      }
    
      openModal() {
        this.setState({ modalOpen: true, ...this.props.snippetInfo});
        console.log(this.state)
      }
    
      closeModal() {
        this.setState({ modalOpen: false });
      }
    
      handleFormChange(event) {
        let value = event.target.value
        this.setState({ [event.target.name]: value });
      }

    async handleSaveAs(event) {
        event.preventDefault();
        const snippetInfo = {
        name: this.state.name,
        contentHTML: this.state.html,
        contentCSS: this.state.css,
        contentJS: this.state.js,
        group: this.state.group,
        // id: this.props.match.params.id
        };
        const newSnip = await this.props.saveSnippet(snippetInfo);
        console.log(this.props.history)
        this.setState({ modalOpen: false });
        this.props.history.push(`/snippets/${newSnip.snippets[0].id}`)
    }
    
    render() {
        return (
            <>
            <Button variant="outlined" onClick={this.openModal} style={{"marginRight": "10px"}}>Save a copy</Button>
            <Modal
                isOpen={this.state.modalOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={this.customStyles}
                contentLabel="Save Snippet"
                ariaHideApp={false}
            >
                <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
                >
                <h2 ref={(_subtitle) => (this.subtitle = _subtitle)}>Save Snippet</h2>
                <Button onClick={this.closeModal}>close</Button>
                </div>
                {this.props.user.id && (
                <form onSubmit={this.handleSaveAs}>
                    <FormControl style={{ marginTop: "50px" }}>
                    <InputLabel
                        style={{ transform: "translateX(15px)", fontSize: "12px" }}
                        id="label"
                    >
                        Snippet name
                    </InputLabel>
                    <Input
                        variant="outlined"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleFormChange}
                    />
                    </FormControl>
                    <FormControl style={{ marginTop: "50px" }}>
                    <InputLabel
                        style={{ transform: "translateX(15px)", fontSize: "12px" }}
                        id="label"
                    >
                        Snippet group
                    </InputLabel>
                    <Select
                        style={{ width: "150px" }}
                        labelId="label"
                        id="select"
                        value={this.state.group}
                        onChange={this.handleFormChange}
                        name="group"
                    >
                        {this.props.user.groups.map((group) => (
                        <MenuItem value={group.id} key={group.id}>
                            {group.name}
                        </MenuItem>
                        ))}
                    </Select>
                    <Button
                        style={{ marginTop: "50px" }}
                        type="submit"
                        variant="outlined"
                    >
                        Confirm
                    </Button>
                    </FormControl>
                </form>
                )}
            </Modal>
            </>
        );
    }
}

const mapState = state => ({
    user: state.auth
})

const mapDispatch = dispatch => ({
    saveSnippet: (snippetInfo) => dispatch(saveSnippet(snippetInfo))

})

export const SaveSnippet = connect(mapState,mapDispatch)(SaveModal)