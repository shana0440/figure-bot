import dynamoose from "./dynamoose";
import { IUser } from "../models/user";
import { getTableName } from "../utils/table";

const UsersSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    required: true
  }
});

interface UsersKeySchema {
  id: string;
}

const User = dynamoose.model<IUser, UsersKeySchema>(
  getTableName("users"),
  UsersSchema
);

export const addUser = async (user: IUser): Promise<void> => {
  await User.create(user);
};

export const removeUser = async (user: IUser): Promise<void> => {
  await User.delete(user);
};

export const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.scan()
    .all()
    .exec();
  // ignore lastKey of result
  return result as IUser[];
};
