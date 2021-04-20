import { Suspense } from "react"
import styled from "styled-components"
import { Loader } from "@/components/Loader"
import { ProfitAndLoss } from "./ProfitAndLoss"
import { Positions } from "./Positions"
import { PnL } from "./PnL"

const AnalyticsWrapper = styled.div`
  flex: 0 0 371px;
  padding: 0.5rem 1rem 0.5rem 0;
  user-select: none;
  overflow: hidden;

  @media (max-width: 750px) {
    display: none;
  }
`

export const Analytics: React.FC = () => {
  return (
    <AnalyticsWrapper>
      <Suspense fallback={<Loader />}>
        <ProfitAndLoss />
        <Positions />
        <PnL />
      </Suspense>
    </AnalyticsWrapper>
  )
}
