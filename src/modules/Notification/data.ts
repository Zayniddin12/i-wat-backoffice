import { IActionType } from "@/components/Common/Dropdown/CActionsDropdown.types";

export const notificationHead = [
  {
    title: "№",
    key: "id",
  },
  {
    title: "connection_name",
    key: "name",
  },
  {
    title: "date_create",
    key: "date_create",
  },
  {
    title: "date_departure",
    key: "date_departure",
  },
  {
    title: "actions",
    key: "action",
  },
];

export const mainModelHead = [
  {
    title: "№",
    key: "id",
  },
  {
    title: "brand_name",
    key: "name",
  },
  {
    title: "models",
    key: "mark",
  },
  {
    title: "added_at",
    key: "added_at",
  },
  {
    title: "actions",
    key: "action",
  },
];

export const modelHead = [
  {
    title: "№",
    key: "id",
  },
  {
    title: "model_name",
    key: "name",
  },
  {
    title: "model_mark",
    key: "mark",
  },
  {
    title: "added_at",
    key: "added_at",
  },
  {
    title: "actions",
    key: "action",
  },
];

export const chargerHead = [
  {
    title: "№",
    key: "id",
  },
  {
    title: "charger_name",
    key: "name",
  },
  {
    title: "category",
    key: "category",
  },
  {
    title: "added_at",
    key: "added_at",
  },
  {
    title: "actions",
    key: "action",
  },
];

export const exchangeActions: IActionType[] = [
  {
    label: "edit",
    value: "edit",
    icon: "icon-edit text-gray-200",
    class: "!text-dark hover:bg-gray/90",
  },
  {
    label: "delete",
    value: "deleteExchange",
    icon: "icon-trash !text-red",
    class: "hover:!bg-red/20 !text-red",
  },
];

export const tabListLanguage = [
  {
    value: "uz",
    label: "O'zbekcha",
    icon: "/images/svg/flags/o'z.svg",
  },
  {
    value: "en",
    label: "English",
    icon: "/images/svg/flags/uk.svg",
  },
  {
    value: "ru",
    label: "Русский",
    icon: "/images/svg/flags/ru.svg",
  },
];
