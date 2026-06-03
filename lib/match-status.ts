// lib/match-status.ts
export const MATCH_STATUS = {
  // Não iniciado
  NS: 'NS',
  TBD: 'TBD',
  TIMED: 'TIMED',
  SCHEDULED: 'SCHEDULED',

  // Em andamento
  IN_PLAY: 'IN_PLAY',
  LIVE: 'LIVE',
  '1H': '1H',
  HT: 'HT',
  '2H': '2H',
  ET: 'ET',
  PEN: 'PEN',
  PAUSED: 'PAUSED',

  // Finalizado
  FINISHED: 'FINISHED',
  FT: 'FT',
  AET: 'AET',

  // Especiais
  PST: 'POSTPONED',
  CANC: 'CANCELLED',
  ABD: 'ABANDONED',
} as const;

export type MatchStatus = typeof MATCH_STATUS[keyof typeof MATCH_STATUS];

export const getMatchState = (status: string) => {
  const upperStatus = status?.toUpperCase() || 'TIMED';

  // Estados especiais que bloqueiam palpites
  if (['CANC', 'PST', 'ABD', 'CANCELLED', 'POSTPONED', 'ABANDONED'].includes(upperStatus)) {
    return {
      isBlocked: true,
      isLive: false,
      isFinished: false,
      isPending: false,
      reason: upperStatus === 'CANC' || upperStatus === 'CANCELLED'
        ? 'Jogo cancelado'
        : upperStatus === 'PST' || upperStatus === 'POSTPONED'
        ? 'Jogo adiado'
        : 'Jogo abandonado',
      allowPredictions: false,
      showRealScore: false,
    };
  }

  // Estados finalizados
  if (['FINISHED', 'FT', 'AET'].includes(upperStatus)) {
    return {
      isBlocked: true,
      isLive: false,
      isFinished: true,
      isPending: false,
      reason: 'Jogo finalizado',
      allowPredictions: false,
      showRealScore: true,
    };
  }

  // Estados em andamento
  if (['IN_PLAY', 'LIVE', '1H', 'HT', '2H', 'ET', 'PEN', 'PAUSED'].includes(upperStatus)) {
    return {
      isBlocked: true,
      isLive: true,
      isFinished: false,
      isPending: false,
      reason: 'Jogo em andamento',
      allowPredictions: false,
      showRealScore: true,
    };
  }

  // Estados pendentes (não iniciado)
  return {
    isBlocked: false,
    isLive: false,
    isFinished: false,
    isPending: true,
    reason: 'Palpites abertos',
    allowPredictions: true,
    showRealScore: false,
  };
};