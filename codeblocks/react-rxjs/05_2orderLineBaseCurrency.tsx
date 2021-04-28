import { bind } from "@react-rxjs/core"
import { createKeyedSignal, combineKeys } from "@react-rxjs/utils"
import { combineLatest, concat, EMPTY } from "rxjs"
import { map, switchMap } from "rxjs/operators"
import {
  initialCurrencyRates,
  formatCurrency,
  NumberInput,
  formatPrice,
  initialOrders,
  Table,
  getBaseCurrencyPrice,
} from "./utils"

const [useCurrencies] = bind(EMPTY, Object.keys(initialCurrencyRates))

const [rateChange$, onRateChange] = createKeyedSignal<string, number>()
const [useCurrencyRate, currencyRate$] = bind(
  (currency: string) => rateChange$(currency),
  (currency) => initialCurrencyRates[currency],
)

const initialOrderIds = Object.keys(initialOrders)
const [useOrderIds, orderIds$] = bind(EMPTY, initialOrderIds)

const [priceChange$, onPriceChange] = createKeyedSignal<string, number>()
const [currencyChange$, onCurrencyChange] = createKeyedSignal<string, string>()

const [useOrder, order$] = bind((id: string) => {
  const initialOrder = initialOrders[id]
  const price$ = concat([initialOrder.price], priceChange$(id))
  const currency$ = concat([initialOrder.currency], currencyChange$(id))

  const rate$ = currency$.pipe(switchMap((ccy) => currencyRate$(ccy)))
  const baseCurrencyPrice$ = combineLatest([price$, rate$]).pipe(
    map(([price, rate]) => getBaseCurrencyPrice(price, rate)),
  )

  return combineLatest({
    price: price$,
    currency: currency$,
    baseCurrencyPrice: baseCurrencyPrice$,
  }).pipe(map((update) => ({ ...initialOrder, ...update })))
})

combineKeys(orderIds$, order$).subscribe()

const CurrencyRate: React.FC<{ currency: string }> = ({ currency }) => {
  const rate = useCurrencyRate(currency)
  return (
    <tr key={currency}>
      <td>{formatCurrency(currency)}</td>
      <td>
        <NumberInput
          value={rate}
          onChange={(value) => {
            onRateChange(currency, value)
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

const Orderline: React.FC<{ id: string }> = ({ id }) => {
  const order = useOrder(id)
  return (
    <tr>
      <td>{order.title}</td>
      <td>
        <NumberInput
          value={order.price}
          onChange={(value) => {
            onPriceChange(id, value)
          }}
        />
      </td>
      <td>
        <CurrencySelector
          value={order.currency}
          onChange={(value) => {
            onCurrencyChange(id, value)
          }}
        />
      </td>
      <td>{formatPrice(order.baseCurrencyPrice)} £</td>
    </tr>
  )
}

const Orders = () => {
  const orderIds = useOrderIds()
  return (
    <Table columns={["Article", "Price", "Currency", "Price in £"]}>
      {orderIds.map((id) => (
        <Orderline key={id} id={id} />
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
