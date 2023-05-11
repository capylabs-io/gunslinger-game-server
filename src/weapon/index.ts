enum WEAPON_TYPE {
  HANDGUN = "HANDGUN",
  SHOTGUN = "SHOTGUN",
  SMG = "SMG",
  SNIPER = "SNIPER",
  AR_LMG = "AR/LMG",
  SPECIAL = "SPECIAL"
}

interface WEAPON_ATTRIBUTE {
  name: string,
  type: WEAPON_TYPE,
  range: number,
  damage: number,
  bulletSpeed: number,
  attackSpeed: number,
  weight: number,
  recoil: number,
  rateOfFire: number,
}
