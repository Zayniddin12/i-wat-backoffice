import { useI18n } from "vue-i18n";

export const activeUsersTableHeadData = () => {
  const { t } = useI18n();

  return [
    {
      key: "index",
      title: "№",
    },
    {
      title: t("dashboard_module.table.user"),
      key: "user",
    },
    {
      title: t("dashboard_module.table.car"),
      key: "car",
    },
    {
      title: t("dashboard_module.table.now"),
      key: "now",
    },
    {
      title: t("dashboard_module.table.col_vo_station"),
      key: "col_vo_station",
    },
    {
      title: t("dashboard_module.table.connector"),
      key: "col_vo_column",
    },
    {
      title: t("dashboard_module.table.start_date"),
      key: "start_date",
    },
  ];
};

// export const dashboardStaticData = () => {
//   const { t } = useI18n();
//
//   return
// };
