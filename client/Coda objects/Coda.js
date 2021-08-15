import Tone from "tone"
import { piano }  from "./piano"

const Coda = `class Coda {
    constructor () {

        document.documentElement.addEventListener('mousedown', () => {
            if (Tone.context.state !== 'running') Tone.context.resume();
          })

        this.instrument = {
            simpleSynth: new instrument('synth'),
            monoSynth: new instrument('monoSynth'),
            fmSynth: new instrument('fmSynth'),
            amSynth: new instrument('amSynth'),
            polySynth: new instrument('polySynth'),
            metalSynth: new instrument('metalSynth'),
            pluckSynth: new instrument('pluckSynth'),
            piano: new instrument('piano'),
        }
    }
}

Coda.prototype.getInstrument = function(type) {
    return (this.instrument[type])
}

Coda.prototype.getSynth = function(type) {
    return (this.instrument[type])
}

Coda.prototype.newSynth = function(type) {
    return new instrument(type)
}

Coda.prototype.newSequence = function(noteLength) {
    return new sequence(noteLength)
}

class instrument {

    constructor(type) {
        let holder;
        switch(type) {
            case 'synth': holder = new Tone.Synth().toDestination(); break;
            case 'monoSynth': holder = new Tone.MonoSynth().toDestination(); break;
            case 'fmSynth': holder = new Tone.FMSynth().toDestination(); break;
            case 'amSynth': holder = new Tone.AMSynth().toDestination(); break;
            case 'polySynth': holder = new Tone.PolySynth().toDestination(); break;
            case 'metalSynth': holder = new Tone.MetalSynth().toDestination(); break;
            case 'pluckSynth': holder = new Tone.PluckSynth().toDestination(); break;
            case 'piano': holder = ${piano}; break;
            default: holder = new Tone.Synth().toDestination();
        }
        this.holder = holder
    }
}

instrument.prototype.playNote = function(note, length, time = Tone.now()) {
    this.holder.triggerAttackRelease(note, length, time)
} 

class sequence {
    constructor(noteLength) {
        this.notes = []
        this.noteLength = noteLength
    }
}

sequence.prototype.addNote = function(note) {
    console.log('adding note to sequence')
    this.notes.push(note)
}

sequence.prototype.addNotes = function(notesArr) {
    console.log('adding notes to sequence')
    this.notes = [...this.notes, ...notesArr]
}

sequence.prototype.setNotes = function(notesArr) {
    console.log('setting notes in sequence')
    this.notes = notesArr
}

sequence.prototype.play = function(instrument) {
    const seq = new Tone.Sequence((time, note) => {
        if (note !== 'rest') {
            instrument.playNote(note, this.noteLength, time);
        }
        // subdivisions are given as subarrays
    }, this.notes, this.noteLength).start(0);

    Tone.Transport.start()
}

sequence.prototype.stop = function() {
    Tone.Transport.stop()
    Tone.Transport.cancel(0)
}

const coda = new Coda()
`

export default Coda


