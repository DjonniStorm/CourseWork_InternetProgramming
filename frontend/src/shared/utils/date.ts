import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';

dayjs.extend(utc);

export const formatDateTime = (date: Date | string): string => {
  const localDate = dayjs(date).locale('ru');
  const utcDate = dayjs.utc(date).locale('ru');
  const localFormatted = localDate.format('D MMMM YYYY, HH:mm');
  const utcFormatted = utcDate.format('D MMMM YYYY, HH:mm');
  
  // Если время отличается, показываем UTC в скобках
  const localTimeStr = localDate.format('YYYY-MM-DD HH:mm');
  const utcTimeStr = utcDate.format('YYYY-MM-DD HH:mm');
  
  if (localTimeStr !== utcTimeStr) {
    return `${localFormatted} (UTC: ${utcFormatted})`;
  }
  
  return localFormatted;
};
