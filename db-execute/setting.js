const { exec } = require("../services/database");

module.exports = {
  dbIsEventOpen: async () => {
    let sql = `
            select setting_value from settings where setting_code = 'IS_EVENT_OPEN'
        `;

    let result = await exec(sql);

    return result[0]["setting_value"];
  },

  dbSetCloseEvent: async () => {
    let sql = `
     update settings set setting_value = "N" where setting_code = 'IS_EVENT_OPEN'
     `;

    let result = await exec(sql);

    if (result.affectedRows > 0) {
      return {
        success: true,
        message: "Status updated to 'N' successfully.",
      };
    } else {
      return {
        success: false,
        message:
          "No rows were updated. Check if the row exists or is already claimed.",
      };
    }
  },
  dbSetOpenEvent: async () => {
    let sql = `
    update settings set setting_value = "Y" where setting_code = 'IS_EVENT_OPEN'
    `;

    let result = await exec(sql);

    if (result.affectedRows > 0) {
      return {
        success: true,
        message: "Status updated to 'Y' successfully.",
      };
    } else {
      return {
        success: false,
        message:
          "No rows were updated. Check if the row exists or is already claimed.",
      };
    }
  },
};
