const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('seutrong_service', 'remote', 'seutrongRemote_1', {
    host: 'seutrongluckydraw.ddns.net',
    dialect: 'mysql'
    });

module.exports = sequelize