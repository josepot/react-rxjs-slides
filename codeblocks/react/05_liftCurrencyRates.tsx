import { createContext, useContext, useState } from "react"
import {
  initialCurrencyRates,
  formatCurrency,
  Order,
  NumberInput,
  formatPrice,
  initialOrders,
  Table,
} from "./utils"

type SetState<T> = React.Dispatch<React.SetStateAction<T>>

const initialCurrencies = Object.keys(initialCurrencyRates)
const currenciesContext = createContext(initialCurrencies)
const useCurrencies = () => useContext(currenciesContext)
const { Provider: CurrenciesContextProvider } = currenciesContext

const currencyRatesContext = createContext<
  [Record<string, number>, SetState<Record<string, number>>]
>([initialCurrencyRates, () => {}])
const useCurrencyRates = () => useContext(currencyRatesContext)
const { Provider: CurrencyRatesContextProvider } = currencyRatesContext

const CurrenciesProvider: React.FC = ({ children }) => {
  const currencyRates = useState(initialCurrencyRates)
  return (
    <CurrenciesContextProvider value={initialCurrencies}>
      <CurrencyRatesContextProvider value={currencyRates}>
        {children}
      </CurrencyRatesContextProvider>
    </CurrenciesContextProvider>
  )
}

const CurrencyRate: React.FC<{ currency: string }> = ({ currency }) => {
  const [currencyRates, setCurrencyRates] = useCurrencyRates()
  const rate = currencyRates[currency]
  return (
    <tr key={currency}>
      <td>{formatCurrency(currency)}</td>
      <td>
        <NumberInput
          value={rate}
          onChange={(value) => {
            setCurrencyRates((prev) => ({ ...prev, [currency]: value }))
          }}
        />
      </td>
    </tr>
  )
}

const Currencies = () => {
  const currencies = useCurrencies()
  return (
    <Table columns={["Currency", "Exchange rate"]}>
      {currencies.map((currency) => (
        <CurrencyRate key={currency} currency={currency} />
      ))}
    </Table>
  )
}

const CurrencySelector: React.FC<{
  value: string
  onChange: (next: string) => void
}> = ({ value, onChange }) => {
  const currencies = useCurrencies()
  return (
    <select
      onChange={(e) => {
        onChange(e.target.value)
      }}
      value={value}
    >
      {currencies.map((c) => (
        <option key={c} value={c}>
          {formatCurrency(c)}
        </option>
      ))}
    </select>
  )
}

const Orderline: React.FC<Order> = (order) => {
  const [price, setPrice] = useState(order.price)
  const [currency, setCurrency] = useState(order.currency)
  return (
    <tr>
      <td>{order.title}</td>
      <td>
        <NumberInput value={price} onChange={setPrice} />
      </td>
      <td>
        <CurrencySelector value={currency} onChange={setCurrency} />
      </td>
      <td>{formatPrice(1000)} £</td>
    </tr>
  )
}

const Orders = () => {
  const orders = Object.values(initialOrders)
  return (
    <Table columns={["Article", "Price", "Currency", "Price in £"]}>
      {orders.map((order) => (
        <Orderline key={order.id} {...order} />
      ))}
    </Table>
  )
}

const OrderTotal = () => {
  const total = 10000
  return <div className="total">{formatPrice(total)} £</div>
}

const App = () => (
  <CurrenciesProvider>
    <div className="App">
      <h1>Orders</h1>
      <Orders />
      <div className="actions">
        <button onClick={() => {}}>Add</button>
        <OrderTotal />
      </div>
      <h1>Exchange rates</h1>
      <Currencies />
    </div>
  </CurrenciesProvider>
)

export default App
