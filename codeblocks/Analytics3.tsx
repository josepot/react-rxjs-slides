import { Suspense, lazy } from "react"
import styled from "styled-components"
import { Loader } from "@/components/Loader"
import { analytics$ } from "@/services/analytics"

analytics$.subscribe()
const CoreAnalytics = lazy("./CoreAnalytics")

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
        <CoreAnalytics />
      </Suspense>
    </AnalyticsWrapper>
  )
}
