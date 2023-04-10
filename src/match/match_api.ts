const rpcMatchInit = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  payload: string
): string {
  let payloadJson;
  if (payload != '') {
    payloadJson = JSON.parse(payload);
  }

  let matchId: string = '';
  let params = {
    label: payloadJson.label,
  };
  try {
    matchId = nk.matchCreate(WORLD_MATCH_GAME, params);
    return JSON.stringify(matchId);
  } catch (error: any) {
    logger.error(error);
    return '';
  }
};
