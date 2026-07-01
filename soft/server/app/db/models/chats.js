module.exports = (db) => {
    const { DataTypes } = db.Sequelize;

    return db.sequelize.define('chats', {
        chat_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        msg_chat_id: { type: DataTypes.STRING },
    });
}