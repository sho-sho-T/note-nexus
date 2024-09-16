import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

export const dateFormatter = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error("無効な日付です");
    }

    return format(date, "yyyy年MM月dd日 HH:mm", { locale: ja });
  } catch (e) {
    console.error(`日付のフォーマットに失敗しました。 ${e}`);
    return "Invalid Date";
  }
};
