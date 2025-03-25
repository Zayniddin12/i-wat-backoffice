export interface ICarSingle {
  user: number;
  vin: string;
  manufacturer: number;
  model: number;
  charging_type: number[];
  state_number: string;
}

export interface IHistoryCharging {
  id: number;
  user: {
    id: number;
    full_name: string;
    avatar_url: string;
    phone: string;
  };
  car: {
    id: number;
    manufacturer_icon: string | null;
    model_name: string;
    manufacturer_name: string;
    is_user_defined: boolean;
  };
  address_name: string;
  connector_name: string;
  meter_used: number;
  cost: number;
  booking_cost: number;
  parking_cost: number;
  end_timestamp: string;
  start_timestamp: string;
  duration: string;
  merchant_id: string;
}
