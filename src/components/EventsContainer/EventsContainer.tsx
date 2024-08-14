import React, { ChangeEvent } from "react";
import { Badge, BadgeProps, Button, Input } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

type EventsContainerProps = {
  list: { type: string; content: string; id: number }[];
  withEditButton?: boolean;
  isShowInput?: { [key: number]: boolean };
  inputEditValue?: string;
  onChangeEditInputValue?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSave?: (id: number) => void;
  onEditClick?: (content: string, id: number) => void;
  onDeleteClick?: (id: number) => void;
};

export const EventsContainer: React.FC<EventsContainerProps> = ({
  list,
  withEditButton,
  isShowInput,
  inputEditValue,
  onChangeEditInputValue,
  onSave,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
      {list.map((item) => (
        <li key={item.content}>
          {withEditButton && isShowInput?.[item.id] ? (
            <>
              <Input
                placeholder={item.content}
                value={inputEditValue}
                onChange={onChangeEditInputValue}
              />
              <Button
                type="primary"
                onClick={() => onSave?.(item.id)}
                size="small"
              >
                ok
              </Button>
            </>
          ) : (
            <>
              <Badge
                status={item.type as BadgeProps["status"]}
                text={item.content}
                style={{
                  overflow: "hidden",
                  ...(withEditButton
                    ? {}
                    : {
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: "100%",
                      }),
                }}
              />
              {withEditButton && (
                <>
                  <Button
                    shape="circle"
                    icon={<EditOutlined />}
                    onClick={() => onEditClick?.(item.content, item.id)}
                  />
                  <Button
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => onDeleteClick?.(item.id)}
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
