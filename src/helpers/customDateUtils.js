import { formatDistanceToNow } from "date-fns";

// Time translation mappings
const timeTranslations = {
  en: {
    about: "about",
    lessThanXSeconds: "less than a second",
    xSeconds: "second",
    xMinutes: "minute",
    aboutXHours: "about an hour",
    xHours: "hour",
    xDays: "day",
    aboutXMonths: "about a month",
    xMonths: "month",
    aboutXYears: "about a year",
    xYears: "year",
    ago: "ago",
  },
  fr: {
    about: "environ",
    lessThanXSeconds: "moins d'une seconde",
    xSeconds: "seconde",
    xMinutes: "minute",
    aboutXHours: "environ une heure",
    xHours: "heure",
    xDays: "jour",
    aboutXMonths: "environ un mois",
    xMonths: "mois",
    aboutXYears: "environ un an",
    xYears: "an",
    ago: "depuis",
  },
};

// Custom formatter function
export const customFormatDistanceToNow = (date, { locale }) => {
  let distance = formatDistanceToNow(date);
  const translations = timeTranslations[locale];

  // Apply translations once, ensuring no duplication
  distance = distance
    .replace(/about/g, translations.about)
    .replace(/less than a second/g, translations.lessThanXSeconds)
    .replace(/ seconds?/g, ` ${translations.xSeconds}`)
    .replace(/ minutes?/g, ` ${translations.xMinutes}`)
    .replace(/ hours?/g, ` ${translations.xHours}`)
    .replace(/ days?/g, ` ${translations.xDays}`)
    .replace(/ months?/g, ` ${translations.xMonths}`)
    .replace(/ years?/g, ` ${translations.xYears}`)
    .replace(/ago/g, translations.ago);

  // Special case for "about an hour"
  distance = distance.replace(/about an hour/, translations.aboutXHours);

  return distance;
};
