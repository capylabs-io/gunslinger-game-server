let InitModule: nkruntime.InitModule = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  initializer: nkruntime.Initializer
) {
  initializer.registerRpc('rpcHealthCheck', rpcHealthCheck);
  initializer.registerMatch(MATCH_GAME, {
    matchInit: worldMatchInit,
    matchJoinAttempt: worldMatchJoinAttempt,
    matchJoin: worldMatchJoin,
    matchLeave: worldMatchLeave,
    matchLoop: worldMatchLoop,
    matchSignal: worldMatchSignal,
    matchTerminate: worldMatchTerminate,
  });
};
