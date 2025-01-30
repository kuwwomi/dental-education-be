const { createAdminSchema } = require("../validation/adminValidation");
const adminService = require("../service/adminService");

async function inviteAdmin(req, res) {
  const { error } = await createAdminSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      meta: {
        status: "failed",
        message: error.message,
      },
    });
  }

  const [result, err] = await adminService.createAdmin(req.body);

  if (err) {
    return res.send({
      status: "failed",
      message: err.message,
    });
  }
  res.send({
    status: "success",
    message: "success send an invitation admin",
    data: result,
  });
}

async function login(req, res) {
  const [result, errorService] = await adminService.LoginAdmin(req.body);

  if (errorService) {
    return res.status(400).send({
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

async function registerAdmin(req, res) {
  const [result, error] = await adminService.updatePasswordAdmin(req.body);

  if (error) {
    const statusCode = error.code || 500;
    return res.status(statusCode).send({
      status: "failed",
      message: "failed to register password for admin",
    });
  }

  return res.send({
    status: "success",
    message: "success registered an admin",
  });
}

module.exports = { inviteAdmin, login, registerAdmin };
