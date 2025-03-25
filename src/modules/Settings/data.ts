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

export const translations = {
  uz: {
    name: "Ism",
    title: "Sarlavha",
    text: "Matn",
    platform: "Platforma",
    releaseTime: "Chiqarish vaqti",
    addImage: "Reklama tasviri",
  },
  ru: {
    name: "Название",
    title: "Заголовок",
    text: "Текст",
    platform: "Платформа",
    releaseTime: "Время выхода",
    addImage: "Изображение объявления",
  },
  en: {
    name: "Name",
    title: "Heading",
    text: "Text",
    platform: "Platform",
    releaseTime: "Release time",
    addImage: "Add image",
  },
};

export const exchangeActions: IActionType[] = [
  {
    label: "edit",
    value: "edit",
    icon: "icon-edit",
  },
  {
    label: "delete",
    value: "deleteExchange",
    icon: "icon-trash group-hover:!text-red",
    class: "hover:!bg-red/20",
  },
];

export const tabListLanguage = [
  {
    value: "uz",
    label: "O'zbekcha",
    icon: "/images/svg/flags/o'z.svg",
  },
  {
    value: "ru",
    label: "Русский",
    icon: "/images/svg/flags/ru.svg",
  },
  {
    value: "en",
    label: "English",
    icon: "/images/svg/flags/uk.svg",
  },
];

export const dataValue = [
  {
    id: 1,
    title: "Title",
    mark: "Tesla",
    mark_icon: "",
    date_departure: "11.11.2022",
  },
  {
    id: 2,
    title: "AC",
    mark: "BMW",
    mark_icon: "",
    date_departure: "11.11.2022",
  },
  {
    id: 3,
    title: "Title",
    mark: "Tesla",
    mark_icon: "",
    date_departure: "11.11.2022",
  },
  {
    id: 4,
    title: "AC",
    mark: "BMW",
    mark_icon: "",
    date_departure: "11.11.2022",
  },
  {
    id: 5,
    title: "Title",
    mark: "Tesla",
    mark_icon: "",
    date_departure: "11.11.2022",
  },
  {
    id: 6,
    title: "AC",
    mark: "BMW",
    mark_icon: "",
    date_departure: "11.11.2022",
  },
];
export const markData = [
  {
    id: 1,
    name: "Tesla",
    mark: 4,
    mark_icon: "",
    date_departure: "11.11.2022",
  },
];
