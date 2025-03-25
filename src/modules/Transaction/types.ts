export interface ITotalData {
  icon1: string;
  icon2: string;
  title1: string;
  value1: string;
  title2: string;
  value2: string;
}

export interface ITransaction {
  id: number;
  variant: string;
  transaction_id: string;
  merchant_id: string;
  amount: number;
  created_at: string;
  user: {
    id: number;
    full_name: string;
    avatar_url: string;
    phone: string;
  };
}
