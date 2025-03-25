export interface ICarModel {
  id: number;
  name: string;
  manufacturer_name: string;
  manufacturer_icon: string | null;
  manufacturer_id?: number;
  created_at: string;
  user_defined: boolean;
}

export interface IMark {
  created_at: string;
  icon: string;
  id: number;
  model_count: number;
  name: string;
}

export interface IChargingType {
  id: number;
  icon: string;
  name: string;
  type: string;
  created_at: string;
}
