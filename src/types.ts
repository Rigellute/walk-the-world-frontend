export type UserHasAuthenticated = React.Dispatch<
  React.SetStateAction<boolean>
>;

export type AppProps = {
  userHasAuthenticated: UserHasAuthenticated;
  isAuthenticated: boolean;
};
