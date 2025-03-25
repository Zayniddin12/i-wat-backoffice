import { IActionType } from "@/components/Common/Dropdown/CActionsDropdown.types";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export const stationsHead = [
  {
    title: "№",
    key: "_index",
  },
  {
    title: "ezc_title",
    key: "title",
  },
  {
    title: "ezc_quantity",
    key: "quantity",
  },
  {
    title: "right_address",
    // Todo: need to add from backend
    key: "location_name",
  },
  {
    title: "added_at",
    key: "date",
  },
];

export const connectorsHead = [
  {
    title: "№",
    key: "_index",
  },
  {
    title: "type_chargers",
    key: "type",
  },
  {
    title: "status_in_app",
    key: "status_app",
  },
  {
    title: "price_kvt",
    key: "price",
  },

  {
    title: "with_discount",
    key: "with_discount",
  },
  {
    title: "power",
    key: "power",
  },
  {
    title: "added_at",
    key: "date",
  },
  {
    title: "edit_user_modal.status",
    key: "status",
  },
  {
    title: "actions",
    key: "action",
  },
];
export const connectors = [
  {
    id: 1,
    type: "TYPE 1 J1772",
    status_app: "empty",
    price: "15 000",
    power: "120.0",
    date: "07.10.2022",
    status: "empty",
  },
  {
    id: 2,
    type: "CHAdeMO",
    status_app: "not_work",
    price: "15 000",
    power: "120.0",
    date: "07.10.2022",
    status: "not_work",
  },
  {
    id: 3,
    type: "CCS COMBO TYPE 1",
    status_app: "disabled",
    price: "15 000",
    power: "120.0",
    date: "07.10.2022",
    status: "disabled",
  },
];

export const dataValue = [
  {
    id: 1,
    title: "Парковка Мирзо Улугбека №28",
    subtitle: "(EBB-98735)",
    count: "4",
    quantity: "10",
    address:
      "ул. Паркент, 45Б махалля Истиклол, Мирзо Улугбекский район, Ташкент",
    date: "11.11.2022 13:13",
  },
  {
    id: 1,
    title: "Парковка Мирзо Улугбека №28",
    subtitle: "(EBB-98735)",
    count: "4",
    quantity: "10",
    address:
      "ул. Паркент, 45Б махалля Истиклол, Мирзо Улугбекский район, Ташкент",
    date: "11.11.2022 13:13",
  },
  {
    id: 1,
    title: "Парковка Мирзо Улугбека №28",
    subtitle: "(EBB-98735)",
    count: "4",
    quantity: "10",
    address:
      "ул. Паркент, 45Б махалля Истиклол, Мирзо Улугбекский район, Ташкент",
    date: "11.11.2022 13:13",
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

export const userList = ref([
  {
    id: 1,
    image: "https://picsum.photos/200/200",
    phone: "Владелец",
    job: "Владелец",
    title: "Владелец",
    fullName: "+998 94 122 90 05",
  },
  {
    id: 2,
    image: "https://picsum.photos/200/200",
    phone: "Яхъё Машрабов",
    job: "Яхъё Машрабов",
    title: "Яхъё Машрабов",
    fullName: "+998 94 122 90 05",
  },
  {
    id: 3,
    image: "https://picsum.photos/200/200",
    phone: "Дильшодбек Курбоналиев",
    job: "Дильшодбек Курбоналиев",
    title: "Дильшодбек Курбоналиев",
    fullName: "+998 94 122 90 05",
  },
  {
    id: 4,
    image: "https://picsum.photos/200/200",
    phone: "Мирзохид Абдураззаков",
    job: "Мирзохид Абдураззаков",
    title: "Мирзохид Абдураззаков",
    fullName: "+998 94 122 90 05",
  },
]);

export const actionListConnector = ref([
  {
    value: "activate",
    class: "hover:bg-gray/40 text-green",
    active: true,
  },
  {
    value: "deactivate",
    class: "hover:bg-red/40 text-red",
    active: false,
  },
]);

export function historyHeadData() {
  const { t } = useI18n();

  return [
    {
      title: "№",
      key: "index",
    },
    {
      title: t("charging_transactions.table.user"),
      key: "user",
    },
    {
      title: t("charging_transactions.table.car"),
      key: "car",
    },
    {
      title: t("charging_transactions.table.station"),
      key: "station",
    },
    {
      title: t("charging_transactions.table.used_kw"),
      key: "used_kw",
    },
    {
      title: t("charging_transactions.table.paid_amount"),
      key: "paid_amount",
    },
    {
      title: t("charging_transactions.table.charging_date"),
      key: "charging_date",
    },
  ];
}

export const ConnectorState = {
  available: "Available",
  preparing: "Preparing",
  charging: "Charging",
  unavailable: "Unavailable",
  finishing: "Finishing",
  faulted: "Faulted",
};
