import React, { ChangeEvent, useState } from "react";

import type { BadgeProps, CalendarProps } from "antd";
import {
  Typography,
  Layout,
  theme,
  Button,
  Badge,
  Flex,
  Modal,
  Input,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

import { MyCalendar } from "../Calendar/Calendar";

const { Content, Footer } = Layout;

export const Main: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [value, setValue] = useState(() => dayjs(Date()));

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
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

  const selectOptions = [
    { value: "default", label: <Badge status="default" text="default" /> },
    { value: "success", label: <Badge status="success" text="success" /> },
    {
      value: "processing",
      label: <Badge status="processing" text="processing" />,
    },
    { value: "warning", label: <Badge status="warning" text="warning" /> },
    { value: "error", label: <Badge status="error" text="error" /> },
  ];

  const [selectValue, setSelectValue] = useState(selectOptions[0].value);

  const onSelectChange = (value: string) => {
    setSelectValue(value);
  };

  const localListData: {
    [k: string]: { type: string; content: string; id: number }[];
  } = JSON.parse(localStorage.getItem("listData") || "{}");

  const [listData, setListData] = useState(localListData);

  const handleOk = () => {
    const currentDateInList = listData[value.date()] || [];

    const data = [
      ...currentDateInList,
      { type: selectValue, content: inputValue, id: currentDateInList.length },
    ];

    setListData({
      ...listData,
      [value.date()]: data,
    });

    localStorage.setItem(
      "listData",
      JSON.stringify({
        ...listData,
        [value.date()]: data,
      })
    );

    setSelectValue(selectOptions[0].value);
    setInputValue("");
    setIsModalOpen(false);
  };

  const getMonthData = (value: Dayjs) => {
    if (value.month() === 8) {
      return 1394;
    }
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const [isShowInput, setIsShowInput] = useState(false);

  const [inputEditValue, setInputEditValue] = useState("");

  const onChangeEditInputValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInputEditValue(e.target.value);
  };

  const dateCellRender = (value: Dayjs, withEditButton?: boolean) => {
    const list = listData[value.date()] || [];

    const onEditClick = (value: string) => {
      setIsShowInput(true);
      setInputEditValue(value);
    };

    const onSave = (id: number) => {
      const currentDateInList = listData[value.date()] || [];

      const newValue = currentDateInList.map((el) =>
        el.id === id ? { ...el, content: inputEditValue } : el
      );

      setListData({
        ...listData,
        [value.date()]: newValue,
      });

      localStorage.setItem(
        "listData",
        JSON.stringify({
          ...listData,
          [value.date()]: newValue,
        })
      );

      setInputEditValue("");
      setIsShowInput(false);
    };

    const onDeleteClick = (id: number) => {
      const currentDateInList = listData[value.date()] || [];

      const newList = currentDateInList.filter((el) => el.id !== id);

      setListData({
        ...listData,
        [value.date()]: newList,
      });

      localStorage.setItem(
        "listData",
        JSON.stringify({
          ...listData,
          [value.date()]: newList,
        })
      );
    };

    return (
      <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
        {list.map((item) => (
          <li key={item.content}>
            {isShowInput ? (
              <>
                <Input
                  placeholder={item.content}
                  value={inputEditValue}
                  onChange={onChangeEditInputValue}
                />
                <Button
                  type="primary"
                  onClick={() => onSave(item.id)}
                  size="small"
                >
                  ok
                </Button>
              </>
            ) : (
              <>
                {" "}
                <Badge
                  status={item.type as BadgeProps["status"]}
                  text={item.content}
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                />
                {withEditButton && (
                  <>
                    {" "}
                    <Button
                      shape="circle"
                      icon={<EditOutlined />}
                      onClick={() => onEditClick(item.content)}
                    />
                    <Button
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => onDeleteClick(item.id)}
                    />
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    );
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
              <MyCalendar cellRender={cellRender} onSelect={onSelect} />
              <Flex
                style={{
                  padding: "12px 4px",
                  margin: 8,
                  border: "2px solid lightgray",
                  minWidth: 180,
                }}
                vertical
              >
                <div style={{ marginBottom: 16 }}>
                  События на {value.format("MM-DD-YYYY")}
                </div>
                {dateCellRender(value, true)}
              </Flex>
            </Flex>
          </div>

          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>Введите событие</p>
            <Input
              placeholder="Событие..."
              value={inputValue}
              onChange={onChangeInputValue}
            />
            <p>Выберите цвет</p>
            <Select
              onChange={onSelectChange}
              options={selectOptions}
              value={selectValue}
            />
          </Modal>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
