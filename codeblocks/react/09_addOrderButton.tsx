import {
  createContext,
  Dispatch,
  memo,
  useContext,
  useReducer,
  useState,
} from "react"
import {
  initialCurrencyRates,
  formatCurrency,
  Order,
  NumberInput,
  formatPrice,
  initialOrders,
  Table,
  getBaseCurrencyPrice,
  getRandomOrder,
  uuidv4,
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

interface AddOrder {
  type: "Add"
  payload: Order
}
interface EditCurrency {
  type: "EditCurrency"
  payload: { id: string; value: string }
}
interface EditPrice {
  type: "EditPrice"
  payload: { id: string; value: number }
}
type OrdersAction = AddOrder | EditCurrency | EditPrice
function ordersReducer(prev: Record<string, Order>, action: OrdersAction) {
  switch (action.type) {
    case "Add":
      return { ...prev, [action.payload.id]: action.payload }
    case "EditPrice":
      return {
        ...prev,
        [action.payload.id]: {
          ...prev[action.payload.id],
          price: action.payload.value,
        },
      }
    case "EditCurrency":
      return {
        ...prev,
        [action.payload.id]: {
          ...prev[action.payload.id],
          currency: action.payload.value,
        },
      }
    default:
      return prev
  }
}

const ordersContext = createContext<
  [Record<string, Order>, React.Dispatch<OrdersAction>]
>([initialOrders, () => {}])
const useOrders = () => useContext(ordersContext)
const { Provider: OrdersContextProvider } = ordersContext

const OrdersProvider: React.FC = ({ children }) => {
  const orders = useReducer(ordersReducer, initialOrders)
  return (
    <OrdersContextProvider value={orders}>{children}</OrdersContextProvider>
  )
}

const CurrencyRate: React.FC<{
  currency: string
  rate: number
  setCurrencyRates: SetState<Record<string, number>>
}> = memo(({ currency, rate, setCurrencyRates }) => {
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
})

const Currencies = () => {
  const [currencyRates, setCurrencyRates] = useCurrencyRates()
  return (
    <Table columns={["Currency", "Exchange rate"]}>
      {Object.entries(currencyRates).map(([currency, rate]) => (
        <CurrencyRate
          key={currency}
          currency={currency}
          rate={rate}
          setCurrencyRates={setCurrencyRates}
        />
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

const Orderline: React.FC<{
  order: Order
  currencyRate: number
  dispatch: Dispatch<OrdersAction>
}> = memo(({ order, currencyRate, dispatch }) => {
  const baseCurrencyPrice = getBaseCurrencyPrice(order.price, currencyRate)
  return (
    <tr>
      <td>{order.title}</td>
      <td>
        <NumberInput
          value={order.price}
          onChange={(value) => {
            dispatch({ type: "EditPrice", payload: { id: order.id, value } })
          }}
        />
      </td>
      <td>
        <CurrencySelector
          value={order.currency}
          onChange={(value) => {
            dispatch({ type: "EditCurrency", payload: { id: order.id, value } })
          }}
        />
      </td>
      <td>{formatPrice(baseCurrencyPrice)} £</td>
    </tr>
  )
})

const Orders = () => {
  const [orders, dispatch] = useOrders()
  const [currencyRates] = useCurrencyRates()
  return (
    <Table columns={["Article", "Price", "Currency", "Price in £"]}>
      {Object.entries(orders).map(([id, order]) => (
        <Orderline
          key={id}
          order={order}
          dispatch={dispatch}
          currencyRate={currencyRates[order.currency]}
        />
      ))}
    </Table>
  )
}

const AddOrderButton = () => {
  const [, dispatch] = useOrders()
  return (
    <button
      onClick={() => {
        dispatch({ type: "Add", payload: getRandomOrder(uuidv4()) })
      }}
    >
      Add
    </button>
  )
}

const OrderTotal = () => {
  const total = 10000
  return <div className="total">{formatPrice(total)} £</div>
}

const App = () => (
  <CurrenciesProvider>
    <OrdersProvider>
      <div className="App">
        <h1>Orders</h1>
        <Orders />
        <div className="actions">
          <AddOrderButton />
          <OrderTotal />
        </div>
        <h1>Exchange rates</h1>
        <Currencies />
      </div>
    </OrdersProvider>
  </CurrenciesProvider>
)

export default App
