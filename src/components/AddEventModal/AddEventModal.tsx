import React, { ChangeEvent, PropsWithChildren, ReactElement } from "react";
import { Input, Modal, Select } from "antd";

type EventsListProps = {
  isModalOpen: boolean;
  onAddEventClick: () => void;
  onCancelModalClick: () => void;
  inputValue: string;
  onChangeInputValue: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectColorChange: (value: string) => void;
  selectColorsOptions: { value: string; label: ReactElement }[];
  selectColorValue: string;
};

export const AddEventModal: React.FC<PropsWithChildren<EventsListProps>> = ({
  isModalOpen,
  onAddEventClick,
  onCancelModalClick,
  inputValue,
  onChangeInputValue,
  onSelectColorChange,
  selectColorsOptions,
  selectColorValue,
}) => {
  return (
    <Modal
      title="Basic Modal"
      open={isModalOpen}
      onOk={onAddEventClick}
      onCancel={onCancelModalClick}
    >
      <p>Введите событие</p>
      <Input
        placeholder="Событие..."
        value={inputValue}
        onChange={onChangeInputValue}
      />
      <p>Выберите цвет</p>
      <Select
        onChange={onSelectColorChange}
        options={selectColorsOptions}
        value={selectColorValue}
      />
    </Modal>
  );
};
