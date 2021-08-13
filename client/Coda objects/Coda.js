import Tone from "tone"

const Coda = `class Coda {
    constructor () {
        this.instrument = {
            simpleSynth: new Tone.Synth().toDestination(),
        }
    }
}
const coda = new Coda()
`

export default Coda