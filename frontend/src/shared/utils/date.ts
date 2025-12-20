import dayjs from 'dayjs';
import 'dayjs/locale/ru';

export const formatDateTime = (date: Date | string): string => {
  return dayjs(date).locale('ru').format('D MMMM YYYY, HH:mm');
};
