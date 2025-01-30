const {
    userCreateSchema,
    createUserSession,
    UpdateUser,
    updateUser,
  } = require("../validation/userValidation");
  const userService = require("../service/userService");
  
  const { sendEmail } = require("../config/mail");
  
  async function register(req, res) {
    const { error } = userCreateSchema.validate(req.body);
    if (error) {
      return res.status(400).send({
        meta: {
          status: "failed",
          message: error.message,
        },
      });
    }
    const [result, errorService] = await userService.register(req.body);
  
    if (errorService) {
      return res.status(400).send({
        meta: {
          status: "failed",
          message: errorService.message,
        },
      });
    }
  
    return res.status(201).send({
      meta: {
        status: "success",
        message: "OK",
      },
      data: result,
    });
  }
  
  async function login(req, res) {
    const { error } = createUserSession.validate(req.body);
  
    if (error) {
      return res.status(400).send({
        meta: {
          status: "failed",
          message: error.message,
        },
      });
    }
    const [result, errorService] = await userService.createSessionUser(req.body);
  
    if (errorService) {
      return res.status(errorService.code).send({
        meta: {
          status: "failed",
          message: errorService.message,
        },
      });
    }
    return res.status(200).send({
      meta: {
        status: "success",
        message: "OK",
      },
      data: {
        token: result,
      },
    });
  }
  
  async function getProfile(req, res) {
    const user = req.user;
  
    const [result, err] = await userService.findUserById(user.id);
  
    if (err) {
      return res.status(err.code).send({
        meta: {
          status: "failed",
          message: err.message,
        },
      });
    }
  
    return res.status(200).send({
      meta: {
        status: "success",
        message: "OK",
      },
      data: result,
    });
  }
  
  async function updateProfile(req, res) {
    const user = req.user;
  
    const { error } = updateUser.validate(req.body);
  
    if (error) {
      return res.status(400).send({
        meta: {
          status: "failed",
          message: error.message,
        },
      });
    }
  
    const [data, err] = await userService.updateProfile(req.body, user.id);
  
    if (err) {
      return res.status(err.code).send({
        meta: {
          status: "failed",
          message: err.message,
        },
      });
    }
  
    return res.status(200).send({
      meta: {
        status: "success",
        message: "OK",
      },
      data: data,
    });
  }
  
  async function updatePhotoProfile(req, res) {
    const user = req.user;
  
    const [result, error] = await userService.updatePhotoProfile(
      req.file,
      user.id
    );
  
    if (error) {
      return res.status(err.code).send({
        meta: {
          status: "failed",
          message: err.message,
        },
      });
    }
  
    return res.status(200).send({
      meta: {
        status: "success",
        message: "OK",
      },
      data: result,
    });
  }
  
  async function forgotPassword(req, res) {
    const { email } = req.body;
  
    const user = await userService.findMyProfile(email);
  
    if (!user) {
      return res.status(err.code).send({
        meta: {
          status: "failed",
          message: "Email not found",
        },
      });
    }
  
    const payloadEmail = {
      to: body.email,
      subject: "Reset Password",
      link_code: process.env.BASE_FE_URL2 + "verifyPasswordAdmin.html",
    };
  
    await sendEmail("template_forgot", payloadEmail);
  }
  
  async function forgotPassword(req, res) {
    const { email } = req.body;
  
    // Simulate fetching user from database
    const [user, error] = await userService.findMyProfile(email);
  
    if (error) {
      return res.status(404).send({
        meta: {
          status: "failed",
          message: "Email not found",
        },
      });
    }
  
    const result = {
      to: email,
      subject: "Forgot Password",
      name: user.firstName + " " + user.lastName,
      email: email,
      link_code:
        process.env.BASE_FE_URL + `resetPasswordUser.html?email=${email}`,
    };
    //send email
    await sendEmail("template_forgot", result);
  
    res.send({
      status: "success",
      data: null,
    });
  }
  
  async function verifyPassword(req, res) {
    const { email, password } = req.body;
  
    const [data, error] = await userService.updatePassword(password, email);
  
    if (error) {
      return res.status(400).send({
        status: "failed",
        message: err.message,
      });
    }
  
    return res.status(200).send({
      meta: {
        status: "success",
        message: "OK",
      },
      data: null,
    });
  }
  
  module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    updatePhotoProfile,
    forgotPassword,
    verifyPassword,
  };
  