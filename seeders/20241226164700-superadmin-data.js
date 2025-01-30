"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Admins", [
      {
        firstName: "Siti",
        lastName: "Nabilah",
        email: "sitinabilah@gmail.com",
        createdAt: new Date(),
        updatedAt: new Date(),
        phone: "021456789",
        password:
          "$2a$12$607vgXEfdCVZVPe0itFmAu9O9i/xT.BHUAmcw0oXNoJqPK44c6cby",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.delete("Admins", {
      email: "sitinabilah@gmail.com",
    });
  },
};
