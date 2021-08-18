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
import { instrumentList } from '../../Coda objects/Coda'
import { saveSnippet } from '../../store/snippets';

class SaveCopyModal extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            instrument: 'simpleSynth',
            instrumentName: 'synthName',
            notes: ['\'D3\'','\'C3\'','\'D3\''],
            useSequencer: false,
            sequenceName: 'seq'
        }

        this.afterOpenModal = this.afterOpenModal.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.handleFormChange = this.handleFormChange.bind(this)
        this.handleSaveAs = this.handleSaveAs.bind(this)

        this.handleSubmit = this.handleSubmit.bind(this)

        this.customStyles = modalStyle()
        this.customStyles.content.height = "500px"
        this.subtitle = '';
        
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = "rgb(39, 39, 230)";
        this.subtitle.style.fontFamily = "'Roboto Mono', monospace";

      }
    
      openModal() {
        this.setState({ modalOpen: true, ...this.props.snippetInfo});
      }
    
      closeModal() {
        this.setState({ modalOpen: false, useSequencer: false });
      }
    
      handleFormChange(event) {
        let value = event.target.value
        if (event.target.name === 'useSequencer') {
          value = event.target.value == "true" ? true : false
        }
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

    handleSubmit(event) {
        event.preventDefault()
        this.props.handleAddInstrument(event)
        this.setState({
            modalOpen: false
        })
    }
    
    render() {
        return (
            <>
            <Button id="add-instrument" variant="outlined" onClick={this.openModal} style={{"justifySelf": "flexEnd"}}>Add Instrument</Button>
            <Modal
                isOpen={this.state.modalOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={this.customStyles}
                contentLabel="Add Instrument Modal"
                ariaHideApp={false}
            >
                <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }}
                >
                <h2 ref={(_subtitle) => (this.subtitle = _subtitle)}>Add instrument</h2>
                <Button onClick={this.closeModal}>close</Button>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <FormControl style={{ marginTop: "50px" }}>
                    <InputLabel
                        style={{ transform: "translateX(15px)", fontSize: "12px" }}
                        id="label"
                    >
                        Instrument Name
                    </InputLabel>
                    <Input
                        variant="outlined"
                        name="instrumentName"
                        value={this.state.instrumentName}
                        onChange={this.handleFormChange}
                    />
                    </FormControl>
                    <FormControl style={{ marginTop: "50px" }}>
                    <InputLabel
                        style={{ transform: "translateX(15px)", fontSize: "12px" }}
                        id="label"
                    >
                        Notes
                    </InputLabel>
                    <Input
                        variant="outlined"
                        name="notes"
                        value={this.state.notes}
                        onChange={this.handleFormChange}
                    />
                    </FormControl>

                    <FormControl style={{ marginTop: "50px" }}>
                    <FormControlLabel
                        control={<Checkbox checked={this.state.useSequencer} onChange={this.handleFormChange} name="useSequencer" value={!this.state.useSequencer}/>}
                        label="Use Sequencer"
                    />
                    </FormControl>
                    {this.state.useSequencer && 
                    <FormControl style={{ marginTop: "50px" }}>
                    <InputLabel
                        style={{ transform: "translateX(15px)", fontSize: "12px" }}
                        id="label"
                    >
                        Sequencer Name
                    </InputLabel>
                    <Input
                        variant="outlined"
                        name="sequenceName"
                        value={this.state.sequenceName}
                        onChange={this.handleFormChange}
                    />
                    </FormControl>
                    }
                    <FormControl style={{ marginTop: "50px" }}>
                    <InputLabel
                        style={{ transform: "translateX(15px)", fontSize: "12px" }}
                        id="label"
                    >
                        Instrument
                    </InputLabel>
                    <Select
                        style={{ width: "150px" }}
                        labelId="label"
                        id="select"
                        value={this.state.instrument}
                        onChange={this.handleFormChange}
                        name="instrument"
                    >
                        {instrumentList.map((name, index) => (
                        <MenuItem value={name} key={index}>
                            {name}
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

export const AddInstrument = connect(mapState,mapDispatch)(SaveCopyModal)