import { bind } from "@react-rxjs/core"
import { EMPTY } from "rxjs"
import {
  initialCurrencyRates,
  formatCurrency,
  Order,
  NumberInput,
  formatPrice,
  initialOrders,
  Table,
} from "./utils"

const [useCurrencies] = bind(EMPTY, Object.keys(initialCurrencyRates))

const CurrencyRate: React.FC<{ currency: string }> = ({ currency }) => {
  const rate = initialCurrencyRates[currency]
  return (
    <tr key={currency}>
      <td>{formatCurrency(currency)}</td>
      <td>
        <NumberInput value={rate} onChange={() => {}} />
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
  return (
    <tr>
      <td>{order.title}</td>
      <td>
        <NumberInput value={order.price} onChange={() => {}} />
      </td>
      <td>
        <CurrencySelector value={order.currency} onChange={() => {}} />
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
)

export default App
