const { User } = require("../models/");
const logger = require("../logger/logger");
const AppError = require("../error/AppError");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const salt = process.env.SALT_ROUNDS;
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../config/mail");
const multer = require("multer");
/**
 * Compose a user object, which is sent as a response to a successful registration or login.
 * @param {Object} body - User object from the database.
 * @returns {Object} The composed user object.
 */

function composeUser(body) {
  if (body.cover != null) {
    body.cover = `${process.env.BASE_URL}uploads/${body.cover}`;
  }

  return {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    createdAt: String(dayjs(body.createdAt).unix()),
    updatedAt: String(dayjs(body.updatedAt).unix()),
    version: body.version,
    cover: body.cover,
  };
}

/**
 * Registers a new user.
 * @param {Object} body - The user object with the attributes:
 *  - firstName
 *  - lastName
 *  - email
 *  - password
 *  - phone
 * @returns {Array} Contains two elements. The first element is the composed user
 * object, and the second element is an error object. If the registration is
 * successful, the first element is the composed user object, and the second
 * element is null. If the registration fails, the first element is null, and the
 * second element is an error object.
 */
async function register(body) {
  try {
    const user = await User.findOne({
      where: {
        email: body.email,
      },
    });
    if (user) {
      logger.warn("User already exist");
      return [null, new AppError("User Already Exist", 400)];
    }

    const hashedPassword = await bcrypt.hash(body.password, Number(salt));
    const resultInsert = await User.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: hashedPassword,
      phone: body.phone,
    });
    const result = {
      to: body.email,
      subject: "Welcome to Dental Education",
      name: body.firstName + " " + body.lastName,
    };
    //send email
    await sendEmail("welcome", result);

    logger.info("Success created user");
    return [composeUser(resultInsert.dataValues), null];
  } catch (err) {
    logger.error(err);
    return [null, err];
  }
}

async function createSessionUser(body) {
  try {
    const user = await User.findOne({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      logger.warn("User not found");
      return [null, new AppError("User Not Found", 400)];
    }
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (!validPassword) {
      logger.warn("Wrong Password");
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
    logger.error(err);
    return [null, err];
  }
}

async function findUserById(id) {
  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return [null, new AppError("User Not Found", 400)];
    }

    return [composeUser(user), null];
  } catch (err) {
    logger.error(err);
    return [null, new AppError("error on server", 500)];
  }
}

async function findMyProfile(email) {
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return [null, new AppError("User Not Found", 400)];
    }

    return [composeUser(user), null];
  } catch (err) {
    logger.error(err);
    return [null, new AppError("error on server", 500)];
  }
}

async function updateProfile(body, id) {
  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return [null, new AppError("User Not Found", 400)];
    }

    const userUpdate = await User.update(body, {
      where: {
        id: id,
      },
    });

    return [null, null];
  } catch (err) {
    logger.error(err);
    return [nil, new AppError(`error on server: ${err}`, 500)];
  }
}

async function updatePhotoProfile(cover, id) {
  try {
    const user = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return [null, new AppError("User Not Found", 400)];
    }

    await User.update(
      { cover: cover.filename },
      {
        where: {
          id: id,
        },
      }
    );

    return [null, null];
  } catch (err) {
    logger.error(err);
    return [null, new AppError(`error on server: ${err}`, 500)];
  }
}

async function updatePassword(password, email) {
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  const hashedPassword = await bcrypt.hash(password, Number(salt));

  if (!user) {
    return [null, new AppError("User Not Found", 400)];
  }
  const body = {
    password: hashedPassword,
  };

  const userUpdate = await User.update(body, {
    where: {
      id: user.id,
    },
  });
  return [null, null];
}

module.exports = {
  register,
  createSessionUser,
  findMyProfile,
  updateProfile,
  updatePhotoProfile,
  findUserById,
  updatePassword,
};
