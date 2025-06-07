export enum ApiErrorCode {
  SUCCESS = 200, // 成功
  USER_ID_INVALID = 10001, // 用户id无效
  USER_NOT_EXIST = 10002, // 用户不存在
  USER_EXIST = 10003, //用户已存在
  USER_PHONE_EXIST = 10006, //用户手机号已存在
  CAPTCHA_ERROR = 10004, //验证码错误
  CAPTCHA_EXPIRE = 10005, //验证码过期
  COMMON_CODE = 20000, //通用错误码,想偷懒就返回这个
}
