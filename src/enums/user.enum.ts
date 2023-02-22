/** 用户状态枚举 */
enum UserStatusEnum {
  /** 正常 */
  正常 = 'normal',
  /** 锁定 */
  锁定 = 'locked',
}

/** 用户性别枚举 */
enum UserGenderEnum {
  /** 未知 */
  未知 = 0,
  /** 男 */
  男 = 1,
  /** 女 */
  女 = 2,
}

export { UserStatusEnum, UserGenderEnum };
