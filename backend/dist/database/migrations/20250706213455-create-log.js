"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Logs', {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            content: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            createdAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Logs');
    },
};
//# sourceMappingURL=20250706213455-create-log.js.map