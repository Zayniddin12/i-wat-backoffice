import { useI18n } from "vue-i18n";

export function transactionTableHeadData() {
  const { t } = useI18n();

  return [
    {
      title: "№",
      key: "index",
    },
    {
      title: t("transaction.table.transactionMethod"),
      key: "method",
    },
    {
      title: t("transaction.table.transactionId"),
      key: "transactionId",
    },
    {
      title: t("transaction.table.amount"),
      key: "amount",
    },
    {
      title: t("transaction.table.date"),
      key: "date",
    },
    {
      title: t("transaction.table.user"),
      key: "user",
    },
  ];
}

export function historyTransactionHeadData() {
  const { t } = useI18n();

  return [
    {
      title: "№",
      key: "index",
    },
    {
      title: t("transaction.table.transactionMethod"),
      key: "method",
    },
    {
      title: t("transaction.table.transaction"),
      key: "amount",
    },
    {
      title: t("transaction.table.commission"),
      key: "commission",
    },
    {
      title: t("transaction.table.date"),
      key: "date",
    },
  ];
}

export function historyParkingTableHeadData() {
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
      title: t("users_module.cars.model"),
      key: "car",
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
  ];
}

export function chargingTableHeadData() {
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
      title: t("charging_transactions.table.columns"),
      key: "columns",
    },
    {
      title: t("charging_transactions.table.used_kw"),
      key: "used_kw",
      sortable: true,
      sort_key: "meter_used",
    },
    {
      title: t("charging_transactions.table.paid_amount"),
      key: "paid_amount",
      sortable: true,
      sort_key: "cost",
    },
    {
      title: t("charging_transactions.table.charging_date"),
      key: "charging_date",
    },
  ];
}

export const fakeChargingInfo = () => {
  const { t } = useI18n();
  return [
    {
      icon1: "icon-cash text-green text-3xl",
      icon2: "",
      title1: t("total_paid"),
      value1: "48 520 400 UZS",
      title2: t("not_paid_vip"),
      value2: "34 590 000 UZS",
    },
    {
      icon1: "icon-light text-[#F2B33A] text-3xl",
      icon2: "",
      title1: t("total_kwt_used"),
      value1: "24 810 кВт",
      title2: t("used_vip_users"),
      value2: "12 324 кВт",
    },
  ];
};

export const paymentSelects = () => {
  const { t } = useI18n();
  return [
    {
      title: t("payment_types.payme"),
      value: "payme",
    },
    {
      title: t("payment_types.paylov"),
      value: "paylov",
    },
    {
      title: t("payment_types.humo"),
      value: "humo",
    },
    {
      title: t("payment_types.uzcard"),
      value: "card",
    },
    {
      title: t("payment_types.uzum"),
      value: "uzum",
    },
  ];
};

export function allStatusAmount() {
  const { t } = useI18n();

  return [
    {
      value: "all",
      label: t("all"),
    },
    {
      value: "-parking_cost",
      label: t("the_largest"),
    },
    {
      value: "parking_cost",
      label: t("the_smallest"),
    },
  ];
}

export function historyChargingTableHeadData() {
  const { t } = useI18n();

  return [
    {
      title: "№",
      key: "index",
    },
    {
      title: t("users_module.cars.model"),
      key: "car",
    },
    {
      title: t("charging_transactions.table.location"),
      key: "station",
    },
    // {
    //   title: t("charging_transactions.table.columns"),
    //   key: "columns",
    // },
    {
      title: t("charging_transactions.table.used_kw"),
      key: "used_kw",
    },
    {
      title: t("charging_transactions.table.charged"),
      key: "charged",
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

export const fakeTransactionData = [
  {
    index: 1,
    method: {
      title: "Bank Transfer",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "123456789",
    amount: "1500",
    date: "2022-01-18",
    user: {
      fullName: "Alice Johnson",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 888 77 66",
    },
  },
  {
    index: 2,
    method: {
      title: "Credit Card",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "987654321",
    amount: "750",
    date: "2022-01-17",
    user: {
      fullName: "Bob Smith",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 777 66 55",
    },
  },
  {
    index: 3,
    method: {
      title: "Cash",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "567890123",
    amount: "2000",
    date: "2022-01-16",
    user: {
      fullName: "Elena Rodriguez",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 666 55 44",
    },
  },
  {
    index: 4,
    method: {
      title: "E-wallet",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "345678901",
    amount: "1200",
    date: "2022-01-15",
    user: {
      fullName: "Daniel Kim",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 555 44 33",
    },
  },
  {
    index: 5,
    method: {
      title: "Check",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "109876543",
    amount: "500",
    date: "2022-01-14",
    user: {
      fullName: "Grace Patel",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 444 33 22",
    },
  },
  {
    index: 6,
    method: {
      title: "PayPal",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "234567890",
    amount: "1800",
    date: "2022-01-13",
    user: {
      fullName: "Michael Nguyen",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 333 22 11",
    },
  },
  {
    index: 7,
    method: {
      title: "Mobile Payments",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "678901234",
    amount: "950",
    date: "2022-01-12",
    user: {
      fullName: "Sophia Chang",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 222 11 00",
    },
  },
  {
    index: 8,
    method: {
      title: "Debit Card",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "456789012",
    amount: "1600",
    date: "2022-01-11",
    user: {
      fullName: "Liam Gupta",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 111 00 99",
    },
  },
  {
    index: 9,
    method: {
      title: "Yandex.Money",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "901234567",
    amount: "2200",
    date: "2022-01-10",
    user: {
      fullName: "Ava Sharma",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 000 99 88",
    },
  },
  {
    index: 10,
    method: {
      title: "WebMoney",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "123456780",
    amount: "1300",
    date: "2022-01-09",
    user: {
      fullName: "Noah Patel",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 999 00 88",
    },
  },
  {
    index: 11,
    method: {
      title: "Bitcoin",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "890123456",
    amount: "1900",
    date: "2022-01-08",
    user: {
      fullName: "Olivia Kim",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 888 00 77",
    },
  },
  {
    index: 12,
    method: {
      title: "Western Union",
      image: "https://picsum.photos/200/300",
    },
    transactionId: "234567891",
    amount: "800",
    date: "2022-01-07",
    user: {
      fullName: "William Chen",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 777 00 66",
    },
  },
];
export const fakeOptions = [
  {
    title: "Bank Transfer",
    id: 1,
  },
  {
    title: "Credit Card",
    id: 2,
  },
];

export const chargingSessions = [
  {
    id: 1,
    user: {
      fullName: "Alice Johnson",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 888 77 66",
    },
    car: {
      title: "Tesla Model S",
      image: "https://picsum.photos/200/300",
      model: "Model S",
    },
    station: "Station 1",
    columns: "1",
    used_kw: "50",
    paid_amount: "1500",
    charging_date: "2022-01-18",
  },
  {
    id: 2,
    user: {
      fullName: "Bob Smith",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 777 66 55",
    },
    car: {
      title: "Chevrolet Bolt",
      image: "https://picsum.photos/200/300",
      model: "Bolt",
    },
    station: "Station 2",
    columns: "2",
    used_kw: "40",
    paid_amount: "1200",
    charging_date: "2022-01-17",
  },
  {
    id: 3,
    user: {
      fullName: "Elena Rodriguez",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 666 55 44",
    },
    car: {
      title: "Nissan Leaf",
      image: "https://picsum.photos/200/300",
      model: "Leaf",
    },
    station: "Station 3",
    columns: "1",
    used_kw: "30",
    paid_amount: "1000",
    charging_date: "2022-01-16",
  },
  {
    id: 4,
    user: {
      fullName: "Daniel Kim",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 555 44 33",
    },
    car: {
      title: "BMW i3",
      image: "https://picsum.photos/200/300",
      model: "i3",
    },
    station: "Station 1",
    columns: "2",
    used_kw: "45",
    paid_amount: "1400",
    charging_date: "2022-01-15",
  },
  {
    id: 5,
    user: {
      fullName: "Grace Patel",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 444 33 22",
    },
    car: {
      title: "Ford Mustang Mach-E",
      image: "https://picsum.photos/200/300",
      model: "Mustang Mach-E",
    },
    station: "Station 2",
    columns: "1",
    used_kw: "35",
    paid_amount: "1100",
    charging_date: "2022-01-14",
  },
  {
    id: 6,
    user: {
      fullName: "Michael Nguyen",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 333 22 11",
    },
    car: {
      title: "Kia Soul EV",
      image: "https://picsum.photos/200/300",
      model: "Soul EV",
    },
    station: "Station 3",
    columns: "2",
    used_kw: "55",
    paid_amount: "1600",
    charging_date: "2022-01-13",
  },
  {
    id: 7,
    user: {
      fullName: "Sophia Chang",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 222 11 00",
    },
    car: {
      title: "Hyundai Kona Electric",
      image: "https://picsum.photos/200/300",
      model: "Kona Electric",
    },
    station: "Station 1",
    columns: "1",
    used_kw: "40",
    paid_amount: "1300",
    charging_date: "2022-01-12",
  },
  {
    id: 8,
    user: {
      fullName: "Liam Gupta",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 111 00 99",
    },
    car: {
      title: "Volkswagen ID.4",
      image: "https://picsum.photos/200/300",
      model: "ID.4",
    },
    station: "Station 2",
    columns: "2",
    used_kw: "60",
    paid_amount: "1800",
    charging_date: "2022-01-11",
  },
  {
    id: 9,
    user: {
      fullName: "Ava Sharma",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 000 99 88",
    },
    car: {
      title: "Audi e-tron",
      image: "https://picsum.photos/200/300",
      model: "e-tron",
    },
    station: "Station 3",
    columns: "1",
    used_kw: "25",
    paid_amount: "900",
    charging_date: "2022-01-10",
  },
  {
    id: 10,
    user: {
      fullName: "Noah Patel",
      image: "https://picsum.photos/200/300",
      phoneNumber: "+998 99 999 00 88",
    },
    car: {
      title: "Mercedes-Benz EQC",
      image: "https://picsum.photos/200/300",
      model: "EQC",
    },
    station: "Station 1",
    columns: "2",
    used_kw: "50",
    paid_amount: "1500",
    charging_date: "2022-01-09",
  },
];
