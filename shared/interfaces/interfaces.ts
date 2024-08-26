export interface UserInterface {
  name: string;
  password: string;
}

export interface Message {
  user: UserInterface;
  content: string;
  createdAt: Date;
}
