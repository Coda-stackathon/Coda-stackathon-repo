import Tone from "tone"

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
        }
    }
}

Coda.prototype.getSynth = function(type) {
    return (this.instrument[type])
}

Coda.prototype.newSynth = function(type) {
    return new instrument(type)
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
            default: holder = new Tone.Synth().toDestination();
        }
        this.holder = holder
    }
}

instrument.prototype.playNote = function(note, length) {
    this.holder.triggerAttackRelease(note, length)
}


const coda = new Coda()
`

export default Coda
