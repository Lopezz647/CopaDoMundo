// lib/timezone-utils.ts
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BRAZIL_TZ = 'America/Sao_Paulo';

export const getMatchTimeInBrazil = (utcDate: string): Date => {
  return toZonedTime(new Date(utcDate), BRAZIL_TZ);
};

export const formatMatchTime = (utcDate: string): string => {
  return formatInTimeZone(
    new Date(utcDate),
    BRAZIL_TZ,
    'dd MMM, HH:mm',
    { locale: ptBR }
  );
};

export const getTimeUntilMatch = (utcDate: string): number => {
  const matchTime = getMatchTimeInBrazil(utcDate).getTime();
  const now = new Date().getTime();
  return matchTime - now;
};

export const isMatchTimeLocked = (utcDate: string): boolean => {
  const timeUntilMatch = getTimeUntilMatch(utcDate);
  const fifteenMinutesInMs = 15 * 60 * 1000;
  return timeUntilMatch <= 0 || timeUntilMatch < fifteenMinutesInMs;
};

export const getLockTimeInBrazil = (utcDate: string): Date => {
  const matchTime = getMatchTimeInBrazil(utcDate);
  return new Date(matchTime.getTime() - 15 * 60 * 1000);
};