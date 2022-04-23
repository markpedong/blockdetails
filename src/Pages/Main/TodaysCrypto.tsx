import { useMantineColorScheme } from "@mantine/core";
import React from "react";
import {
  TodayContainer,
  TodayTitle,
} from "../../Styled Components/StyledTodayCrypto";

export const TodaysCrypto = () => {
  const { colorScheme } = useMantineColorScheme();
  return (
    <TodayContainer
      style={{
        backgroundColor: "inherit",
      }}
    >
      <TodayTitle theme={colorScheme}>
        Today's Cryptocurrency Market Cap
      </TodayTitle>
    </TodayContainer>
  );
};

// <Col className="today_description">
//   <p>The Global Crypto Market cap is</p>
//   <TodayCryptoComp data={global} symbol={symbol} />
//   <p>{profit ? "increase" : "decrease"} over the last day.</p>
//   <button
//     onClick={() => setOpen(!open)}
//     aria-controls="collapse_container"
//     aria-expanded={open}
//   >
//     read more
//   </button>
// </Col>
// <Col className="collapse_container">
//   <Collapse in={open}>
//     <div className="collapse_container">
//       <TodayCollapse data={global} symbol={symbol} />
//     </div>
//   </Collapse>
// </Col>
