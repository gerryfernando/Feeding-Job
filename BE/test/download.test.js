const request = require("supertest");
const app = require("../router");

describe("GET /download", () => {
  test("should return an Excel file", async () => {
    const res = await request(app)
      .get("/download")
      .expect(200)
      .expect(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    expect(res.body).not.toBeNull();
    expect(res.body).toBeInstanceOf(Object);
  });
});
