export interface LoginFormProps {
  onLoginSuccess: (token: string, userId: string) => void;
  onLoginError: (error: string) => void;
}