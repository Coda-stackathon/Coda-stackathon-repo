import React from "react";
import { Button } from "@material-ui/core";
import * as Tone from "tone";
import { Synth } from "tone";
import brace from "brace"
import AceEditor from "react-ace"
import 'brace/mode/javascript'
import 'brace/theme/github'


export class Loops extends React.Component {
  constructor() {
    super();
    this.state = {
      soundSource: new Tone.Synth().toDestination(),
      notes: ["C4", "E4", "F4", "G4"],
      sequence: [],
      duration: "16n",
      transportSpeed: 250,
      transport: null,
      playing: false,
      code: "",
      errorMessage: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this)
    this.playNote = this.playNote.bind(this);
    this.generatePattern = this.generatePattern.bind(this);
    this.playPattern = this.playPattern.bind(this);
  }

  handleChange(event) {
    if (event.target.name === 'notes') {
        if (this.state.playing === false) {
            this.setState({
                errorMessage: "",
                notes: event.target.value.split(',')
            })
        } else {
            this.setState( {errorMessage: "can't change notes while playing"} )
            throw new Error('cannot modify while playing')
        }
    } else {
        this.setState({
          [event.target.name]: event.target.value,
        });
    }
  }

  handleCodeChange(event) {
    console.log(event)
    this.setState({ code: event })
  }

  playNote(note, duration) {
    this.state.soundSource.triggerAttackRelease(note, duration);
  }

  generatePattern() {
    let pattern = [];
    let notesArrayLength = this.state.notes.length;
    eval(this.state.code);
    this.setState({ sequence: pattern });
  }

  async playPattern() {
    if (this.state.playing) {
      this.setState({ playing: false });
      clearInterval(this.state.transport);
    } else if (!this.state.playing) {
      this.setState({ playing: true });
      let duration = this.state.duration;
      let seqPosition = 0;
      let seqArrayLength = this.state.sequence.length;
      let currentNote = this.state.notes[this.state.sequence[seqPosition]];

      this.setState({
        transport: setInterval(() => {
          this.playNote(currentNote, duration);
          seqPosition = (seqPosition + 1) % seqArrayLength;
          currentNote = this.state.notes[this.state.sequence[seqPosition]];
        }, this.state.transportSpeed),
      });
    }
  }

  render() {
    const code = this.state.code;
    const notes = this.state.notes;
    const transportSpeed = this.state.transportSpeed;
    const errorMessage = this.state.errorMessage;
    const exampleCode = 
    `for (let i = 0; i < notesArrayLength; i++) { 
        pattern.push(i)
        for (let j = 0; j < i; j++) {
          pattern.push(j)
          for (let k = 0; k < j; k++) {
            pattern.push(k)
          }
        }
      }`
    return (
      <div className="parent-div">
        <h1>Loops</h1>
        {/* <p>notes: [ {this.state.notes.join("  ")} ]</p> */}
        <label>playback speed in ms</label>
        <input name='transportSpeed' value={transportSpeed} onChange={this.handleChange}></input>
        <div id='notes-label-div'>
        <label>notes</label>
        <p>{errorMessage}</p>
        </div>
        <input name='notes' value={notes} onChange={this.handleChange}></input>
        <p>pattern: [ {this.state.sequence} ]</p>
        <p>write a loop (or nested loop(s)) to generate a pattern of numbers</p>
        <p>
          use "notesArrayLength" for the length of the notes array and
          "pattern.push" to push numbers into the pattern array
        </p>
        <div id="codeblock-form">
          <AceEditor
            // name="code"
            value={code}
            onChange={this.handleCodeChange}
            id="loops-codeblock"
            placeholder="for(let i = 0; i < notesArrayLength; i++) {
            pattern.push(i)
          }" 
            style={{ height: "300px" }}
          />
          <div>
            <Button onClick={this.generatePattern}>generate pattern</Button>
            <Button onClick={this.playPattern}>
              {this.state.playing ? "stop pattern" : "play pattern"}
            </Button>
          </div>

        </div>
      </div>
    );
  }
}
