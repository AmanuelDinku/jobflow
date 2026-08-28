const pool = require("../db");

// Get all applications for the logged-in user
const getApplications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM applications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get applications."
    });
  }
};


// Get one application
const getApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM applications
       WHERE id = $1
       AND user_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found."
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get application."
    });
  }
};


// Create application
const createApplication = async (req, res) => {
  try {
    const {
      company,
      position,
      status,
      location,
      salary,
      job_url,
      applied_date,
      interview_date, 
      interview_time, 
      interview_type, 
      interview_notes,
      notes
    } = req.body;

    if (!company || !position) {
      return res.status(400).json({
        message: "Company and position are required."
      });
    }

    const result = await pool.query(
      `INSERT INTO applications
       (
         user_id,
         company,
         position,
         status,
         location,
         salary,
         job_url,
         applied_date,
         interview_date, 
         interview_time,
          interview_type, 
          interview_notes,
         notes
       )
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [ 
        req.user.id, 
        company, 
        position, 
        status || "wishlist", 
        location || null, 
        salary || null, 
        job_url || null, 
        applied_date || null, 
        interview_date || null, interview_time || null, interview_type || null, interview_notes || null, 
        notes || null 
      ]
    );

    res.status(201).json({
      message: "Application created successfully.",
      application: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create application."
    });
  }
};


// Update application
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company,
      position,
      status,
      location,
      salary,
      job_url,
      applied_date,
      interview_date, 
      interview_time, 
      interview_type, 
      interview_notes,
      notes
    } = req.body;

    const result = await pool.query(
      `UPDATE applications
       SET
         company = $1, 
         position = $2, 
         status = $3, 
         location = $4, 
         salary = $5, 
         job_url = $6, 
         applied_date = $7, 
         interview_date = $8, 
         interview_time = $9, 
         interview_type = $10, 
         interview_notes = $11, 
         notes = $12, 
         updated_at = CURRENT_TIMESTAMP 
        WHERE id = $13 
        AND user_id = $14 
        RETURNING *`,
      [ 
        company, 
        position, 
        status, 
        location, 
        salary, 
        job_url, 
        applied_date, 
        interview_date, 
        interview_time, 
        interview_type, 
        interview_notes, 
        notes, 
        id, 
        req.user.id 
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found."
      });
    }

    res.json({
      message: "Application updated successfully.",
      application: result.rows[0]
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update application."
    });
  }
};


// Delete application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM applications
       WHERE id = $1
       AND user_id = $2
       RETURNING id`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found."
      });
    }

    res.json({
      message: "Application deleted successfully."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete application."
    });
  }
};


module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
};