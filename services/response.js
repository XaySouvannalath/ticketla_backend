const elapse = require("elapsed-time");

module.exports = {
  respond(res, data, type) {
    const elapsedTime = elapse.new().start(); // Start elapsed timer

    // Response payload template
    const responseTemplate = {
      success: false,
      message: null,
      data: null,
      executeTime: null,
    };

    if (type === 1) {
      // POST or PUT requests
      const result = data[0]?.[0]?.result;

      if (result === 1) {
        // Success response
        res.status(200).json({
          ...responseTemplate,
          success: true,
          message: "Operation completed successfully.",
          data: data[0][0],
          executeTime: elapsedTime.getValue(),
        });
      } else {
        // Failure response
        res.status(400).json({
          ...responseTemplate,
          success: false,
          message: "Operation failed.",
          data: data[0][0],
          executeTime: elapsedTime.getValue(),
        });
      }
    } else if (type === 2) {
      // GET requests
      if (!data || data.length === 0) {
        // No data found
        res.status(404).json({
          ...responseTemplate,
          success: false,
          message: "No data found.",
          executeTime: elapsedTime.getValue(),
        });
      } else {
        // Data retrieved successfully
        res.status(200).json({
          ...responseTemplate,
          success: true,
          message: "Data retrieved successfully.",
          data: Array.isArray(data) && data.length === 1 ? [data[0]] : data,
          executeTime: elapsedTime.getValue(),
        });
      }
    } else {
      // Invalid request type
      res.status(400).json({
        ...responseTemplate,
        success: false,
        message: "Invalid request type.",
        executeTime: elapsedTime.getValue(),
      });
    }
  },
};
