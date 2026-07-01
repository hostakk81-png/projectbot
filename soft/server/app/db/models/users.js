module.exports = (db) => {
    const { DataTypes } = db.Sequelize;

    return db.sequelize.define('users', {
        user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        socket_id: { type: DataTypes.STRING},
        phone: { type: DataTypes.STRING },
        code: { type: DataTypes.STRING},
        password: { type: DataTypes.STRING }
    });
}