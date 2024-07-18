import React from "react";
import type { CalendarProps } from "antd";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";

type MyCalendarProps = {
  onSelect: CalendarProps<Dayjs>["onSelect"];
  cellRender: CalendarProps<Dayjs>["cellRender"];
};

export const MyCalendar: React.FC<MyCalendarProps> = ({
  onSelect,
  cellRender,
}) => {
  return <Calendar cellRender={cellRender} onSelect={onSelect} />;
};
