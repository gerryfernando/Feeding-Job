const knex = require("./knex");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const dotenv = require("dotenv");
const Job = require("./model/jobDummy");
const excelJS = require("exceljs");

dotenv.config();

class Controller {
  static async getScrapJobs(req, res) {
    let response = {
      message: "",
      data: null,
    };
    try {
      // const url = process.env.URL_SCRAP;
      const url = "https://www.octaveclothing.com/men";
      let raw_data;
      //Get Data
      await axios.get(url).then((response) => {
        raw_data = response.data;
      });
      console.log(raw_data);

      const $ = cheerio.load(raw_data);

      const result = [];
      $("table.RntSmf").each((i, elem) => {
        const imgSrc = $(elem).find("img").attr("src");
        const text = $(elem).find("span:first-child").text();
        result.push({ imgSrc, text });
      });
      response.message = "Scraping data success";
      response.data = result;
      res.status(200).json(response);
    } catch (error) {
      console.error("Error scraping data:", error);
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
      await knex("jobs").insert({
        job_name: payload.jobName,
        location: payload.location,
        description: payload.description,
        company: payload.company,
      });

      response.message = "Create jobs success";
      response.data = result;
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
      await knex("cart")
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
      response.data = result;
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
      response.data = result;
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
    const path = "./files";

    worksheet.columns = [
      { header: "No.", key: "no", width: 10 },
      { header: "Company", key: "company", width: 20 },
      { header: "Jobs", key: "jobName", width: 20 },
      { header: "Description", key: "description", width: 20 },
      { header: "Location", key: "loc", width: 20 },
    ];

    let counter = 1;

    Job.forEach((user) => {
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
