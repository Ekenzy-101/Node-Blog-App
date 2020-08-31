module.exports = {
  formatError: (rawErrors) => {
    let errors = {
      username: [],
      fullname: [],
      password: [],
      password2: [],
      email: [],
    };
    if (rawErrors) {
      rawErrors.forEach((er) => {
        if (er.param === "username") {
          errors.username.push(er.msg);
        }
        if (er.param === "email") {
          errors.email.push(er.msg);
        }
        if (er.param === "fullname") {
          errors.fullname.push(er.msg);
        }
        if (er.param === "password") {
          errors.password.push(er.msg);
        }
        if (er.param === "password2") {
          errors.password2.push(er.msg);
        }
      });
      return errors;
    }
    return null;
  },
};
