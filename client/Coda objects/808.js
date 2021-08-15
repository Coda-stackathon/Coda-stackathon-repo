import * as Tone from 'tone'

export const drums = `class drum {

  constructor() {

    this.sampleBaseUrl = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/969699'

    //this.reverb = new Tone.Convolver(
    //  \`\${this.sampleBaseUrl}/small-drum-room.wav\`
    //).toDestination()
    //reverb.wet.value = 0.35

    this.snarePanner = new Tone.Panner().toDestination()//.connect(this.reverb)
    new Tone.LFO(0.13, -0.25, 0.25).connect(this.snarePanner.pan).start()

    this.drumKit = {
      kick: new Tone.Players({
        high: \`\${this.sampleBaseUrl}/808-kick-vh.mp3\`,
        med: \`\${this.sampleBaseUrl}/808-kick-vm.mp3\`,
        low: \`\${this.sampleBaseUrl}/808-kick-vl.mp3\`
      }).toDestination(),
      snare: new Tone.Players({
        high: \`\${this.sampleBaseUrl}/flares-snare-vh.mp3\`,
        med: \`\${this.sampleBaseUrl}/flares-snare-vm.mp3\`,
        low: \`\${this.sampleBaseUrl}/flares-snare-vl.mp3\`
      }).connect(this.snarePanner),
      hihat: new Tone.Players({
        high: \`\${this.sampleBaseUrl}/808-hihat-vh.mp3\`,
        med: \`\${this.sampleBaseUrl}/808-hihat-vm.mp3\`,
        low: \`\${this.sampleBaseUrl}/808-hihat-vl.mp3\`
      }).connect(new Tone.Panner(-0.5).toDestination()),//.connect(this.reverb)),
      hihatOpen: new Tone.Players({
        high: \`\${this.sampleBaseUrl}/808-hihat-open-vh.mp3\`,
        med: \`\${this.sampleBaseUrl}/808-hihat-open-vm.mp3\`,
        low: \`\${this.sampleBaseUrl}/808-hihat-open-vl.mp3\`
      }).connect(new Tone.Panner(-0.5).toDestination()),//.connect(this.reverb)),
      tomLow: new Tone.Players({
        high: \`\${this.sampleBaseUrl}/slamdam-tom-low-vh.mp3\`,
        med: \`\${this.sampleBaseUrl}/slamdam-tom-low-vm.mp3\`,
        low: \`\${this.sampleBaseUrl}/slamdam-tom-low-vl.mp3\`
      }).connect(new Tone.Panner(-0.4).toDestination()),//.connect(this.reverb)),
      tomMid: new Tone.Players({
        high: \`\${this.sampleBaseUrl}/slamdam-tom-mid-vh.mp3\`,
        med: \`\${this.sampleBaseUrl}/slamdam-tom-mid-vm.mp3\`,
        low: \`\${this.sampleBaseUrl}/slamdam-tom-mid-vl.mp3\`
      }).toDestination(),//.connect(this.reverb),
      tomHigh: new Tone.Players({
        high: \`\${this.sampleBaseUrl}/slamdam-tom-high-vh.mp3\`,
        med: \`\${this.sampleBaseUrl}/slamdam-tom-high-vm.mp3\`,
        low: \`\${this.sampleBaseUrl}/slamdam-tom-high-vl.mp3\`
      }).connect(new Tone.Panner(0.4).toDestination()),//.connect(this.reverb)),
      clap: new Tone.Players({
        high: \`\${this.sampleBaseUrl}/909-clap-vh.mp3\`,
        med: \`\${this.sampleBaseUrl}/909-clap-vm.mp3\`,
        low: \`\${this.sampleBaseUrl}/909-clap-vl.mp3\`
      }).connect(new Tone.Panner(0.5).toDestination()),//.connect(this.reverb)),
      rim: new Tone.Players({
        high: \`\${this.sampleBaseUrl}/909-rim-vh.wav\`,
        med: \`\${this.sampleBaseUrl}/909-rim-vm.wav\`,
        low: \`\${this.sampleBaseUrl}/909-rim-vl.wav\`
      }).connect(new Tone.Panner(0.5).toDestination()),//.connect(this.reverb))
    }
  }
}

drum.prototype.getDrum = function(drum) {
  return this.drumKit[drum]
}
`
