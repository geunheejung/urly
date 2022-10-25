interface User {
  index: number;
  id: string;
  email: string;
}
interface Mock {
  users: User[];
}

export const mock: Mock = {
  users: [
    {
      index: 0,
      id: 'hijs12345',
      email: 'hijs12345@gmail.com',
    },
    {
      index: 1,
      id: 'hits12345',
      email: 'hits12345@gmail.com',
    },
    {
      index: 2,
      id: 'hijava12345',
      email: 'hijava12345@gmail.com',
    },
    {
      index: 3,
      id: 'hipython12345',
      email: 'hipython12345@gmail.com',
    },
  ],
};

export const confirmId = (id: string) =>
  mock.users.some((raw) => raw.id === id);
export const confirmEmail = (email: string) =>
  mock.users.some((raw) => raw.email === email);
