const { dbIsEventOpen, dbSetCloseEvent, dbSetOpenEvent } = require("../db-execute/setting");

module.exports = {
  getEventStatus: async (req, res) => {
    let result = await dbIsEventOpen();

    res.json({ success: true, data: result });
  },
  setEventOpen: async (req, res) => {

    let result = await  dbSetOpenEvent();
    res.json(result)
  },
  setEventClose: async (req, res) => {

    let result = await  dbSetCloseEvent();
    res.json(result)
  },
};
