function BeforeAuthenticateCustom(
  ctx: nkruntime.Context,
  logger: nkruntime.Logger,
  nk: nkruntime.Nakama,
  data: nkruntime.AuthenticateCustomRequest
): nkruntime.AuthenticateCustomRequest | void {
  let jwtToken = data.account?.id;
  if (jwtToken == '') {
    return;
  }

  const env = ctx.env;
  let getUserDataUrl = env.strapi_url + 'users/me';
  const response = nk.httpRequest(getUserDataUrl, 'get', {
    Authorization: 'Bearer ' + data.account?.id,
  });
  if (response.code > 299) {
    logger.error(`API error: ${response.body}`);
    return;
  }
  const userInfo = <UserInfo>JSON.parse(response.body);
  logger.info('data %v', userInfo);

  // Update the incoming authenticate request with the user ID and username
  data.account!.id = 'neobank-' + userInfo.id.toString();
  data.username = userInfo.username;
  return data;
}
