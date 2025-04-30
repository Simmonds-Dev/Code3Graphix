import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/connection.js';
import bcrypt from 'bcrypt';


class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.user_password);
    }
};

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isAlphanumeric: true
            }
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        user_password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 64],
            },
        },
        // May not need to keep phone/address
        user_phone: {
            type: DataTypes.STRING
        },
        user_address: {
            type: DataTypes.STRING
        },
        // ----------------------------------
        user_role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user',
            validate: {
                isIn: [['user', 'admin']]
            }
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'user',
        sequelize
    }
);

User.addHook('beforeCreate', async (newUserData) => {
    newUserData.user_password = await bcrypt.hash(newUserData.user_password, 10);
    return newUserData;
});

User.addHook('beforeUpdate', async (updatedUserData) => {
    if (updatedUserData.changed('user_password')) {
        updatedUserData.user_password = await bcrypt.hash(updatedUserData.user_password, 10);
    }
    return updatedUserData;
});

export default User;
