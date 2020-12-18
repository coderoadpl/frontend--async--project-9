import Input from './Input'
import Message from './Message'
import Chart from './Chart'
import Map from './Map'

import fetchData from './fetchData'
import debounce from './debounce'

const APPID = 'a798d078efa04620523b043cc93248e8'

class App {

    constructor() {
        this.container = null
        this.query = 'Lublin,pl'

        this.isLoading = false
        this.hasError = null

        this.data = null

        this.fetchWeatherDebounced = debounce(1000)(this.fetchWeather)

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

    transformData(data) {
        const list = data && data.list
        const listMapped = list && list.map((dataItem) => {
            const dt = dataItem && dataItem.dt
            const timestamp = dt && dt * 1000
            const temp = dataItem && dataItem.main && dataItem.main.temp
            const feelsLike = dataItem && dataItem.main && dataItem.main.feels_like

            return { timestamp, temp, feelsLike }
        })
        return listMapped
    }

    onInput(event) {
        this.query = event.target.value
        this.isLoading = true
        this.fetchWeatherDebounced()
        this.render()
    }

    render() {
        if (this.container === null) {
            this.container = document.createElement('div')
        }

        this.container.innerHTML = ''

        const input = new Input(this.query, (event) => this.onInput(event))

        this.container.appendChild(input.render())

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

        if (!this.data) {
            return this.container
        }

        const lat = this.data && this.data.city && this.data.city.coord && this.data.city.coord.lat
        const lng = this.data && this.data.city && this.data.city.coord && this.data.city.coord.lon
        const name = this.data && this.data.city && this.data.city.name
        const mapElement = new Map(lng, lat, name)
        this.container.appendChild(mapElement.render())

        const transformedData = this.transformData(this.data)
        const chartElement = new Chart(transformedData)

        this.container.appendChild(chartElement.render())

        return this.container
    }

}

export default App