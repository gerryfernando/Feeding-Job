const knex = require("./knex");
const moment = require("moment");

class Controller {
  static async getTable(req, res) {
    let response = {
      message: "",
      data: null,
    };
    try {
      const table = await knex("table").select("*");
      const data = table || [];

      response.message = "Get list table success";
      response.data = data;
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      response.message = "error: " + error;
      res.status(500).json(response);
    }
  }

  static async getMenu(req, res) {
    let response = {
      message: "",
      data: null,
    };
    try {
      const menu = await knex("menu").select("*");
      const data = menu || [];

      response.message = "Get list menu success";
      response.data = data;
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      response.message = "error: " + error;
      res.status(500).json(response);
    }
  }

  static async getCart(req, res) {
    let response = {
      message: "",
      data: null,
    };
    try {
      const tableId = req.params.tableId;
      const cart = await knex("cart")
        .join("menu", "cart.menu_id", "menu.id")
        .join("table", "cart.table_id", "table.id")
        .where("table.id", tableId)
        .where("cart.status", "PROGRESS")
        .where("cart.qty", ">", 0)
        .select(
          "cart.id",
          "menu.price",
          "menu.name",
          "cart.qty",
          "menu.image_url",
          "cart.status",
          knex.raw("cart.qty*menu.price as total")
        );
      const data = cart || [];

      response.message = "Get list cart success";
      response.data = data;
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      response.message = "error: " + error;
      res.status(500).json(response);
    }
  }

  static async addCart(req, res) {
    let response = {
      message: "",
      data: null,
    };
    try {
      const payload = req.body;
      const existingCart = await knex("cart")
        .where({
          menu_id: payload.menuId,
          table_id: payload.tableId,
          status: "PROGRESS",
        })
        .first();
      if (existingCart) {
        await knex("cart")
          .where({
            id: existingCart.id,
            menu_id: payload.menuId,
            table_id: payload.tableId,
          })
          .update({
            qty: existingCart.qty + payload.qty,
            status: "PROGRESS",
          });
      } else {
        await knex("cart").insert({
          menu_id: payload.menuId,
          table_id: payload.tableId,
          qty: payload.qty,
          status: "PROGRESS",
        });
      }

      response.message = "Add cart data success";
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      response.message = "error: " + error;
      res.status(500).json(response);
    }
  }

  static async updateCart(req, res) {
    let response = {
      message: "",
      data: null,
    };
    try {
      const payload = req.body;
      await knex("cart").where("id", payload.cartId).update({
        qty: payload.qty,
      });

      response.message = "Update cart data success";
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      response.message = "error: " + error;
      res.status(500).json(response);
    }
  }

  static async order(req, res) {
    let response = {
      message: "",
      data: null,
    };
    try {
      const payload = req.body;
      if (payload.tableId === payload.newTableId) {
        await knex("cart")
          .where({ table_id: payload.tableId, status: "PROGRESS" })
          .update({
            status: "COMPLETED",
          });
      } else {
        await knex("cart")
          .where({ table_id: payload.tableId, status: "PROGRESS" })
          .update({
            status: "COMPLETED",
            table_id: payload.newTableId,
          });
      }

      response.message = "Order success";
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      response.message = "error: " + error;
      res.status(500).json(response);
    }
  }
}

module.exports = Controller;
