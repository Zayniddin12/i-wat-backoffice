export interface INotification {
  message_uz: string;
  message_ru: string;
  message_en: string;
  title_uz: string;
  title_ru: string;
  title_en: string;
  text_uz: string;
  text_ru: string;
  text_en: string;
  cover_image_uz: string;
  cover_image_ru: string;
  cover_image_en: string;
  platformChecked: string;
  datePicker: string;
  dateTimePicker: string;
  scheduled_time?: string;
  is_scheduled?: boolean;
}
