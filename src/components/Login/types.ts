export interface LoginProps {
  onLogin: (token: string) => Promise<boolean>;
  isLoading?: boolean;
}

export interface LoginFormProps {
  onSubmit: (token: string) => Promise<void>;
  isSubmitting: boolean;
}