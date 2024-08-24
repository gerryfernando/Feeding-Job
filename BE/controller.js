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
    };
    try {
      const url = process.env.URL_SCRAP;
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
        jobData.jobName = val.title;
        jobData.company = val.companyName;
        jobData.benefit = val.bulletPoints;
        jobData.location = val.jobLocation.label;
        jobData.publishDate = moment(val.listingDate).format(
          "DD-MMMM-yyyy HH:mm"
        );
        jobData.salary = val.salary;
        jobData.description = val.teaser;
        jobData.workType = val.workType;

        result.push(jobData);
      });
      response.message = "Scraping data success";
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
    };
    try {
      const jobData = await knex("jobs").select("*");
      const data = jobData || [];

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
      await knex("jobs").insert({
        job_name: payload.jobName,
        location: payload.location,
        description: payload.description,
        company: payload.company,
      });

      response.message = "Create jobs success";
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
      { header: "Job Name", key: "job_name", width: 30 },
      { header: "Company", key: "company", width: 30 },
      { header: "Location", key: "location", width: 20 },
      { header: "Description", key: "description", width: 40 },
    ];

    let counter = 1;
    const jobData = await knex("jobs").select("*");
    jobData.forEach((user) => {
      user.no = counter;
      worksheet.addRow(user);
      counter++;
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "004e47cc" } };
    });

    worksheet.getColumn(2).eachCell((cell) => {
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.font = { bold: true };
    });

    try {
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader("Content-Disposition", `attachment; filename=jobs.xlsx`);

      return workbook.xlsx.write(res).then(() => {
        response.message = "Download success";
        res.status(200).json(response);
      });
    } catch (err) {
      res.status(500).json({ message: "Error downloading data" });
    }
  }
}

module.exports = Controller;
