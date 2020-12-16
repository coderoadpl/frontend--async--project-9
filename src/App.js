import Input from './Input'
import Button from './Button'
import Message from './Message'

import fetchData from './fetchData'

const APPID = 'a798d078efa04620523b043cc93248e8'

class App {

    constructor() {
        this.container = null
        this.query = 'Lublin,pl'

        this.isLoading = false
        this.hasError = null

        this.data = null

        this.init()
    }

    init() {
        this.fetchWeather()
    }

    startCallback() {
        this.isLoading = true
        this.hasError = null
        this.render()
    }

    catchCallback(error) {
        this.hasError = error
        this.render()
    }

    endCallback() {
        this.isLoading = false
        this.render()
    }

    setData(data) {
        this.data = data
        this.render()
    }

    fetchWeather() {
        return fetchData(
            `https://api.openweathermap.org/data/2.5/forecast?q=${this.query}&appid=${APPID}&units=metric`,
            {
                startCallback: () => this.startCallback(),
                catchCallback: (error) => this.catchCallback(error),
                endCallback: () => this.endCallback(),
            }
        )
            .then((data) => this.setData(data))
    }

    onInput(event) {
        this.query = event.target.value
        this.render()
    }

    onClick() {
        this.fetchWeather()
        this.render()
    }

    render() {
        if (this.container === null) {
            this.container = document.createElement('div')
        }

        this.container.innerHTML = ''

        const input = new Input(this.query, (event) => this.onInput(event))
        const button = new Button('Fetch weather', () => this.onClick())

        this.container.appendChild(input.render())
        this.container.appendChild(button.render())

        if (this.hasError) {
            const messageElement = new Message('Error ocurred!')
            this.container.appendChild(messageElement.render())
            return this.container
        }

        if (this.isLoading) {
            const messageElement = new Message('Loading...')
            this.container.appendChild(messageElement.render())
            return this.container
        }

        const text = document.createTextNode(JSON.stringify(this.data))

        this.container.appendChild(text)

        return this.container
    }

}

export default App