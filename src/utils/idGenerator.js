const { User, Employee, Student, LeaveRequest } = require('../models');

/**
 * Generate a unique display ID for different entity types
 * @param {string} type - Entity type (USER, EMPLOYEE, STUDENT, LEAVE)
 * @returns {Promise<string>} - Generated unique ID
 */
async function generateDisplayId(type) {
  const prefixes = {
    USER: 'DEP', // Department (for users)
    EMPLOYEE: 'EMP',
    STUDENT: 'STU',
    LEAVE: 'LEA'
  };

  const prefix = prefixes[type];
  if (!prefix) {
    throw new Error(`Invalid entity type: ${type}`);
  }

  // Get the corresponding model
  const models = {
    USER: User,
    EMPLOYEE: Employee,
    STUDENT: Student,
    LEAVE: LeaveRequest
  };

  const Model = models[type];
  
  // Find the highest existing number for this type
  const latestRecord = await Model.findOne({
    where: {
      displayId: {
        [require('sequelize').Op.like]: `${prefix}%`
      }
    },
    order: [['displayId', 'DESC']],
    attributes: ['displayId']
  });

  let nextNumber = 1;
  if (latestRecord && latestRecord.displayId) {
    // Extract numeric part from displayId (e.g., STU001 -> 001 -> 1)
    const currentNumber = parseInt(latestRecord.displayId.replace(prefix, ''), 10);
    nextNumber = currentNumber + 1;
  }

  // Format with leading zeros (3 digits)
  const formattedNumber = nextNumber.toString().padStart(3, '0');
  
  return `${prefix}${formattedNumber}`;
}

/**
 * Validate that a display ID is unique
 * @param {string} displayId - The display ID to validate
 * @param {string} type - Entity type
 * @param {string} excludeId - Optional UUID to exclude from check (for updates)
 * @returns {Promise<boolean>} - True if unique
 */
async function validateDisplayId(displayId, type, excludeId = null) {
  const models = {
    USER: User,
    EMPLOYEE: Employee,
    STUDENT: Student,
    LEAVE: LeaveRequest
  };

  const Model = models[type];
  if (!Model) {
    return false;
  }

  const whereClause = { displayId };
  if (excludeId) {
    whereClause.id = { [require('sequelize').Op.ne]: excludeId };
  }

  const existing = await Model.findOne({ where: whereClause });
  return !existing;
}

module.exports = {
  generateDisplayId,
  validateDisplayId
};
