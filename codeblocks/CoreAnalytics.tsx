import { ProfitAndLoss } from "./ProfitAndLoss"
import { Positions } from "./Positions"
import { PnL } from "./PnL"

const CoreAnalytics: React.FC = () => {
  return (
    <>
      <ProfitAndLoss />
      <Positions />
      <PnL />
    </>
  )
}

export default CoreAnalytics
