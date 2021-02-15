// console.clear()

import EventEmitter from 'event-emitter'

// import Header from './components/header'
// import ToggleNav from './components/toggle-nav'
import MickoyCover from './components/mickoy-cover'

window.App = window.App || {}
window.App.EM = new EventEmitter()

document.addEventListener("DOMContentLoaded", () => {
  MickoyCover().init()

  // ToggleNav().init()
  // Header().init()
})