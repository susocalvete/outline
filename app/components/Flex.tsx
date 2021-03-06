import styled from "styled-components";

type JustifyValues =
  | "center"
  | "space-around"
  | "space-between"
  | "flex-start"
  | "flex-end";

type AlignValues =
  | "stretch"
  | "center"
  | "baseline"
  | "flex-start"
  | "flex-end";

const Flex = styled.div<{
  auto?: boolean;
  column?: boolean;
  align?: AlignValues;
  justify?: JustifyValues;
  shrink?: boolean;
  gap?: number;
}>`
  display: flex;
  flex: ${({ auto }) => (auto ? "1 1 auto" : "initial")};
  flex-direction: ${({ column }) => (column ? "column" : "row")};
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
  flex-shrink: ${({ shrink }) => (shrink ? 1 : "initial")};
  gap: ${({ gap }) => (gap ? `${gap}px` : "initial")};
  min-height: 0;
  min-width: 0;
`;

export default Flex;
