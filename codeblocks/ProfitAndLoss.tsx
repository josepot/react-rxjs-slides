import { FC } from "react"
import {
  Title,
  AnalyticsLineChartWrapper,
  ProfitAndLossHeader,
  ProfitAndLossStyle
} from "../ProfitAndLoss.styles"
import { LineChart } from "./LineChart"
import { LastPosition } from "./LastPosition"

export const ProfitAndLoss: FC = () => (
  <ProfitAndLossStyle>
    <ProfitAndLossHeader>
      <Title>Profit &amp; Loss</Title>
      <LastPosition />
    </ProfitAndLossHeader>
    <AnalyticsLineChartWrapper>
      <LineChart />
    </AnalyticsLineChartWrapper>
  </ProfitAndLossStyle>
)
