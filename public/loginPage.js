'use strict'
const userForm = new UserForm();

userForm.loginFormCallback = function (loginData) {
   let loginCallback = (loginResponse) => {
      console.log(loginResponse);
      if (!loginResponse.success) {
         this.setLoginErrorMessage(loginResponse.error);
      } else location.reload();
   };

   ApiConnector.login(loginData, loginCallback);
}

userForm.registerFormCallback = function (registerData) {
   let registerCallback = (registerResponse) => {
      if (!registerResponse.success) {
         this.setRegisterErrorMessage(registerResponse.error);
      } else location.reload();
   };

   ApiConnector.register(registerData, registerCallback);
}