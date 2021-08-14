export const loadingHtml = `<div class="spinner">
<div class="rect1"></div>
<div class="rect2"></div>
<div class="rect3"></div>
<div class="rect4"></div>
<div class="rect5"></div>
<h1>Loading Coda</h1>
</div>`

export const loadingCss = `

  .hidden {
    display: none;
  }
  
  .spinner {
    margin: 100px auto;
    width: 50px;
    height: 40px;
    text-align: center;
    font-size: 10px;
    transition: opacity 1.5s ease;
    text-align: center;
  }
  
  h1 {
    color: gray;
    font-family: sans-serif;
    font-size: 16px;
    transform: translateX(-122px);
    width: 300px;
  }
  
  .spinner > div {
    background-color: #333;
    height: 100%;
    width: 6px;
    display: inline-block;
    
    -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }
  
  .spinner .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }
  
  .spinner .rect3 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
  }
  
  .spinner .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }
  
  .spinner .rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }
  
  @-webkit-keyframes sk-stretchdelay {
    0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
    20% { -webkit-transform: scaleY(1.0) }
  }
  
  @keyframes sk-stretchdelay {
    0%, 40%, 100% { 
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }  20% { 
      transform: scaleY(1.0);
      -webkit-transform: scaleY(1.0);
    }
  }
  `

  export const loadingJs = `const spinner = document.querySelector('.spinner')

  const loading = setInterval(() => {
    if (Tone){ 
      spinner.classList.add("hidden")
      }
    }, 100)`

    
    