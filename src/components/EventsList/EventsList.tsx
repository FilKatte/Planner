import React, { PropsWithChildren } from "react";
import { Flex, theme } from "antd";
import type { Dayjs } from "dayjs";

type EventsListProps = {
  date: Dayjs;
};

export const EventsList: React.FC<PropsWithChildren<EventsListProps>> = ({
  children,
  date,
}) => {
  const {
    token: { colorBgLayout, colorBorderSecondary },
  } = theme.useToken();

  return (
    <Flex
      style={{
        padding: "12px 4px",
        margin: 8,
        marginTop: 64,
        border: `2px solid ${colorBorderSecondary}`,
        borderRadius: 8,
        minWidth: "30%",
        background: colorBgLayout,
      }}
      vertical
    >
      <div style={{ marginBottom: 16 }}>
        События на {date.format("MM-DD-YYYY")}
      </div>
      {children}
    </Flex>
  );
};
