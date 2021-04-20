import Resizer from "@/components/Resizer"
import { MainWrapper, AppLayoutRoot } from './App.styles'
import Header from "./Header"
import { Footer } from "./Footer"
import { LiveRates } from "./LiveRates"
import { Trades } from "./Trades"
import { Analytics } from "./Analytics"

export const App: React.FC = () => (
  <AppLayoutRoot>
    <Header />
    <MainWrapper>
      <Resizer>
        <LiveRates />
        <Trades />
      </Resizer>
      <Analytics />
    </MainWrapper>
    <Footer />
  </AppLayoutRoot>
)
