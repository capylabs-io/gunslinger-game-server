const matchInit = function (
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  params: { [key: string]: string }
): { state: nkruntime.MatchState; tickRate: number; label: string } {
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
  presences.forEach(function (presence) {
    state.presences[presence.userId] = presence;
    state.players[presence.userId] = new Player({
      x: 0,
      y: 0
    }, 100, 100)
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
    const view = new DataView(message.data);
    let decodedStr = "";
    for (let i = 0; i < (message.data.byteLength); i++) {
      decodedStr += String.fromCharCode(view.getUint8(i));
    }
    let data = JSON.parse(decodedStr)
    switch (message.opCode) {
      case OpCode.move:
        let player = <Player>state.players[message.sender.userId]
        player.position.x -= player.speed

        dispatcher.broadcastMessage(
          message.opCode,
          JSON.stringify(player),
          null,
          message.sender
        );
    }    
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
