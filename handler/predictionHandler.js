const { equal } = require("joi");
const predictionService = require("../service/predictionService");
const axios = require("axios");
const XLSX = require("xlsx");
const { log } = require("winston");
const AppError = require("../error/AppError");

async function insertPrediction(req, res) {
  //anatomy
  const user = req.user;

  let endpoint = "";
  let payload = {};
  const { type } = req.body;
  switch (type) {
    case "anatomy":
      endpoint = "anatomy-prediction";
      payload = {
        STATE: req.body.state.toUpperCase(),
        AGE_DURING_ADMISSION: req.body.age,
        TOTAL_SEM: req.body.semester,
        AVERAGE_CGPA: req.body.final_cgpa,
        FINAL_CGPA: req.body.average_cgpa,
      };
      break;
    case "physiology":
      endpoint = "physiology";
      payload = {
        STATE: req.body.state.toUpperCase(),
        AGE_DURING_ADMISSION: req.body.age,
        TOTAL_SEM: req.body.semester,
        AVERAGE_CGPA: req.body.final_cgpa,
        FINAL_CGPA: req.body.average_cgpa,
      };
      break;
    case "biochemistry":
      endpoint = "biochemistry";
      payload = {
        STATE: req.body.state.toUpperCase(),
        AGE_DURING_ADMISSION: req.body.age,
        TOTAL_SEM: req.body.semester,
        AVERAGE_CGPA: req.body.final_cgpa,
        FINAL_CGPA: req.body.average_cgpa,
      };
      break;
    case "pathology":
      endpoint = "pathology";
      payload = {
        STATE: req.body.state.toUpperCase(),
        AGE_DURING_ADMISSION: req.body.age,
        TOTAL_SEM: req.body.semester,
        AVERAGE_CGPA: req.body.final_cgpa,
        FINAL_CGPA: req.body.average_cgpa,
      };
      break;
    case "pharmacology":
      endpoint = "pharmacology";
      payload = {
        STATE: req.body.state.toUpperCase(),
        AGE_DURING_ADMISSION: req.body.age,
        TOTAL_SEM: req.body.semester,
        AVERAGE_CGPA: req.body.final_cgpa,
        FINAL_CGPA: req.body.average_cgpa,
      };
      break;
    case "year1":
      endpoint = "year1";
      payload = {
        STATE: req.body.state.toUpperCase(),
        AGE_DURING_ADMISSION: req.body.age,
        TOTAL_SEM: req.body.semester,
        AVERAGE_CGPA: req.body.final_cgpa,
        FINAL_CGPA: req.body.average_cgpa,
      };
      break;

    case "year2":
      endpoint = "year2";
      payload = {
        STATE: req.body.state.toUpperCase(),
        AGE_DURING_ADMISSION: req.body.age,
        TOTAL_SEM: req.body.semester,
        AVERAGE_CGPA: req.body.final_cgpa,
        FINAL_CGPA: req.body.average_cgpa,
      };
      break;

    case "oral-biology":
      endpoint = "oral-biology";
      payload = {
        AGE_DURING_ADMISSION: req.body.age,
        TOTAL_SEM: req.body.semester,
        AVERAGE_CGPA: req.body.final_cgpa,
        FINAL_CGPA: req.body.average_cgpa,
      };
      break;
    case "microbiology":
      endpoint = "microbiology";
      payload = {
        AGE_DURING_ADMISSION: req.body.age,
        TOTAL_SEM: req.body.semester,
        AVERAGE_CGPA: req.body.final_cgpa,
        FINAL_CGPA: req.body.average_cgpa,
      };
      break;
    case "dental-material":
      endpoint = "dental-material";
      payload = {
        AGE_DURING_ADMISSION: req.body.age,
        TOTAL_SEM: req.body.semester,
        AVERAGE_CGPA: req.body.final_cgpa,
        FINAL_CGPA: req.body.average_cgpa,
      };
      break;
    default:
      return res.send({
        status: "failed",
        message: error.message,
      });
  }
  console.log(payload);
  try {
    const reqPrediction = await axios.post(
      `http://localhost:5000/${endpoint}`,
      payload
    );
    const result = reqPrediction.data["prediction"];

    if (Array.isArray(result)) {
      req.body.result = result[0];
    } else {
      req.body.result = result;
    }

    req.body.email = user.email;
    const [data, error] = await predictionService.insertPrediction(req.body);
    if (error) {
      return res.send({
        status: "failed",
        message: error.message,
      });
    }
    return res.send({
      status: "success",
      data: req.body,
    });
  } catch (err) {
    if (err.hasOwnProperty("status")) {
      return res.status(err.status).send({
        status: err.code,
        message: err.message,
      });
    }
    res.send({
      status: err,
    });
  }
}
async function bulkPrediction(req, res) {
  const user = req.user;
  const file = req.file;

  if (!file) return res.status(400).send("No file uploaded");

  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet);

  try {
    const { type } = req.body;

    // Map over the data and create prediction promises
    const insertPromises = data.map(async (row) => {
      const name = row["NAME"];
      const age = row["AGE DURING ADMISSION"];
      const semester = row["TOTAL_SEM"];
      const averageCgpa = row["AVERAGE_CGPA"];
      const finalCgpa = row["FINAL_CGPA"];
      const state = row["STATE"];
      let endpoint = "";
      let payload = {};

      switch (type) {
        case "anatomy":
          endpoint = "anatomy-prediction";
          payload = {
            STATE: state.toUpperCase(),
            AGE_DURING_ADMISSION: age,
            TOTAL_SEM: semester,
            AVERAGE_CGPA: finalCgpa,
            FINAL_CGPA: averageCgpa,
          };
          break;
        case "physiology":
          endpoint = "physiology";
          payload = {
            STATE: state.toUpperCase(),
            AGE_DURING_ADMISSION: age,
            TOTAL_SEM: semester,
            AVERAGE_CGPA: finalCgpa,
            FINAL_CGPA: averageCgpa,
          };
          break;
        case "biochemistry":
          endpoint = "biochemistry";
          payload = {
            STATE: state.toUpperCase(),
            AGE_DURING_ADMISSION: age,
            TOTAL_SEM: semester,
            AVERAGE_CGPA: finalCgpa,
            FINAL_CGPA: averageCgpa,
          };
          break;
        case "pathology":
          endpoint = "pathology";
          payload = {
            STATE: state.toUpperCase(),
            AGE_DURING_ADMISSION: age,
            TOTAL_SEM: semester,
            AVERAGE_CGPA: finalCgpa,
            FINAL_CGPA: averageCgpa,
          };
          break;
        case "pharmacology":
          endpoint = "pharmacology";
          payload = {
            STATE: state.toUpperCase(),
            AGE_DURING_ADMISSION: age,
            TOTAL_SEM: semester,
            AVERAGE_CGPA: finalCgpa,
            FINAL_CGPA: averageCgpa,
          };
          break;
        case "oral-biology":
          endpoint = "oral-biology";
          payload = {
            AGE_DURING_ADMISSION: age,
            TOTAL_SEM: semester,
            AVERAGE_CGPA: finalCgpa,
            FINAL_CGPA: averageCgpa,
          };
          break;
        case "year1":
          endpoint = "year1";
          payload = {
            STATE: state.toUpperCase(),
            AGE_DURING_ADMISSION: age,
            TOTAL_SEM: semester,
            AVERAGE_CGPA: finalCgpa,
            FINAL_CGPA: averageCgpa,
          };
          break;
          case "year2":
            endpoint = "year2";
            payload = {
              STATE: state.toUpperCase(),
              AGE_DURING_ADMISSION: age,
              TOTAL_SEM: semester,
              AVERAGE_CGPA: finalCgpa,
              FINAL_CGPA: averageCgpa,
            };
            break;  
        case "microbiology":
          endpoint = "microbiology";
          payload = {
            AGE_DURING_ADMISSION: req.body.age,
            TOTAL_SEM: req.body.semester,
            AVERAGE_CGPA: req.body.final_cgpa,
            FINAL_CGPA: req.body.average_cgpa,
          };
          break;
        case "dental-material":
          endpoint = "dental-material";
          payload = {
            AGE_DURING_ADMISSION: req.body.age,
            TOTAL_SEM: req.body.semester,
            AVERAGE_CGPA: req.body.final_cgpa,
            FINAL_CGPA: req.body.average_cgpa,
          };
          break;
        default:
          throw new AppError(`${type} is not available in our database`, 400);
      }

      // Make a request to the prediction endpoint
      const result = await axios.post(
        `http://localhost:5000/${endpoint}`,
        payload
      );
      console.log(result.data)
      if (Array.isArray(result.data.prediction)) {
        req.body.result = result.data.prediction[0];
      } else {
        req.body.result = result.data.prediction;
      }

      // Prepare the data for insertion
      const body = {
        state,
        name,
        average_cgpa: averageCgpa,
        final_cgpa: finalCgpa,
        semester,
        age,
        result: req.body.result,
        type,
        email: user.email,
      };
      console.log(body)
      // Insert the prediction data
      const [dataPrediction, err] = await predictionService.insertPrediction(
        body
      );
      if (err) {
        throw new AppError("Error inserting prediction data", 400);
      }
    });

    // Wait for all promises to resolve
    await Promise.all(insertPromises);

    return res.send({
      status: "success",
      message: "Bulk insert prediction successful",
    });
  } catch (err) {
    let code = 500;
    if (err.code === "ERR_BAD_REQUEST") {
      code = 400;
    }
    console.log(err);
    return res.status(code).send({
      status: "failed",
      message: err.message || "An error occurred",
    });
  }
}

async function ListAdminPredictions(req, res) {
  const [result, error] = await predictionService.ListPredictions();
  if (error) {
    return res.send({
      status: "Failed",
      message: error.message,
    });
  }

  return res.send({
    meta: {
      status: "success",
      message: "Success Retrieved data",
    },
    data: result,
  });
}

async function ListUserPredictions(req, res) {
  user = req.user;
  const { data } = req.query;
  const [result, error] = await predictionService.ListPredictions(
    user.email,
    data
  );
  if (error) {
    return res.send({
      status: "Failed",
      message: error.message,
    });
  }

  return res.send({
    meta: {
      status: "success",
      message: "Success Retrieved data",
    },
    data: result,
  });
}

async function ListAnalytics(req, res) {
  const user = req.user;
  const [result, error] = await predictionService.ListAnalytics(user.email);

  if (error) {
    return res.send({
      status: "failed",
      message: error.message,
    });
  }

  return res.send({
    meta: {
      status: "success",
      message: "success received analytics data",
    },
    data: result,
  });
}

async function deletePrediction(req, res) {
  user = req.user;
  const { type } = req.body;

  const [result, err] = await predictionService.deletePrediction(
    user.email,
    type
  );

  if (err) {
    return res.send({
      status: "failed",
      message: "failed to delete prediction",
    });
  }

  return res.send({
    status: "success",
    message: "success delete predictions",
  });
}

module.exports = {
  bulkPrediction,
  insertPrediction,
  ListAdminPredictions,
  ListUserPredictions,
  ListAnalytics,
  deletePrediction,
};
