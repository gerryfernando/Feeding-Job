const request = require("supertest");
const app = require("../router");
const dotenv = require("dotenv");
const { createJobData, updateJobData } = require("./jobs.test.data");
dotenv.config();

// const PORT = process.env.PORT || 3001;

let jobId;

// beforeAll(async () => {
//   await new Promise((resolve) => {
//     app.listen(PORT, () => {
//       console.log("Example app listening on port 6666!");
//       return resolve();
//     });
//   });
// });

// afterAll(() => {
//   app.close();
// });

describe("GET /job", () => {
  test("should get jobs data", async () => {
    return request(app)
      .get("/job")
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        const data = res.body.data;
        expect(data).not.toBeNull();
        expect(data).toStrictEqual(expect.any(Array));
      });
  });

  test("should filter when get jobs data", async () => {
    const filter = "Reactjs";
    return request(app)
      .get("/job")
      .query({ filter })
      .expect(200)
      .expect("Content-Type", /json/)
      .then((res) => {
        const data = res.body.data;
        expect(data).toStrictEqual(expect.any(Array));
        expect(data).not.toBeNull();
        data.forEach((val) => {
          if (data.length > 0) {
            expect(val.job_tag).toBe(filter);
          }
        });
      });
  });
});

describe("POST /job", () => {
  test("should create jobs data", async () => {
    return request(app)
      .post("/job")
      .send(createJobData)
      .expect(200)
      .then(({ body }) => {
        const id = body.data.id;
        jobId = id;
      });
  });
});

describe("PUT /jobs", () => {
  test("should update jobs data", async () => {
    return request(app)
      .put("/job/" + jobId)
      .send(updateJobData)
      .expect(200);
  });
});

describe("DELETE /jobs", () => {
  test("should delete jobs data", async () => {
    return request(app)
      .delete("/job/" + jobId)
      .expect(200);
  });
});
