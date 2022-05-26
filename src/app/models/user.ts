export interface ProfileUser {
  uid: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  address?: string;
  photoURL?: string;
  userList?: Users[];
}

interface Users {
  name: string;
  age: number;
  dob: string;
}
