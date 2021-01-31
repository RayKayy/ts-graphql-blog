import { singleton } from 'tsyringe';

@singleton()
class Db {
  USERS: any[] = [
    {
      id: 'abc123',
      name: 'Raymond',
      email: 'a@a.ca',
      age: 26,
    },
    {
      id: 'abcdefg123',
      name: 'RAYRAY',
      email: 'b@b.ca',
      age: 26,
    },
  ];

  POSTS = [
    {
      id: '234defg',
      title: 'The Bullet Journal',
      body: 'Lalalalalala',
      published: false,
      author: 'abcdefg123',
    },
    {
      id: '123def',
      title: 'The Journal Method',
      body: 'Lalalalalala',
      published: true,
      author: 'abc123',
    },
    {
      id: '234567',
      title: 'Bullet Journal Method',
      body: 'Lalalalalala',
      published: true,
      author: 'abc123',
    },
  ];

  COMMENTS = [
    {
      id: '1',
      text: 'hello',
      author: 'abc123',
      post: '234567',
    },
    {
      id: '2',
      text: 'world',
      author: 'abc123',
      post: '234567',
    },
    {
      id: '3',
      text: 'hello world',
      author: 'abcdefg123',
      post: '234defg',
    },
    {
      id: '4',
      text: 'world hello',
      author: 'abcdefg123',
      post: '123def',
    },
  ];
}

export default Db;
