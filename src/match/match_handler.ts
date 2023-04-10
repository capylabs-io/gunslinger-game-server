const matchInit = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  params: { [key: string]: string }
): { state: nkruntime.MatchState; tickRate: number; label: string } {
  logger.debug('Lobby match created');
  let presences: { [userId: string]: nkruntime.Presence } = {};

  return {
    state: { presences },
    tickRate: 60,
    label: params.label,
  };
};

const matchJoinAttempt = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  presence: nkruntime.Presence,
  metadata: { [key: string]: any }
): {
  state: nkruntime.MatchState;
  accept: boolean;
  rejectMessage?: string | undefined;
} | null {
  Logger.load(logger);
  StorageEngine.load(nk);

  // if (metadata) {
  //   const outfitData = JSON.parse(metadata.CharacterOutfitData);
  //   const writeParam: IStorageWrite = {
  //     collection: USER_DATA_COLLECTION,
  //     key: ctx.userId,
  //     value: {
  //       userId: ctx.userId,
  //       outfit: outfitData || null,
  //     },
  //   };
  //   storageWrite(nk, [writeParam]);
  //   // StorageEngine.write([writeParam]);
  // }

  return {
    state,
    accept: true,
  };
};

const matchJoin = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  presences: nkruntime.Presence[]
): { state: nkruntime.MatchState } | null {
  Logger.error(state);
  presences.forEach(function (presence) {
    state.presences[presence.userId] = presence;
  });

  return {
    state,
  };
};

const matchLeave = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  presences: nkruntime.Presence[]
): { state: nkruntime.MatchState } | null {
  presences.forEach(function (presence) {
    delete state.presences[presence.userId];
    const deleteParam: IStorageDelete = {
      collection: USER_DATA_COLLECTION,
      key: presence.userId,
    };
    StorageEngine.delete([deleteParam]);
    logger.debug('%q left Lobby match', presence.userId);
  });

  return {
    state,
  };
};

const matchLoop = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  messages: nkruntime.MatchMessage[]
): { state: nkruntime.MatchState } | null {
  Logger.load(logger);
  StorageEngine.load(nk);

  Object.keys(state.presences).forEach(function (key) {
    const presence = state.presences[key];
  });

  messages.forEach(function (message) {
    dispatcher.broadcastMessage(
      message.opCode,
      message.data,
      null,
      message.sender
    );
  });

  return {
    state,
  };
};

const matchTerminate = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  graceSeconds: number
): { state: nkruntime.MatchState } | null {
  logger.debug('Lobby match terminated');

  const message = `Server shutting down in ${graceSeconds} seconds.`;
  dispatcher.broadcastMessage(2, message, null, null);

  return {
    state,
  };
};

const matchSignal = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  dispatcher: nkruntime.MatchDispatcher,
  tick: number,
  state: nkruntime.MatchState,
  data: string
): { state: nkruntime.MatchState; data?: string } | null {
  logger.debug('Lobby match signal received: ' + data);

  return {
    state,
    data: 'Lobby match signal received: ' + data,
  };
};
