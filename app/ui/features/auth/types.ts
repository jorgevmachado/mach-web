export type SignUpParams = {
  name: string;
  email: string;
  gender: string;
  username: string;
  password: string;
  date_of_birth: string;
}

export type SignInParams = {
  email: string;
  username?: string;
  password: string;
}

export type LoginResponsePayload = {
  token_type: string;
  access_token: string;
}