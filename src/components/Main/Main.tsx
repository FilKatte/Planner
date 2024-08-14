import React, { ChangeEvent, useState } from "react";

import type { CalendarProps } from "antd";
import { Typography, Layout, theme, Button, Flex } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import { MyCalendar } from "../Calendar/Calendar";
import { EventsList } from "../EventsList/EventsList";
import { AddEventModal } from "../AddEventModal/AddEventModal";
import { EventsContainer } from "../EventsContainer/EventsContainer";
import { selectColorOptions } from "./Main.constants";

const { Content, Footer } = Layout;

export const Main: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [selectedDate, setSelectedDate] = useState(() => dayjs(Date()));

  const onSelectDate = (newDate: Dayjs) => {
    setSelectedDate(newDate);
  };

  const [inputValue, setInputValue] = useState("");

  const onChangeInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [selectedColor, setSelectedColor] = useState(
    selectColorOptions[0].value
  );

  const onSelectChange = (value: string) => {
    setSelectedColor(value);
  };

  const localListData: {
    [k: string]: { type: string; content: string; id: number }[];
  } = JSON.parse(localStorage.getItem("listData") || "{}");

  const [listData, setListData] = useState(localListData);

  const handleOk = () => {
    const dateValue = selectedDate.format("MM-DD-YYYY");
    const currentDateInList = listData[dateValue] || [];

    const data = [
      ...currentDateInList,
      {
        type: selectedColor,
        content: inputValue,
        id: currentDateInList.length,
      },
    ];

    setListData({
      ...listData,
      [dateValue]: data,
    });

    localStorage.setItem(
      "listData",
      JSON.stringify({
        ...listData,
        [dateValue]: data,
      })
    );

    setSelectedColor(selectColorOptions[0].value);
    setInputValue("");
    setIsModalOpen(false);
  };

  const [isShowInput, setIsShowInput] = useState<{ [key: number]: boolean }>(
    {}
  );

  const [inputEditValue, setInputEditValue] = useState("");

  const onChangeEditInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInputEditValue(e.target.value);
  };

  const dateCellRender = (value: Dayjs, withEditButton?: boolean) => {
    const dateValue = value.format("MM-DD-YYYY");
    const list = listData[dateValue] || [];

    const onEditClick = (value: string, id: number) => {
      setIsShowInput({ ...isShowInput, [id]: true });
      setInputEditValue(value);
    };

    const onSave = (id: number) => {
      const currentDateInList = listData[dateValue] || [];

      const newValue = currentDateInList.map((el) =>
        el.id === id ? { ...el, content: inputEditValue } : el
      );

      setListData({
        ...listData,
        [dateValue]: newValue,
      });

      localStorage.setItem(
        "listData",
        JSON.stringify({
          ...listData,
          [dateValue]: newValue,
        })
      );

      setInputEditValue("");
      setIsShowInput({ ...isShowInput, [id]: false });
    };

    const onDeleteClick = (id: number) => {
      const currentDateInList = listData[dateValue] || [];

      const newList = currentDateInList.filter((el) => el.id !== id);

      setListData({
        ...listData,
        [dateValue]: newList,
      });

      localStorage.setItem(
        "listData",
        JSON.stringify({
          ...listData,
          [dateValue]: newList,
        })
      );
    };

    return (
      <EventsContainer
        list={list}
        withEditButton={withEditButton}
        isShowInput={isShowInput}
        inputEditValue={inputEditValue}
        onChangeEditInputValue={onChangeEditInputValue}
        onSave={onSave}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
    );
  };

  const monthCellRender = (value: Dayjs) => {
    const dateValue = value.format("MM-DD-YYYY");
    const list = Object.entries(listData) || [];

    const events = list
      .filter(
        ([key]) =>
          key.slice(0, 2) === dateValue.slice(0, 2) &&
          key.slice(6) === dateValue.slice(6)
      )
      ?.map(([_, value]) => value)
      ?.flat();

    return events.length > 0 ? <EventsContainer list={events} /> : null;
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Typography.Title>My Planner</Typography.Title>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Flex justify="space-between" style={{ marginBottom: 24 }}>
              My Calendar
              <Button type="primary" onClick={showModal}>
                Добавить
              </Button>
            </Flex>

            <Flex style={{ marginBottom: 24 }}>
              <MyCalendar cellRender={cellRender} onSelect={onSelectDate} />
              <EventsList date={selectedDate}>
                {dateCellRender(selectedDate, true)}
              </EventsList>
            </Flex>
          </div>

          <AddEventModal
            isModalOpen={isModalOpen}
            onAddEventClick={handleOk}
            onCancelModalClick={handleCancel}
            inputValue={inputValue}
            onChangeInputValue={onChangeInputValue}
            onSelectColorChange={onSelectChange}
            selectColorsOptions={selectColorOptions}
            selectColorValue={selectedColor}
          />
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
