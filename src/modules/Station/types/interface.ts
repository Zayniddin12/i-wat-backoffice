export interface IRegion {
  id: number;
  name: string;
}

export interface IDistrict {
  id: number;
  name: string;
  regionId: number;
}

export interface Connector {
  id: number;
  charging_type_icon: string | null;
  charging_type_name: string;
  created_at: string;
  status: string;
  power: number;
  power_unit: string;
  available: boolean;
}

export interface Owner {
  id: number;
  full_name: string;
  avatar_url: string;
  phone: string;
}

export interface IColumn {
  id: number;
  name: string | null;
  connectors?: Connector[];
  owners?: Owner[];
}

export interface IStation {
  name: string;
  landmark: string;
  price_parking: number;
  columns_ids: IColumn[];
  created_at: string;
}

export interface IUserSelector {
  id: number;
  full_name: string;
  avatar_url: string;
  phone: string;
}

export type ChargingStation = {
  id: number;
  icon: null | string;
  name: string;
  type: string;
  created_at: string;
};
