export const strings = {
  // Home Screen
  en:
  {
    homeScreen:{
      welcome: "Welcome to Nativewind!",
  },
  SignInScreen: {
      // App/Section Headers
      title: "MovieApp",
      subtitle: "Sign in or create an account",

      // Field Labels
      fullNameLabel: "Full name",
      emailLabel: "Email",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",

      // Placeholders
      fullNamePlaceholder: "John Doe",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "At least 6 characters",
      confirmPasswordPlaceholder: "Re-type password",

      // Validation Errors
      nameRequired: "Name is required",
      nameMinLength: "Name must be at least 2 characters",
      emailRequired: "Email is required",
      emailInvalid: "Enter a valid email",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 6 characters",
      confirmRequired: "Confirm password is required",
      passwordsMismatch: "Passwords do not match",
      incorrectPassword: "Incorrect password for this email",

      // Button Texts
      submitButton: "Sign In / Register",
      loadingButton: "Please wait...",
      showPassword: "Show",
      hidePassword: "Hide",

      // Alert Titles and Messages
      registeredTitle: "Registered",
      registeredMessage: "Your account is created locally.\nNow login with your credentials.",
      signedInTitle: "Signed in",
      signedInMessage: "Welcome back, ",
      errorTitle: "Error",
      emailExistsError: "Email already registered — incorrect password.",
      differentAccountTitle: "Different account found",
      differentAccountMessage: "A different account is already stored on this device. Do you want to overwrite it with this new account?",
      overwriteTitle: "Registered",
      overwriteMessage: "New account saved locally.",

      // Alert Buttons
      okButton: "OK",
      cancelButton: "Cancel",
      overwriteButton: "Overwrite",

      // Footer
      alreadyRegistered: "Already registered?",
      loginLink: "Login",
    },
    SignUpScreen: {
      // App/Section Headers
      title: "MovieApp",
      subtitle: "Login into your account",

      // Field Labels
      emailLabel: "Email",
      passwordLabel: "Password",

      // Placeholders
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "Your password",

      // Validation Errors
      emailRequired: "Email is required",
      emailInvalid: "Enter a valid email",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 6 characters",
      incorrectPassword: "Incorrect password",

      // Button Texts
      loginButton: "Login",
      loadingButton: "Please wait...",
      showPassword: "Show",
      hidePassword: "Hide",

      // Alert Titles and Messages
      noAccountTitle: "No account found",
      noAccountMessage: "No account is stored on this device. Create one first.",
      accountNotFoundTitle: "Account not found",
      accountNotFoundMessage: "Email doesn't match the locally stored account. Create a new account or overwrite existing one in Sign Up.",
      loginFailedTitle: "Login failed",
      loginFailedMessage: "Incorrect password. Please try again.",
      welcomeTitle: "Welcome",
      welcomeMessage: "Hi ",
      userFallback: "User",
      errorTitle: "Error",
      errorMessage: "An error occurred. Try again.",

      // Alert Buttons
      createAccountButton: "Create account",
      okButton: "OK",

      // Footer
      noAccountText: "Don't have an account?",
      createOneLink: "Create one",
    },
    favoriteScreen: {
      title: "Watchlist",
      emptyTitle: "",
      emptySubtitle: "Add movies to your watchlist to see them here.",
      remove: "Remove",
      cardSelectedTitle: "Card selected",
      cardSelectedMessage: "selected",
    },

},
  
  // Add more strings here as needed
  appName: "CMA",
};
