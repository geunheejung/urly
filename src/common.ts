export const RULE = {
  ID: /^(?!(?:[0-9]+)$)([a-zA-Z]|[0-9a-zA-Z]){6,16}$/g,
  SPECIAL: /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g,
  PW: /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?:[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]/g,
  REPEAT_NUM: /\b(\d)\1+\b/g,
  EMAIL: /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/,
} as const;

export const MockData = {
  idList: ['aaa'],
  emailList: ['bbb'],
} as const;

export const ROUTE = {
  HOME: '/',  
  SIGN_UP: '/member/signup',  
  SHIPPING: '/address/shipping-address',
  SHIPPING_RESULT: '/address/shipping-address/result'
} as const;

