export interface UserModel {
  email: string;
  uid: string;
}
export interface PublisherModel extends UserModel {
  imageUrl: string;
}
