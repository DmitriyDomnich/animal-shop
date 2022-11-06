export interface UserModel {
  email: string;
  uid: string;
  name?: string;
}
export interface PublisherModel extends UserModel {
  imageUrl: string;
}
