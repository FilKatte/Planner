import { Badge } from "antd";

export const selectColorOptions = [
  { value: "default", label: <Badge status="default" text="default" /> },
  { value: "success", label: <Badge status="success" text="success" /> },
  {
    value: "processing",
    label: <Badge status="processing" text="processing" />,
  },
  { value: "warning", label: <Badge status="warning" text="warning" /> },
  { value: "error", label: <Badge status="error" text="error" /> },
];
