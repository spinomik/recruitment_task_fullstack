import React, { Component } from 'react'
import axios from 'axios'
import ExchangeTable from './ExchangeTable'

class ExchangeRates extends Component {
	constructor(props) {
		super(props)
		const today = new Date()
		const minDate = new Date('2023-01-01')

		//w celu dodania nowej waluty wystarczy dodac obiekt do "currencies"
		this.state = {
			date: today.toISOString().split('T')[0],
			minDate: minDate.toISOString().split('T')[0],
			maxDate: today.toISOString().split('T')[0],
			currencies: [
				{ code: 'EUR', name: 'euro (EUR)' },
				{ code: 'USD', name: 'dolar amerykański (USD)' },
				{ code: 'CZK', name: 'korona czeska (CZK)' },
				{ code: 'IDR', name: 'rupia indonezyjska (IDR)' },
				{ code: 'BRL', name: 'real brazylijski (BRL)' },
			],
			data: null,
			loading: false,
			message: '',
		}
	}

	componentDidMount() {
		this.handleSubmit()
	}

	handleChange = event => {
		const selectedDate = event.target.value
		const { minDate, maxDate } = this.state
		if (selectedDate < minDate || selectedDate > maxDate) {
			this.setState({
				message: `Wybierz datę pomiędzy ${minDate} a ${maxDate}`,
			})
		} else {
			this.setState({ date: selectedDate, message: '' })
			this.handleSubmit()
		}
	}

	handleSubmit = async event => {
		if (event) {
			event.preventDefault()
		}
		this.setState({ loading: true, message: '' })
		const currencyCodes = this.state.currencies.map(currency => currency.code)
		try {
			const response = await axios.get('http://telemedi-zadanie.localhost/api/getTable', {
				headers: {
					Accept: 'application/json',
				},
				params: {
					date: this.state.date,
					currencies: currencyCodes,
				},
			})
			const data = response.data

			if (Object.values(data).some(item => item.error)) {
				this.setState({ message: 'Wystąpił błąd podczas pobierania danych.', loading: false })
			} else {
				this.setState({ data: data, loading: false })
			}
		} catch (error) {
			console.error('Błąd podczas pobierania danych:', error)
			this.setState({ message: 'Wystąpił błąd podczas pobierania danych.', loading: false })
		}
	}

	render() {
		const { loading, data, message, minDate, maxDate } = this.state
		const today = new Date().toISOString().split('T')[0]
		return (
			<div>
				<h1>Kantor</h1>
				<form onSubmit={this.handleSubmit}>
					<label>
						Wybierz Datę:
						<input
							type="date"
							name="date"
							value={this.state.date}
							min={minDate}
							max={maxDate}
							onChange={this.handleChange}
						/>
					</label>
				</form>
				<h2>Tabela:</h2>

				{loading && <p>Ładowanie danych...</p>}

				{message && <p style={{ color: 'red' }}>{message}</p>}
				{!loading && data && (
					<ExchangeTable
						currencies={this.state.currencies}
						selectedDate={this.state.date}
						todayDate={today}
						data={this.state.data}
					/>
				)}
			</div>
		)
	}
}

export default ExchangeRates
