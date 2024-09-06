const request = require("supertest");
const app = require("../router");

const jobTag = "Java-Spring";

describe("GET /scrap", () => {
  test("should scrap jobs data from jobstreet", async () => {
    const res = await request(app)
      .get("/scrap/" + jobTag)
      .expect(200);

    const data = res.body.data;
    expect(data).not.toBeNull();
    expect(data.length).toBeGreaterThan(0);
    data.forEach((val) => expect(val.job_tag).toBe(jobTag));
  });
});
