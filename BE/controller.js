const knex = require("./knex");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv");
const excelJS = require("exceljs");
const moment = require("moment");

dotenv.config();

class Controller {
  static async getScrapJobs(req, res) {
    let response = {
      message: "",
      data: null,
      length: 0,
    };
    try {
      const jobTag = req.params.jobTag;
      const url = `https://id.jobstreet.com/id/${jobTag}-jobs`;
      let raw_data;
      //Get Data
      const { data } = await axios.get(url);
      raw_data = data;
      const $ = cheerio.load(raw_data);
      const result = [];

      const scriptContent = $('script[data-automation="server-state"]').html();

      // Extract JSON strings using regular expressions
      const reduxDataMatch = scriptContent.match(
        /window\.SEEK_REDUX_DATA\s*=\s*(\{.*?\});/
      );

      // Parse JSON data
      const reduxData = reduxDataMatch ? JSON.parse(reduxDataMatch[1]) : {};
      const jobs = reduxData?.results?.results?.jobs;

      jobs.forEach((val) => {
        let jobData = {};
        jobData.job_name = val.title;
        jobData.description = val.teaser;
        jobData.company = val.companyName;
        jobData.location = val.jobLocation.label;
        jobData.publish_date = moment(val.listingDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        jobData.salary = val.salary;
        jobData.benefit = JSON.stringify(val.bulletPoints);
        jobData.work_type = val.workType;
        jobData.job_tag = jobTag;
        result.push(jobData);
      });
      await knex("jobs").insert(result);
      response.message = "Scraping data success";
      response.length = result.length;
      response.data = result;
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Error scraping data" });
    }
  }

  static async getJobs(req, res) {
    let response = {
      message: "",
      data: null,
      total: 0,
    };
    const jobTag = req.query.filter;
    try {
      const jobData = await knex("jobs")
        .modify((queryBuilder) => {
          if (jobTag !== "all" && jobTag) {
            queryBuilder.where("job_tag", jobTag);
          }
        })
        .orderBy("id", "desc")
        .select("*");
      const data = (jobData || []).map((val) => ({
        ...val,
        benefit: JSON.parse(val?.benefit),
      }));

      response.total = jobData.length;
      response.message = "Get list jobs success";
      response.data = data;
      res.status(200).json(response);
    } catch (error) {
      response.message = "error: " + error;
      res.status(500).json(response);
    }
  }

  static async createJobs(req, res) {
    let response = {
      message: "",
      data: null,
    };
    try {
      const payload = req.body;
      const [job] = await knex("jobs").insert({
        job_name: payload.jobName,
        location: payload.location,
        description: payload.description,
        company: payload.company,
        salary: payload.salary,
        benefit: JSON.stringify(payload.benefit),
        work_type: payload.workType,
        job_tag: payload.jobTag,
      });
      response.message = "Create jobs success";
      response.data = { id: job };
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Create jobs failed" });
    }
  }

  static async editJobs(req, res) {
    let response = {
      message: "",
      data: null,
    };
    try {
      const payload = req.body;
      const id = req.params.id;

      await knex("jobs  ")
        .where({
          id: id,
        })
        .update({
          job_name: payload.jobName,
          location: payload.location,
          description: payload.description,
          company: payload.company,
          salary: payload.salary,
          benefit: JSON.stringify(payload.benefit),
          work_type: payload.workType,
          job_tag: payload.jobTag,
          // updated_at: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
        });
      response.message = "Edit jobs success";
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Edit jobs failed" });
    }
  }

  static async deleteJobs(req, res) {
    let response = {
      message: "",
      data: null,
    };
    try {
      const id = req.params.id;

      await knex("jobs").where("id", id).del();

      response.message = "Delete jobs success";
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: "Delete jobs failed" });
    }
  }

  static async downloadExcel(req, res) {
    let response = {
      message: "",
      data: null,
    };
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("My Users");

    worksheet.columns = [
      { header: "No.", key: "no", width: 10 },
      { header: "Job Name", key: "job_name", width: 50 },
      { header: "Company", key: "company", width: 35 },
      { header: "Location", key: "location", width: 30 },
      { header: "Description", key: "description", width: 125 },
      { header: "Salary", key: "salary", width: 35 },
      { header: "Benefit", key: "benefit", width: 125 },
      { header: "Work Type", key: "work_type", width: 20 },
      { header: "Publish Date", key: "publish_date", width: 20 },
    ];

    let counter = 1;
    const jobData = await knex("jobs").orderBy("id", "desc").select("*");
    jobData.forEach((user) => {
      user.no = counter;
      worksheet.addRow(user);
      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "004e47cc" } };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });

    // worksheet.getColumn(2).eachCell((cell, rowNumber) => {
    //   if (rowNumber > 1) {
    //     cell.alignment = {
    //       vertical: "middle",
    //       horizontal: "center",
    //       wrapText: true,
    //     };
    //     cell.font = { bold: true };
    //   }
    // });

    try {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=jobs.xlsx`);

      return workbook.xlsx.write(res);
    } catch (err) {
      res.status(500).json({ message: "Error downloading data" });
    }
  }
}

module.exports = Controller;
