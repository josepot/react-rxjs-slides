import styled from "styled-components"
import { filter, map } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { formatAsWholeNumber } from "@/utils/formatNumber"
import { history$ } from "@/services/analytics"

const USDspan = styled.span`
  opacity: 0.6;
  font-size: 14px;
  margin-right: 10px;
`
const LastPositionStyle = styled.span<{ value: number }>`
  font-size: 14px;
  color: ${({ theme, value }) =>
    theme.accents[value >= 0 ? "positive" : "negative"].base};
`

const LastPositionFormatted: React.FC<{ children: number }> = ({
  children,
}) => (
  <LastPositionStyle role={"lastPosition"} value={children}>
    {formatAsWholeNumber(children)}
  </LastPositionStyle>
)

const [useLastPosition] = bind(
  history$.pipe(
    filter((history) => history.length > 0),
    map((history) => history[history.length - 1].usPnl),
  ),
)

export const LastPosition: React.FC = () => {
  const lastPos = useLastPosition()
  return (
    <div>
      <USDspan>USD</USDspan>
      <LastPositionFormatted>{lastPos}</LastPositionFormatted>
    </div>
  )
}
