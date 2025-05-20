import * as bcrypt from 'bcrypt';

/**
 *  进行加盐加密
 *   password { string } 密码
 *   saltLength { number }  盐的长度
 */
export const encrypt = (password: string, saltLength = 16): string => {
  const salt = bcrypt.genSaltSync(saltLength);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

/**
 *  检查密码与加盐后的密码是否相同
 *  password  { string } 不加盐的密码
 *  hash      { string } 加盐后的密码
 */
export const decrypt = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
