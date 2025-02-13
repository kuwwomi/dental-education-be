const AppError = require("../error/AppError");
const { Admin, AdminSession } = require("../models");
const { sendEmail } = require("../config/mail");
const { where } = require("sequelize");
const salt = process.env.SALT_ROUNDS;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
function adminCompose(body) {
  return {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phoneNumber: body.phone,
  };
}

async function createAdmin(body) {
  try {
    const result = await Admin.create(body);

    if (!result) {
      return [null, new AppError("failed to create data", 400)];
    }

    const dataSession = {
      email: body.email,
      pass_code: Buffer.from(body.email).toString("base64"),
      admin_id: result.id,
    };

    await AdminSession.create(dataSession);

    const payloadEmail = {
      to: body.email,
      subject: "Verify Admin Invitation",
      name: body.firstName + " " + body.lastName,
      pass_code: dataSession.pass_code,
      link_code: process.env.BASE_FE_URL2 + "verifyPasswordAdmin.html",
    };
    //send email
    await sendEmail("email_dental", payloadEmail);

    return [adminCompose(result), null];
  } catch (err) {
    return [null, err];
  }
}

async function updatePasswordAdmin(body) {
  const hashedPassword = await bcrypt.hash(body.password, Number(salt));
  try {
    const adminSession = await AdminSession.findOne({
      where: {
        pass_code: body.pass_code,
      },
    });

    if (!adminSession) {
      return [null, new AppError("User Not Found", 400)];
    }

    await Admin.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          email: adminSession.email,
        },
      }
    );
    return [null, null];
  } catch (err) {
    return [null, err];
  }
}

async function LoginAdmin(body) {
  try {
    const user = await Admin.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return [null, new AppError("User Not Found", 400)];
    }
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) {
      return [null, new AppError("Wrong Password", 400)];
    }
    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return [token, null];
  } catch (err) {
    return [null, err];
  }
}

async function forgotPassword(email) {
  try {
    const user = await Admin.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return [null, new AppError("User Not Found", 400)];
    }

    const payloadEmail = {
      to: email,
      subject: "Reset Password",
      link_code: process.env.BASE_FE_URL2 + `reset_pass.html?email=${email}`,
    };

    await sendEmail("template_forgot", payloadEmail);

    return [null, null];
  } catch (err) {
    console.log(err);
    return [null, new AppError("error in server", 500)];
  }
}

async function updatePassword(password, email) {
  const user = await Admin.findOne({
    where: {
      email: email,
    },
  });
  const hashedPassword = await bcrypt.hash(password, Number(salt));

  if (!user) {
    return [null, new AppError("Admin Not Found", 400)];
  }
  const body = {
    password: hashedPassword,
  };

  const userUpdate = await Admin.update(body, {
    where: {
      id: user.id,
    },
  });
  return [null, null];
}

module.exports = {
  createAdmin,
  updatePasswordAdmin,
  LoginAdmin,
  forgotPassword,
  updatePassword,
};
