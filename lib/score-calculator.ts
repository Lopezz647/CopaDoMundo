export const calculateLivePoints = (
  palpiteHome: number, 
  palpiteAway: number, 
  realHome: number | null | undefined, 
  realAway: number | null | undefined
): number => {
  // TRAVA DE SEGURANÇA: Se a API não mandou placar válido, ninguém ganha ponto
  if (typeof realHome !== 'number' || typeof realAway !== 'number') return 0;

  const acertouTendencia = Math.sign(realHome - realAway) === Math.sign(palpiteHome - palpiteAway);
  const acertouUmPlacar = (palpiteHome === realHome || palpiteAway === realAway);

  if (palpiteHome === realHome && palpiteAway === realAway) return 10; // Exato
  if (acertouTendencia) return acertouUmPlacar ? 7 : 5; // Vencedor + 1 placar ou Só Vencedor
  if (acertouUmPlacar) return 2; // Acertou um dos placares
  
  return 0; // Errou tudo
};
