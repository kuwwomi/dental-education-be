const { error } = require("winston");
const AppError = require("../error/AppError");
const { Prediction } = require("../models");
const { Sequelize, Op } = require("sequelize");

async function insertPrediction(body) {
  let state = "";
  if (body.state) {
    state = String(body.state).toUpperCase();
  }

  try {
    const result = await Prediction.create({
      name: body.name,
      age: body.age,
      state: state,
      semester: body.semester,
      average_cgpa: body.average_cgpa,
      final_cgpa: body.final_cgpa,
      result: body.result,
      type: body.type,
      predictor_email: body.email,
    });

    return [null, null];
  } catch (err) {
    return [null, new AppError(err.message, 500)];
  }
}

async function ListPredictions(email, data) {
  try {
    let result;
    if (!email) {
      if (data !== "undefined") {
        result = await Prediction.findAll({
          where: {
            type: "repeat-paper",
          },
          order: [["id", "DESC"]],
        });
      } else {
        result = await Prediction.findAll({
          where: {
            type: {
              [Op.ne]: "repeat-paper", // Not equal to "repeat-paper"
            },
          },
          order: [["id", "DESC"]],
        });
      }
    } else {
      if (data !== "undefined") {
        result = await Prediction.findAll({
          where: {
            predictor_email: email,
            type: "repeat-paper",
          },
          order: [["id", "DESC"]],
        });
      } else {
        result = await Prediction.findAll({
          where: {
            predictor_email: email,
            type: {
              [Op.ne]: "repeat-paper", // Not equal to "repeat-paper"
            },
          },
          order: [["id", "DESC"]],
        });
      }
    }

    return [result, null];
  } catch (err) {
    return [null, new AppError(err.message, 500)];
  }
}

async function ListAnalytics(email) {
  try {
    const result = await Prediction.findAll({
      attributes: [
        "result",
        "semester",
        [Sequelize.fn("COUNT", Sequelize.col("result")), "count"], // Correct format for COUNT
      ],
      where: {
        type: "repeat-paper",
        predictor_email : email
      },
      group: ["result", "semester"],
    });

    return [result, null];
  } catch (err) {
    return [null, err];
  }
}

async function deletePrediction(email, type) {
  try {
    let whereCondition = {
      where: {
        predictor_email: email,
        type: {
          [Op.not]: "repeat-paper",
        },
      },
    };
    if (type == "repeat-paper") {
      whereCondition = {
        where: {
          predictor_email: email,
          type: "repeat-paper",
        },
      };
    }
    console.log(whereCondition);

    await Prediction.destroy(whereCondition);

    return [null, null];
  } catch (err) {
    console.log(err);
    return [null, err];
  }
}

module.exports = {
  ListAnalytics,
  ListPredictions,
  insertPrediction,
  deletePrediction,
};
