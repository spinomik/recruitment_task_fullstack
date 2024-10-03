import React, { Component } from 'react'

class ExchangeTable extends Component {
	roundToFiveDecimals(value) {
		if (value == '') return ''
		const numericValue = Number(value)
		if (isNaN(numericValue)) {
			return 'Brak danych'
		}
		return numericValue.toFixed(5)
	}

	render() {
		const { currencies, selectedDate, todayDate, data } = this.props
		return (
			<table className="table">
				<thead>
					<tr>
						<th colSpan="2">Waluta</th>
						<th colSpan="3">Kursy NBP ({selectedDate})</th>
						<th colSpan="2">Kurs ({selectedDate}) </th>
						<th colSpan="2">Kurs ({todayDate})</th>
						<th colSpan="3">Kursy NBP ({todayDate})</th>
					</tr>
					<tr>
						<th>Kod</th>
						<th>Nazwa</th>
						<th>sprzedaż</th>
						<th>średnia</th>
						<th>kupno</th>
						<th>sprzedaż</th>
						<th>kupno</th>
						<th>sprzedaż</th>
						<th>kupno</th>
						<th>sprzedaż</th>
						<th>średnia</th>
						<th>kupno</th>
					</tr>
				</thead>
				<tbody>
					{currencies.map((currency, index) => {
						const currencyData = data ? data[currency.code] : null
						return (
							<tr key={index}>
								<td>{currency.code}</td>
								<td>{currency.name}</td>
								{currencyData && currencyData.error ? (
									<td colSpan="10" style={{ color: 'red' }}>
										{currencyData.error}
									</td>
								) : (
									<>
										<td>{this.roundToFiveDecimals(currencyData?.nbp?.selected?.ask)}</td>
										<td>{this.roundToFiveDecimals(currencyData?.nbp?.selected?.mid)}</td>
										<td>{this.roundToFiveDecimals(currencyData?.nbp?.selected?.bid)}</td>
										<td>{this.roundToFiveDecimals(currencyData?.cantor?.selected?.ask)}</td>
										<td>{this.roundToFiveDecimals(currencyData?.cantor?.selected?.bid)}</td>
										<td>{this.roundToFiveDecimals(currencyData?.cantor?.today?.ask)}</td>
										<td>{this.roundToFiveDecimals(currencyData?.cantor?.today?.bid)}</td>
										<td>{this.roundToFiveDecimals(currencyData?.nbp?.today?.ask)}</td>
										<td>{this.roundToFiveDecimals(currencyData?.nbp?.today?.mid)}</td>
										<td>{this.roundToFiveDecimals(currencyData?.nbp?.today?.bid)}</td>
									</>
								)}
							</tr>
						)
					})}
				</tbody>
			</table>
		)
	}
}

export default ExchangeTable
