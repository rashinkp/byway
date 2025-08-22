declare global {
  interface Window {
    FB: {
      init: (params: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: { authResponse?: AuthResponse }) => void,
        options: { scope: string }
      ) => void;
      getLoginStatus: (callback: (response: { status: string; authResponse?: AuthResponse }) => void) => void;
      api: (
        path: string,
        params: { fields: string },
        callback: (response: FacebookUserData) => void
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

interface AuthResponse {
  accessToken: string;
  userID: string;
  expiresIn: number;
  signedRequest: string;
  graphDomain: string;
  data_access_expiration_time: number;
}

interface FacebookUserData {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
  error?: { message: string; type: string };
}

export {};
