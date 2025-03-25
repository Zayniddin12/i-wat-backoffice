import { useI18n } from "vue-i18n";

export function userTableHeadData() {
  const { t } = useI18n();

  return [
    {
      key: "index",
      title: "№",
    },
    {
      title: t("users_module.table.user"),
      key: "user",
    },
    {
      title: t("users_module.table.col_vo_car"),
      key: "col_vo_car",
    },
    {
      title: t("users_module.table.col_vo_station"),
      key: "col_vo_station",
    },
    {
      title: t("users_module.table.balance"),
      key: "balance",
    },
    {
      title: t("users_module.table.registration_date"),
      key: "registration_date",
    },
    {
      title: t("users_module.table.last_login"),
      key: "last_login",
    },
    {
      title: t("users_module.table.status"),
      key: "status",
    },
  ];
}
export function userTableCarHeadData() {
  const { t } = useI18n();

  return [
    {
      key: "index",
      title: "№",
    },
    {
      title: t("users_module.cars.model"),
      key: "model",
    },
    {
      title: t("users_module.cars.number"),
      key: "number",
    },
    {
      title: t("users_module.cars.vin"),
      key: "vin",
    },
    {
      title: t("users_module.cars.connector"),
      key: "connector",
    },
    {
      title: t("users_module.cars.added_date"),
      key: "added_date",
    },
    {
      title: t("users_module.cars.action"),
      key: "action",
    },
  ];
}

export function userTableCarsHeadData() {
  const { t } = useI18n();

  return [
    {
      key: "index",
      title: "№",
    },
    {
      key: "user",
      title: t("users_module.cars.user"),
    },
    {
      title: t("users_module.cars.model"),
      key: "model",
    },
    {
      title: t("users_module.cars.number"),
      key: "number",
    },
    {
      title: t("users_module.cars.vin"),
      key: "vin",
    },
    {
      title: t("users_module.cars.connector"),
      key: "connector",
    },
    {
      title: t("users_module.cars.added_date"),
      key: "added_date",
    },
  ];
}

export const fakeCarsDataForUser = [
  {
    id: 1,
    user: {
      fullName: "John Doe",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 999 99 99",
    },
    model: {
      name: "Tesla",
      title: "Tesla Model X",
      image: "https://picsum.photos/200/300",
    },
    number: "01123AAA",
    vin: "123456789",
    connector: "gb/tdc",
    added_date: "2022-01-18",
  },
  {
    id: 2,
    user: {
      fullName: "John Doe",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 999 99 99",
    },
    model: {
      name: "Chevrolet",
      title: "Chevrolet Bolt EV",
      image: "https://picsum.photos/200/300",
    },
    number: "01123AAA",
    vin: "987654321",
    connector: "gb/tac",
    added_date: "2022-02-05",
  },
  {
    id: 3,
    user: {
      fullName: "John Doe",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 999 99 99",
    },
    model: {
      name: "Nissan",
      title: "Nissan Leaf",
      image: "https://picsum.photos/200/300",
    },
    number: "01123AAA",
    vin: "456789012",
    connector: "chademo",
    added_date: "2022-03-12",
  },
  {
    id: 4,
    user: {
      fullName: "John Doe",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 999 99 99",
    },
    model: {
      name: "BMW",
      title: "BMW i3",
      image: "https://picsum.photos/200/300",
    },
    number: "01123AAA",
    vin: "345678901",
    connector: "chademo2",
    added_date: "2022-04-25",
  },
];

export const fakeUsersData = [
  {
    id: 1,
    user: {
      fullName: "John Doe",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 999 99 99",
    },
    col_vo_car: 2,
    col_vo_station: 3,
    balance: 1500,
    registration_date: "2022-01-18",
    last_login: "2022-01-18",
    status: "active",
  },
  {
    id: 2,
    user: {
      fullName: "Jane Smith",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 88 888 88 88",
    },
    col_vo_car: 1,
    col_vo_station: 5,
    balance: 2000,
    registration_date: "2022-02-05",
    last_login: "2022-02-05",
    status: "active",
  },
  {
    id: 3,
    user: {
      fullName: "Alice Johnson",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 77 777 77 77",
    },
    col_vo_car: 4,
    col_vo_station: 2,
    balance: 1800,
    registration_date: "2022-03-12",
    last_login: "2022-03-12",
    status: "active",
  },
  {
    id: 4,
    user: {
      fullName: "Bob Anderson",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 66 666 66 66",
    },
    col_vo_car: 0,
    col_vo_station: 7,
    balance: 2200,
    registration_date: "2022-04-25",
    last_login: "2022-04-25",
    status: "inactive",
  },
];

export function allStatus() {
  const { t } = useI18n();

  return [
    {
      value: "all",
      label: t("users_module.status.all"),
    },
    {
      value: "true",
      label: t("users_module.status.active"),
    },
    {
      value: "false",
      label: t("users_module.status.inactive"),
    },
  ];
}

export function allUserTypes() {
  const { t } = useI18n();

  return [
    {
      value: "all",
      label: t("users_module.user_type.all"),
    },
    {
      value: "in_station",
      label: t("users_module.user_type.in_station"),
    },
    {
      value: "out_station",
      label: t("users_module.user_type.out_station"),
    },
    {
      value: "admin",
      label: t("users_module.user_type.admin"),
    },
  ];
}

export const fakeCarsData = [
  {
    id: 1,
    model: {
      name: "Tesla",
      title: "Tesla Model X",
      image: "https://picsum.photos/200/300",
    },
    number: "AA 1234 AA",
    vin: "123456789",
    connector: "Type 2",
    added_date: "2022-01-18",
  },
  {
    id: 2,
    model: {
      name: "Chevrolet",
      title: "Chevrolet Bolt EV",
      image: "https://picsum.photos/200/300",
    },
    number: "BB 5678 BB",
    vin: "987654321",
    connector: "CCS Combo",
    added_date: "2022-02-05",
  },
  {
    id: 3,
    model: {
      name: "Nissan",
      title: "Nissan Leaf",
      image: "https://picsum.photos/200/300",
    },
    number: "CC 9876 CC",
    vin: "456789012",
    connector: "CHAdeMO",
    added_date: "2022-03-12",
  },
  {
    id: 4,
    model: {
      name: "BMW",
      title: "BMW i3",
      image: "https://picsum.photos/200/300",
    },
    number: "DD 5432 DD",
    vin: "345678901",
    connector: "Type 2",
    added_date: "2022-04-25",
  },
];
