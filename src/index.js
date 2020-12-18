import App from './App'

const app1 = new App()

window.app1 = app1

document.querySelector('#root').appendChild(app1.render())